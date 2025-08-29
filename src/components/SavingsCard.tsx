import { useState } from 'react';
import type { SavingsGoal } from '../types';

type SavingsCardProps = {
  selectedMonth: string;
  currentSavingsGoal?: SavingsGoal;
  currentSavings: number;
  onSavingsGoalSubmit: (targetAmount: number) => void;
};

function getMonthName(monthString: string) {
  const date = new Date(monthString + '-01');
  return `${date.getMonth() + 1}月`;
}

export default function SavingsCard({ 
  selectedMonth, 
  currentSavingsGoal, 
  currentSavings, 
  onSavingsGoalSubmit 
}: SavingsCardProps) {
  const [showSavingsGoalModal, setShowSavingsGoalModal] = useState(false);
  const [newSavingsTarget, setNewSavingsTarget] = useState(15000);

  const handleSubmit = () => {
    onSavingsGoalSubmit(newSavingsTarget);
    setShowSavingsGoalModal(false);
  };

  return (
    <>
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-gray-500 text-xs font-semibold'>月の貯金額</h2>
          <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
            <span className='text-purple-500 text-lg'>💰</span>
          </div>
        </div>
        
        <div className='text-xl font-bold text-purple-500 mb-1'>
          {currentSavings.toLocaleString()}
          <span className='text-sm ml-1'>円</span>
        </div>
        
        {currentSavingsGoal ? (
          <>
            <div className='text-gray-400 text-xs mb-4'>
              目標金額 : {currentSavingsGoal.targetAmount.toLocaleString()}
            </div>
            
            {/* Progress bar */}
            <div className='bg-gray-100 rounded-full p-1 mb-4'>
              <div className='bg-gradient-to-r from-purple-500 to-purple-400 h-5 rounded-full flex items-center justify-center relative overflow-hidden'>
                <div 
                  className='bg-purple-600 absolute left-0 top-0 h-full transition-all duration-500'
                  style={{ 
                    width: `${Math.min((currentSavings / currentSavingsGoal.targetAmount) * 100, 100)}%` 
                  }}
                ></div>
                <span className='text-white text-xs font-medium relative z-10'>
                  {Math.round((currentSavings / currentSavingsGoal.targetAmount) * 100)}%
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSavingsGoalModal(true)}
              className='text-gray-400 text-xs'
            >
              目標を変更
            </button>
          </>
        ) : (
          <button 
            onClick={() => setShowSavingsGoalModal(true)}
            className='bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors'
          >
            目標を設定
          </button>
        )}
      </div>

      {/* Savings Goal Modal */}
      {showSavingsGoalModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-sm'>
            <h3 className='text-lg font-bold text-black mb-4'>貯金目標を設定</h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {getMonthName(selectedMonth)}の目標貯金額
                </label>
                <input
                  type='number'
                  value={newSavingsTarget}
                  onChange={(e) => setNewSavingsTarget(Number(e.target.value))}
                  className='w-full border border-gray-200 p-3 rounded-lg text-sm'
                  placeholder='目標金額を入力'
                  min={0}
                />
              </div>
              <div className='text-sm text-gray-500'>
                現在の貯金可能額: {currentSavings.toLocaleString()}円
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowSavingsGoalModal(false)}
                  className='flex-1 border border-gray-200 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors'
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  className='flex-1 bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors'
                >
                  設定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}