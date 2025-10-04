import { useState } from 'react';
import type { Category } from '../types';
import { categoryIcons } from '../constants/categories';

type AddExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddExpense: (amount: number, memo: string, category: string) => Promise<void>;
  loading?: boolean;
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  categories,
  onAddExpense,
  loading = false
}: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [category, setCategory] = useState('');

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !memo || !category) {
      alert('全ての項目を入力してください');
      return;
    }

    await onAddExpense(Number(amount), memo, category);

    // フォームをリセットして閉じる
    setAmount('');
    setMemo('');
    setCategory('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">新しい支出を追加</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 金額入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              金額
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* メモ入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メモ
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="ランチ代"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* カテゴリ選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const IconComponent = categoryIcons[cat.icon as keyof typeof categoryIcons];
                const isSelected = category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-gray-200 border-gray-400'
                        : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IconComponent
                        size={24}
                        stroke={2}
                        className="text-gray-700"
                      />
                      <span className="text-xs text-gray-700">{cat.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? '追加中...' : '追加する'}
          </button>
        </form>
      </div>
    </div>
  );
}
