import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Tag, 
  Users, 
  Settings, 
  Store, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { AdminTab } from '../../types';
import brandLogo from '../../assets/logo';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onReturnToStore: () => void;
  pendingOrdersCount: number;
  totalProductsCount: number;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onReturnToStore,
  pendingOrdersCount,
  totalProductsCount,
  onLogout,
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: <Package className="w-5 h-5" />, 
      badge: totalProductsCount 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: <ShoppingBag className="w-5 h-5" />, 
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined 
    },
    { 
      id: 'coupons', 
      label: 'Coupons & Promos', 
      icon: <Tag className="w-5 h-5" /> 
    },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      id: 'settings', 
      label: 'Store Settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col shrink-0 min-h-screen border-r border-stone-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={brandLogo}
            alt="SR Fashion Logo"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/80 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-wider text-white leading-none">
                SR <span className="text-amber-500">FASHION</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/10'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-stone-950' : 'text-stone-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-stone-950 text-amber-400'
                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Store status card */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-stone-800/60 border border-stone-700/60 text-xs">
        <div className="flex items-center justify-between text-stone-300 mb-1 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Store Status
          </span>
          <span className="text-emerald-400 font-semibold">Online</span>
        </div>
        <p className="text-stone-400 text-[11px] leading-relaxed">
          Catalog is live and receiving orders. Fast dispatch active.
        </p>
      </div>

      {/* Return to Store & Logout buttons */}
      <div className="p-4 border-t border-stone-800 space-y-2">
        <button
          onClick={onReturnToStore}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors border border-stone-700 cursor-pointer"
        >
          <Store className="w-4 h-4 text-stone-400" />
          <span>Return to Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium transition-colors border border-red-900/50 cursor-pointer"
            title="লগআউট করুন"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>এডমিন লগআউট (Logout)</span>
          </button>
        )}
      </div>
    </aside>
  );
};
