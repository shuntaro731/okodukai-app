import type { Category, Expense, Savings } from './types';

// === Validation Utils ===
export const validateAmount = (amount: number): string | null => {
  if (amount <= 0) {
    return "金額は0円より多く入力してください。";
  }
  return null;
};

export const validateMemo = (memo: string): string | null => {
  if (memo.trim() === "") {
    return "メモを入力してください。";
  }
  return null;
};

export const validateExpenseForm = (amount: number, memo: string) => {
  const amountError = validateAmount(amount);
  const memoError = validateMemo(memo);
  
  return {
    isValid: !amountError && !memoError,
    errors: {
      amount: amountError,
      memo: memoError,
    },
  };
};

export const validateSavingsForm = (amount: number, memo: string) => {
  return validateExpenseForm(amount, memo);
};

export const validateSavingsGoal = (targetAmount: number): string | null => {
  if (targetAmount <= 0) {
    return "目標金額は0円より多く入力してください。";
  }
  return null;
};

// === Calculation Utils ===
export const calculateTotal = (items: Expense[] | Savings[]) => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateCurrentSavings = (monthlyBudget: number, totalExpenses: number) => {
  return Math.max(0, monthlyBudget - totalExpenses);
};

export const calculatePreviousMonthComparison = (
  currentTotal: number,
  previousTotal: number
) => {
  const difference = currentTotal - previousTotal;
  return {
    previousTotal,
    difference,
    percentage: previousTotal > 0 ? Math.round((difference / previousTotal) * 100) : 0,
  };
};

export const calculateSavingsProgress = (currentAmount: number, targetAmount: number) => {
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);
  return {
    percentage: Math.round(percentage),
    isCompleted: currentAmount >= targetAmount,
  };
};

// === Category Utils ===
export const getCategoryInfo = (categoryId: string, categories: Category[]) => {
  return (
    categories.find((cat) => cat.id === categoryId) ||
    categories.find((cat) => cat.id === 'other')!
  );
};

export const getCategoryTotals = (expenses: Expense[], categories: Category[]) => {
  const totals = categories
    .map((category) => {
      const categoryExpenses = expenses.filter(
        (expense) => expense.category === category.id
      );
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      return {
        ...category,
        total,
        count: categoryExpenses.length,
      };
    })
    .filter((cat) => cat.total > 0);

  return totals.sort((a, b) => b.total - a.total);
};

// === Date Utils ===
export const getMonthName = (monthString: string) => {
  const date = new Date(monthString + '-01');
  return `${date.getMonth() + 1}月`;
};

export const filterExpensesByMonth = (expenses: Expense[], month: string) => {
  return expenses.filter((expense) => {
    const expenseMonth = expense.createdAt.toDate().toISOString().slice(0, 7);
    return expenseMonth === month;
  });
};

export const filterSavingsByMonth = (savings: Savings[], month: string) => {
  return savings.filter((saving) => {
    const savingMonth = saving.createdAt.toDate().toISOString().slice(0, 7);
    return savingMonth === month;
  });
};

export const getCurrentMonth = () => {
  return new Date().toISOString().slice(0, 7);
};

export const getPreviousMonth = (monthString: string) => {
  const currentDate = new Date(monthString + '-01');
  const previousDate = new Date(currentDate);
  previousDate.setMonth(previousDate.getMonth() - 1);
  return previousDate.toISOString().slice(0, 7);
};