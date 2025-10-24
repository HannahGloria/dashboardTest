import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";
const normalizeImage = (img) => {
  if (!img) return null;
  // si nos pasan un objeto que contiene la propiedad "image", extraerla
  if (typeof img === "object" && img.image) img = img.image;
  // ahora si es string, devolver directamente
  if (typeof img === "string") {
    if (img.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${img.replace(/^ipfs:\/\//, "")}`;
    if (img.startsWith("ipfs/")) return `https://ipfs.io/ipfs/${img.replace(/^ipfs\//, "")}`;
    if (img.startsWith("//")) return `https:${img}`;
    return img;
  }
  // buscar las claves más comunes
  const url = img.small || img.small_2x || img.thumb || img.small_x || img.large || img.thumb_url || null;
  if (!url) return null;
  if (url.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${url.replace(/^ipfs:\/\//, "")}`;
  if (url.startsWith("ipfs/")) return `https://ipfs.io/ipfs/${url.replace(/^ipfs\//, "")}`;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
};
//https://docs.coingecko.com/v3.0.1/reference/coins-id-market-chart
export const getCoinData = async (id = "bitcoin", days = 30) => {
  try {
    const respuesta = await axios.get(`${BASE_URL}/coins/${id}/market_chart`, {
      params: { vs_currency: "usd", days },
    });
    return respuesta.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//Un NFT representa la propiedad de un archivo digital, único, Token No Fungible, puede ser arte
export const getNfts = async (query = "", includeDetails = false, sampleSize = 20) =>{
    try {
        const respuesta = await axios.get(`${BASE_URL}/nfts/list`);
        const raw = Array.isArray(respuesta.data) ? respuesta.data : (respuesta.data.coins || respuesta.data);
        const items = (raw || []).map((entry)=> {
            const i = entry.item || entry;  // asi para que acepte item: {...} o directamente {...}
            return {
                id: i.id || i.contract_address || (i.name && i.name.toLowerCase().replace(/\s+/g, "-")),
                name: i.name || null,
                symbol: i.symbol || null,
                asset_platform_id: i.asset_platform_id || null,
                image: normalizeImage(i.image) || normalizeImage(i.small_image) || normalizeImage(i.thumb) || null,
            }
        });

        // Si se solicita, rellenar imágenes para un sample pequeño usando el endpoint de detalle (evita 429 con batching)
        if (includeDetails) {
            const need = items.filter(it => !it.image).slice(0, sampleSize);
            const batchSize = 3;
            for (let i = 0; i < need.length; i += batchSize) {
                const batch = need.slice(i, i + batchSize);
                const res = await Promise.all(batch.map(b => getNftDetails(b.id).catch(() => ({ id: b.id, image: null }))));
                // mezclar resultados
                res.forEach(d => {
                    const idx = items.findIndex(it => it.id === d.id);
                    if (idx >= 0 && d.image) items[idx].image = d.image;
                });
                // pequeño delay entre batches para reducir riesgo de 429
                await new Promise(r => setTimeout(r, 700));
            }
        }

        if(!query) return items;
        const q = query.toLowerCase();
        return items.filter((item) => item.name && item.name.toLowerCase().includes(q));
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//DEtalles por id 
export const getNftDetails = async (id) => {
  const maxAttempts = 3;
  let attempt = 0;
  let delay = 600;
  while (attempt < maxAttempts) {
    try {
      const respuesta = await axios.get(`${BASE_URL}/nfts/${encodeURIComponent(id)}`);
      const d = respuesta.data || {};
      const image = normalizeImage(d.image || d);
      const price = d.market_data?.floor_price_usd
        ?? d.market_data?.current_price?.floor_price_usd
        ?? d.floor_price_usd
        ?? d.market_data?.floor_price?.floor_price_usd
        ?? null;
      return { id: d.id || id, name: d.name || null, image, price, raw: d };
    } catch (error) {
      const status = error?.response?.status;
      // si la API devuelve Retry-After, respetarla
      const retryAfter = parseInt(error?.response?.headers?.["retry-after"], 10);
      if (status === 429 && attempt < maxAttempts) {
        const wait = Number.isFinite(retryAfter) ? retryAfter * 1000 : delay;
        await new Promise(r => setTimeout(r, wait));
        attempt++;
        delay *= 2;
        continue;
      }
      console.error("getNftDetails error", id, status);
      if (status === 429) throw error; // permitir que llamador maneje reintentos adicionales
      return { id, name: null, image: null, price: null, raw: null };
    }
  }
  return { id, name: null, image: null, price: null, raw: null };
};
//filtrar top 5 por precio
export const getTopNftsByPrice = async (n = 5) =>{
    try{
        const list = await getNfts();
        // reducir sample para no hacer demasiadas llamadas desde el cliente
        const sample = list.slice(0, 20);

        // procesar en batches pequeños para evitar 429
        const batchSize = 2;
        const details = [];

        // helper: intenta getNftDetails con backoff (reintentos en 429)
        const fetchWithRetry = async (id) => {
          let attempt = 0;
          let delay = 600;
          const maxAttempts = 3;
          while (attempt < maxAttempts) {
            try {
              return await getNftDetails(id);
            } catch (err) {
              const status = err?.response?.status;
              attempt++;
              if (status === 429 && attempt < maxAttempts) {
                // espera exponencial y reintenta
                await new Promise(r => setTimeout(r, delay));
                delay *= 2;
                continue;
              }
              // si no es 429 o se agotaron intentos, devolver fallback vacío
              return {id, name: null, image: null, price: null, raw: null};
            }
          }
          return {id, name: null, image: null, price: null, raw: null};
        };

        for (let i=0; i<sample.length; i += batchSize){
            const batch = sample.slice(i, i+batchSize);
            const res = await Promise.all(batch.map(item => fetchWithRetry(item.id)));
            details.push(...res);
            // espera entre batches
            await new Promise(r => setTimeout(r, 900));
        }

        // conservar solo los que tienen precio numérico
        const withPrice = details.filter(d => typeof d.price === "number");
        if (withPrice.length === 0) {
          // fallback: devolver primeras n entradas del listado que tengan imagen
          const fallback = sample
            .filter(it => it.image)
            .slice(0, n)
            .map(it => ({ id: it.id, name: it.name, image: normalizeImage(it.image), price: null, raw: null }));
          return fallback;
        }

        withPrice.sort((a,b)=>b.price - a.price);
        return withPrice.slice(0,n);
    }catch(error){
        console.error(error);
        throw error;
    }
}