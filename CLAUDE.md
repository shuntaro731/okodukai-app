# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「okodukai-app（お小遣いアプリ）」は、TypeScript、Vite、Firebase Firestoreで構築されたReact家計簿・支出管理アプリケーションです。ユーザーは支出を記録し、カテゴリ別分析や月次推移を可視化できます。これは学校の課題であり、エラーハンドリング、セキュリティは重視せず、UIの再現、実際に動作すること、コードのわかりやすさを重視します。

### デザインビジョン
提供されたUIデザインに基づき、以下の特徴を持ちます：
- クリーンでモダンなモバイルファーストインターフェース 
- カード型レイアウトによる支出カテゴリ表示
- チャートやプログレスバーによるデータ可視化
- カテゴリアイコン付きの最近の取引履歴
- 月次貯金目標と進捗トラッキング

## Key Commands

- **Development server**: `npm run dev`
- **Build**: `npm run build` (includes TypeScript compilation via `tsc -b`)
- **Linting**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build tool**: Vite with SWC for fast refresh
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Linting**: ESLint v9 with TypeScript support

### Core Structure
- **src/App.tsx**: Main application component containing all expense tracking logic
- **src/firebase.ts**: Firebase configuration and Firestore database initialization
- **src/main.tsx**: React application entry point

### データモデル
現在のExpense型に加えて、拡張予定の型定義：
```typescript
// 基本の支出型
type Expense = {
  id: string;
  amount: number;
  memo: string;
  category: string; // 追加予定
  createdAt: Timestamp;
}

// カテゴリ型
type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  monthlyBudget?: number;
}

// 貯金目標型
type SavingsGoal = {
  id: string;
  targetAmount: number;
  currentAmount: number;
  month: string;
}
```

### Firebase Integration
- Uses Firestore for real-time expense data
- Collection: "expenses"
- Real-time updates via `onSnapshot`
- Ordered by `createdAt` descending

### State Management
The application uses React hooks for state management:
- `useState` for form inputs (amount, memo) and expenses list
- `useEffect` for Firestore subscription setup
- No external state management library

## 開発フェーズ

### 🚀 Phase 1 (MVP)
- ✅ 基本的な取引記録・表示機能 
- 📊 カテゴリ別支出表示
- 📅 月次切り替え機能

### Phase 2 (機能拡張)
- 💰 貯金管理機能
- 📈 詳細な分析・チャート機能

## 📊 データ可視化機能

### チャート実装予定
- **カテゴリ別支出**: 横棒グラフ / ドーナツチャート
- **月次推移**: 線グラフ
- **貯金進捗**: プログレスバー

### ライブラリ候補
- Chart.js / React-Chartjs-2
- Recharts
- D3.js + カスタムコンポーネント

## Development Notes

- モバイルファーストなレスポンシブデザイン
- Firebase config is directly embedded (development/demo setup)
- Uses Tailwind for responsive design with mobile-first approach
- TypeScript strict mode enabled
- ESLint configured for React hooks and TypeScript