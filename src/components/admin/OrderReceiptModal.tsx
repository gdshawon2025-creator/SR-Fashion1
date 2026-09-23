import React from 'react';
import { 
  X, 
  Printer, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  Trash2
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import brandLogo from '../../assets/logo';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><Package className="w-3 h-3" /> Processing</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">Order #{order.id}</h2>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Placed on {order.createdAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors"
              title="Print invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status update controls */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-700">Fulfillment Status:</span>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-700">Payment:</span>
              <select
                value={order.paymentStatus}
                onChange={(e) => onUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="paid">Paid</option>
                <option value="pending">Payment Pending</option>
                <option value="failed">Failed / Refunded</option>
              </select>
            </div>
          </div>

          {/* Printable Invoice Brand Header */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-3">
              <img
                src={brandLogo}
                alt="SR Fashion Logo"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/80 shadow-xs"
              />
              <div>
                <div className="text-xl font-bold tracking-wider text-stone-900 leading-none">
                  SR <span className="text-[#e8b04b]">Fashion</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Official Order Receipt & Invoice</p>
              </div>
            </div>
            <div className="text-right text-xs text-stone-500">
              <div className="font-bold text-stone-900">SR Fashion Store</div>
              <div>Keshobpur, Jessore</div>
              <div className="text-[11px] text-stone-400">Tel: 01352113432</div>
            </div>
          </div>

          {/* Customer & Shipping Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
              <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-stone-400">
                Customer Information
              </div>
              <div className="font-semibold text-stone-800 text-sm">{order.customerName}</div>
              <div className="flex items-center gap-2 text-stone-600">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <a href={`mailto:${order.email}`} className="hover:text-amber-600 underline">
                  {order.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <a href={`tel:${order.phone}`} className="hover:text-amber-600">
                  {order.phone}
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
              <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-stone-400">
                Shipping Destination & Payment
              </div>
              <div className="flex items-start gap-2 text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">{order.address}</p>
                  <p className="text-stone-500">{order.city}, {order.state} {order.zip}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-stone-700 pt-1 border-t border-stone-100">
                <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                <span>Method: <strong>{order.paymentMethod}</strong></span>
              </div>
              {order.transactionId && (
                <div className="mt-1.5 p-2 bg-amber-50 rounded border border-amber-200 text-xs font-mono text-stone-800">
                  <div className="font-semibold text-amber-900">TrxID: {order.transactionId}</div>
                  {order.senderNumber && (
                    <div className="text-stone-600 text-[11px]">Sender: {order.senderNumber}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Purchased Items ({order.items.length})
            </h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
              {order.items.map((item, index) => (
                <div key={index} className="p-3.5 flex items-center gap-3.5 hover:bg-stone-50 transition-colors">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-900 truncate">{item.productName}</h4>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                      <span>Size: <strong className="text-stone-700">{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-stone-700">{item.color}</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-stone-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                    <div className="text-sm font-bold text-stone-900 mt-0.5">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Applied</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee</span>
              <span>{order.shipping === 0 ? 'Free Shipping' : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Amount</span>
              <span className="text-base text-amber-700">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onDeleteOrder && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`আপনি কি নিশ্চিতভাবে এই অর্ডারটি (#${order.id}) স্থায়ীভাবে মুছে ফেলতে চান?`)) {
                    onDeleteOrder(order.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order (মুছে ফেলুন)</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
