import { useEffect, useState } from "react";
import axios from "axios";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";

export default function RadialPrice() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopCoins() {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 5,
            page: 1,
          },
        });
        const palette = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#ffc658"];
        const formatted = res.data.map((coin, i) => ({
          name: coin.name,
          // value key used by RadialBar dataKey
          value: coin.current_price,
          // optional: show price text in tooltip/label if needed
          price: coin.current_price,
          fill: palette[i % palette.length],
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error fetching coins for RadialPrice:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTopCoins();
  }, []);

  if (loading) return <p className="text-gray-500">Cargando datos...</p>;
  if (!data.length) return <p className="text-red-500">No hay datos disponibles</p>;

  const legendStyle = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "24px",
  };

  return (
    <div className="w-full max-w-[700px] m-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-1 text-gray-700">Top 5 Criptomonedas (Precio USD)</h2>
      <h3 className="text-sm font-semibold mb-4 text-gray-700">Criptomonedas más populares en el mercado</h3>
      <div className="w-full h-[320px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="30%" innerRadius="10%" outerRadius="80%" barSize={18} data={data}>
            <RadialBar
              minAngle={15}
              label={{ position: "insideStart", fill: "#fff", formatter: () => "" }}
              background
              dataKey="value"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={legendStyle}
              payload={data.map((d) => ({ value: `${d.name} — $${d.value}`, type: "square", color: d.fill }))}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};