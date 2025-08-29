import { useState } from 'react';
import { validateSavingsForm } from '../utils';

type SavingsFormProps = {
  onAddSavings: (amount: number, memo: string) => Promise<void>;
  loading?: boolean;
  onError?: (error: string) => void;
};

export default function SavingsForm({ onAddSavings, loading = false, onError }: SavingsFormProps) {
  const [savingsAmount, setSavingsAmount] = useState<number>(0);
  const [savingsMemo, setSavingsMemo] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSavingsForm(savingsAmount, savingsMemo);
    if (!validation.isValid) {
      const errorMessage = validation.errors.amount || validation.errors.memo || "入力エラーがあります。";
      onError?.(errorMessage);
      return;
    }
    
    await onAddSavings(savingsAmount, savingsMemo);
    setSavingsAmount(0);
    setSavingsMemo("");
  };

  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200'>
      <h3 className='text-green-600 text-sm font-semibold mb-4'>💰 貯金を追加</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <input
            type='number'
            value={savingsAmount || ''}
            onChange={(e) => setSavingsAmount(Number(e.target.value))}
            className='w-full border border-green-200 p-3 rounded-lg text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400'
            placeholder='貯金額を入力'
            min={0}
          />
        </div>
        <div>
          <input
            type='text'
            value={savingsMemo}
            onChange={(e) => setSavingsMemo(e.target.value)}
            className='w-full border border-green-200 p-3 rounded-lg text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400'
            placeholder='メモを入力'
          />
        </div>
        
        <button 
          type='submit'
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {loading ? '追加中...' : '貯金を追加'}
        </button>
      </form>
    </div>
  );
}