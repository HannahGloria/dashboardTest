export default function FilterBar({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-4 bg-white shadow-sm p-4 rounded-lg">
      <label className="text-pink-500 font-medium content-center">Selecciona Criptomoneda:</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2"
      >
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
        <option value="dogecoin">Dogecoin</option>
        <option value="cardano">Cardano</option>
      </select>
    </div>
  );
}
