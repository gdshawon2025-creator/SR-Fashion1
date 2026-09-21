import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle, 
  Store, 
  Truck, 
  KeyRound, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StoreSettings, getAdminPassword, saveAdminPassword } from '../../utils/storage';

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

  // Password change state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const handleSubmitStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess(false);

    const actualCurrentPwd = getAdminPassword();

    if (!currentPwd) {
      setPwdError('বর্তমান পাসওয়ার্ড প্রদান করুন');
      return;
    }
    if (currentPwd !== actualCurrentPwd) {
      setPwdError('বর্তমান পাসওয়ার্ডটি সঠিক নয়!');
      return;
    }
    if (!newPwd || newPwd.length < 4) {
      setPwdError('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না!');
      return;
    }

    saveAdminPassword(newPwd);
    setPwdSuccess(true);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setTimeout(() => setPwdSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Store Profile & WhatsApp Card */}
      <form onSubmit={handleSubmitStoreSettings} className="space-y-6">
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

            {/* Auto WhatsApp Order Alert Number */}
            <div className="sm:col-span-2 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>অর্ডার অটো WhatsApp নোটিফিকেশন নম্বর (Order Alert WhatsApp Number)</span>
              </div>
              <input
                type="text"
                value={formData.whatsappNumber || '01352113432'}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="01352113432"
                className="w-full px-3.5 py-2 text-sm font-mono font-bold text-stone-900 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <p className="text-[11px] text-emerald-800 mt-1.5">
                গ্রাহক ওয়েবসাইটে কোনো অর্ডার কনফার্ম করলে তাৎক্ষণিকভাবে এই নম্বরের WhatsApp-এ অর্ডারের সম্পূর্ণ বিবরণী চলে যাবে।
              </p>
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

        {/* Shipping & Delivery Policies */}
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
              <span>স্টোর সেটিংস সফলভাবে সেভ হয়েছে এবং সব জায়গায় আপডেট হয়েছে!</span>
            </div>
          ) : (
            <span className="text-xs text-stone-500">এখানে যেকোনো পরিবর্তন সেভ করলে পুরো ওয়েবসাইটে সাথে সাথে আপডেট হয়ে যাবে।</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold tracking-wide transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings (সেভ করুন)</span>
          </button>
        </div>
      </form>

      {/* Admin Password Change Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">এডমিন পাসওয়ার্ড পরিবর্তন (Change Admin Password)</h3>
            <p className="text-xs text-stone-500">
              আপনার ইচ্ছেমতো যেকোনো সময় এডমিন প্যানেলের পাসওয়ার্ড পরিবর্তন করতে পারেন
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                বর্তমান পাসওয়ার্ড (Current Password)
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                নতুন পাসওয়ার্ড (New Password)
              </label>
              <input
                type={showPwd ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm)
              </label>
              <input
                type={showPwd ? 'text' : 'password'}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="পুনরায় নতুন পাসওয়ার্ড"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPwd ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>পাসওয়ার্ড পরিবর্তন করুন</span>
            </button>
          </div>

          {pwdError && (
            <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! পরবর্তী লগইনে এই নতুন পাসওয়ার্ড ব্যবহার করুন।</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
