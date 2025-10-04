// 支出データを管理するカスタムフック
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
} from "firebase/firestore";
import { db } from "../firebase";
import type { Expense } from '../types';
import { filterByMonth, calculateTotal } from '../utils';

type UseExpensesReturn = {
  expenses: Expense[];
  addExpense: (amount: number, memo: string, category: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  loading: boolean;
  currentMonthExpenses: Expense[];
  totalExpenses: number;
};

export function useExpenses(selectedMonth: string): UseExpensesReturn {
  // 全ての支出データを保持（Firestoreから取得）
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // データ操作中かどうかを示すフラグ
  const [loading, setLoading] = useState(false);

  // Firestoreから支出データをリアルタイムで取得
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

  // 支出を追加
  const addExpense = async (amount: number, memo: string, category: string) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "expenses"), {
        amount,
        memo,
        category,
        createdAt: Timestamp.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // 支出を削除
  const deleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "expenses", id));
    } finally {
      setLoading(false);
    }
  };

  // 選択された月の支出だけを抽出
  const currentMonthExpenses = filterByMonth(expenses, selectedMonth);

  // 今月の総支出額を計算
  const totalExpenses = calculateTotal(currentMonthExpenses);

  return {
    expenses,
    addExpense,
    deleteExpense,
    loading,
    currentMonthExpenses,
    totalExpenses,
  };
}