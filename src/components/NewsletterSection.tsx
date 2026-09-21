import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface NewsletterSectionProps {
  onSubscribe?: (email: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setSubscribed(true);
    if (onSubscribe) {
      onSubscribe(email);
    }
  };

  return (
    <section id="newsletter" className="newsletter text-center py-[70px] px-[7%] bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-[#f8f8f8] flex items-center justify-center mx-auto mb-4 text-[#111111]">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-[28px] sm:text-[32px] font-bold text-[#222222] mb-[10px]">
          Subscribe to Our Newsletter
        </h2>

        <p className="text-[#777777] text-sm sm:text-base mb-[25px]">
          Get 15% off your first order plus early access to new collections, lookbooks, and VIP fashion events.
        </p>

        {subscribed ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-md inline-flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-left">
              <p className="font-bold text-sm">Welcome to the SR Fashion Club!</p>
              <p className="text-xs text-emerald-700">Check your inbox ({email}) for your 15% welcome code.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-lg mx-auto">
            <input
              type="email"
              id="newsletter-email-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email address..."
              required
              className="w-full sm:w-[350px] p-[14px] border border-[#dddddd] outline-none text-sm text-[#222222] focus:border-[#e8b04b] focus:ring-1 focus:ring-[#e8b04b] transition-all rounded-[3px] bg-[#fdfdfd]"
            />
            <button
              type="submit"
              id="newsletter-submit-btn"
              className="w-full sm:w-auto px-[25px] py-[14px] border-none bg-[#111111] text-white cursor-pointer font-bold text-sm tracking-wide hover:bg-[#e8b04b] hover:text-[#111111] transition-all duration-300 rounded-[3px] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <p className="text-[11px] text-gray-400 mt-4">
          By signing up you agree to our Terms of Service and Privacy Policy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};
