import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { Expense, Savings } from '../types';
import { getMonthName, filterExpensesByMonth, filterSavingsByMonth, calculateTotal } from '../utils';

type ExpenseChartProps = {
  expenses: Expense[];
  savings: Savings[];
};

export default function ExpenseChart({ expenses, savings }: ExpenseChartProps) {
  const getChartData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthString = date.toISOString().slice(0, 7);
      const monthExpenses = filterExpensesByMonth(expenses, monthString);
      const monthSavings = filterSavingsByMonth(savings, monthString);
      const expenseTotal = calculateTotal(monthExpenses);
      const savingTotal = calculateTotal(monthSavings);
      
      data.push({
        month: getMonthName(monthString),
        expenses: expenseTotal,
        savings: savingTotal,
      });
    }
    return data;
  };

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
          <LineChart data={getChartData()}>
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