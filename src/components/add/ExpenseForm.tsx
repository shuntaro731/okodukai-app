import { useState } from 'react';
import type { Category } from '../../types';

type ExpenseFormProps = {
  categories: Category[];
  onAddExpense: (amount: number, memo: string, category: string) => Promise<void>;
  loading?: boolean;
};

export default function ExpenseForm({ categories, onAddExpense, loading = false }: ExpenseFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>('other');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await onAddExpense(amount, memo, selectedCategory);
    setAmount(0);
    setMemo("");
    setSelectedCategory('other');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <input
          type='number'
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          className='w-full border border-gray-200 p-3 rounded-lg text-sm'
          placeholder='金額を入力'
          min={0}
        />
      </div>
      <div>
        <input
          type='text'
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className='w-full border border-gray-200 p-3 rounded-lg text-sm'
          placeholder='メモを入力'
        />
      </div>
      
      {/* Category selection */}
      <div>
        <label className='text-gray-700 text-sm font-medium mb-2 block'>カテゴリ</label>
        <div className='grid grid-cols-3 gap-2'>
          {categories.map((category) => (
            <button
              key={category.id}
              type='button'
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} text-white border-transparent`
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className='text-lg'>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <button 
        type='submit'
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-500 hover:bg-purple-600'
        } text-white`}
      >
        {loading ? '追加中...' : '追加'}
      </button>
    </form>
  );
}