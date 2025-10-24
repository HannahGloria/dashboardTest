import { useState, useEffect } from "react";
import { getTrendingNFTs } from "../services/moralisService"; //mejor usare esta API

export default function SearchByName() {
    const [query, setQuery] = useState("");
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // No mostrar resultados hasta que el usuario escriba al menos 2 caracteres
    const minLength = 2;
    const txtSearch = query.trim().toLowerCase();
    const showResults = txtSearch.length >= minLength;
     const filtered = showResults
    ? list.filter(it => it.name && it.name.toLowerCase().includes(txtSearch))
    : [];

    const resolveImageUrl = (item) => {
        const url = item?.image || item?.raw?.collection_image || item?.image?.small || item?.image_url || item?.thumbnail;
         if (!url) return "/placeholder.png";
        let final = url;
        if (final.startsWith("ipfs://")) {
            final = "https://ipfs.io/ipfs/" + final.replace("ipfs://", "");
        }
        if (final.startsWith("http://")) {
            final = final.replace("http://", "https://");
        }
        return final;
    };

    useEffect(() => {
        (async () => {
          setLoading(true);
          setError(null);
          try {
            // Moralis devuelve colecciones 
            const items = await getTrendingNFTs();
            console.log("getTrendingNfts() ->", items); //Borrar después de debug
            if (Array.isArray(items)) {
              // mapear de la forma que usa el componente
              const mapped = items.map((it, idx) => ({
                id: it.collection_address || it.id || `${it.collection_title}-${idx}`,
                name: it.collection_title || it.name || "Sin título",
                image: it.collection_image || it.thumbnail || it.image || null,
                price: it.floor_price || it.floor_price_usd || it.floor_price_usd_24hr_percent_change || null,
                raw: it,
              }));
              setList(mapped);
            } else {
              console.error("getTrendingNfts no devolvió un array:", items);
              setList([]);
              setError("Respuesta inesperada de la API");
            }
          } catch (e) {
            console.error("Error fetching NFTs:", e);
            setError(e.message || "Error al obtener NFTs");
            setList([]);
          } finally {
            setLoading(false);
          }
        })();
      }, []);
    return (
        <div>
            <div className="mb-1 flex items-center justify-between">
                <h2 className="text-2xl font-semibold ml-4 text-stone-900">¿Quieres ver más NFTs?</h2>
                <input
                className="p-2 w-6/12 max-w-6/12 rounded-2xl m-8 border-2 border-gray-500"
                placeholder="Buscar NFT por nombre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            
            {/* RESULTADOS */}
            <div className="mt-4 px-4">
           
            {loading && <div className="text-gray-600">Cargando NFTs...</div>}
            {error && <div className="text-red-600">Error: {error}</div>}

            {showResults ? (
                filtered.length === 0 ? (
                <div className="text-cyan-800 mb-8 rounded-3xl">
                    No se encontraron NFTs para "{query}".
                </div>
                ) : (
                <div className="flex gap-6 flex-wrap mb-3">
                    {filtered.map(t => (
                    <div key={t.id}
                        className="w-48 p-4 shadow-xs rounded-2xl bg-white text-center">
                        <img
                          src={resolveImageUrl(t)}
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                          alt={t.name || "nft"}
                          className="w-32 h-32 object-cover rounded-2xl mx-auto"
                        />
                        <div className="mt-2 font-semibold">{t.name}</div>
                        <div className="mt-1.5 caret-indigo-500">{t.price ? `$${Number(t.price).toLocaleString()}` : "—"}</div>
                    </div>
                    ))}
                </div>
                )
            ) : (
                <div className="text-gray-500 mb-4 pb-4">
                {query.length === 0 ? "Escribe para buscar NFTs por nombre." : (query.length < minLength ? `Ingresa al menos ${minLength} caracteres para buscar.` : null)}
                </div>
            )}
            </div>
        </div>
    )
}
