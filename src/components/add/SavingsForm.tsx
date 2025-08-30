import { useState } from 'react';

type SavingsFormProps = {
  onAddSavings: (amount: number, memo: string) => Promise<void>;
  loading?: boolean;
};

export default function SavingsForm({ onAddSavings, loading = false }: SavingsFormProps) {
  const [savingsAmount, setSavingsAmount] = useState<number>(0); //貯金額の入力値を保持
  const [savingsMemo, setSavingsMemo] = useState<string>(""); //メモの入力値を保持

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //contactformでもやったブラウザのデフォルトのフォーム送信動作を防ぐやつ
    await onAddSavings(savingsAmount, savingsMemo); //親コンポーネントにデータを渡す
    setSavingsAmount(0); //フォームリセット
    setSavingsMemo("");
  };

  return (
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
  );
}