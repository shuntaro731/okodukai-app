//カスタムフック => 様々な状態管理などをReact のフックを使って再利用可能に
import { useState, useEffect, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
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
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type {
  DocumentData,
} from "firebase/firestore"; //Firestoreデータベースを操作するための関数群(多分気にしなくてもいい？)
import { db } from "../firebase";  //firestoreeにアクセス

import type { Expense, Savings, SavingsGoal } from '../types'; //typesから型をインポート
import {
  filterByMonth,
  getPreviousMonth,
  getMonthName,
  calculateTotal,
  calculatePreviousMonthComparison
} from '../utils';  //utitlsからデータ処理に関する関数をインポート

// 汎用的なFirestoreコレクション監視フック
function useFirestoreCollection<T>(
  collectionName: string,
  setState: Dispatch<SetStateAction<T[]>>
): void {
  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as T[];
      setState(data);
    });
    return () => unsubscribe();
  }, [collectionName, setState]);
}

// 汎用的なドキュメント追加関数
async function addDocument(
  collectionName: string,
  data: Record<string, string | number>,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  try {
    setLoading(true);
    await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
    });
  } finally {
    setLoading(false);
  }
}

// 汎用的なドキュメント削除関数
async function deleteDocument(
  collectionName: string,
  id: string,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  try {
    setLoading(true);
    await deleteDoc(doc(db, collectionName, id));
  } finally {
    setLoading(false);
  }
}

type UseExpensesReturn = {
  expenses: Expense[];
  savings: Savings[];
  addExpense: (amount: number, memo: string, category: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addSavings: (amount: number, memo: string) => Promise<void>;
  deleteSavings: (id: string) => Promise<void>;
  loading: boolean;
  currentMonthExpenses: Expense[];
  currentMonthSavings: Savings[];
  totalExpenses: number;
  currentSavings: number;
  previousMonthComparison: { previousTotal: number; difference: number; percentage: number };
  chartData: { month: string; expenses: number; savings: number }[];
  currentSavingsGoal?: SavingsGoal;
  handleSavingsGoalSubmit: (targetAmount: number) => Promise<void>;
};

export function useExpenses(selectedMonth: string): UseExpensesReturn {
  const [expenses, setExpenses] = useState<Expense[]>([]); //Firestoreのexpensesコレクションから取得した全ての支出データを保持する変数です。初期値は空の配列。
  const [savings, setSavings] = useState<Savings[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(false); //追加、削除、更新などのデータ操作が進行中であるかを示す(ローディング)真偽値の状態変数です。初期値は false

  // 汎用関数を使用してコレクションを監視
  useFirestoreCollection<Expense>("expenses", setExpenses);
  useFirestoreCollection<Savings>("savings", setSavings);
  useFirestoreCollection<SavingsGoal>("savingsGoals", setSavingsGoals);


  // 支出を追加する
  const addExpense = async (amount: number, memo: string, category: string) => {
    await addDocument("expenses", { amount, memo, category }, setLoading);
  };

  //支出を削除する
  const deleteExpense = async (id: string) => {
    await deleteDocument("expenses", id, setLoading);
  };

  //支出を追加すると同じ処理
  const addSavings = async (amount: number, memo: string) => {
    await addDocument("savings", { amount, memo }, setLoading);
  };

  //支出を削除すると同じ処理
  const deleteSavings = async (id: string) => {
    await deleteDocument("savings", id, setLoading);
  };


  //utilsの関数を使ってフィルタリングおよびデータ処理
  const currentMonthExpenses = filterByMonth(expenses, selectedMonth); //今月（selectedMonth）の支出だけを絞り込む
  const currentMonthSavings = filterByMonth(savings, selectedMonth); //今月（selectedMonth）の貯金だけを絞り込む

  const totalExpenses = calculateTotal(currentMonthExpenses); //今月の総支出額を計算
  const currentSavings = calculateTotal(currentMonthSavings); // 今月の総貯金額を計算 

  const previousMonth = getPreviousMonth(selectedMonth); // 先月が何月かを計算
  const previousMonthExpenses = filterByMonth(expenses, previousMonth); // 先月の支出だけを絞り込む
  const previousTotal = calculateTotal(previousMonthExpenses);  // 先月の総支出額を計算
  const previousMonthComparison = calculatePreviousMonthComparison(totalExpenses, previousTotal); // 今月の支出と先月の支出を比較する

  // チャートデータをメモ化して最適化
  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i));
      const monthString = date.toISOString().slice(0, 7);
      
      return {
        month: getMonthName(monthString),
        expenses: calculateTotal(filterByMonth(expenses, monthString)),
        savings: calculateTotal(filterByMonth(savings, monthString)),
      };
    });
  }, [expenses, savings]);

  // 今月（selectedMonth）の貯金目標を見つける
  const currentSavingsGoal = savingsGoals.find((goal) => goal.month === selectedMonth);

  const handleSavingsGoalSubmit = async (targetAmount: number) => { //ユーザーが貯金目標の金額を入力した時
    const existingGoal = currentSavingsGoal;
    try {
      setLoading(true);
      if (existingGoal?.id) { //existingGoalIdもしあるなら
        await updateDoc(doc(db, "savingsGoals", existingGoal.id), { //目標額をアップデート
          targetAmount,
          currentAmount: 0,
        });
      } else { //もしないなら
        await addDoc(collection(db, "savingsGoals"), { //新規作成
          month: selectedMonth,
          targetAmount,
          currentAmount: 0,
          createdAt: Timestamp.now(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    savings,
    addExpense,
    deleteExpense,
    addSavings,
    deleteSavings,
    loading,
    // Monthly data
    currentMonthExpenses,
    currentMonthSavings,
    totalExpenses,
    currentSavings,
    previousMonthComparison,
    chartData,
    // Savings goal data
    currentSavingsGoal,
    handleSavingsGoalSubmit,
  };
}