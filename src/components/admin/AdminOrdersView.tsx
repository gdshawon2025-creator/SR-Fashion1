import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  CreditCard,
  FileText,
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  X,
  MessageSquare
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { generateOrderWhatsAppDetails } from '../../utils/storage';

interface AdminOrdersViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  onSelectOrder,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  };

  const counts = getStatusCounts();

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleToggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Delete handlers
  const handleConfirmSingleDelete = () => {
    if (orderToDelete && onDeleteOrder) {
      onDeleteOrder(orderToDelete.id);
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderToDelete.id));
      setOrderToDelete(null);
    }
  };

  const handleConfirmBulkDelete = () => {
    if (onDeleteOrder && selectedOrderIds.length > 0) {
      selectedOrderIds.forEach((id) => {
        onDeleteOrder(id);
      });
      setSelectedOrderIds([]);
      setShowBulkDeleteConfirm(false);
    }
  };

  const isAllSelected =
    filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        {[
          { id: 'all', label: 'All Orders', count: counts.all },
          { id: 'pending', label: 'Pending', count: counts.pending },
          { id: 'processing', label: 'Processing', count: counts.processing },
          { id: 'shipped', label: 'Shipped', count: counts.shipped },
          { id: 'delivered', label: 'Delivered', count: counts.delivered },
          { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-stone-700 text-amber-300' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search, Filter & Bulk Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার #, গ্রাহকের নাম বা মোবাইল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Bulk delete trigger button if any selected */}
          {selectedOrderIds.length > 0 && onDeleteOrder && (
            <button
              type="button"
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>মুছে ফেলুন ({selectedOrderIds.length}টি অর্ডার)</span>
            </button>
          )}

          <div className="text-xs text-stone-500 font-medium">
            Showing {filteredOrders.length} of {orders.length} total orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    title="Select all"
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5">Order</th>
                <th className="px-4 py-3.5">Customer & Contact</th>
                <th className="px-4 py-3.5">Items Purchased</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Order Status</th>
                <th className="px-4 py-3.5">Total</th>
                <th className="px-5 py-3.5 text-right">Actions (কার্যক্রম)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-stone-400">
                    <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-600">কোনো অর্ডার পাওয়া যায়নি</p>
                    <p className="text-xs mt-0.5">ফিল্টার পরিবর্তন করে অথবা সার্চ ক্লিয়ার করে দেখুন।</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isSelected ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Checkbox for selection */}
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOrder(order.id)}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                        />
                      </td>

                      {/* Order ID & Date */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-stone-900 text-sm">#{order.id}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{order.createdAt}</div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-stone-900">{order.customerName}</div>
                        <div className="text-[11px] text-stone-600 font-medium">{order.phone}</div>
                        <div className="text-[11px] text-stone-400">{order.city}</div>
                      </td>

                      {/* Items Purchased Preview */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.productImage}
                              alt={item.productName}
                              className="w-8 h-8 rounded-md object-cover border border-stone-200"
                              title={`${item.productName} (${item.quantity}x)`}
                            />
                          ))}
                          {order.items.length > 3 && (
                            <span className="w-8 h-8 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-600">
                              +{order.items.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} total unit(s)
                        </div>
                      </td>

                      {/* Payment Info & Status */}
                      <td className="px-4 py-4">
                        <div className="text-xs text-stone-800 font-medium">{order.paymentMethod}</div>
                        {order.transactionId && (
                          <div className="text-[11px] font-mono text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                            TrxID: {order.transactionId}
                          </div>
                        )}
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : order.paymentStatus === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>

                      {/* Order Fulfillment Status (Interactive Dropdown) */}
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : order.status === 'processing'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : order.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-stone-50 text-stone-800 border-stone-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-stone-900 text-sm">
                          ${order.total.toFixed(2)}
                        </div>
                        {order.discount > 0 && (
                          <div className="text-[10px] text-emerald-600">
                            -${order.discount.toFixed(2)} coupon
                          </div>
                        )}
                      </td>

                      {/* Actions: Invoice + WhatsApp + Delete */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={generateOrderWhatsAppDetails(order, '01352113432').url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                            title="WhatsApp-এ অর্ডারের বিবরণ দেখুন (01352113432)"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => onSelectOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-amber-600 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                            title="ইনভয়েস বা রসিদ দেখুন"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          {onDeleteOrder && (
                            <button
                              type="button"
                              onClick={() => setOrderToDelete(order)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                              title="অর্ডারটি মুছে ফেলুন (Delete Order)"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal: Single Order Delete */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  অর্ডার ডিলিট নিশ্চিত করুন
                </h3>
              </div>
              <button
                onClick={() => setOrderToDelete(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed">
                আপনি কি নিশ্চিত যে নিচের অর্ডারটি ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলতে চান?
              </p>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-bold text-stone-900">#{orderToDelete.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">গ্রাহকের নাম:</span>
                  <span className="font-semibold text-stone-800">{orderToDelete.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">মোবাইল:</span>
                  <span className="text-stone-800 font-mono">{orderToDelete.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">মোট মূল্য:</span>
                  <span className="font-bold text-amber-700">${orderToDelete.total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[11px] text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
                ⚠️ সতর্কবার্তা: একবার মুছে ফেললে এই অর্ডারের রেকর্ড আর ফিরিয়ে আনা সম্ভব হবে না।
              </p>
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>হ্যাঁ, মুছে ফেলুন (Delete)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Bulk Delete */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  নির্বাচিত অর্ডারগুলো ডিলিট করুন
                </h3>
              </div>
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed">
                আপনি <strong>{selectedOrderIds.length}</strong>টি অর্ডার নির্বাচন করেছেন। আপনি কি এই সমস্ত নির্বাচিত অর্ডার স্থায়ীভাবে মুছে ফেলতে চান?
              </p>

              <p className="text-[11px] text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
                ⚠️ সতর্কবার্তা: নির্বাচিত সকল অর্ডার স্থায়ীভাবে ডিলিট হয়ে যাবে।
              </p>
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সবগুলো মুছে ফেলুন ({selectedOrderIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
