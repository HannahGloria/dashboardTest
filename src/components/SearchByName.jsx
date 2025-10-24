import { useState, useEffect } from "react";
import { getNfts, getTopNftsByPrice } from "../services/coingeckoAPI";

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
        const url = item?.image?.small || item?.image_url || item?.thumbnail || item?.image;
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
            // pedir includeDetails = true para popular image (solo un sample pequeño en la función)
            const items = await getNfts("", true);
            console.log("getNfts() ->", items);
            if (Array.isArray(items)) {
              setList(items);
            } else {
              console.error("getNfts no devolvió un array:", items);
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
                <h2 className="text-lg font-semibold ml-4">NFTs</h2>
                <input
                placeholder="Buscar NFT por nombre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="p-2 w-3/12 max-w-3/12 rounded-2xl m-8"
                />
            </div>
            
            {/* RESULTADOS */}
            <div className="mt-4 px-4">
            <h3 className="text-md font-semibold mb-3">Resultados</h3>

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
                <div className="text-gray-500">
                {query.length === 0 ? "Escribe para buscar NFTs por nombre." : (query.length < minLength ? `Ingresa al menos ${minLength} caracteres para buscar.` : null)}
                </div>
            )}
            </div>
        </div>
    )
}
