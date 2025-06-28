import './App.css'     
import { useState } from 'react'
import { useEffect } from 'react'
import {db} from "./firebase"

import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore"


type Expense = {
  id: string;
  amount: number;
  memo: string;
  createdAt: Timestamp,
}

function App() {

  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>("")
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"))
    const unsubscirbe = onSnapshot(q, (snapshot)=>{
      const data = snapshot.docs.map((docSnap)=> {
        console.log("id", docSnap.id)
        return{
          id:docSnap.id,
          ...docSnap.data()
        }
      })as Expense[]
      setExpenses(data)
    })
    return () => unsubscirbe()
  }, [])
const handleSubmit = async (e: React.FormEvent) => {
  console.log("submit")
  console.log(amount)
  console.log(memo)
  e. preventDefault()
  if (amount <= 0 || memo.trim() === "") {
    console.log("処理が間違っています")
    return
  }
  await addDoc(collection(db, "expenses"), {
    amount,
    memo,
    createdAt: Timestamp.now(),
  })
  setAmount(0)
  setMemo("")
}

const handleDelete = async (id: string) => {
  console.log("id", id)
  await deleteDoc(doc(db, "expenses",id))
}

const total = expenses.reduce((sum, item) => sum + item.amount, 0)


return (
  <div className='min-h-screen bg-white flex flex-col items-center justify-center p-4'>
    <div className='w-full max-w-sm'>
      <h1 className='text-2xl font-bold mb-4 text-center'>お小遣い手帳</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1'>金額</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className='w-full border p-2 rounded'
            placeholder='例: 1000'
            min={0}
          />
        </div>
        <div>
          <label className='block mb-1'>メモ</label>
          <input
            type='text'
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className='w-full border p-2 rounded'
            placeholder='例: 昼ごはん'
          />
        </div>
        <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded'>
          登録
        </button>
        <div className='mt-6'>
          <h2 className='text-lg font-bold mb-2 text-center'>支出一覧</h2>
          <ul className='space-y-2 max-h-48 overflow-y-auto'>
            {expenses.map((e) => (
              <li key={e.id} className='flex justify-between items-center border p-2 rounded'>
                <span className='truncate'>{e.memo}</span>
                <span>{e.amount.toLocaleString()} 円</span>
                <button onClick={() => handleDelete(e.id)} className='text-red-600 text-sm'>
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='mt-4 text-center'>
          <div>合計金額: <strong>{total.toLocaleString()} 円</strong></div>
        </div>
      </form>
    </div>
  </div>
)
}

export default App