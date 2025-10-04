import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Category, Expense } from '../types';
import { getCategoryTotals, calculateTotal } from '../utils';

type ExpenseDonutChartProps = {
  expenses: Expense[];
  categories: Category[];
};

// Tailwindのカラークラスを実際の色コードに変換
const colorClassToHex: Record<string, string> = {
  'bg-green-500': '#22c55e',
  'bg-blue-500': '#3b82f6',
  'bg-yellow-500': '#eab308',
  'bg-purple-500': '#a855f7',
  'bg-pink-500': '#ec4899',
  'bg-gray-500': '#6b7280',
};

export default function ExpenseDonutChart({ expenses, categories }: ExpenseDonutChartProps) {
  const total = calculateTotal(expenses);
  const categoryTotals = getCategoryTotals(expenses, categories);

  // Rechartsで使用するデータ形式に変換
  const chartData = categoryTotals.map((cat) => ({
    name: cat.name,
    value: cat.total,
    color: colorClassToHex[cat.color] || '#6b7280',
  }));

  // 支出がない場合は表示しない
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: 350 }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-black mb-2">
            0<span className="text-3xl ml-1">円</span>
          </div>
          <div className="text-gray-400 text-sm">今月の支出</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={110}
            outerRadius={155}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* 中央のテキスト表示 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-4xl font-bold text-black mb-2">
            {total.toLocaleString()}
            <span className="text-2xl ml-1">円</span>
          </div>
        </div>
      </div>
    </div>
  );
}
