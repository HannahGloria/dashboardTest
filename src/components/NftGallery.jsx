import { useEffect, useState } from "react";
import { getTrendingNFTs } from "../services/moralisService";

export default function NftGallery() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function fetchNFTs() {
      try {
        const data = await getTrendingNFTs();
        console.log("raw trending data:", data); // loguea la respuesta real
        const list = Array.isArray(data) ? data.slice(0, 6) : [];
        setNfts(list); // actualizar estado con los 6 primeros
      } catch (error) {
        console.error(error);
      }
    }
    fetchNFTs();
  }, []);

  // efecto para ver el estado actualizado de nfts
  useEffect(() => {
    console.log("nfts state updated:", nfts);
  }, [nfts]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">NFTs en Tendencia</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {nfts.map((nft, i) => (
          <div
            key={i}
            className="rounded-xs border border-gray-200 p-3 hover:shadow-lg transition"
          >
            <img
              src={nft.thumbnail || nft.image || nft.collection_image || "/placeholder.jpg"}
              alt={nft.name || nft.collection_title || `NFT ${i + 1}`}
              className="rounded-lg w-full h-40 object-cover"
            />
            <h3 className="text-md font-medium mt-2">
              {nft.collection_title || "Colección desconocida"}
            </h3>
            <p className="text-sm text-gray-500">
                <span>Precio minimo: </span>
              {nft.floor_price || "Precio minimo desconocido"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}