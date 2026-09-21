export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'women' | 'men' | 'accessories' | 'shoes';
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  isSale?: boolean;
  saleTag?: string;
  isNew?: boolean;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CategoryInfo {
  id: 'women' | 'men' | 'accessories' | 'shoes';
  name: string;
  itemCount: string;
  image: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'cart';
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  transactionId?: string;
  senderNumber?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  usageCount: number;
  isActive: boolean;
  minOrderAmount?: number;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export type AdminTab = 'dashboard' | 'products' | 'orders' | 'coupons' | 'customers' | 'settings';
