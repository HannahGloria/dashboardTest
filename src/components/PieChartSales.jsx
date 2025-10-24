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
        <div className="w-full lg:w-1/2 md:w-full flex items-center justify-center h-30 md:h-30">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart className='w-full'>
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
        <div className="w-full lg:w-1/2 md:w-full flex flex-col justify-center p-3 h-30 md:h-30">
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
                <ol className="mt-2 list-decimal list-inside text-xs text-gray-700 block -space-x-1 overflow-hidden">
                <li className='flex m-auto w-5/12 p-2 text-center justify-between'>
                    <p className='m-auto'>Tanjiro Kamado — $45</p>
                    <img
                    alt=""
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="inline-block size-6 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10 m-auto"
                    />
                </li>
                <li className='flex m-auto w-5/12 p-2 text-center justify-between'>
                    <p  className='m-auto'>Satoru Gojo — $30</p>
                    <img
                    alt=""
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="inline-block size-6 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10 m-auto"
                    />
                </li>
                <li className="flex m-auto w-5/12 p-2 text-center justify-between">
                    <p className='m-auto'>Inosuke Hashibira — $25</p>
                    <img
                    alt=""
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                    className="inline-block size-6 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10 m-auto"
                    />
                    </li>
                </ol>
            </div>
    </div>
  );
}