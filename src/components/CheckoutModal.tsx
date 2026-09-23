import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import {
  X,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Truck,
  Loader2,
  Copy,
  Check,
  Smartphone,
  Banknote,
  ArrowRight,
  Info,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { generateOrderWhatsAppDetails } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedDiscount: number;
  onOrderPlaced: (order?: Order) => void;
  whatsappNumber?: string;
}

type PaymentMethodType = 'cod' | 'bkash' | 'nagad' | 'card';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedDiscount,
  onOrderPlaced,
  whatsappNumber = '01352113432',
}) => {
  const [formData, setFormData] = useState({
    firstName: 'Younus',
    lastName: 'Ali',
    email: 'gdyounus2025@gmail.com',
    phone: '01352113432',
    address: 'Main Bazaar Road',
    city: 'Keshobpur',
    state: 'Jessore',
    zip: '7450',
    paymentMethod: 'cod' as PaymentMethodType,
    // bKash fields
    bkashSenderNumber: '',
    bkashTrxId: '',
    // Nagad fields
    nagadSenderNumber: '',
    nagadTrxId: '',
    // Card fields
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '08/28',
    cardCvc: '•••',
  });

  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [copiedType, setCopiedType] = useState<'bkash' | 'nagad' | null>(null);
  const [whatsAppInfo, setWhatsAppInfo] = useState<{ url: string; text: string; number: string; rawNumber: string } | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  if (!isOpen) return null;

  const paymentRecipientNumber = '01804459691';

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shippingFee = subtotal >= 150 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleCopyNumber = (type: 'bkash' | 'nagad') => {
    navigator.clipboard.writeText(paymentRecipientNumber);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const generatedOrder = 'SR-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(generatedOrder);
      setOrderConfirmed(true);

      let methodLabel = 'Cash on Delivery (ক্যাশ অন ডেলিভারি)';
      let trxId: string | undefined = undefined;
      let senderNum: string | undefined = undefined;
      let payStatus: 'paid' | 'pending' = 'pending';

      if (formData.paymentMethod === 'bkash') {
        methodLabel = `bKash (বিকাশ: ${paymentRecipientNumber})`;
        trxId = formData.bkashTrxId.trim() || undefined;
        senderNum = formData.bkashSenderNumber.trim() || undefined;
        payStatus = 'paid';
      } else if (formData.paymentMethod === 'nagad') {
        methodLabel = `Nagad (নগদ: ${paymentRecipientNumber})`;
        trxId = formData.nagadTrxId.trim() || undefined;
        senderNum = formData.nagadSenderNumber.trim() || undefined;
        payStatus = 'paid';
      } else if (formData.paymentMethod === 'card') {
        methodLabel = 'Credit / Debit Card';
        payStatus = 'paid';
      } else {
        methodLabel = 'Cash on Delivery (ক্যাশ অন ডেলিভারি)';
        payStatus = 'pending';
      }

      const newOrder: Order = {
        id: generatedOrder,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        items: items.map((it) => ({
          productId: it.product.id,
          productName: it.product.name,
          productImage: it.product.image,
          price: it.product.price,
          quantity: it.quantity,
          size: it.selectedSize,
          color: it.selectedColor,
        })),
        subtotal,
        discount: discountAmount,
        shipping: shippingFee,
        total,
        paymentMethod: methodLabel,
        paymentStatus: payStatus,
        status: 'pending',
        transactionId: trxId,
        senderNumber: senderNum,
        createdAt: new Date().toLocaleString([], {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Generate complete WhatsApp order details for 01352113432
      const targetPhone = whatsappNumber || '01352113432';
      const wa = generateOrderWhatsAppDetails(newOrder, targetPhone);
      setWhatsAppInfo(wa);

      // Automatically open WhatsApp with all order details
      try {
        window.open(wa.url, '_blank');
      } catch (err) {
        console.log('WhatsApp auto window.open triggered', err);
      }

      onOrderPlaced(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#111111] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base md:text-lg">
              সরাসরি অর্ডার ফর্ম <span className="text-[#e8b04b] font-normal text-sm">(Direct Order Form)</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderConfirmed ? (
          <div className="p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#e8b04b]">
                অর্ডার সফল হয়েছে • Order Confirmed
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে।
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Order Tracking ID: <strong className="text-gray-900 font-mono">{orderNumber}</strong>
              </p>
            </div>

            {/* Payment Method Recap */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 text-left space-y-2 max-w-md mx-auto">
              <div className="font-bold text-stone-900 flex items-center justify-between border-b border-stone-200 pb-2">
                <span>পেমেন্ট মেথড:</span>
                <span className="text-amber-700 font-semibold">
                  {formData.paymentMethod === 'cod' && 'ক্যাশ অন ডেলিভারি (COD)'}
                  {formData.paymentMethod === 'bkash' && 'বিকাশ (bKash)'}
                  {formData.paymentMethod === 'nagad' && 'নগদ (Nagad)'}
                  {formData.paymentMethod === 'card' && 'Credit / Debit Card'}
                </span>
              </div>

              {formData.paymentMethod === 'cod' && (
                <p className="text-stone-600">
                  পণ্য হাতে পেয়ে ডেলিভারিম্যানের কাছে <strong>${total.toFixed(2)}</strong> পরিশোধ করুন। ডেলিভারির আগে আপনাকে ফোন করা হবে।
                </p>
              )}

              {formData.paymentMethod === 'bkash' && (
                <div className="space-y-1">
                  <p className="text-stone-600">বিকাশ পার্সোনাল নম্বর: <strong>{paymentRecipientNumber}</strong></p>
                  {formData.bkashTrxId && (
                    <p className="font-mono text-stone-900">
                      TrxID: <strong>{formData.bkashTrxId}</strong>
                    </p>
                  )}
                  {formData.bkashSenderNumber && (
                    <p className="text-stone-600">প্রেরক বিকাশ নম্বর: {formData.bkashSenderNumber}</p>
                  )}
                </div>
              )}

              {formData.paymentMethod === 'nagad' && (
                <div className="space-y-1">
                  <p className="text-stone-600">নগদ পার্সোনাল নম্বর: <strong>{paymentRecipientNumber}</strong></p>
                  {formData.nagadTrxId && (
                    <p className="font-mono text-stone-900">
                      TrxID: <strong>{formData.nagadTrxId}</strong>
                    </p>
                  )}
                  {formData.nagadSenderNumber && (
                    <p className="text-stone-600">প্রেরক নগদ নম্বর: {formData.nagadSenderNumber}</p>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                <span>মোট পরিশোধযোগ্য:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Automated WhatsApp Notification Box for 01352113432 */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-left space-y-3 max-w-md mx-auto shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                      WhatsApp এ সকল তথ্য পাঠানো হচ্ছে
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800">
                      অটো WhatsApp
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    অর্ডারের সকল বিবরণী স্বয়ংক্রিয়ভাবে <strong>{whatsAppInfo?.rawNumber || whatsappNumber || '01352113432'}</strong> নম্বরে পাঠানোর জন্য রেডি করা হয়েছে।
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={whatsAppInfo?.url || `https://api.whatsapp.com/send?phone=8801352113432`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp এ পাঠান / দেখুন</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (whatsAppInfo?.text) {
                      navigator.clipboard.writeText(whatsAppInfo.text);
                      setCopiedWhatsApp(true);
                      setTimeout(() => setCopiedWhatsApp(false), 2500);
                    }
                  }}
                  className="flex items-center justify-center gap-1 py-2 px-3 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWhatsApp ? 'কপি হয়েছে!' : 'মেসেজ কপি'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              অর্ডারের বিস্তারিত তথ্য <strong>{formData.email}</strong> এবং আপনার মোবাইল নম্বরে নিশ্চিত করা হবে।
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e8b04b] hover:text-black transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Shipping Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center justify-between">
                <span>১. ডেলিভারি তথ্য (Delivery Information)</span>
                <span className="text-xs text-stone-500 font-normal">Keshobpur, Jessore</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">নামের প্রথম অংশ (First Name)</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded focus:border-[#e8b04b] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">নামের শেষ অংশ (Last Name)</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded focus:border-[#e8b04b] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">ইমেইল (Email)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded focus:border-[#e8b04b] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">মোবাইল নম্বর (Phone)</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded focus:border-[#e8b04b] outline-none"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1 font-medium">সম্পূর্ণ ডেলিভারি ঠিকানা (Full Address)</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded focus:border-[#e8b04b] outline-none"
                    placeholder="বাড়ি নং, রাস্তা, এলাকা..."
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">শহর / উপজেলা (City/Upazila)</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded focus:border-[#e8b04b] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">জেলা / পোস্টকোড (District / ZIP)</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded focus:border-[#e8b04b] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center justify-between">
                <span>২. পেমেন্ট মেথড (Payment Option)</span>
                <span className="text-xs text-gray-400 font-normal flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  নিরাপদ চেকআউট
                </span>
              </h3>

              {/* 4 Payment Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {/* Cash on Delivery (COD) */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#111111] bg-stone-900 text-white shadow-md'
                      : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#e8b04b]" />
                  <span className="font-bold">ক্যাশ অন ডেলিভারি</span>
                  <span className={`text-[10px] ${formData.paymentMethod === 'cod' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Cash on Delivery
                  </span>
                </button>

                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                  className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    formData.paymentMethod === 'bkash'
                      ? 'border-[#D12053] bg-[#D12053] text-white shadow-md'
                      : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-white hover:border-[#D12053]/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    formData.paymentMethod === 'bkash' ? 'bg-white text-[#D12053]' : 'bg-[#D12053] text-white'
                  }`}>
                    ৳
                  </div>
                  <span className="font-bold">বিকাশ (bKash)</span>
                  <span className={`text-[10px] ${formData.paymentMethod === 'bkash' ? 'text-pink-100' : 'text-gray-500'}`}>
                    Send Money
                  </span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                  className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    formData.paymentMethod === 'nagad'
                      ? 'border-[#F7931E] bg-[#F7931E] text-white shadow-md'
                      : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-white hover:border-[#F7931E]/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    formData.paymentMethod === 'nagad' ? 'bg-white text-[#F7931E]' : 'bg-[#F7931E] text-white'
                  }`}>
                    ৳
                  </div>
                  <span className="font-bold">নগদ (Nagad)</span>
                  <span className={`text-[10px] ${formData.paymentMethod === 'nagad' ? 'text-orange-100' : 'text-gray-500'}`}>
                    Send Money
                  </span>
                </button>

                {/* Card Payment */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#e8b04b] bg-amber-50 text-gray-900 shadow-md ring-1 ring-[#e8b04b]'
                      : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  <span className="font-bold">কার্ড পেমেন্ট</span>
                  <span className="text-[10px] text-gray-500">Visa / Master</span>
                </button>
              </div>

              {/* 1. Cash on Delivery Description Box */}
              {formData.paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 text-xs text-stone-800">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    অগ্রিম কোনো টাকা দিতে হবে না। পার্সেল হাতে পাওয়ার পর পণ্য চেক করে ডেলিভারিম্যানকে মোট <strong>${total.toFixed(2)}</strong> ক্যাশ পরিশোধ করবেন।
                  </p>
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] pt-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>ডেলিভারির সময় নিশ্চিত করতে আমাদের প্রতিনিধি আপনার দেওয়া নম্বরে কল করবেন।</span>
                  </div>
                </div>
              )}

              {/* 2. bKash Payment Box with 01804459691 */}
              {formData.paymentMethod === 'bkash' && (
                <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-xl space-y-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#D12053] text-white font-bold flex items-center justify-center text-xs">
                        ৳
                      </div>
                      <div>
                        <span className="font-bold text-[#D12053] text-sm block">বিকাশ পার্সোনাল পেমেন্ট</span>
                        <span className="text-[11px] text-stone-600">Send Money / ক্যাশ সেন্ড করুন</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-pink-300 shadow-xs">
                      <span className="font-mono font-bold text-stone-900 text-sm">{paymentRecipientNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber('bkash')}
                        className="p-1 rounded text-[#D12053] hover:bg-pink-100 transition-colors flex items-center gap-1 cursor-pointer font-medium text-[11px]"
                        title="নম্বর কপি করুন"
                      >
                        {copiedType === 'bkash' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">কপিকৃত!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-stone-700 text-[11px] bg-white p-3 rounded-lg border border-pink-100">
                    <p className="font-semibold text-stone-900">নির্দেশিকা:</p>
                    <p>১. আপনার বিকাশ অ্যাপ ওপেন করুন অথবা <strong>*247#</strong> ডায়াল করুন।</p>
                    <p>২. <strong>Send Money</strong> অপশন সিলেক্ট করে প্রাপক নম্বরে <strong>{paymentRecipientNumber}</strong> দিন।</p>
                    <p>৩. টাকার পরিমাণ: <strong>${total.toFixed(2)}</strong> (বা সমপরিমাণ টাকা)।</p>
                    <p>৪. সেন্ড মানি সফল হলে নিচের বক্সে আপনার বিকাশ নম্বর ও TrxID দিন।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-stone-700 mb-1 font-semibold">
                        প্রেরক বিকাশ নম্বর (Sender bKash No.) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.bkashSenderNumber}
                        onChange={(e) => setFormData({ ...formData, bkashSenderNumber: e.target.value })}
                        className="w-full p-2.5 border border-pink-200 rounded-lg bg-white focus:border-[#D12053] focus:ring-1 focus:ring-[#D12053] outline-none font-mono"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1 font-semibold">
                        ট্রানজেকশন আইডি (bKash TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bkashTrxId}
                        onChange={(e) => setFormData({ ...formData, bkashTrxId: e.target.value })}
                        className="w-full p-2.5 border border-pink-200 rounded-lg bg-white focus:border-[#D12053] focus:ring-1 focus:ring-[#D12053] outline-none font-mono uppercase"
                        placeholder="যেমন: BL9X2A88"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Nagad Payment Box with 01804459691 */}
              {formData.paymentMethod === 'nagad' && (
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F7931E] text-white font-bold flex items-center justify-center text-xs">
                        ৳
                      </div>
                      <div>
                        <span className="font-bold text-[#F7931E] text-sm block">নগদ পার্সোনাল পেমেন্ট</span>
                        <span className="text-[11px] text-stone-600">Send Money / ক্যাশ সেন্ড করুন</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-orange-300 shadow-xs">
                      <span className="font-mono font-bold text-stone-900 text-sm">{paymentRecipientNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber('nagad')}
                        className="p-1 rounded text-[#F7931E] hover:bg-orange-100 transition-colors flex items-center gap-1 cursor-pointer font-medium text-[11px]"
                        title="নম্বর কপি করুন"
                      >
                        {copiedType === 'nagad' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">কপিকৃত!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-stone-700 text-[11px] bg-white p-3 rounded-lg border border-orange-100">
                    <p className="font-semibold text-stone-900">নির্দেশিকা:</p>
                    <p>১. আপনার নগদ অ্যাপ ওপেন করুন অথবা <strong>*167#</strong> ডায়াল করুন।</p>
                    <p>২. <strong>Send Money</strong> অপশনে গিয়ে প্রাপক নম্বরে <strong>{paymentRecipientNumber}</strong> দিন।</p>
                    <p>৩. টাকার পরিমাণ: <strong>${total.toFixed(2)}</strong> (বা সমপরিমাণ টাকা)।</p>
                    <p>৪. সফলভাবে সেন্ড মানি হওয়ার পর আপনার নগদ নম্বর ও TrxID নিচে লিখুন।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-stone-700 mb-1 font-semibold">
                        প্রেরক নগদ নম্বর (Sender Nagad No.) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.nagadSenderNumber}
                        onChange={(e) => setFormData({ ...formData, nagadSenderNumber: e.target.value })}
                        className="w-full p-2.5 border border-orange-200 rounded-lg bg-white focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] outline-none font-mono"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1 font-semibold">
                        ট্রানজেকশন আইডি (Nagad TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nagadTrxId}
                        onChange={(e) => setFormData({ ...formData, nagadTrxId: e.target.value })}
                        className="w-full p-2.5 border border-orange-200 rounded-lg bg-white focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] outline-none font-mono uppercase"
                        placeholder="যেমন: 7K9J2L1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Card Payment Box */}
              {formData.paymentMethod === 'card' && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Card Number</label>
                    <input
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">CVV / CVC</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Review summary */}
            <div className="border-t border-gray-100 pt-4 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>পণ্যের মূল্য Subtotal ({items.length} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>ডিসকাউন্ট Discount ({appliedDiscount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ Shipping:</span>
                <span>{shippingFee === 0 ? 'FREE (ফ্রি)' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2">
                <span>সর্বমোট Total:</span>
                <span className="text-[#111111]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#111111] text-white font-bold text-sm tracking-wide rounded-xl hover:bg-[#e8b04b] hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <span>অর্ডার কনফার্ম করুন • CONFIRM ORDER (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
