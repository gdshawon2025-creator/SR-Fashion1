import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import brandLogo from '../../assets/logo';
import { verifyPassword, setAdminLoggedIn, DEFAULT_ADMIN_PASSWORD } from '../../utils/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentPassword?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentPassword,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('অনুগ্রহ করে এডমিন পাসওয়ার্ড লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const isValid = verifyPassword(password) || (currentPassword && password === currentPassword);
      if (isValid) {
        setAdminLoggedIn(rememberMe);
        setPassword('');
        setError('');
        setIsSubmitting(false);
        onLoginSuccess();
      } else {
        setIsSubmitting(false);
        setError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header gradient banner */}
        <div className="bg-stone-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={brandLogo}
                alt="SR Fashion"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 text-stone-950 shadow-xs">
                <Lock className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold tracking-tight text-white">SR Fashion Admin</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Protected
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">এডমিন প্যানেলে প্রবেশ করতে পাসওয়ার্ড দিন</p>
            </div>
          </div>
        </div>

        {/* Content & Form */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                এডমিন পাসওয়ার্ড (Admin Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  autoFocus
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium text-stone-900 bg-stone-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 focus:outline-none"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me toggle */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 hover:text-stone-900">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <span>এই ডিভাইসে মনে রাখুন (Remember me)</span>
              </label>
            </div>

            {/* Hint Box */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-semibold">প্রাথমিক ডিফল্ট পাসওয়ার্ড: </span>
                <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">admin123</code>
                <p className="text-amber-800/80 text-[10px] mt-0.5">
                  লগইন করার পর Settings মেনু থেকে আপনি যেকোনো সময় পাসওয়ার্ড পরিবর্তন করতে পারবেন।
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold tracking-wide transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 px-4 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>যাচাই করা হচ্ছে...</span>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
