import { useState, useEffect } from "react";
import { getNfts, getTopNftsByPrice } from "../services/coingeckoAPI";

export default function TopNftCard(){
    const [loadingTop, setLoadingTop] = useState(false);
    const [top5, setTop5] = useState([]);

  useEffect(() => {
    (async () => {
      setLoadingTop(true);
      try {
        const top = await getTopNftsByPrice(5);
        setTop5(top);
         console.log("Top NFTs:", top); // 
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTop(false);
      }
    })();
  }, []);

  // Normaliza IPFS / esquemas y asegura URL válida
  const normalizeImageUrl = (url) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${url.replace(/^ipfs:\/\//, "")}`;
    if (url.startsWith("ipfs/")) return `https://ipfs.io/ipfs/${url.replace(/^ipfs\//, "")}`;
    if (url.startsWith("//")) return `https:${url}`;
    return url;
  };

  return(
    <div>
        {/* TOP5 */}
        <div className="mb-6 px-4">
          <h3 className="text-md font-semibold mb-3">Top 5 NFTs</h3>
            <div className="flex gap-6 flex-wrap mb-3">
            {loadingTop ? (
            <div>Cargando top 5...</div>
            ) : (
            top5.map(t => (
                <div key={t.id} 
                className="w-3xs p-4 shadow-xs rounded-2xl bg-white text-center">
                <img
                src={normalizeImageUrl(t.image)}
                alt={t.name}
                className="w-12 h-32 object-cover rounded-2xl"
                onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                />
                <div className="mt-2 font-semibold">{t.name}</div>
                <div className="mt-1.5 caret-indigo-500">{t.price ? `$${Number(t.price).toLocaleString()}` : "—"}</div>
                </div>
            ))
            )}
            </div>
        </div>
    </div>
  )
}