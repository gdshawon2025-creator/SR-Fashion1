import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminProductsView } from './AdminProductsView';
import { AdminOrdersView } from './AdminOrdersView';
import { AdminCouponsView } from './AdminCouponsView';
import { AdminCustomersView } from './AdminCustomersView';
import { AdminSettingsView } from './AdminSettingsView';
import { ProductModal } from './ProductModal';
import { OrderReceiptModal } from './OrderReceiptModal';
import { Product, Order, Coupon, Subscriber, AdminTab, OrderStatus, PaymentStatus } from '../../types';

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

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  subscribers: Subscriber[];
  settings: StoreSettings;
  onReturnToStore: () => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleProductSale: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateOrderPaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (id: string) => void;
  onDeleteCoupon: (id: string) => void;
  onSaveSettings: (settings: StoreSettings) => void;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  coupons,
  subscribers,
  settings,
  onReturnToStore,
  onSaveProduct,
  onDeleteProduct,
  onToggleProductSale,
  onUpdateOrderStatus,
  onUpdateOrderPaymentStatus,
  onDeleteOrder,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  onSaveSettings,
  onLogout,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onReturnToStore={onReturnToStore}
          pendingOrdersCount={pendingOrdersCount}
          totalProductsCount={products.length}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <AdminSidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setMobileSidebarOpen(false);
              }}
              onReturnToStore={onReturnToStore}
              pendingOrdersCount={pendingOrdersCount}
              totalProductsCount={products.length}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        <AdminHeader
          currentTab={currentTab}
          onOpenAddProduct={handleOpenAddProduct}
          onReturnToStore={onReturnToStore}
          onToggleMobileMenu={() => setMobileSidebarOpen(true)}
          pendingOrdersCount={pendingOrdersCount}
          onLogout={onLogout}
        />

        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboardView
              orders={orders}
              products={products}
              onNavigateTab={setCurrentTab}
              onSelectOrder={setSelectedOrderForInvoice}
              onOpenAddProduct={handleOpenAddProduct}
            />
          )}

          {currentTab === 'products' && (
            <AdminProductsView
              products={products}
              onOpenAddProduct={handleOpenAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={onDeleteProduct}
              onToggleSale={onToggleProductSale}
            />
          )}

          {currentTab === 'orders' && (
            <AdminOrdersView
              orders={orders}
              onSelectOrder={setSelectedOrderForInvoice}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onUpdatePaymentStatus={onUpdateOrderPaymentStatus}
              onDeleteOrder={onDeleteOrder}
            />
          )}

          {currentTab === 'coupons' && (
            <AdminCouponsView
              coupons={coupons}
              onAddCoupon={onAddCoupon}
              onToggleCoupon={onToggleCoupon}
              onDeleteCoupon={onDeleteCoupon}
            />
          )}

          {currentTab === 'customers' && (
            <AdminCustomersView orders={orders} subscribers={subscribers} />
          )}

          {currentTab === 'settings' && (
            <AdminSettingsView
              settings={settings}
              onSaveSettings={onSaveSettings}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={onSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Order Invoice Details Modal */}
      <OrderReceiptModal
        order={selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        onUpdateStatus={onUpdateOrderStatus}
        onUpdatePaymentStatus={onUpdateOrderPaymentStatus}
        onDeleteOrder={onDeleteOrder}
      />
    </div>
  );
};
