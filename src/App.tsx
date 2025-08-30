import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses"; //カスタムフック
import { categories } from "./constants/categories"; //カテゴリー定義
import { getCurrentMonth } from "./utils"; //今月の文字列（例: "2023-05"）を取得

// Components
import ErrorMessage from "./components/ErrorMessage"; //エラーメッセージ
import MonthSelector from "./components/MonthSelector"; //月選択セレクター
import ExpenseChart from "./components/ExpenseChart";
import CategorySpendingCard from "./components/CategorySpendingCard"; // カテゴリ別支出表示部品
import SavingsCard from "./components/SavingsCard";
import RecentTransactions from "./components/RecentTransactions"; // 貯金目標表示部品
import RecentSavings from "./components/RecentSavings";
import AddButton from "./components/add/AddButton";
import AddModal from "./components/add/AddModal";

function App() {
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth()); //
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Unified data operations via custom hook
  const {
    expenses,
    savings,
    addExpense,
    deleteExpense,
    addSavings,
    deleteSavings,
    error,
    setError,
    clearError,
    loading,
    // Monthly data
    currentMonthExpenses,
    currentMonthSavings,
    totalExpenses,
    totalSavings,
    currentSavings,
    previousMonthComparison,
    // Savings goal data
    currentSavingsGoal,
    handleSavingsGoalSubmit,
  } = useExpenses(selectedMonth);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Error message */}
        <ErrorMessage message={error} onClose={clearError} />

        {/* Header section with month selector and total */}
        <div className="text-center mb-6">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />

          <div className="text-4xl font-bold text-black mb-1">
            {totalExpenses.toLocaleString()}
            <span className="text-2xl ml-1">円</span>
          </div>
          <div className="text-gray-500 text-sm">
            先月比: {previousMonthComparison.difference > 0 ? "+" : ""}
            {previousMonthComparison.difference.toLocaleString()} 円
          </div>
        </div>

        {/* Chart */}
        <ExpenseChart expenses={expenses} savings={savings} />

        {/* Category spending card */}
        <CategorySpendingCard 
          expenses={currentMonthExpenses}
          categories={categories}
        />

        {/* Savings card */}
        <SavingsCard
          selectedMonth={selectedMonth}
          currentSavingsGoal={currentSavingsGoal}
          currentSavings={currentSavings}
          onSavingsGoalSubmit={handleSavingsGoalSubmit}
          loading={loading}
          onError={setError}
        />

        {/* Recent transactions card */}
        <RecentTransactions
          expenses={currentMonthExpenses}
          categories={categories}
          onDeleteExpense={deleteExpense}
        />

        {/* Recent savings card */}
        <RecentSavings
          savings={currentMonthSavings}
          savingsTotal={totalSavings}
          onDeleteSavings={deleteSavings}
        />

        {/* Fixed add button */}
        <AddButton onClick={() => setIsAddModalOpen(true)} />

        {/* Add modal */}
        <AddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          categories={categories}
          onAddExpense={addExpense}
          onAddSavings={addSavings}
          loading={loading}
          onError={setError}
        />
      </div>
    </div>
  );
}

export default App;