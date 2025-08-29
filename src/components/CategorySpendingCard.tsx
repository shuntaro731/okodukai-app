import type { Category, Expense } from '../types';
import { MONTHLY_BUDGET } from '../constants/categories';

type CategorySpendingCardProps = {
  expenses: Expense[];
  categories: Category[];
};

export default function CategorySpendingCard({ expenses, categories }: CategorySpendingCardProps) {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const getCategoryTotals = () => {
    const totals = categories.map(category => {
      const categoryExpenses = expenses.filter(expense => expense.category === category.id);
      const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        ...category,
        total: categoryTotal,
        count: categoryExpenses.length
      };
    }).filter(cat => cat.total > 0);
    
    return totals.sort((a, b) => b.total - a.total);
  };

  const categoryTotals = getCategoryTotals();

  if (categoryTotals.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-gray-500 text-sm font-semibold'>カテゴリごとの支出</h2>
        <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
          <span className='text-purple-500 text-lg'>📊</span>
        </div>
      </div>
      
      <div className='text-2xl font-bold text-black mb-2'>
        {total.toLocaleString()}
        <span className='text-sm ml-1'>円</span>
      </div>
      <div className='text-gray-400 text-sm mb-4'>/{MONTHLY_BUDGET.toLocaleString()}</div>
      
      <div className='space-y-3'>
        {categoryTotals.slice(0, 3).map((categoryData) => {
          const percentage = Math.min((categoryData.total / total) * 100, 100);
          return (
            <div key={categoryData.id} className='flex items-center gap-3'>
              <div className={`w-4 h-4 ${categoryData.color} rounded`}></div>
              <div className='flex-1 min-w-0'>
                <div className='text-black text-sm font-semibold'>{categoryData.name}</div>
                <div className='w-full bg-gray-200 rounded-full h-1 mt-1'>
                  <div 
                    className={`${categoryData.color} h-1 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className='text-black text-sm font-semibold'>
                {categoryData.total.toLocaleString()}
                <span className='text-xs'>円</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}