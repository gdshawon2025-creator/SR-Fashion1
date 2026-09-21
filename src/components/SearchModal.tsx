import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/fashionData';
import { Search, X, Star, ArrowRight, ShoppingBag, Zap } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectBuy?: (product: Product) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  onDirectBuy,
  products = PRODUCTS,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const popularTags = ['Trench Coat', 'Blazer', 'Boots', 'Watch', 'Dress', 'Sweater'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 animate-in slide-in-from-top-4 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clothes, shoes, bags, accessories..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular searches suggestions */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 font-medium">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-[#e8b04b] hover:text-black transition-colors whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              Type keywords above to explore our 2026 fashion catalog.
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-gray-800">No items match "{query}"</p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching for general terms like "coat", "boots", or "bag"
              </p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded bg-gray-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#e8b04b]">
                      {product.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#e8b04b] transition-colors truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onDirectBuy) {
                        onDirectBuy(product);
                      } else {
                        onAddToCart(product);
                        onClose();
                      }
                    }}
                    className="px-2.5 py-1.5 bg-[#e8b04b] hover:bg-[#d69d38] text-stone-950 text-xs font-bold rounded transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Zap className="w-3 h-3 fill-stone-950" />
                    <span>অর্ডার করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>কার্ট</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
