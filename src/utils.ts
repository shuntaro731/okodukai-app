import type { Category, Expense } from './types';

// 支出リストの合計金額を計算
export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// 指定した月の支出データだけを抽出
export const filterByMonth = (expenses: Expense[], month: string): Expense[] => {
  return expenses.filter((expense) => {
    const expenseMonth = expense.createdAt.toDate().toISOString().slice(0, 7);
    return expenseMonth === month;
  });
};

// 現在の月を取得（YYYY-MM形式）
export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

// カテゴリ情報を取得（見つからない場合は「その他」を返す）
export const getCategoryInfo = (categoryId: string, categories: Category[]): Category => {
  return categories.find((cat) => cat.id === categoryId) ||
         categories.find((cat) => cat.id === 'other')!;
};

// カテゴリ別の支出集計
export const getCategoryTotals = (
  expenses: Expense[],
  categories: Category[]
): (Category & { total: number; count: number })[] => {
  // カテゴリごとに合計と件数を集計
  const categoryMap = new Map<string, { total: number; count: number }>();

  expenses.forEach(expense => {
    const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
    existing.total += expense.amount;
    existing.count++;
    categoryMap.set(expense.category, existing);
  });

  // カテゴリ情報と集計結果を結合して、金額が多い順に並べる
  return categories
    .map(category => ({
      ...category,
      ...(categoryMap.get(category.id) || { total: 0, count: 0 })
    }))
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total);
};