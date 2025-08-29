# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an "okodukai-app" (allowance/pocket money app) - a React expense tracking application built with TypeScript, Vite, and Firebase Firestore. The app allows users to record expenses with amounts and memos, view them in a list, and see running totals.

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

### Data Model
The app uses a single `Expense` type:
```typescript
type Expense = {
  id: string;
  amount: number;
  memo: string;
  createdAt: Timestamp;
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

## Development Notes

- The app is a single-page application with all logic contained in App.tsx
- Firebase config is directly embedded (development/demo setup)
- Uses Tailwind for responsive design with mobile-first approach
- TypeScript strict mode enabled
- ESLint configured for React hooks and TypeScript