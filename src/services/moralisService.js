export async function getTrendingNFTs() {
  const url = "https://deep-index.moralis.io/api/v2.2/market-data/nfts/top-collections";

  const response = await fetch(url, {
    headers: {
      "accept": "application/json",
      "X-API-Key": import.meta.env.VITE_MORALIS_API_KEY,
    },
    // mode: "cors" // opcional, por defecto es "cors" en browsers
  });

  const status = response.status;
  const contentType = response.headers.get("content-type") || "";

  // si no ok, devuelve el texto para depuración
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Moralis fetch error:", status, text);
    throw new Error(`Error al obtener NFTs: ${status}`);
  }

  // intenta parsear según el content-type, con fallback a text y parseo seguro
  let rawText;
  try {
    if (contentType.includes("application/json")) {
      const data = await response.json();
      // soportar varias estructuras: array directo, { result: [...] }, { data: [...] }
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.result)) return data.result;
      if (Array.isArray(data.data)) return data.data;
      console.warn("Estructura inesperada de JSON:", Object.keys(data));
      return [];
    } else {
      // no es JSON según headers: leer texto para ver qué está devolviendo el servidor (HTML de error, login, etc.)
      rawText = await response.text();
      console.warn("Respuesta no JSON de Moralis:", contentType, rawText.slice(0, 1000));
      try {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed)) return parsed;
        if (Array.isArray(parsed.result)) return parsed.result;
        if (Array.isArray(parsed.data)) return parsed.data;
      } catch (e) {
        // no es JSON válido
        return [];
      }
    }
  } catch (err) {
    console.error("Error parseando respuesta Moralis:", err, rawText || "");
    return [];
  }

  return [];
}