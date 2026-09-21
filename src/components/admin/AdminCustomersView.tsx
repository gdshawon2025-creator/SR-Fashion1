import React, { useState } from 'react';
import { Users, Mail, Phone, ShoppingBag, DollarSign, Search, CheckCircle, Download } from 'lucide-react';
import { Order, Subscriber } from '../../types';

interface AdminCustomersViewProps {
  orders: Order[];
  subscribers: Subscriber[];
}

export const AdminCustomersView: React.FC<AdminCustomersViewProps> = ({
  orders,
  subscribers,
}) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'subscribers'>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate customers from orders
  const customerMap = orders.reduce((acc, order) => {
    const key = order.email.toLowerCase();
    if (!acc[key]) {
      acc[key] = {
        name: order.customerName,
        email: order.email,
        phone: order.phone,
        city: order.city,
        orderCount: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt,
      };
    }
    acc[key].orderCount += 1;
    acc[key].totalSpent += order.total;
    return acc;
  }, {} as Record<string, { name: string; email: string; phone: string; city: string; orderCount: number; totalSpent: number; lastOrderDate: string }>);

  const customerList = Object.values(customerMap);

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'customers'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Registered Shoppers ({customerList.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'subscribers'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Newsletter Subscribers ({subscribers.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email, name, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {activeTab === 'customers' ? (
        /* Customers Table */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Orders</th>
                  <th className="px-5 py-3.5">Lifetime Value</th>
                  <th className="px-5 py-3.5">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                          {customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{customer.name}</div>
                          <div className="text-[11px] text-stone-400">Verified Purchaser</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs text-stone-900 font-medium">{customer.email}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{customer.phone}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium">
                        {customer.city}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-stone-900">{customer.orderCount}</span> orders
                    </td>

                    <td className="px-5 py-4 font-bold text-stone-900 text-sm">
                      ${customer.totalSpent.toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-stone-500">
                      {customer.lastOrderDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Subscribers Table */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3.5">Email Address</th>
                  <th className="px-5 py-3.5">Subscription Date</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span className="font-semibold text-stone-900 text-sm">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-500">{sub.subscribedAt}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          sub.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{sub.status === 'active' ? 'Active Subscriber' : 'Unsubscribed'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
