import './App.css'
import { useState, useMemo, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import type { Category } from './types'
import { useExpenses } from './hooks/useExpenses'

const categories: Category[] = [
  { id: 'food', name: '食品', icon: '🍽️', color: 'bg-green-500' },
  { id: 'dining', name: '外食', icon: '🍕', color: 'bg-blue-500' },
  { id: 'transport', name: '公共交通', icon: '🚌', color: 'bg-yellow-500' },
  { id: 'shopping', name: 'ショッピング', icon: '🛍️', color: 'bg-purple-500' },
  { id: 'entertainment', name: 'エンタメ', icon: '🎬', color: 'bg-pink-500' },
  { id: 'other', name: 'その他', icon: '💰', color: 'bg-gray-500' },
]

function App() {
  // Use the custom hook for Firebase operations
  const {
    expenses,
    savings,
    savingsGoals,
    addExpense,
    deleteExpense,
    addSavings,
    deleteSavings,
    saveSavingsGoal,
    error,
    setError,
    clearError,
    loading,
  } = useExpenses()

  // Form state
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>('other')
  const [savingsAmount, setSavingsAmount] = useState<number>(0)
  const [savingsMemo, setSavingsMemo] = useState<string>("")
  
  // UI state
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))
  const [showSavingsGoalModal, setShowSavingsGoalModal] = useState<boolean>(false)
  const [newSavingsTarget, setNewSavingsTarget] = useState<number>(15000)
  
  // Constants
  const monthlyBudget = 120000

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  clearError()
  
  if (amount <= 0) {
    setError("金額は0円より多く入力してください。")
    return
  }
  if (memo.trim() === "") {
    setError("メモを入力してください。")
    return
  }
  
  await addExpense(amount, memo, selectedCategory)
  setAmount(0)
  setMemo("")
  setSelectedCategory('other')
}

const handleDelete = async (id: string) => {
  await deleteExpense(id)
}

const handleSavingsSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  clearError()
  
  if (savingsAmount <= 0) {
    setError("貯金額は0円より多く入力してください。")
    return
  }
  if (savingsMemo.trim() === "") {
    setError("メモを入力してください。")
    return
  }
  
  await addSavings(savingsAmount, savingsMemo)
  setSavingsAmount(0)
  setSavingsMemo("")
}

const handleSavingsDelete = async (id: string) => {
  await deleteSavings(id)
}

// Memoized expensive calculations
const currentMonthExpenses = useMemo(() => {
  return expenses.filter(expense => {
    const expenseMonth = expense.createdAt.toDate().toISOString().slice(0, 7)
    return expenseMonth === selectedMonth
  })
}, [expenses, selectedMonth])

const currentMonthSavings = useMemo(() => {
  return savings.filter(saving => {
    const savingMonth = saving.createdAt.toDate().toISOString().slice(0, 7)
    return savingMonth === selectedMonth
  })
}, [savings, selectedMonth])

const total = useMemo(() => {
  return currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0)
}, [currentMonthExpenses])

const savingsTotal = useMemo(() => {
  return currentMonthSavings.reduce((sum, item) => sum + item.amount, 0)
}, [currentMonthSavings])

// Helper functions for reusability
const getMonthExpenses = useCallback((monthFilter: string) => {
  return expenses.filter(expense => {
    const expenseMonth = expense.createdAt.toDate().toISOString().slice(0, 7)
    return expenseMonth === monthFilter
  })
}, [expenses])

const getMonthSavings = useCallback((monthFilter: string) => {
  return savings.filter(saving => {
    const savingMonth = saving.createdAt.toDate().toISOString().slice(0, 7)
    return savingMonth === monthFilter
  })
}, [savings])

const getCategoryInfo = (categoryId: string = 'other') => {
  return categories.find(cat => cat.id === categoryId) || categories.find(cat => cat.id === 'other')!
}

const getCategoryTotals = useMemo(() => {
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
}, [currentMonthExpenses])

const getMonthName = (monthString: string) => {
  const date = new Date(monthString + '-01')
  return `${date.getMonth() + 1}月`
}

// Get or create savings goal for the selected month
const getCurrentSavingsGoal = useMemo(() => {
  return savingsGoals.find(goal => goal.month === selectedMonth)
}, [savingsGoals, selectedMonth])

// Calculate current month savings (budget - expenses)
const calculateCurrentSavings = useMemo(() => {
  return Math.max(0, monthlyBudget - total)
}, [monthlyBudget, total])

// Calculate previous month comparison
const getPreviousMonthComparison = useMemo(() => {
  const currentDate = new Date(selectedMonth + '-01')
  const previousDate = new Date(currentDate)
  previousDate.setMonth(previousDate.getMonth() - 1)
  const previousMonth = previousDate.toISOString().slice(0, 7)
  
  const previousMonthExpenses = getMonthExpenses(previousMonth)
  const previousTotal = previousMonthExpenses.reduce((sum, item) => sum + item.amount, 0)
  
  const difference = total - previousTotal
  return {
    previousTotal,
    difference,
    percentage: previousTotal > 0 ? Math.round((difference / previousTotal) * 100) : 0
  }
}, [selectedMonth, getMonthExpenses, total])

// Handle savings goal creation/update
const handleSavingsGoalSubmit = async (targetAmount: number) => {
  clearError()
  
  if (targetAmount <= 0) {
    setError("目標金額は0円より多く入力してください。")
    return
  }
  
  const existingGoal = getCurrentSavingsGoal
  const currentSavings = calculateCurrentSavings
  
  await saveSavingsGoal(selectedMonth, targetAmount, currentSavings, existingGoal?.id)
  setShowSavingsGoalModal(false)
}

// Generate chart data for the last 6 months
const getChartData = useMemo(() => {
  const data = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthString = date.toISOString().slice(0, 7)
    const monthExpenses = getMonthExpenses(monthString)
    const monthSavings = getMonthSavings(monthString)
    const expenseTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const savingTotal = monthSavings.reduce((sum, saving) => sum + saving.amount, 0)
    
    data.push({
      month: getMonthName(monthString),
      expenses: expenseTotal,
      savings: savingTotal,
    })
  }
  return data
}, [getMonthExpenses, getMonthSavings])


return (
  <div className='min-h-screen bg-gray-50 p-4'>
    <div className='w-full max-w-md mx-auto'>
      {/* Error message */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative'>
          <span className='block sm:inline'>{error}</span>
          <button
            onClick={clearError}
            className='absolute top-0 bottom-0 right-0 px-4 py-3'
          >
            <span className='text-red-500 text-xl'>×</span>
          </button>
        </div>
      )}
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
          先月比: {getPreviousMonthComparison.difference > 0 ? '+' : ''}{getPreviousMonthComparison.difference.toLocaleString()} 円
        </div>
      </div>

      {/* Chart */}
      <div className='bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200'>
        <h3 className='text-gray-500 text-sm font-semibold mb-3'>支出・貯金推移</h3>
        <div className='flex gap-4 mb-3'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-purple-500 rounded-full'></div>
            <span className='text-xs text-gray-600'>支出</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
            <span className='text-xs text-gray-600'>貯金</span>
          </div>
        </div>
        <div className='h-24'>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
              />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 4, fill: '#8B5CF6' }}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 4, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category spending card */}
      {getCategoryTotals.length > 0 && (
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
            {getCategoryTotals.slice(0, 3).map((categoryData) => {
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

      {/* Savings card */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-gray-500 text-xs font-semibold'>月の貯金額</h2>
          <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
            <span className='text-purple-500 text-lg'>💰</span>
          </div>
        </div>
        
        <div className='text-xl font-bold text-purple-500 mb-1'>
          {calculateCurrentSavings.toLocaleString()}
          <span className='text-sm ml-1'>円</span>
        </div>
        
        {getCurrentSavingsGoal ? (
          <>
            <div className='text-gray-400 text-xs mb-4'>
              目標金額 : {getCurrentSavingsGoal?.targetAmount.toLocaleString()}
            </div>
            
            {/* Progress bar */}
            <div className='bg-gray-100 rounded-full p-1 mb-4'>
              <div className='bg-gradient-to-r from-purple-500 to-purple-400 h-5 rounded-full flex items-center justify-center relative overflow-hidden'>
                <div 
                  className='bg-purple-600 absolute left-0 top-0 h-full transition-all duration-500'
                  style={{ 
                    width: `${Math.min((calculateCurrentSavings / (getCurrentSavingsGoal?.targetAmount || 1)) * 100, 100)}%` 
                  }}
                ></div>
                <span className='text-white text-xs font-medium relative z-10'>
                  {Math.round((calculateCurrentSavings / (getCurrentSavingsGoal?.targetAmount || 1)) * 100)}%
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

      {/* Recent transactions card */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-gray-500 text-sm font-semibold'>最近の支出履歴</h2>
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

      {/* Recent savings card */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-green-600 text-sm font-semibold'>💰 最近の貯金履歴</h2>
          <div className='text-green-600 text-xs font-semibold'>
            合計: +{savingsTotal.toLocaleString()}円
          </div>
        </div>
        
        {currentMonthSavings.length > 0 ? (
          <div className='space-y-3'>
            {currentMonthSavings.slice(0, 3).map((s) => (
              <div key={s.id} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center'>
                    <span className='text-lg'>💰</span>
                  </div>
                  <div>
                    <div className='text-black text-sm font-semibold'>{s.memo}</div>
                    <div className='text-green-500 text-xs'>貯金</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='text-green-600 text-sm font-semibold'>
                    +{s.amount.toLocaleString()}
                    <span className='text-xs'>円</span>
                  </div>
                  <button onClick={() => handleSavingsDelete(s.id)} className='w-5 h-5 text-gray-400 hover:text-red-500'>
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-400 text-sm text-center py-4'>
            まだ貯金の記録がありません
          </div>
        )}
      </div>

      {/* Add new expense form */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6'>
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
      </div>

      {/* Add new savings form */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-200'>
        <h3 className='text-green-600 text-sm font-semibold mb-4'>💰 貯金を追加</h3>
        <form onSubmit={handleSavingsSubmit} className='space-y-4'>
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
                現在の貯金可能額: {calculateCurrentSavings.toLocaleString()}円
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowSavingsGoalModal(false)}
                  className='flex-1 border border-gray-200 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors'
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleSavingsGoalSubmit(newSavingsTarget)}
                  disabled={loading}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-purple-500 hover:bg-purple-600'
                  } text-white`}
                >
                  {loading ? '設定中...' : '設定'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)
}

export default App