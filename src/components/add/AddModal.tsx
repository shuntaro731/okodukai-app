import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import SavingsForm from './SavingsForm';
import type { Category } from '../../types';
import { MODAL_OVERLAY, MODAL_CONTENT, MODAL_HEADER, CLOSE_BUTTON, SELECTION_BUTTON_BASE, BACK_BUTTON } from '../../constants/styles';

type ModalType = 'selection' | 'expense' | 'savings'; //支出か貯金を選択

type AddModalProps = {
  isOpen: boolean; //モーダルの開閉状況
  onClose: () => void;
  categories: Category[];
  onAddExpense: (amount: number, memo: string, category: string) => Promise<void>; //支出追加データを親に渡す
  onAddSavings: (amount: number, memo: string) => Promise<void>; //略
  loading?: boolean;
};

const modalConfig = {
  selection: { title: '項目を追加' },
  expense: { title: '新しい支出を追加' },
  savings: { title: '貯金を追加' }
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

  const handleItemAdded = async (type: 'expense' | 'savings', amount: number, memo: string, category?: string) => {
    if (type === 'expense' && category) {
      await onAddExpense(amount, memo, category);
    } else if (type === 'savings') {
      await onAddSavings(amount, memo);
    }
    handleClose();
  };

  if (!isOpen) return null; //

  return (
    <div className={MODAL_OVERLAY}>
      <div className={MODAL_CONTENT}>
        <div className={MODAL_HEADER}>
          <h2 className="text-lg font-semibold text-black">
            {modalConfig[modalType].title}
          </h2>
          <button
            onClick={handleClose}
            className={CLOSE_BUTTON}
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
                className={`${SELECTION_BUTTON_BASE} bg-purple-50 hover:bg-purple-100 border-purple-200`}
              >
                <div>
                  <div className="text-purple-700 font-semibold">支出を追加</div>
                  <div className="text-purple-600 text-sm">新しい支出を記録する</div>
                </div>
                <span className="text-purple-500 text-2xl">💸</span>
              </button>

              <button
                onClick={() => setModalType('savings')}
                className={`${SELECTION_BUTTON_BASE} bg-green-50 hover:bg-green-100 border-green-200`}
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
              onAddExpense={(amount, memo, category) => handleItemAdded('expense', amount, memo, category)}
              loading={loading}
            />
          )}

          {modalType === 'savings' && ( //貯金を追加
            <SavingsForm
              onAddSavings={(amount, memo) => handleItemAdded('savings', amount, memo)}
              loading={loading}
            />
          )}

          {modalType !== 'selection' && (
            <button
              onClick={() => setModalType('selection')}
              className={BACK_BUTTON}
            >
              ← 選択画面に戻る
            </button>
          )}
        </div>
      </div>
    </div>
  );
}