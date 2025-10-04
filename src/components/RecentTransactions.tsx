import type { Category, Expense } from '../types';
import { getCategoryInfo } from '../utils';
import { categoryIcons } from '../constants/categories';
import { IconClock } from '@tabler/icons-react';

type RecentTransactionsProps = {
  expenses: Expense[]; //支出データ
  categories: Category[]; //カテゴリ定義リスト
  onDeleteExpense: (id: string) => void; //voidなのでデータを空にする 削除
};

export default function RecentTransactions({ expenses, categories, onDeleteExpense }: RecentTransactionsProps) {

  return (
    <div className='bg-white rounded-2xl p-5'>
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center gap-2'>
          <IconClock size={20} stroke={2} className='text-gray-400' />
          <h2 className='text-gray-700 text-sm font-medium'>最近の履歴</h2>
        </div>
      </div>

      <div className='space-y-0 divide-y divide-gray-100'>
        {expenses.slice(0, 3).map((expense) => {
          const categoryInfo = getCategoryInfo(expense.category || 'other', categories);
          const IconComponent = categoryIcons[categoryInfo.icon as keyof typeof categoryIcons];
          return (
            <div key={expense.id} className='flex items-center justify-between py-3 first:pt-0'>
              <div className='flex items-center gap-3'>
                <div className={`w-10 h-10 ${categoryInfo.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                  <IconComponent size={22} stroke={2} className={categoryInfo.color.replace('bg-', 'text-')} />
                </div>
                <div>
                  <div className='text-black text-sm font-medium'>{expense.memo}</div>
                  <div className='text-gray-400 text-xs mt-0.5'>{categoryInfo.name}</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='text-black text-base font-semibold'>
                  -{expense.amount.toLocaleString()}
                  <span className='text-xs font-normal text-gray-400 ml-0.5'>円</span>
                </div>
                <button onClick={() => onDeleteExpense(expense.id)} className='w-6 h-6 text-gray-300 hover:text-red-500 text-xl transition-colors'>
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