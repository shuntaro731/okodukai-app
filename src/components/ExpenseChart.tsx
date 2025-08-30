import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

type ChartData = {
  month: string;
  expenses: number;
  savings: number;
};

type ExpenseChartProps = {
  chartData: ChartData[]; //utilで今の月と6月前のまでのデータ支出、貯金取得
};

export default function ExpenseChart({ chartData }: ExpenseChartProps) {

  return (
    <div className='bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200'>
      <h3 className='text-gray-500 text-sm font-semibold mb-3'>支出・貯金推移</h3>
      <div className='flex gap-4 mb-3'>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-purple-500 rounded-full'></div>
          <span className='text-xs text-gray-600'>支出</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-green-500 rounded-full'></div>
          <span className='text-xs text-gray-600'>貯金</span>
        </div>
      </div>
      <div className='h-24'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
            />
            <YAxis hide />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4, fill: '#8B5CF6' }}
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}