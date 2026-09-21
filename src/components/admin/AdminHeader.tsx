import React from 'react';
import { 
  Plus, 
  Bell, 
  Search, 
  ExternalLink, 
  Store,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onOpenAddProduct: () => void;
  onReturnToStore: () => void;
  onToggleMobileMenu?: () => void;
  pendingOrdersCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onOpenAddProduct,
  onReturnToStore,
  onToggleMobileMenu,
  pendingOrdersCount
}) => {
  const getTabTitles = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', desc: 'Real-time sales, order fulfillment, and inventory analytics' };
      case 'products':
        return { title: 'Products & Inventory', desc: 'Manage your fashion catalog, prices, stocks, and seasonal tags' };
      case 'orders':
        return { title: 'Order Management', desc: 'Track customer orders, update shipping statuses, and print invoices' };
      case 'coupons':
        return { title: 'Promotions & Coupons', desc: 'Create promotional discount codes and track customer redemptions' };
      case 'customers':
        return { title: 'Customers & Subscribers', desc: 'View customer purchase histories and newsletter subscribers' };
      case 'settings':
        return { title: 'Store Settings', desc: 'Configure general store parameters, shipping costs, and contact information' };
    }
  };

  const { title, desc } = getTabTitles(currentTab);

  return (
    <header className="bg-white border-b border-stone-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button 
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center">
        {/* Quick Add Product Button */}
        <button
          onClick={onOpenAddProduct}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>

        {/* View Storefront button */}
        <button
          onClick={onReturnToStore}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors"
          title="Go to customer-facing shop"
        >
          <Store className="w-4 h-4 text-stone-500" />
          <span className="hidden sm:inline">Storefront</span>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </button>

        {/* Notification indicator */}
        <div className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          {pendingOrdersCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          )}
        </div>

        {/* Admin profile pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-800 font-bold text-xs">
            SR
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1">
              Store Owner
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-[10px] text-stone-500">gdyounus2025@gmail.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};
