import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import SavingsForm from './SavingsForm';
import type { Category } from '../../types';

type ModalType = 'selection' | 'expense' | 'savings'; //支出か貯金を選択

type AddModalProps = {
  isOpen: boolean; //モーダルの開閉状況
  onClose: () => void;
  categories: Category[];
  onAddExpense: (amount: number, memo: string, category: string) => Promise<void>; //支出追加データを親に渡す
  onAddSavings: (amount: number, memo: string) => Promise<void>; //略
  loading?: boolean;
};

export default function AddModal({
  isOpen,
  onClose,
  categories,
  onAddExpense,
  onAddSavings,
  loading = false
}: AddModalProps) {
  const [modalType, setModalType] = useState<ModalType>('selection');

  const handleClose = () => {
    setModalType('selection'); //selection画面
    onClose(); //完了後閉じる
  };

  const handleExpenseAdded = async (amount: number, memo: string, category: string) => {
    await onAddExpense(amount, memo, category); //支出画面
    handleClose();
  };

  const handleSavingsAdded = async (amount: number, memo: string) => { 
    await onAddSavings(amount, memo); //貯金画面
    handleClose();
  };

  if (!isOpen) return null; //

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">
            {modalType === 'selection' && '項目を追加'}
            {modalType === 'expense' && '新しい支出を追加'}
            {modalType === 'savings' && '貯金を追加'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {modalType === 'selection' && (
            <div className="space-y-3">
              <button
                onClick={() => setModalType('expense')}
                className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="text-purple-700 font-semibold">支出を追加</div>
                  <div className="text-purple-600 text-sm">新しい支出を記録する</div>
                </div>
                <span className="text-purple-500 text-2xl">💸</span>
              </button>

              <button
                onClick={() => setModalType('savings')}
                className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="text-green-700 font-semibold">貯金を追加</div>
                  <div className="text-green-600 text-sm">新しい貯金を記録する</div>
                </div>
                <span className="text-green-500 text-2xl">💰</span>
              </button>
            </div>
          )}

          {modalType === 'expense' && ( //新しい支出を追加
            <ExpenseForm
              categories={categories}
              onAddExpense={handleExpenseAdded}
              loading={loading}
            />
          )}

          {modalType === 'savings' && ( //貯金を追加
            <SavingsForm
              onAddSavings={handleSavingsAdded}
              loading={loading}
            />
          )}

          {modalType !== 'selection' && ( //選択画面に戻る
            <button
              onClick={() => setModalType('selection')}
              className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              ← 選択画面に戻る
            </button>
          )}
        </div>
      </div>
    </div>
  );
}