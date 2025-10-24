import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;
const chartData = [
  { name: 'Criptomonedas', value: 160, fill: '#c69fd5' }, // mayor venta
  { name: 'NFTs', value: 50, fill: '#fbb9c5' },
  { name: 'Cambio divisas', value: 30, fill: '#b8dfe6' },
];

const needle = ({ value, data, cx, cy, iR, oR, color }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="needle-circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      key="needle-path"
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="none"
      fill={color}
    />,
  ];
};

export default function PieChartSales({ isAnimationActive = true }) {
  const cx = 100;
  const cy = 100;
  const iR = 50;
  const oR = 100;
  const value = chartData[0].value;
  const value2 = chartData[1].value;
  const value3 = chartData[2].value;
  const total = chartData.reduce((s, v) => s + v.value, 0);
  const percent = Math.round((value / total) * 100);
  const percent2 = Math.round((value2 / total) * 100);
  const percent3 = Math.round((value3 / total) * 100);

  return (
    <div className="w-full  mx-auto bg-white shadow rounded-lg p-3">
      <div className="text-lg font-semibold mb-1 text-gray-700">Ventas de NFTs y Criptomonedas</div>
      <h3 className=" mb-2 font-medium text-xs text-gray-600">Realizadas por Cryptocoins</h3>

      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-4">
        <div className="w-full md:w-1/2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart className=' w-6/12'>
                    <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={chartData}
                    cx={cx}
                    cy={cy}
                    innerRadius={iR}
                    outerRadius={oR}
                    stroke="none"
                    isAnimationActive={isAnimationActive}
                    />
                    {needle({ value, data: chartData, cx, cy, iR, oR, color: chartData[0].fill })}
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-3">
            <div className="flex flex-col items-start">
                <div className="text-sm font-semibold text-gray-800">{chartData[0].name}</div>
                <div className="text-xs text-gray-600 mb-3">${value} · {percent}%</div>

                <div className="text-sm font-semibold text-gray-800">NFTs</div>
                <div className="text-xs text-gray-600 mb-2">${value2} · {percent2}%</div>

                <div className="text-sm font-semibold text-gray-800">Divisas</div>
                <div className="text-xs text-gray-600 mb-4">${value3} · {percent3}%</div>
            </div>
        </div>
      </div>
            <div className="mt-2">
                <h2 className="text-sm font-semibold">Top 3 mejores vendedores de CriptoCoins</h2>
                <ol className="mt-2 list-decimal list-inside text-xs text-gray-700">
                <li>Vendedor A — $45</li>
                <li>Vendedor B — $30</li>
                <li>Vendedor C — $25</li>
                </ol>
            </div>
    </div>
  );
}