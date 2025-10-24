import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MarketChart() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 5,
            page: 1,
          },
        });
        const formatted = res.data.map((coin) => ({
          name: coin.name,
          price: coin.current_price,
        }));
        setCoins(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMarketData();
  }, []);

  if (loading) return <p className="text-gray-500">Cargando datos...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2 text-green-700">Top 5 Criptomonedas</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={coins}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
