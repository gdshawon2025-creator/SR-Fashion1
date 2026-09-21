import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { getAdminPassword, setAdminAuthStatus } from '../../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentStoredPassword = getAdminPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('দয়া করে পাসওয়ার্ড লিখুন');
      return;
    }

    if (password === currentStoredPassword) {
      setError('');
      setAdminAuthStatus(true);
      onLoginSuccess();
      setPassword('');
    } else {
      setError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#e8b04b] flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">এডমিন প্যানেল লগইন</h3>
              <p className="text-[11px] text-stone-400">SR Fashion ম্যানেজমেন্ট পোর্টাল</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>এডমিন পাসওয়ার্ড দিন (Admin Password)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="পাসওয়ার্ড লিখুন..."
                className={`w-full pl-4 pr-11 py-2.5 text-sm rounded-xl border transition-all outline-none ${
                  error
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-medium mt-1.5 animate-in fade-in">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Helpful Hint */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <span>💡 ডিফল্ট পাসওয়ার্ড:</span>
              <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono font-bold text-stone-900">
                123456
              </code>
            </p>
            <p className="text-stone-600 leading-normal">
              লগইন করার পর এডমিন প্যানেলের <strong>Settings</strong> অপশন থেকে আপনি আপনার ইচ্ছেমতো যেকোনো নতুন পাসওয়ার্ড পরিবর্তন করে সেট করতে পারবেন।
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-[#e8b04b] hover:text-stone-950 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
