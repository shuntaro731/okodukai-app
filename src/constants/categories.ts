//定数管理
import type { Category } from '../types';
import { IconToolsKitchen2, IconPizza, IconBus, IconShoppingBag, IconDeviceTv, IconWallet } from '@tabler/icons-react';

export const categories: Category[] = [
  { id: 'food', name: '食品', icon: 'IconToolsKitchen2', color: 'bg-green-500' },
  { id: 'dining', name: '外食', icon: 'IconPizza', color: 'bg-blue-500' },
  { id: 'transport', name: '公共交通', icon: 'IconBus', color: 'bg-yellow-500' },
  { id: 'shopping', name: 'ショッピング', icon: 'IconShoppingBag', color: 'bg-purple-500' },
  { id: 'entertainment', name: 'エンタメ', icon: 'IconDeviceTv', color: 'bg-pink-500' },
  { id: 'other', name: 'その他', icon: 'IconWallet', color: 'bg-gray-500' },
];

export const categoryIcons = {
  IconToolsKitchen2,
  IconPizza,
  IconBus,
  IconShoppingBag,
  IconDeviceTv,
  IconWallet,
};