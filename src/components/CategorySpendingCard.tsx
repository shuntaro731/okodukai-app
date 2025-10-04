import type { Category, Expense } from '../types';
import { MONTHLY_BUDGET } from '../constants/categories';
import { calculateTotal, getCategoryTotals } from '../utils';
import { IconChartPie } from '@tabler/icons-react';

type CategorySpendingCardProps = {
  expenses: Expense[];
  categories: Category[];
};

export default function CategorySpendingCard({ expenses, categories }: CategorySpendingCardProps) {
  const total = calculateTotal(expenses);

  const categoryTotals = getCategoryTotals(expenses, categories);

  if (categoryTotals.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-2xl p-5'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-gray-500 text-sm font-medium'>カテゴリごとの支出</h2>
        <div className='w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center'>
          <IconChartPie size={20} stroke={2} className='text-purple-600' />
        </div>
      </div>

      <div className='text-3xl font-bold text-black mb-1'>
        {total.toLocaleString()}
        <span className='text-lg ml-1 font-normal'>円</span>
      </div>
      <div className='text-gray-300 text-sm mb-5'>/{MONTHLY_BUDGET.toLocaleString()}</div>

      <div className='space-y-4'>
        {categoryTotals.slice(0, 3).map((categoryData) => {
          return (
            <div key={categoryData.id} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className={`w-2 h-2 ${categoryData.color} rounded-full`}></div>
                <span className='text-sm text-gray-700'>{categoryData.name}</span>
              </div>
              <div className='text-base font-semibold text-black'>
                {categoryData.total.toLocaleString()}
                <span className='text-xs font-normal text-gray-400 ml-0.5'>円</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}