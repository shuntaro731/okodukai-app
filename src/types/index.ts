//Firestoreに書き込むデータの構造
import { Timestamp } from "firebase/firestore"; //JSのDate オブジェクトではなく、独自の Timestamp オブジェクトとして保存・取得するらしい。何がいいのかはわからない

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type Expense = {
  id: string;
  amount: number;
  memo: string;
  category: string;
  createdAt: Timestamp; //Firestoreの Timestamp 型
}

export type SavingsGoal = {
  id: string;
  month: string; // YYYY-MM format
  targetAmount: number; //目標とする貯金額
  currentAmount: number; //現在までに貯金できた金額
  createdAt: Timestamp;
}

export type Savings = {
  id: string;
  amount: number;
  memo: string;
  createdAt: Timestamp;
}