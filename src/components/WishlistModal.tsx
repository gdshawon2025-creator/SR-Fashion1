import React from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/fashionData';
import { X, Heart, Trash2, ShoppingBag, ArrowRight, Zap } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onDirectBuy?: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  onRemoveFromWishlist,
  onAddToCart,
  onDirectBuy,
  onSelectProduct,
  products = PRODUCTS,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#111111] text-white">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#e8b04b] fill-current" />
              <h2 className="text-lg font-bold">Saved Wishlist</h2>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-semibold">
                {wishlistedProducts.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Save items you love by clicking the heart icon on any product card.
                </p>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 items-center justify-between"
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
                      className="w-16 h-20 object-cover rounded bg-gray-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">
                        ${product.price.toFixed(2)}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        In Stock
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 items-end">
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (onDirectBuy) {
                            onDirectBuy(product);
                            onClose();
                          } else {
                            onAddToCart(product);
                          }
                        }}
                        className="px-2.5 py-1 bg-[#e8b04b] hover:bg-[#d69d38] text-stone-950 text-[11px] font-bold rounded transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Zap className="w-3 h-3 fill-stone-950" />
                        <span>অর্ডার</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="px-2 py-1 bg-stone-800 text-white text-[11px] font-medium rounded hover:bg-black transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>কার্ট</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => onAddToCart(p));
                  onClose();
                }}
                className="w-full py-3 bg-[#111111] text-white text-xs font-bold tracking-wider rounded hover:bg-[#e8b04b] hover:text-black transition-colors"
              >
                MOVE ALL TO BAG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
