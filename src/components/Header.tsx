import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import brandLogo from '../assets/logo';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-50 bg-[#111111] text-white px-[7%] py-4 transition-all duration-300 shadow-md"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo matching user template with new circular brand emblem */}
        <a
          href="#"
          id="header-logo"
          className="flex items-center gap-3 select-none group"
        >
          <img
            src={brandLogo}
            alt="SR Fashion Logo"
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#e8b04b] shadow-xs group-hover:scale-105 transition-transform duration-200"
          />
          <span className="text-2xl sm:text-[28px] font-bold tracking-wider leading-none">
            SR <span className="text-[#e8b04b]">Fashion</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
          <a
            href="#"
            className="text-sm font-medium text-white hover:text-[#e8b04b] transition-colors duration-200"
          >
            Home
          </a>
          <button
            onClick={() => scrollToSection('shop')}
            className="text-sm font-medium text-white hover:text-[#e8b04b] transition-colors duration-200 cursor-pointer"
          >
            Shop
          </button>
          <button
            onClick={() => scrollToSection('categories')}
            className="text-sm font-medium text-white hover:text-[#e8b04b] transition-colors duration-200 cursor-pointer"
          >
            Categories
          </button>
          <button
            onClick={() => scrollToSection('offers')}
            className="text-sm font-medium text-white hover:text-[#e8b04b] transition-colors duration-200 cursor-pointer"
          >
            Offers
          </button>
          <button
            onClick={() => scrollToSection('newsletter')}
            className="text-sm font-medium text-white hover:text-[#e8b04b] transition-colors duration-200 cursor-pointer"
          >
            Newsletter
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-sm font-medium text-white hover:text-[#e8b04b] transition-colors duration-200 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-4 text-xl" id="header-action-icons">
          <button
            id="search-button"
            onClick={onOpenSearch}
            className="p-2 text-gray-300 hover:text-[#e8b04b] transition-colors rounded-full hover:bg-white/10"
            title="Search products"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            id="wishlist-button"
            onClick={onOpenWishlist}
            className="relative p-2 text-gray-300 hover:text-[#e8b04b] transition-colors rounded-full hover:bg-white/10"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-black bg-[#e8b04b] rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            id="cart-button"
            onClick={onOpenCart}
            className="relative p-2 text-gray-300 hover:text-[#e8b04b] transition-colors rounded-full hover:bg-white/10 flex items-center"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-black bg-[#e8b04b] rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Panel Entry Button */}
          <button
            id="admin-panel-button"
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-stone-950 border border-amber-500/30 hover:border-amber-500 transition-all text-xs font-bold tracking-wide"
            title="Open Admin Portal"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-[#e8b04b] md:hidden rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden mt-3 pt-3 pb-4 border-t border-gray-800 bg-[#111111] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-3 px-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left px-3 py-2.5 text-sm font-bold bg-amber-500 text-stone-950 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Management Panel</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-white hover:text-[#e8b04b] rounded-md hover:bg-white/5"
            >
              Home
            </a>
            <button
              onClick={() => scrollToSection('shop')}
              className="text-left px-3 py-2 text-base font-medium text-white hover:text-[#e8b04b] rounded-md hover:bg-white/5"
            >
              Shop All Products
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="text-left px-3 py-2 text-base font-medium text-white hover:text-[#e8b04b] rounded-md hover:bg-white/5"
            >
              Categories
            </button>
            <button
              onClick={() => scrollToSection('offers')}
              className="text-left px-3 py-2 text-base font-medium text-white hover:text-[#e8b04b] rounded-md hover:bg-white/5 flex items-center justify-between"
            >
              <span>Special Offers</span>
              <span className="bg-[#e8b04b] text-black text-xs font-bold px-2 py-0.5 rounded">
                Sale 50%
              </span>
            </button>
            <button
              onClick={() => scrollToSection('newsletter')}
              className="text-left px-3 py-2 text-base font-medium text-white hover:text-[#e8b04b] rounded-md hover:bg-white/5"
            >
              Newsletter
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left px-3 py-2 text-base font-medium text-white hover:text-[#e8b04b] rounded-md hover:bg-white/5"
            >
              Customer Care & Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
