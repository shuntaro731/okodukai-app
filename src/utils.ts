import type { Category, Expense, Savings } from './types'; //index.tsで作った型をimport

//支出リストや貯金リストの合計金額を計算
export const calculateTotal = (items: Expense[] | Savings[]) => {
  return items.reduce((sum, item) => sum + item.amount, 0); //初期値は0,itemの値段を合計(sum)する
};

//先月比
export const calculatePreviousMonthComparison = (
  currentTotal: number,
  previousTotal: number
) => {
  const difference = currentTotal - previousTotal;  //今月合計 - 先月合計
  return {
    previousTotal,
    difference, //差分
    percentage: previousTotal > 0 ? Math.round((difference / previousTotal) * 100) : 0,
    //(差分 ÷ 先月) × 100 で先月比何%増減を計算 Match.roundで四捨五入

  }; //先月が 0 の場合0にしている
};

//貯金目標プログレッシブバー
export const calculateSavingsProgress = (currentAmount: number, targetAmount: number) => {
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100); //今の貯金額 ÷ 目標額 × 100 で進捗率（％）を計算、100を最大値に
  return {
    percentage: Math.round(percentage), //四捨五入
    isCompleted: currentAmount >= targetAmount,
  };
};

 //categoriesの中から指定された categoryIdを探す
export const getCategoryInfo = (categoryId: string, categories: Category[]) => {
  return ( //OR演算子なので見つからなければotherID のカテゴリを探して
    categories.find((cat) => cat.id === categoryId) || categories.find((cat) => cat.id === 'other')!
  );
};

export const getCategoryTotals = (expenses: Expense[], categories: Category[]) => {
  const totals = categories
    .map((category) => { //すべてのカテゴリに対して処理を行う  mapでカテゴリごとに配列
      const categoryExpenses = expenses.filter(
        //expense.categoryはコレクション内のid、category.idは 現在処理中のID、category.idと一致するものをfilterで抽出
        (expense) => expense.category === category.id
      );
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount, //カテゴリの支出合計金額を計算
        0 //初期値は0
      );
      return {
        ...category,
        total,
        count: categoryExpenses.length,
      };
    })
    .filter((cat) => cat.total > 0); //filterで支出があるカテゴリだけ残す
  return totals.sort((a, b) => b.total - a.total); //sortで支出が多い順に並べる
};

//（YYYY-MM)を月名に整形
export const getMonthName = (monthString: string) => {
  const date = new Date(monthString + '-01'); //JSのDateオブジェクトとして渡すために2025-08 => 2025-08-01月の1日として日付を作る
  return `${date.getMonth() + 1}月`; //getMonth() は 0始まりの月番号（0=1月, 7=8月）を返す そこで+1して月番号 に変換
};

//指定した月の支出データだけを抽出する関数(チャートに使う)
export const filterExpensesByMonth = (expenses: Expense[], month: string) => {
  return expenses.filter((expense) => {
    //FirestoreのTimestamp 型をtoDate()でDateオブジェクトに変換して、ISO形式文字列(2025-08-30T12:34:56.000Z)の0~7文字目を切り出す
    const expenseMonth = expense.createdAt.toDate().toISOString().slice(0, 7);
    return expenseMonth === month; //比較して指定月の支出だけ出力
  });
};

export const filterSavingsByMonth = (savings: Savings[], month: string) => {
  return savings.filter((saving) => {
    const savingMonth = saving.createdAt.toDate().toISOString().slice(0, 7);
    return savingMonth === month;
  });
};

//月別の集計
export const getCurrentMonth = () => {
  return new Date().toISOString().slice(0, 7);
};

//先月比の割り出し
export const getPreviousMonth = (monthString: string) => {
  const currentDate = new Date(monthString + '-01');
  const previousDate = new Date(currentDate);
  previousDate.setMonth(previousDate.getMonth() - 1); //一つ前の月
  return previousDate.toISOString().slice(0, 7);
};