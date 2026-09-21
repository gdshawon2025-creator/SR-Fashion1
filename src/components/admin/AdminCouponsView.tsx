import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';
import { Coupon } from '../../types';

interface AdminCouponsViewProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (id: string) => void;
  onDeleteCoupon: (id: string) => void;
}

export const AdminCouponsView: React.FC<AdminCouponsViewProps> = ({
  coupons,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
}) => {
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<string>('15');
  const [minOrderAmount, setMinOrderAmount] = useState<string>('50');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Promo code cannot be empty.');
      return;
    }

    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      setError('A promo code with this name already exists.');
      return;
    }

    const pct = parseInt(discountPercent, 10);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      setError('Discount must be between 1% and 100%.');
      return;
    }

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: cleanCode,
      discountPercent: pct,
      usageCount: 0,
      isActive: true,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
    };

    onAddCoupon(newCoupon);
    setCode('');
    setDiscountPercent('15');
    setMinOrderAmount('50');
    setError('');
  };

  const copyToClipboard = (couponCode: string, id: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create New Promo Code (Left Column) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs h-fit space-y-5">
        <div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Tag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Create Promotional Coupon</h3>
          <p className="text-xs text-stone-500 mt-1">
            Generate discount vouchers for social media campaigns or VIP customer retention.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Coupon Code *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER25"
              className="w-full px-3.5 py-2 text-sm uppercase font-bold tracking-wider rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Discount (%) *</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="15"
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Min. Spend ($)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">$</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Promo Code</span>
          </button>
        </form>
      </div>

      {/* Existing Coupons Table (Right 2 Columns) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Active Store Coupons ({coupons.length})</h3>
            <p className="text-xs text-stone-500">Live codes redeemable by customers during checkout</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Promo Code</th>
                <th className="px-5 py-3.5">Discount</th>
                <th className="px-5 py-3.5">Min. Order</th>
                <th className="px-5 py-3.5">Times Used</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-stone-900 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(coupon.code, coupon.id)}
                        className="text-stone-400 hover:text-stone-700 p-1"
                        title="Copy code"
                      >
                        {copiedId === coupon.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-emerald-600">
                      {coupon.discountPercent}% OFF
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span>{coupon.minOrderAmount ? `$${coupon.minOrderAmount}` : 'No minimum'}</span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-stone-800">{coupon.usageCount} orders</span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => onToggleCoupon(coupon.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        coupon.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {coupon.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{coupon.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onDeleteCoupon(coupon.id)}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 hover:border-rose-300 text-stone-500 hover:text-rose-600 transition-colors"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
