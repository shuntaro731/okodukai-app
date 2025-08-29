import type { Category } from '../types';

export const categories: Category[] = [
  { id: 'food', name: '食品', icon: '🍽️', color: 'bg-green-500' },
  { id: 'dining', name: '外食', icon: '🍕', color: 'bg-blue-500' },
  { id: 'transport', name: '公共交通', icon: '🚌', color: 'bg-yellow-500' },
  { id: 'shopping', name: 'ショッピング', icon: '🛍️', color: 'bg-purple-500' },
  { id: 'entertainment', name: 'エンタメ', icon: '🎬', color: 'bg-pink-500' },
  { id: 'other', name: 'その他', icon: '💰', color: 'bg-gray-500' },
];