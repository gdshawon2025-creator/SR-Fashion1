import React, { useState, useEffect } from 'react';
import { Clock, Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface OfferSectionProps {
  onShopOffer: () => void;
  onApplyCouponCode?: (code: string) => void;
}

export const OfferSection: React.FC<OfferSectionProps> = ({ onShopOffer, onApplyCouponCode }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SR20');
    setCopied(true);
    if (onApplyCouponCode) {
      onApplyCouponCode('SR20');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <section id="offers" className="offer bg-[#111111] text-white py-[70px] px-[7%] text-center relative overflow-hidden">
      {/* Subtle decorative glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#e8b04b]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8b04b]/20 border border-[#e8b04b]/40 text-[#e8b04b] text-xs font-bold tracking-widest uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SPECIAL PROMOTIONAL EVENT</span>
        </div>

        <h2 className="text-[32px] sm:text-[42px] font-bold text-white mb-[15px] leading-tight">
          Mid-Season Clearance Sale <br className="hidden sm:block" />
          <span className="text-[#e8b04b]">Up to 50% Off</span>
        </h2>

        <p className="text-[#dddddd] text-base sm:text-lg mb-[30px] max-w-2xl mx-auto leading-relaxed">
          Revamp your wardrobe with luxury cuts, handcrafted leather, and timeless outerwear. Limited stock available across our premium 2026 fashion line.
        </p>

        {/* Live Countdown Timer */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-black text-white border border-white/10 shadow-inner">
              {formatNum(timeLeft.hours)}
            </div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 mt-2 font-semibold">
              Hours
            </span>
          </div>

          <span className="text-2xl font-bold text-[#e8b04b] -mt-5">:</span>

          <div className="flex flex-col items-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-black text-white border border-white/10 shadow-inner">
              {formatNum(timeLeft.minutes)}
            </div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 mt-2 font-semibold">
              Minutes
            </span>
          </div>

          <span className="text-2xl font-bold text-[#e8b04b] -mt-5">:</span>

          <div className="flex flex-col items-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-black text-[#e8b04b] border border-[#e8b04b]/30 shadow-inner">
              {formatNum(timeLeft.seconds)}
            </div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 mt-2 font-semibold">
              Seconds
            </span>
          </div>
        </div>

        {/* Coupon Code Pill */}
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/15 px-5 py-2.5 rounded-full mb-8 backdrop-blur-xs">
          <Tag className="w-4 h-4 text-[#e8b04b]" />
          <span className="text-xs text-gray-300">Use promo code:</span>
          <span className="font-mono font-bold text-[#e8b04b] text-base tracking-wider">SR20</span>
          <button
            onClick={handleCopyCode}
            id="copy-coupon-btn"
            className="ml-2 text-xs font-semibold bg-white/20 hover:bg-[#e8b04b] hover:text-black text-white px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>

        <div>
          <button
            id="offer-shop-cta"
            onClick={onShopOffer}
            className="btn inline-flex items-center gap-2 bg-[#e8b04b] text-[#111111] px-[32px] py-[15px] font-bold rounded-[3px] transition-all duration-300 hover:bg-white hover:text-black cursor-pointer shadow-xl active:scale-95 text-base"
          >
            <span>CLAIM OFFER NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
