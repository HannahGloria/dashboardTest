export async function getTrendingNFTs() {
  const url = "https://deep-index.moralis.io/api/v2.2/market-data/nfts/top-collections";

  const response = await fetch(url, {
    headers: {
      "accept": "application/json",
      "X-API-Key": import.meta.env.VITE_MORALIS_API_KEY,
    },
  });

  const status = response.status;
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Moralis fetch error:", status, text);
    throw new Error(`Error al obtener NFTs: ${status}`);
  }

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
      rawText = await response.text();
      console.warn("Respuesta en formato que no es JSON:", contentType, rawText.slice(0, 1000));
      try {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed)) return parsed;
        if (Array.isArray(parsed.result)) return parsed.result;
        if (Array.isArray(parsed.data)) return parsed.data;
      } catch (e) {
        // Si no es un JSON válido
        return [];
      }
    }
  } catch (err) {
    console.error("Error parseando respuesta Moralis:", err, rawText || "");
    return [];
  }

  return [];
}