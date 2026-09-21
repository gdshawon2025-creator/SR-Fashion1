import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowRight,
  Clock,
  CheckCircle2,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { Order, Product, AdminTab, OrderStatus } from '../../types';

interface AdminDashboardViewProps {
  orders: Order[];
  products: Product[];
  onNavigateTab: (tab: AdminTab) => void;
  onSelectOrder: (order: Order) => void;
  onOpenAddProduct: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  orders,
  products,
  onNavigateTab,
  onSelectOrder,
  onOpenAddProduct
}) => {
  // Financial computations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / (orders.filter(o => o.paymentStatus === 'paid').length || 1)) : 0;

  // Category breakdown
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900 tracking-tight">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">All Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900 tracking-tight">
              {totalOrdersCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
              <span className="font-semibold text-amber-600">{pendingOrders.length}</span> awaiting fulfillment
            </div>
          </div>
        </div>

        {/* Metric 3: Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Avg. Order Value</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900 tracking-tight">
              ${avgOrderValue.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
              <span>Healthy basket size</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900 tracking-tight">
              {products.length} Items
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
              <span>Across 4 categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-stone-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Merchant Quick Actions</span>
          <h3 className="text-lg font-bold text-white mt-1">Ready to manage new fashion arrivals?</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            You have {pendingOrders.length} order(s) to fulfill and {products.length} products published in your storefront.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold tracking-wide transition-colors shadow-sm"
          >
            + Add New Product
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold tracking-wide transition-colors border border-stone-700"
          >
            View Orders Queue ({pendingOrders.length})
          </button>
          <button
            onClick={() => onNavigateTab('coupons')}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold tracking-wide transition-colors border border-stone-700"
          >
            Manage Discounts
          </button>
        </div>
      </div>

      {/* Middle Grid: Recent Orders & Catalog Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Live incoming customer orders and shipment readiness</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-100">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-stone-900">{order.id}</td>
                    <td className="px-5 py-3.5">
                      <div>
                        <div className="font-semibold text-stone-900">{order.customerName}</div>
                        <div className="text-[11px] text-stone-400">{order.city}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-semibold">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-stone-900">${order.total.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown & Performance */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900">Catalog Composition</h3>
            <p className="text-xs text-stone-500">Live products by fashion categories</p>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Women's Collection</span>
                <span>{categoryCounts['women'] || 0} items</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${((categoryCounts['women'] || 0) / products.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Men's Apparel</span>
                <span>{categoryCounts['men'] || 0} items</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-stone-800 rounded-full"
                  style={{ width: `${((categoryCounts['men'] || 0) / products.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Luxury Accessories</span>
                <span>{categoryCounts['accessories'] || 0} items</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${((categoryCounts['accessories'] || 0) / products.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Footwear & Bags</span>
                <span>{categoryCounts['shoes'] || 0} items</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${((categoryCounts['shoes'] || 0) / products.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('products')}
              className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-stone-500" />
              <span>Manage Entire Catalog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
