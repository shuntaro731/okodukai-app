import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Expense, Savings, SavingsGoal } from '../types';
import { 
  filterExpensesByMonth, 
  filterSavingsByMonth, 
  getPreviousMonth, 
  getMonthName,
  calculateTotal,
  calculatePreviousMonthComparison,
  calculateCurrentSavings
} from '../utils';
import { MONTHLY_BUDGET } from '../constants/categories';

export function useExpenses(selectedMonth: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savings, setSavings] = useState<Savings[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Expenses subscription
  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Expense[];
      setExpenses(data);
    });
    return () => unsubscribe();
  }, []);

  // Savings subscription
  useEffect(() => {
    const q = query(collection(db, "savings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Savings[];
      setSavings(data);
    });
    return () => unsubscribe();
  }, []);

  // Savings goals subscription
  useEffect(() => {
    const q = query(collection(db, "savingsGoals"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as SavingsGoal[];
      setSavingsGoals(data);
    });
    return () => unsubscribe();
  }, []);

  // Add expense
  const addExpense = async (amount: number, memo: string, category: string) => {
    try {
      setError("")
      setLoading(true)
      await addDoc(collection(db, "expenses"), {
        amount,
        memo,
        category,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      setError("支出の追加に失敗しました。もう一度お試しください。")
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false)
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      setError("支出の削除に失敗しました。もう一度お試しください。")
      console.error("Error deleting expense:", error);
    } finally {
      setLoading(false)
    }
  };

  // Add savings
  const addSavings = async (amount: number, memo: string) => {
    try {
      setError("")
      setLoading(true)
      await addDoc(collection(db, "savings"), {
        amount,
        memo,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      setError("貯金の追加に失敗しました。もう一度お試しください。")
      console.error("Error adding savings:", error);
    } finally {
      setLoading(false)
    }
  };

  // Delete savings
  const deleteSavings = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      await deleteDoc(doc(db, "savings", id));
    } catch (error) {
      setError("貯金の削除に失敗しました。もう一度お試しください。")
      console.error("Error deleting savings:", error);
    } finally {
      setLoading(false)
    }
  };

  // Handle savings goal creation/update
  const saveSavingsGoal = async (month: string, targetAmount: number, currentAmount: number, existingGoalId?: string) => {
    try {
      setError("")
      setLoading(true)
      if (existingGoalId) {
        // Update existing goal
        await updateDoc(doc(db, "savingsGoals", existingGoalId), {
          targetAmount,
          currentAmount,
        });
      } else {
        // Create new goal
        await addDoc(collection(db, "savingsGoals"), {
          month,
          targetAmount,
          currentAmount,
          createdAt: Timestamp.now(),
        });
      }
    } catch (error) {
      setError("貯金目標の保存に失敗しました。もう一度お試しください。")
      console.error("Error with savings goal:", error);
    } finally {
      setLoading(false)
    }
  };

  // Monthly data calculations (simplified, no useMemo/useCallback)
  const currentMonthExpenses = filterExpensesByMonth(expenses, selectedMonth);
  const currentMonthSavings = filterSavingsByMonth(savings, selectedMonth);
  
  const totalExpenses = calculateTotal(currentMonthExpenses);
  const totalSavings = calculateTotal(currentMonthSavings);
  const currentSavings = calculateCurrentSavings(MONTHLY_BUDGET, totalExpenses);
  
  const previousMonth = getPreviousMonth(selectedMonth);
  const previousMonthExpenses = filterExpensesByMonth(expenses, previousMonth);
  const previousTotal = calculateTotal(previousMonthExpenses);
  const previousMonthComparison = calculatePreviousMonthComparison(totalExpenses, previousTotal);
  
  // Chart data generation
  const getChartData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthString = date.toISOString().slice(0, 7);
      const monthExpenses = filterExpensesByMonth(expenses, monthString);
      const monthSavings = filterSavingsByMonth(savings, monthString);
      const expenseTotal = calculateTotal(monthExpenses);
      const savingTotal = calculateTotal(monthSavings);

      data.push({
        month: getMonthName(monthString),
        expenses: expenseTotal,
        savings: savingTotal,
      });
    }
    return data;
  };

  // Savings goal management
  const currentSavingsGoal = savingsGoals.find((goal) => goal.month === selectedMonth);
  
  const handleSavingsGoalSubmit = async (targetAmount: number) => {
    const existingGoal = currentSavingsGoal;
    
    await saveSavingsGoal(
      selectedMonth,
      targetAmount,
      currentSavings,
      existingGoal?.id
    );
  };

  return {
    expenses,
    savings,
    addExpense,
    deleteExpense,
    addSavings,
    deleteSavings,
    error,
    setError,
    clearError: () => setError(""),
    loading,
    // Monthly data
    currentMonthExpenses,
    currentMonthSavings,
    totalExpenses,
    totalSavings,
    currentSavings,
    previousMonthComparison,
    getChartData,
    // Savings goal data
    currentSavingsGoal,
    handleSavingsGoalSubmit,
  };
}