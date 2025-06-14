import './App.css'     //meのデザイン
import { useState } from 'react'

type Expense = {
  amount: number;
  memo: string;
}

function App() {
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>("")
  const [expenses, setExpenses] = useState<Expense[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expensive: Expense = {amount, memo};
    console.log("送信済み", expensive);

    setExpenses([...expenses, expensive])

    setAmount(0); 
    setMemo("");
  }

const total = expenses.reduce((sum, item) => sum + item.amount, 0)

const handleDelete = (indexToDelete : number) => {
  const updated = expenses.filter((_, index) => index !== indexToDelete);
  setExpenses(updated)
}

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex flex-col items-center justify-center py-8 px-2'>
      <div className='w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8'>
        <h1 className='text-3xl font-bold mb-6 text-blue-800 text-center drop-shadow-sm tracking-wide'>
          お小遣いアプリ手帳
        </h1>
        <form
          onSubmit={handleSubmit}
          className='space-y-5'
        >
          <div>
            <label className='block text-base font-semibold mb-1 text-blue-700'>金額</label>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className='w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg bg-blue-50 placeholder:text-blue-300 transition'
              placeholder='例: 1000'
              min={0}
            />
          </div>
          <div>
            <label className='block text-base font-semibold mb-1 text-blue-700'>メモ</label>
            <input
              type='text'
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className='w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg bg-blue-50 placeholder:text-blue-300 transition'
              placeholder='例: 昼ごはん'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-lg font-bold text-lg shadow-md transition-all duration-150 active:scale-95'
          >
            登録
          </button>
          <div className='mt-8'>
            <h2 className='text-xl font-bold text-blue-700 mb-2 text-center'>支出一覧</h2>
            <ul className='space-y-3 max-h-56 overflow-y-auto'>
              {expenses.map((expense, index) => (
                <li
                  key={index}
                  className='flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 shadow-sm hover:bg-blue-100 transition'
                >
                  <span className='text-gray-700 text-base font-medium truncate flex-1'>{expense.memo}</span>
                  <span className='text-blue-700 text-base font-bold ml-3'>{expense.amount.toLocaleString()} 円</span>
                  <button
                    className='ml-4 text-xs text-red-600 hover:text-white hover:bg-red-500 px-2 py-1 rounded transition font-semibold border border-red-200'
                    onClick={() => handleDelete(index)}
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='mt-8'>
            <label className='block text-base font-semibold mb-1 text-blue-700 text-center'>合計金額</label>
            <div className='w-full p-3 border border-blue-200 bg-blue-50 text-right font-bold text-blue-800 rounded-lg text-xl tracking-wider'>
              {total.toLocaleString()} 円
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App