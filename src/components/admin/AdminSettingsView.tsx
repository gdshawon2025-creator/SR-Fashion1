import React, { useState } from 'react';
import { Settings, Save, CheckCircle, Store, Truck, ShieldAlert, KeyRound, Lock, Eye, EyeOff, ShieldCheck, RefreshCw } from 'lucide-react';
import { verifyPassword, setStoredPassword, getStoredPassword, resetStoredPassword, DEFAULT_ADMIN_PASSWORD } from '../../utils/adminAuth';

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

interface AdminSettingsViewProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Management State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!currentPass.trim()) {
      setPassError('বর্তমান পাসওয়ার্ড লিখুন!');
      return;
    }

    if (!verifyPassword(currentPass)) {
      setPassError('বর্তমান পাসওয়ার্ডটি সঠিক নয়!');
      return;
    }

    if (newPass.length < 4) {
      setPassError('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    const success = setStoredPassword(newPass);
    if (success) {
      setPassSuccess('অভিনন্দন! আপনার এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassSuccess(null), 4000);
    } else {
      setPassError('পাসওয়ার্ড সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm(`আপনি কি পাসওয়ার্ডটি ডিফল্ট (${DEFAULT_ADMIN_PASSWORD}) এ রিসেট করতে চান?`)) {
      resetStoredPassword();
      setPassSuccess(`পাসওয়ার্ড ডিফল্ট (${DEFAULT_ADMIN_PASSWORD}) এ রিসেট হয়েছে!`);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassSuccess(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Brand & Store Identity</h3>
              <p className="text-xs text-stone-500">Visible on customer invoices, headers, and metadata</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Store Brand Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm font-semibold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Tagline / Slogan</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Customer Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Helpline Phone Number</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Storefront Announcement Banner</label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Currency Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Shipping & Delivery Policies</h3>
              <p className="text-xs text-stone-500">Calculate delivery charges and automated free shipping rules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Standard Delivery Fee ($)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.standardShippingFee}
                onChange={(e) => setFormData({ ...formData, standardShippingFee: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Free Shipping Minimum Threshold ($)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Physical Warehouse / Return Address</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Store configuration saved successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-stone-500">Changes apply immediately across the live store.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold tracking-wide transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Admin Security & Password Change Section */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5" id="admin-security-section">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>এডমিন সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  সুরক্ষিত
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                এডমিন প্যানেলে প্রবেশের পাসওয়ার্ড আপনার পছন্দমতো পরিবর্তন করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors"
            title="পাসওয়ার্ড ডিফল্ট (admin) এ রিসেট করুন"
          >
            <RefreshCw className="w-3 h-3" />
            <span>রিসেট অপশন</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {passSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                <span>বর্তমান পাসওয়ার্ড</span>
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="text-stone-400 hover:text-stone-600 text-[11px] flex items-center gap-1"
                >
                  {showCurrentPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showCurrentPass ? 'লুকান' : 'দেখুন'}</span>
                </button>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                <span>নতুন পাসওয়ার্ড</span>
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="text-stone-400 hover:text-stone-600 text-[11px] flex items-center gap-1"
                >
                  {showNewPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showNewPass ? 'লুকান' : 'দেখুন'}</span>
                </button>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  required
                  minLength={4}
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  required
                  minLength={4}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-stone-400">
              * পাসওয়ার্ড পরিবর্তন করার সাথে সাথে ব্রাউজারে স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
            </p>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold tracking-wide transition-colors shadow-sm cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>পাসওয়ার্ড পরিবর্তন করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
