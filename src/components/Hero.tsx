import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <div id="hero-wrapper" className="relative">
      {/* Primary Hero Section matching user specification */}
      <section
        id="hero-banner"
        className="hero min-h-[580px] flex items-center px-[7%] py-[60px] text-white relative"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-content max-w-[600px] z-10">
          <p className="text-[#e8b04b] text-[18px] font-bold mb-[15px] tracking-wide uppercase">
            NEW COLLECTION 2026
          </p>

          <h1 className="text-[42px] sm:text-[52px] md:text-[60px] leading-[1.1] font-bold mb-[20px] text-white">
            Define Your <span className="text-[#e8b04b]">Style</span>
          </h1>

          <p className="description text-[#eeeeee] text-base sm:text-lg leading-[1.7] mb-[30px] font-normal max-w-xl">
            Discover the latest fashion trends with SR Fashion. Quality products, modern designs, and affordable prices tailored for your everyday elegance.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              id="hero-shop-btn"
              onClick={onShopClick}
              className="btn inline-flex items-center gap-2 bg-[#e8b04b] text-[#111111] px-[30px] py-[14px] font-bold rounded-[3px] transition-all duration-300 hover:bg-white hover:text-black cursor-pointer shadow-lg active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#categories"
              className="inline-flex items-center px-[24px] py-[14px] font-semibold text-white border border-white/40 hover:border-white hover:bg-white/10 rounded-[3px] transition-all duration-300 text-sm"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </section>

      {/* Value Badges strip below Hero */}
      <div
        id="value-props-strip"
        className="bg-white border-b border-gray-200 px-[7%] py-6 shadow-sm"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#e8b04b]">
              <Truck className="w-5 h-5 text-[#111]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Free Express Delivery</h4>
              <p className="text-xs text-gray-500">On all orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#e8b04b]">
              <RotateCcw className="w-5 h-5 text-[#111]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">30-Day Easy Returns</h4>
              <p className="text-xs text-gray-500">Hassle-free exchange policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#e8b04b]">
              <ShieldCheck className="w-5 h-5 text-[#111]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Secure Payments</h4>
              <p className="text-xs text-gray-500">256-bit SSL encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#f8f8f8] flex items-center justify-center text-[#e8b04b]">
              <Award className="w-5 h-5 text-[#111]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Premium Quality</h4>
              <p className="text-xs text-gray-500">Handpicked materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
