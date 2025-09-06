import type { Category, Expense, Savings } from './types'; //index.tsで作った型をimport

//支出リストや貯金リストの合計金額を計算
export const calculateTotal = (items: Expense[] | Savings[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

//先月比
export const calculatePreviousMonthComparison = (
  currentTotal: number, 
  previousTotal: number
): { previousTotal: number; difference: number; percentage: number } => ({
  previousTotal,
  difference: currentTotal - previousTotal,
  percentage: previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : 0,
});

//貯金目標プログレッシブバー
export const calculateSavingsProgress = (
  currentAmount: number, 
  targetAmount: number
): { percentage: number; isCompleted: boolean; progressWidth: string } => {
  const ratio = Math.min((currentAmount / targetAmount) * 100, 100);
  return {
    percentage: Math.round(ratio),
    isCompleted: currentAmount >= targetAmount,
    progressWidth: `${ratio}%`,
  };
};

//categoriesの中から指定された categoryIdを探す（メモ化で最適化）
const categoryCache = new Map<string, Category>();
export const getCategoryInfo = (categoryId: string, categories: Category[]): Category => {
  const cacheKey = categoryId;
  if (categoryCache.has(cacheKey)) {
    return categoryCache.get(cacheKey)!;
  }
  
  const category = categories.find((cat) => cat.id === categoryId) || 
                   categories.find((cat) => cat.id === 'other')!;
  categoryCache.set(cacheKey, category);
  return category;
};

export const getCategoryTotals = (
  expenses: Expense[], 
  categories: Category[]
): (Category & { total: number; count: number })[] => {
  // カテゴリ別の集計を一度で実行し、O(n)で処理
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  expenses.forEach(expense => {
    const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
    existing.total += expense.amount;
    existing.count++;
    categoryMap.set(expense.category, existing);
  });
  
  return categories
    .map(category => ({
      ...category,
      ...(categoryMap.get(category.id) || { total: 0, count: 0 })
    }))
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total);
};

//（YYYY-MM)を月名に整形
export const getMonthName = (monthString: string): string => {
  const date = new Date(monthString + '-01');
  return `${date.getMonth() + 1}月`;
};

//指定した月のデータだけを抽出する汎用関数
export const filterByMonth = <T extends { createdAt: { toDate(): Date } }>(items: T[], month: string): T[] =>
  items.filter((item) => item.createdAt.toDate().toISOString().slice(0, 7) === month);

//月別の集計
export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

//先月比の割り出し
export const getPreviousMonth = (monthString: string): string => {
  const currentDate = new Date(monthString + '-01');
  const previousDate = new Date(currentDate);
  previousDate.setMonth(previousDate.getMonth() - 1);
  return previousDate.toISOString().slice(0, 7);
};