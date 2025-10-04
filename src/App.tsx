import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";
import { categories } from "./constants/categories";
import { getCurrentMonth } from "./utils";
import { IconChevronLeft, IconChevronRight, IconPlus } from "@tabler/icons-react";

// Components
import CategorySpendingCard from "./components/CategorySpendingCard";
import RecentTransactions from "./components/RecentTransactions";
import AddExpenseModal from "./components/AddExpenseModal";
import ExpenseDonutChart from "./components/ExpenseDonutChart";

function App() {
  // 選択されている月（YYYY-MM形式）
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  // 支出追加モーダルの開閉状態
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // カスタムフックで支出データを管理
  const {
    addExpense,
    deleteExpense,
    loading,
    currentMonthExpenses,
  } = useExpenses(selectedMonth);

  // 前月に移動
  const handlePreviousMonth = () => {
    const date = new Date(selectedMonth + '-01');
    date.setMonth(date.getMonth() - 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  // 次月に移動
  const handleNextMonth = () => {
    const date = new Date(selectedMonth + '-01');
    date.setMonth(date.getMonth() + 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  // 月を表示用の文字列に変換（例: "2025-01" → "2025年1月"）
  const displayMonth = () => {
    const date = new Date(selectedMonth + '-01');
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white pb-6">
      <div className="w-full max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 pt-6 pb-4">
          <h1 className="text-xl font-bold text-black">お小遣い帳</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          >
            <IconPlus size={24} stroke={2.5} />
          </button>
        </div>

        <div className="px-4">
          {/* 月選択 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={handlePreviousMonth}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IconChevronLeft size={20} stroke={2} />
            </button>
            <div className="text-lg font-semibold text-black min-w-[140px] text-center">
              {displayMonth()}
            </div>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IconChevronRight size={20} stroke={2} />
            </button>
          </div>

          {/* 今月の総支出額 - 円グラフ */}
          <ExpenseDonutChart
            expenses={currentMonthExpenses}
            categories={categories}
          />
        </div>

        <div className="px-4 space-y-4">
          {/* カテゴリ別支出カード */}
          <CategorySpendingCard
            expenses={currentMonthExpenses}
            categories={categories}
          />

          {/* 最近の支出履歴 */}
          <RecentTransactions
            expenses={currentMonthExpenses}
            categories={categories}
            onDeleteExpense={deleteExpense}
          />
        </div>

        {/* 支出追加モーダル */}
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          categories={categories}
          onAddExpense={addExpense}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
