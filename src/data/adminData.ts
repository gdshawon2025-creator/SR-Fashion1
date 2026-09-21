import { Order, Coupon, Subscriber } from '../types';

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'SR10',
    discountPercent: 10,
    usageCount: 0,
    isActive: true,
    minOrderAmount: 50
  },
  {
    id: 'c-2',
    code: 'FASHION20',
    discountPercent: 20,
    usageCount: 0,
    isActive: true,
    minOrderAmount: 150
  },
  {
    id: 'c-3',
    code: 'VIP50',
    discountPercent: 50,
    usageCount: 0,
    isActive: false,
    minOrderAmount: 300
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: 'sub-1', email: 'gdyounus2025@gmail.com', subscribedAt: '2026-09-21', status: 'active' },
];
