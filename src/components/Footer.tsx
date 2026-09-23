import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, ShieldCheck } from 'lucide-react';
import brandLogo from '../assets/logo';

interface FooterProps {
  onCategoryClick?: (cat: string) => void;
  onOpenAdmin?: () => void;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  onCategoryClick, 
  onOpenAdmin,
  storeAddress = 'Keshobpur, Jessore, Bangladesh',
  storePhone = '01352113432',
  storeEmail = 'gdyounus2025@gmail.com',
}) => {
  return (
    <footer id="contact" className="bg-[#111111] text-white pt-[50px] px-[7%] pb-[20px]">
      <div className="max-w-7xl mx-auto">
        {/* Footer grid matching user spec: 2fr 1fr 1fr 1fr */}
        <div className="footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-[40px] mb-[40px]">
          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={brandLogo}
                alt="SR Fashion Logo"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#e8b04b] shadow-xs"
              />
              <div className="text-[28px] font-bold tracking-wider leading-none">
                SR <span className="text-[#e8b04b]">Fashion</span>
              </div>
            </div>
            <p className="text-[#aaaaaa] leading-[1.7] text-sm mb-6 max-w-sm">
              SR Fashion brings you haute couture designs and premium everyday essentials. Designed with meticulous craftsmanship, contemporary cuts, and timeless sustainability.
            </p>

            <div className="space-y-2.5 text-xs text-[#aaaaaa]">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#e8b04b] shrink-0" />
                <span>{storeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e8b04b] shrink-0" />
                <a href={`tel:${storePhone}`} className="hover:text-[#e8b04b] transition-colors">
                  {storePhone} (Helpline & WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e8b04b] shrink-0" />
                <a href={`mailto:${storeEmail}`} className="hover:text-[#e8b04b] transition-colors">
                  {storeEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e8b04b] hover:text-black flex items-center justify-center text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e8b04b] hover:text-black flex items-center justify-center text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e8b04b] hover:text-black flex items-center justify-center text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e8b04b] hover:text-black flex items-center justify-center text-gray-300 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-[18px] tracking-wide">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="#" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Home
              </a>
              <a href="#shop" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Shop Collection
              </a>
              <a href="#categories" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Featured Categories
              </a>
              <a href="#offers" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Special Deals & Offers
              </a>
              <a href="#newsletter" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                VIP Club & Rewards
              </a>
            </div>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-base font-bold text-white mb-[18px] tracking-wide">
              Shop Categories
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <button
                onClick={() => onCategoryClick && onCategoryClick('women')}
                className="text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
              >
                Women's Collection
              </button>
              <button
                onClick={() => onCategoryClick && onCategoryClick('men')}
                className="text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
              >
                Men's Apparel
              </button>
              <button
                onClick={() => onCategoryClick && onCategoryClick('accessories')}
                className="text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
              >
                Luxury Accessories
              </button>
              <button
                onClick={() => onCategoryClick && onCategoryClick('shoes')}
                className="text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
              >
                Footwear & Handbags
              </button>
              <button
                onClick={() => onCategoryClick && onCategoryClick('all')}
                className="text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
              >
                New Arrivals 2026
              </button>
            </div>
          </div>

          {/* Column 4: Customer Care */}
          <div>
            <h3 className="text-base font-bold text-white mb-[18px] tracking-wide">
              Customer Support
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="#track" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Track Your Order
              </a>
              <a href="#shipping" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Shipping & Handling
              </a>
              <a href="#returns" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                30-Day Returns Policy
              </a>
              <a href="#size-guide" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Size & Fit Guide
              </a>
              <a href="#privacy" className="text-[#aaaaaa] hover:text-[#e8b04b] transition-colors">
                Privacy & Security
              </a>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-left text-[#e8b04b] hover:underline transition-colors flex items-center gap-1.5 pt-1 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Merchant Admin Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copyright matching user spec */}
        <div className="copyright border-t border-[#333333] pt-[20px] text-center text-[#888888] text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SR Fashion Store. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Powered by SR Fashion Engine</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e8b04b]" />
              Secure 256-Bit SSL Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
