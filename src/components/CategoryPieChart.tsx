import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Expense, Category } from '../types'

type CategoryPieChartProps = {
  expenses: Expense[];
  categories: Category[];
}

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#A855F7', '#14B8A6']

export default function CategoryPieChart({ expenses, categories }: CategoryPieChartProps) {
  const data = categories.map((cat, idx) => {
    const sum = expenses
      .filter(e => e.category === cat.id)
      .reduce((s, e) => s + e.amount, 0)
    return { name: cat.name, value: sum, color: cat.color || COLORS[idx % COLORS.length] }
  }).filter(d => d.value > 0)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className='bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-200'>
      <h3 className='text-gray-500 text-sm font-semibold mb-3'>カテゴリ別支出</h3>
      <div className='h-56 relative'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Tooltip formatter={(v: number | string | Array<number | string>) => `${Number(v).toLocaleString()}円`} />
            <Pie data={data} dataKey='value' nameKey='name' cx='50%' cy='50%' innerRadius={60} outerRadius={80} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='text-center'>
            <div className='text-xs text-gray-400'>合計</div>
            <div className='text-xl font-bold text-black'>{total.toLocaleString()}<span className='text-sm ml-1'>円</span></div>
          </div>
        </div>
      </div>
      <div className='mt-3 grid grid-cols-2 gap-x-4 gap-y-1'>
        {data.map((d, i) => (
          <div key={i} className='flex items-center gap-2 text-sm'>
            <span className='w-3 h-3 rounded-full' style={{ backgroundColor: d.color }} />
            <span className='text-gray-700 flex-1'>{d.name}</span>
            <span className='text-gray-500'>{d.value.toLocaleString()}円</span>
          </div>
        ))}
      </div>
    </div>
  )
} 