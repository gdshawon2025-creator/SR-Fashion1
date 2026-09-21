import React, { useState } from 'react';
import { Product, CartItem, ToastMessage, Order, Coupon, Subscriber, OrderStatus, PaymentStatus } from './types';
import { PRODUCTS } from './data/fashionData';
import { INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_SUBSCRIBERS } from './data/adminData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductsSection } from './components/ProductsSection';
import { OfferSection } from './components/OfferSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';
import { Toast } from './components/Toast';
import { AdminPanel } from './components/admin/AdminPanel';
import { ShieldCheck, LayoutDashboard } from 'lucide-react';

interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  announcementText: string;
  storeAddress: string;
}

export default function App() {
  // Current view: storefront or admin panel
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');

  // Products state (can be modified by admin)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Newsletter subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);

  // Store Settings state
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'SR Fashion',
    tagline: 'Haute Couture & Modern Luxury Apparel',
    supportEmail: 'gdyounus2025@gmail.com',
    supportPhone: '01352113432',
    currency: '$',
    standardShippingFee: 15,
    freeShippingThreshold: 150,
    announcementText: 'SEASON SALE 2026: Use code SR20 for 20% off all designer styles. Free delivery over $150.',
    storeAddress: 'Keshobpur, Jessore, Bangladesh',
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'cart' = 'success'
  ) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    size: string = product.sizes[0] || 'Standard',
    color: string = product.colors[0]?.name || 'Default',
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
      }
    });

    showToast(
      'Added to Shopping Bag',
      `${product.name} (${size}, ${color}) has been added.`,
      'cart'
    );
  };

  const handleDirectBuy = (
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ) => {
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
    const chosenColor = color || (product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default');

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedSize: chosenSize, selectedColor: chosenColor }];
      }
    });

    // Close any other open modals
    setQuickViewProduct(null);
    setIsSearchOpen(false);
    setIsWishlistOpen(false);
    setIsCartOpen(false);

    // Direct open Checkout Order Form!
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    size: string,
    color: string,
    delta: number
  ) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
    showToast('Item Removed', 'The item was removed from your bag.', 'info');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isSaved = prev.includes(productId);
      const product = products.find((p) => p.id === productId);
      if (isSaved) {
        showToast('Removed from Wishlist', `${product?.name || 'Item'} removed.`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', `${product?.name || 'Item'} saved to your favorites.`, 'success');
        return [...prev, productId];
      }
    });
  };

  // Dynamic Coupon redemption against active coupons list
  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const foundCoupon = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);

    if (foundCoupon) {
      setAppliedDiscount(foundCoupon.discountPercent);
      // Increment usage count
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === foundCoupon.id ? { ...c, usageCount: c.usageCount + 1 } : c
        )
      );
      showToast(
        `${foundCoupon.discountPercent}% Discount Applied!`,
        `Coupon ${foundCoupon.code} has been successfully applied to your order.`,
        'success'
      );
      return true;
    }

    // Default fallback promo code SR20
    if (clean === 'SR20') {
      setAppliedDiscount(20);
      showToast('20% Discount Applied!', 'Promo code SR20 activated.', 'success');
      return true;
    }

    showToast('Invalid Coupon', 'This promo code is either expired or invalid.', 'info');
    return false;
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopNow = () => {
    setSelectedCategory('all');
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle new newsletter subscriber
  const handleSubscribeNewsletter = (email: string) => {
    const cleanEmail = email.trim();
    if (cleanEmail && !subscribers.some((s) => s.email.toLowerCase() === cleanEmail.toLowerCase())) {
      setSubscribers((prev) => [
        {
          id: `sub-${Date.now()}`,
          email: cleanEmail,
          subscribedAt: new Date().toISOString().split('T')[0],
          status: 'active',
        },
        ...prev,
      ]);
    }
    showToast('Subscribed!', `Welcome promo code sent to ${email}`, 'success');
  };

  // Admin Actions: Products
  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updatedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        return [updatedProduct, ...prev];
      }
    });
    showToast(
      'Product Catalog Updated',
      `"${updatedProduct.name}" is now live in the store.`,
      'success'
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product Removed', 'Product has been deleted from your store.', 'info');
  };

  const handleToggleProductSale = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newSale = !p.isSale;
          return {
            ...p,
            isSale: newSale,
            saleTag: newSale ? p.saleTag || '-20%' : undefined,
          };
        }
        return p;
      })
    );
  };

  // Admin Actions: Orders
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast('Order Updated', `Order #${orderId} marked as ${status.toUpperCase()}`, 'success');
  };

  const handleUpdateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );
    showToast('Payment Updated', `Order #${orderId} payment is now ${paymentStatus}`, 'success');
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('অর্ডার ডিলিট হয়েছে', `অর্ডার #${orderId} সফলভাবে মুছে ফেলা হয়েছে।`, 'info');
  };

  // Admin Actions: Coupons
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast('Coupon Created', `Code ${newCoupon.code} is now active.`, 'success');
  };

  const handleToggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon Removed', 'Coupon code deleted.', 'info');
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showToast('Settings Saved', 'Store configuration updated.', 'success');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If Admin View is active, render full Admin Panel
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900">
        <AdminPanel
          products={products}
          orders={orders}
          coupons={coupons}
          subscribers={subscribers}
          settings={settings}
          onReturnToStore={() => setCurrentView('store')}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleProductSale={handleToggleProductSale}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateOrderPaymentStatus={handleUpdateOrderPaymentStatus}
          onDeleteOrder={handleDeleteOrder}
          onAddCoupon={handleAddCoupon}
          onToggleCoupon={handleToggleCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          onSaveSettings={handleSaveSettings}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Otherwise, render Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8] text-[#222222]">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#111111] border-b border-gray-800 text-white text-xs py-2 px-4 text-center font-medium">
        <span className="text-[#e8b04b] font-bold mr-2">STORE NOTICE:</span>
        <span>{settings.announcementText}</span>
      </div>

      {/* Main Sticky Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        activeCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onShopClick={handleShopNow} />

        {/* Categories Grid Section */}
        <CategoriesSection
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Products Grid Section */}
        <ProductsSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddToCart={(product) => handleAddToCart(product)}
          onDirectBuy={(product, size, color) => handleDirectBuy(product, size, color)}
          onQuickView={(product) => setQuickViewProduct(product)}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenAdmin={() => setCurrentView('admin')}
        />

        {/* Promotional Offer Section */}
        <OfferSection
          onShopOffer={handleShopNow}
          onApplyCouponCode={(code) => handleApplyCoupon(code)}
        />

        {/* Newsletter Section */}
        <NewsletterSection onSubscribe={handleSubscribeNewsletter} />
      </main>

      {/* Footer */}
      <Footer
        onCategoryClick={handleSelectCategory}
        onOpenAdmin={() => setCurrentView('admin')}
        storeAddress={settings.storeAddress}
        storePhone={settings.supportPhone}
        storeEmail={settings.supportEmail}
      />

      {/* Slide-over Shopping Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedDiscount={appliedDiscount}
        onApplyCoupon={handleApplyCoupon}
      />

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectBuy={(product, size, color, quantity) =>
          handleDirectBuy(product, size, color, quantity)
        }
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        onAddToCart={(product) => handleAddToCart(product)}
        onDirectBuy={(product) => handleDirectBuy(product)}
        products={products}
      />

      {/* Wishlist Drawer */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(product) => handleAddToCart(product)}
        onDirectBuy={(product) => handleDirectBuy(product)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        products={products}
      />

      {/* Complete Checkout Flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedDiscount={appliedDiscount}
        onOrderPlaced={(newOrder) => {
          if (newOrder) {
            setOrders((prev) => [newOrder, ...prev]);
          }
          setCart([]);
          showToast(
            'Order Confirmed!',
            'Receipt generated and sent to merchant management portal.',
            'success'
          );
        }}
      />

      {/* Floating Quick Admin Toggle Pill */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setCurrentView('admin')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-950 font-bold text-xs shadow-xl border border-stone-700 hover:border-amber-400 transition-all transform hover:scale-105"
          title="Open Merchant Admin Panel"
        >
          <LayoutDashboard className="w-4 h-4 text-amber-400 group-hover:text-stone-950" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
