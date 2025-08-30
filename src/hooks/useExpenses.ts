//カスタムフック => 様々な状態管理などをReact のフックを使って再利用可能に
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
} from "firebase/firestore"; //Firestoreデータベースを操作するための関数群(多分気にしなくてもいい？)
import { db } from "../firebase";  //firestoreeにアクセス

import type { Expense, Savings, SavingsGoal } from '../types'; //typesから型をインポート
import {
  filterExpensesByMonth,
  filterSavingsByMonth,
  getPreviousMonth,
  getMonthName,
  calculateTotal,
  calculatePreviousMonthComparison
} from '../utils';  //utitlsからデータ処理に関する関数をインポート

export function useExpenses(selectedMonth: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]); //Firestoreのexpensesコレクションから取得した全ての支出データを保持する変数です。初期値は空の配列。
  const [savings, setSavings] = useState<Savings[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(false); //追加、削除、更新などのデータ操作が進行中であるかを示す(ローディング)真偽値の状態変数です。初期値は false


  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc")); //expensesからデータが登録されると「createdAt」が新しい順に並べる
    const unsubscribe = onSnapshot(q, (snapshot) => {  //データベースの変化をリアルタイムで取得
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id, //ドキュメントid
        ...docSnap.data() //その他でータ
      })) as Expense[]; //index.tsで定義したデータに整える
      setExpenses(data); //setExpensesに保持
    });
    return () => unsubscribe(); // アプリが終わるときは処理をやめる
  }, []); //空の配列なので初回レンダー時にも一度だけこの処理を始める


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


  // 支出を追加する
  const addExpense = async (amount: number, memo: string, category: string) => {
    setLoading(true) //ローディングが始まる
    await addDoc(collection(db, "expenses"), { //expensesにデータを追加
      amount,
      memo,
      category,
      createdAt: Timestamp.now(),
    });
    setLoading(false) //ローディングを終わらせる
  };

  //支出を削除する
  const deleteExpense = async (id: string) => {
    setLoading(true)
    await deleteDoc(doc(db, "expenses", id)); //db内の指定されたIDの支出データを削除
    setLoading(false)
  };

  //支出を追加すると同じ処理
  const addSavings = async (amount: number, memo: string) => {
    setLoading(true)
    await addDoc(collection(db, "savings"), {
      amount,
      memo,
      createdAt: Timestamp.now(),
    });
    setLoading(false)
  };

  //支出を削除すると同じ処理
  const deleteSavings = async (id: string) => {
    setLoading(true)
    await deleteDoc(doc(db, "savings", id));
    setLoading(false)
  };

  // 貯金目標を作成・更新する //existingGoalId?: 既存のドキュメントのID。。
  const savingGoal = async (month: string, targetAmount: number, currentAmount: number, existingGoalId?: string) => {
    setLoading(true)
    if (existingGoalId) { //existingGoalIdもしあるなら
      await updateDoc(doc(db, "savingsGoals", existingGoalId), { //目標額をアップデート
        targetAmount,
        currentAmount,
      });
    } else { //もしないなら
      await addDoc(collection(db, "savingsGoals"), { //新規作成
        month,
        targetAmount,
        currentAmount,
        createdAt: Timestamp.now(),
      });
    }
    setLoading(false)
  };

  //utilsの関数を使ってフィルタリングおよびデータ処理
  const currentMonthExpenses = filterExpensesByMonth(expenses, selectedMonth); //今月（selectedMonth）の支出だけを絞り込む
  const currentMonthSavings = filterSavingsByMonth(savings, selectedMonth); //今月（selectedMonth）の支出だけを絞り込む

  const totalExpenses = calculateTotal(currentMonthExpenses); //今月の総支出額を計算
  const totalSavings = calculateTotal(currentMonthSavings);  // 今月の総貯金額を計算
  const currentSavings = totalSavings; 

  const previousMonth = getPreviousMonth(selectedMonth); // 先月が何月かを計算
  const previousMonthExpenses = filterExpensesByMonth(expenses, previousMonth); // 先月の支出だけを絞り込む
  const previousTotal = calculateTotal(previousMonthExpenses);  // 先月の総支出額を計算
  const previousMonthComparison = calculatePreviousMonthComparison(totalExpenses, previousTotal); // 今月の支出と先月の支出を比較する

  //チャート
  const getChartData = () => {
    const data = []; //最終的にpush
    for (let i = 5; i >= 0; i--) { //new Date()(現在の日時)を基準にiヶ月前のデータ作る。2025年8月 i=5 → 2025年3月 i=4 → 2025年4月
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      // 各月の支出・貯金を絞り込み、合計を計算
      const monthString = date.toISOString().slice(0, 7);
      const monthExpenses = filterExpensesByMonth(expenses, monthString);
      const monthSavings = filterSavingsByMonth(savings, monthString);
      const expenseTotal = calculateTotal(monthExpenses);
      const savingTotal = calculateTotal(monthSavings);

      data.push({
        month: getMonthName(monthString), //getMonthNameで月表示に整形してdateにpush
        expenses: expenseTotal, //その月の支出合計
        savings: savingTotal, //その月の貯金合計
      });
    }
    return data;
  };

  // 今月（selectedMonth）の貯金目標を見つける
  const currentSavingsGoal = savingsGoals.find((goal) => goal.month === selectedMonth);

  const handleSavingsGoalSubmit = async (targetAmount: number) => { //ユーザーが貯金目標の金額を入力した時
    const existingGoal = currentSavingsGoal;
    await savingGoal( //以前の関数を使う
      selectedMonth,
      targetAmount,
      0,
      existingGoal?.id // 既存目標があればそのIDを渡す
    );
  };

  return { //カスタムフックをApp.tsxなどに渡す
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
    totalSavings,
    currentSavings,
    previousMonthComparison,
    getChartData,
    // Savings goal data
    currentSavingsGoal,
    handleSavingsGoalSubmit,
  };
}