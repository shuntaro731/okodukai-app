import type { Category, Expense } from '../types';
import { getCategoryInfo } from '../utils';

type RecentTransactionsProps = {
  expenses: Expense[];
  categories: Category[];
  onDeleteExpense: (id: string) => void;
};

export default function RecentTransactions({ expenses, categories, onDeleteExpense }: RecentTransactionsProps) {

  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-gray-500 text-sm font-semibold'>最近の支出履歴</h2>
        <button className='text-gray-400 text-xs font-semibold'>すべて見る</button>
      </div>
      
      <div className='space-y-3'>
        {expenses.slice(0, 3).map((expense) => {
          const categoryInfo = getCategoryInfo(expense.category || 'other', categories);
          return (
            <div key={expense.id} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className={`w-9 h-9 ${categoryInfo.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                  <span className='text-lg'>{categoryInfo.icon}</span>
                </div>
                <div>
                  <div className='text-black text-sm font-semibold'>{expense.memo}</div>
                  <div className='text-gray-400 text-xs'>{categoryInfo.name}</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='text-black text-sm font-semibold'>
                  -{expense.amount.toLocaleString()}
                  <span className='text-xs'>円</span>
                </div>
                <button onClick={() => onDeleteExpense(expense.id)} className='w-5 h-5 text-gray-400 hover:text-red-500'>
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}