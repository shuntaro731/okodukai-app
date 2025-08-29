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
  category?: string;
  createdAt: Timestamp;
}

export type SavingsGoal = {
  id: string;
  month: string; // YYYY-MM format
  targetAmount: number;
  currentAmount: number;
  createdAt: Timestamp;
}

export type Savings = {
  id: string;
  amount: number;
  memo: string;
  createdAt: Timestamp;
}