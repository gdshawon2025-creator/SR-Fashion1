import { Product, Order, Coupon, Subscriber } from '../types';
import { PRODUCTS } from '../data/fashionData';
import { INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_SUBSCRIBERS } from '../data/adminData';

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  announcementText: string;
  storeAddress: string;
  whatsappNumber: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'SR Fashion',
  tagline: 'Haute Couture & Modern Luxury Apparel',
  supportEmail: 'gdyounus2025@gmail.com',
  supportPhone: '01352113432',
  currency: '$',
  standardShippingFee: 15,
  freeShippingThreshold: 150,
  announcementText: 'SEASON SALE 2026: Use code SR20 for 20% off all designer styles. Free delivery over $150.',
  storeAddress: 'Keshobpur, Jessore, Bangladesh',
  whatsappNumber: '01352113432',
};

export const DEFAULT_ADMIN_PASSWORD = '123456';

// Storage Keys
const STORAGE_KEYS = {
  PRODUCTS: 'sr_fashion_products_v3',
  ORDERS: 'sr_fashion_orders_v3',
  COUPONS: 'sr_fashion_coupons_v3',
  SUBSCRIBERS: 'sr_fashion_subscribers_v3',
  SETTINGS: 'sr_fashion_settings_v3',
  ADMIN_PASSWORD: 'sr_fashion_admin_password_v3',
  ADMIN_LOGGED_IN: 'sr_fashion_admin_logged_in_v3',
};

// Safe LocalStorage helpers
export const loadStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
};

export const saveStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Also notify other tabs/windows
    broadcastStorageUpdate(key, value);
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
};

// Cross-tab / Cross-window broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('sr_fashion_sync_channel');
  }
} catch {
  broadcastChannel = null;
}

export const broadcastStorageUpdate = (key: string, data: any) => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ key, data, timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
};

export const subscribeToSync = (callback: (key: string, data: any) => void) => {
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.key) {
      callback(event.data.key, event.data.data);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        callback(event.key, parsed);
      } catch {
        // ignore
      }
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
};

// Initial state loaders
export const getInitialProducts = (): Product[] => {
  return loadStorage<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
};

export const saveProductsStorage = (products: Product[]) => {
  saveStorage(STORAGE_KEYS.PRODUCTS, products);
};

export const getInitialOrders = (): Order[] => {
  return loadStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
};

export const saveOrdersStorage = (orders: Order[]) => {
  saveStorage(STORAGE_KEYS.ORDERS, orders);
};

export const getInitialCoupons = (): Coupon[] => {
  return loadStorage<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
};

export const saveCouponsStorage = (coupons: Coupon[]) => {
  saveStorage(STORAGE_KEYS.COUPONS, coupons);
};

export const getInitialSubscribers = (): Subscriber[] => {
  return loadStorage<Subscriber[]>(STORAGE_KEYS.SUBSCRIBERS, INITIAL_SUBSCRIBERS);
};

export const saveSubscribersStorage = (subs: Subscriber[]) => {
  saveStorage(STORAGE_KEYS.SUBSCRIBERS, subs);
};

export const getInitialSettings = (): StoreSettings => {
  return loadStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
};

export const saveSettingsStorage = (settings: StoreSettings) => {
  saveStorage(STORAGE_KEYS.SETTINGS, settings);
};

export const getAdminPassword = (): string => {
  const pwd = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
  return pwd ? pwd : DEFAULT_ADMIN_PASSWORD;
};

export const saveAdminPassword = (newPassword: string) => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
  broadcastStorageUpdate(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
};

export const getAdminAuthStatus = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuthStatus = (isAuth: boolean) => {
  try {
    if (isAuth) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    }
  } catch {
    // ignore
  }
};

export { STORAGE_KEYS };

// WhatsApp Order formatting utility for 01352113432
export const generateOrderWhatsAppDetails = (order: Order, customNumber = '01352113432') => {
  const cleanNumber = customNumber.replace(/\D/g, '');
  const internationalNumber = cleanNumber.startsWith('88')
    ? cleanNumber
    : `88${cleanNumber.replace(/^0+/, '')}`;

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}* (${item.quantity}টি)
   সাইজ: ${item.size || 'Standard'} | কালার: ${item.color || 'Default'}
   মূল্য: $${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n');

  const text = `🛍️ *নতুন অর্ডার কনফার্মেশন - SR FASHION*
━━━━━━━━━━━━━━━━━━━━━━━━
🧾 *অর্ডার নম্বর:* #${order.id}
📅 *তারিখ ও সময়:* ${order.createdAt}

👤 *গ্রাহকের তথ্য:*
• নাম: *${order.customerName}*
• মোবাইল: *${order.phone}*
• ইমেইল: ${order.email || 'N/A'}
• ডেলিভারি ঠিকানা: ${order.address}, ${order.city}, ${order.state} (পোস্টকোড: ${order.zip})

📦 *অর্ডারকৃত পণ্যসমূহ:*
${itemsList}

💵 *মূল্য বিবরণী:*
• সাবটোটাল: $${order.subtotal.toFixed(2)}
${order.discount > 0 ? `• ডিসকাউন্ট: -$${order.discount.toFixed(2)}\n` : ''}• ডেলিভারি চার্জ: $${order.shipping.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━
⭐ *সর্বমোট প্রদেয়: $${order.total.toFixed(2)}*

💳 *পেমেন্ট পদ্ধতি:* ${order.paymentMethod}
${order.transactionId ? `🔢 *TrxID:* ${order.transactionId}\n` : ''}${order.senderNumber ? `📱 *প্রেরক নম্বর:* ${order.senderNumber}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━
🌐 *SR Fashion* | Keshobpur, Jessore`;

  const webUrl = `https://api.whatsapp.com/send?phone=${internationalNumber}&text=${encodeURIComponent(text)}`;

  return {
    url: webUrl,
    text,
    number: internationalNumber,
    rawNumber: customNumber,
  };
};
