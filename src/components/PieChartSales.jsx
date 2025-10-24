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
  const total = chartData.reduce((s, v) => s + v.value, 0);
  const percent = Math.round((value / total) * 100);

  return (
    <div className="w-full max-w-[515px] mx-auto bg-white shadow rounded-lg p-3">
      <div className="text-lg font-semibold mb-1 text-gray-700">Ventas de NFTs y Criptomonedas</div>
      <h3 className=" mb-2 font-medium text-xs text-gray-600">Realizadas por Cryptocoins</h3>

      {/* indicador central que muestra que lo más vendido son Criptomonedas */}
      <div className="inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-sm font-semibold text-gray-800">{chartData[0].name}</div>
        <div className="text-xs text-gray-600">${value} · {percent}%</div>
        {/* El resto de ventas */}
        <p className='text-sm font-semibold text-gray-800'>NFTs</p>
        <p className='text-sm font-semibold text-gray-800'>Divisas</p>
      </div>
      
      <div className="w-full h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
    </div>
  );
}