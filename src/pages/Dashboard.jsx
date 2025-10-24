import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import CryptoChart from "../components/CryptoChart";
import MarketChart from "../components/MarketChart";
import NftGallery from "../components/NftGallery";
import RadialPrice from "../components/RadialPrice"
import PieChartSales from "../components/PieChartSales"
import SearchByName from "../components/SearchByName";

export default function Dashboard() {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div>
      <Navbar />
      <NftGallery/>
      <div className="min-h-screen bg-indigo-200 w-4/5 m-auto rounded-2xl">
        <main className="max-w-6xl mx-auto p-6">
          <FilterBar selected={selectedCoin} onChange={setSelectedCoin} />
          <section className="grid md:grid-cols-2 gap-6 mt-6">
            <CryptoChart coinId={selectedCoin} />
            <MarketChart />
            <RadialPrice />
            <PieChartSales />
          </section>
        </main>
      </div>
      <div className="bg-lime-200 w-4/5 m-auto rounded-2xl mt-2">
        <SearchByName />
      </div>
    </div>
  );
}
