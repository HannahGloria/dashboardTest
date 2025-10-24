import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import CryptoChart from "../components/CryptoChart";
import MarketChart from "../components/MarketChart";
import NftGallery from "../components/NftGallery";

export default function Dashboard() {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div>
      <Navbar />
      <NftGallery/>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-6xl mx-auto p-6">
          <FilterBar selected={selectedCoin} onChange={setSelectedCoin} />
          <section className="grid md:grid-cols-2 gap-6 mt-6">
            <CryptoChart coinId={selectedCoin} />
            <MarketChart />
          </section>
        </main>
      </div>
    </div>
  );
}
