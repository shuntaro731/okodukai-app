import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses"; //カスタムフック
import { categories } from "./constants/categories"; //カテゴリー定義
import { getCurrentMonth } from "./utils"; //現在の月を取得

// Components
import MonthSelector from "./components/MonthSelector";
import ExpenseChart from "./components/ExpenseChart";
import CategorySpendingCard from "./components/CategorySpendingCard";
import SavingsCard from "./components/SavingsCard";
import RecentTransactions from "./components/RecentTransactions"; // 貯金目標表示部品
import RecentSavings from "./components/RecentSavings"; //貯金履歴
import AddButton from "./components/add/AddButton";
import AddModal from "./components/add/AddModal";

function App() {
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth()); //現在選択されている月を再レンダリングして取得
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false); //支出追加ボタンのモーダルの開閉状態を取得(booleanなのでtrueかfalse)

  const {
    addExpense,
    deleteExpense,
    addSavings,
    deleteSavings,
    loading,
    //月毎のデータ
    currentMonthExpenses,
    currentMonthSavings,
    totalExpenses,
    currentSavings,
    previousMonthComparison,
    getChartData,
    //目標値データ
    currentSavingsGoal,
    handleSavingsGoalSubmit,
  } = useExpenses(selectedMonth); //useExpensesフックに selectedMonth を渡すことで、選択選択している月に紐づいてデータを取得

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-14">
          {/* App.tsxで必要なデータをプロップスで子コンポーネント送る */}
          <MonthSelector
            selectedMonth={selectedMonth} //選択している月
            onMonthChange={setSelectedMonth} //月の選択が変わるとonMonthChangeプロップスを通じてsetSelectedMonth関数を呼び出し更新
          />

          <div className="text-4xl font-bold text-black mb-1">
            {/* 選択月の合計支出額を表示 */}
            {totalExpenses.toLocaleString()}
            <span className="text-2xl ml-1">円</span>
          </div>

          <div className="text-gray-500 text-sm">
            {/*differenceで差分の数値を割り出し正なのか負なのかを判別して正の時は+負の時は-を返す*/}
            先月比: {previousMonthComparison.difference > 0 ? "+" : "-"}
            {/* toLocaleStringによって桁区切りを入れた文字列に変換 */}
            {previousMonthComparison.difference.toLocaleString()} 円
          </div>
        </div>

        {/* useExpenses から取得したチャートデータを渡してグラフ表示*/}
        <ExpenseChart chartData={getChartData()} />

        {/*選択月の支出データとカテゴリ定義を渡して、カテゴリごとの支出額を表示*/}
        <CategorySpendingCard
          expenses={currentMonthExpenses} //
          categories={categories}
        />

        {/*貯金目標*/}
        <SavingsCard
          selectedMonth={selectedMonth}
          currentSavingsGoal={currentSavingsGoal} //現在の貯金目標額
          currentSavings={currentSavings} //月毎の貯金総額
          onSavingsGoalSubmit={handleSavingsGoalSubmit} //貯金目標を更新した際に呼び出す関数
          loading={loading}
        />

        {/*選択月の支出データとカテゴリ定義を渡して、カテゴリごとの支出額を表示*/}
        <RecentTransactions
          expenses={currentMonthExpenses}
          categories={categories}
          onDeleteExpense={deleteExpense}
        />

        {/* Recent savings card */}
        <RecentSavings
          savings={currentMonthSavings}
          savingsTotal={currentSavings}
          onDeleteSavings={deleteSavings}
        />

        {/* onClickが実行されるとsetIsAddModalOpen(true) によってモーダルを開く状態に */}
        <AddButton onClick={() => setIsAddModalOpen(true)} />

        {/* Add modal */}
        <AddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)} // モーダル内の閉じるボタンや背景クリック時に実行、isAddModalOpenをfalse に設定してモーダルを閉じる
          categories={categories} //支出カテゴリの選択肢として categoriesデータを渡す
          onAddExpense={addExpense} //支出データが入力・送信された際に、支出を追加
          onAddSavings={addSavings} //貯金データが入力・送信された際に、貯金を追加
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
