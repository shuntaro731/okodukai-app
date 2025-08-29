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

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
}

type Expense = {
  id: string;
  amount: number;
  memo: string;
  category?: string;
  createdAt: Timestamp,
}

const categories: Category[] = [
  { id: 'food', name: '食品', icon: '🍽️', color: 'bg-green-500' },
  { id: 'dining', name: '外食', icon: '🍕', color: 'bg-blue-500' },
  { id: 'transport', name: '公共交通', icon: '🚌', color: 'bg-yellow-500' },
  { id: 'shopping', name: 'ショッピング', icon: '🛍️', color: 'bg-purple-500' },
  { id: 'entertainment', name: 'エンタメ', icon: '🎬', color: 'bg-pink-500' },
  { id: 'other', name: 'その他', icon: '💰', color: 'bg-gray-500' },
]

function App() {

  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>('other')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))

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
    category: selectedCategory,
    createdAt: Timestamp.now(),
  })
  setAmount(0)
  setMemo("")
  setSelectedCategory('other')
}

const handleDelete = async (id: string) => {
  console.log("id", id)
  await deleteDoc(doc(db, "expenses",id))
}

// Filter expenses by selected month
const getMonthExpenses = (monthFilter: string) => {
  return expenses.filter(expense => {
    const expenseMonth = expense.createdAt.toDate().toISOString().slice(0, 7)
    return expenseMonth === monthFilter
  })
}

const currentMonthExpenses = getMonthExpenses(selectedMonth)
const total = currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0)

const getCategoryInfo = (categoryId: string = 'other') => {
  return categories.find(cat => cat.id === categoryId) || categories.find(cat => cat.id === 'other')!
}

const getCategoryTotals = () => {
  const totals = categories.map(category => {
    const categoryExpenses = currentMonthExpenses.filter(expense => expense.category === category.id)
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return {
      ...category,
      total,
      count: categoryExpenses.length
    }
  }).filter(cat => cat.total > 0)
  
  return totals.sort((a, b) => b.total - a.total)
}

const getMonthName = (monthString: string) => {
  const date = new Date(monthString + '-01')
  return `${date.getMonth() + 1}月`
}


return (
  <div className='min-h-screen bg-gray-50 p-4'>
    <div className='w-full max-w-md mx-auto'>
      {/* Header section with month selector and total */}
      <div className='text-center mb-6'>
        <div className='flex items-center justify-center gap-2 mb-4'>
          <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
          <div className='w-16 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
            <div className='w-6 h-6 bg-white rounded-full'></div>
          </div>
        </div>

        {/* Month selector */}
        <div className='flex items-center justify-center gap-2 mb-4'>
          {[-2, -1, 0, 1, 2].map((offset) => {
            const date = new Date()
            date.setMonth(date.getMonth() + offset)
            const monthString = date.toISOString().slice(0, 7)
            const isSelected = monthString === selectedMonth
            
            return (
              <button
                key={monthString}
                onClick={() => setSelectedMonth(monthString)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                  isSelected 
                    ? 'bg-purple-500 text-white' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                {getMonthName(monthString)}
              </button>
            )
          })}
        </div>
        
        <div className='text-4xl font-bold text-black mb-1'>
          {total.toLocaleString()}
          <span className='text-2xl ml-1'>円</span>
        </div>
        <div className='text-gray-500 text-sm'>
          {getMonthName(selectedMonth)}の支出
        </div>
      </div>

      {/* Chart placeholder */}
      <div className='bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200'>
        <div className='h-24 bg-gradient-to-r from-purple-100 to-transparent rounded'></div>
      </div>

      {/* Category spending card */}
      {getCategoryTotals().length > 0 && (
        <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-gray-500 text-sm font-semibold'>カテゴリごとの支出</h2>
            <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
              <span className='text-purple-500 text-lg'>📊</span>
            </div>
          </div>
          
          <div className='text-2xl font-bold text-black mb-2'>
            {total.toLocaleString()}
            <span className='text-sm ml-1'>円</span>
          </div>
          <div className='text-gray-400 text-sm mb-4'>/120,000</div>
          
          <div className='space-y-3'>
            {getCategoryTotals().slice(0, 3).map((categoryData) => {
              const percentage = Math.min((categoryData.total / total) * 100, 100)
              return (
                <div key={categoryData.id} className='flex items-center gap-3'>
                  <div className={`w-4 h-4 ${categoryData.color} rounded`}></div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-black text-sm font-semibold'>{categoryData.name}</div>
                    <div className='w-full bg-gray-200 rounded-full h-1 mt-1'>
                      <div 
                        className={`${categoryData.color} h-1 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className='text-black text-sm font-semibold'>
                    {categoryData.total.toLocaleString()}
                    <span className='text-xs'>円</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent transactions card */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-gray-500 text-sm font-semibold'>最近の履歴</h2>
          <button className='text-gray-400 text-xs font-semibold'>すべて見る</button>
        </div>
        
        <div className='space-y-3'>
          {currentMonthExpenses.slice(0, 3).map((e) => {
            const categoryInfo = getCategoryInfo(e.category)
            return (
              <div key={e.id} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className={`w-9 h-9 ${categoryInfo.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                    <span className='text-lg'>{categoryInfo.icon}</span>
                  </div>
                  <div>
                    <div className='text-black text-sm font-semibold'>{e.memo}</div>
                    <div className='text-gray-400 text-xs'>{categoryInfo.name}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='text-black text-sm font-semibold'>
                    -{e.amount.toLocaleString()}
                    <span className='text-xs'>円</span>
                  </div>
                  <button onClick={() => handleDelete(e.id)} className='w-5 h-5 text-gray-400 hover:text-red-500'>
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add new expense form */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200'>
        <h3 className='text-black text-sm font-semibold mb-4'>新しい支出を追加</h3>
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
            className='w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors'
          >
            追加
          </button>
        </form>
      </div>
    </div>
  </div>
)
}

export default App