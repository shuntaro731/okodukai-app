import type { Savings } from '../types';

type RecentSavingsProps = {
  savings: Savings[];
  savingsTotal: number;
  onDeleteSavings: (id: string) => void;
};

export default function RecentSavings({ savings, savingsTotal, onDeleteSavings }: RecentSavingsProps) {
  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-green-600 text-sm font-semibold'>💰 最近の貯金履歴</h2>
        <div className='text-green-600 text-xs font-semibold'>
          合計: +{savingsTotal.toLocaleString()}円
        </div>
      </div>
      
      {savings.length > 0 ? (
        <div className='space-y-3'>
          {savings.slice(0, 3).map((saving) => (
            <div key={saving.id} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center'>
                  <span className='text-lg'>💰</span>
                </div>
                <div>
                  <div className='text-black text-sm font-semibold'>{saving.memo}</div>
                  <div className='text-green-500 text-xs'>貯金</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='text-green-600 text-sm font-semibold'>
                  +{saving.amount.toLocaleString()}
                  <span className='text-xs'>円</span>
                </div>
                <button onClick={() => onDeleteSavings(saving.id)} className='w-5 h-5 text-gray-400 hover:text-red-500'>
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-gray-400 text-sm text-center py-4'>
          まだ貯金の記録がありません
        </div>
      )}
    </div>
  );
}