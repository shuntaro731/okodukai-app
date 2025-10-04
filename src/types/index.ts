// Firestoreに保存する支出データの型定義
import { Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp;
}