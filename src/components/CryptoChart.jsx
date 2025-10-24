import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchCrypto } from "../hooks/useFetchCrypto";

export default function CryptoChart({ coinId = "bitcoin", days = 30 }) {
  const { data, loading, error } = useFetchCrypto(coinId, days);

  if (loading) return <p className="text-gray-500">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const chartData = data.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: parseFloat(price.toFixed(2)),
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2 text-fuchsia-800">
        Precio de {coinId.charAt(0).toUpperCase() + coinId.slice(1)}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
