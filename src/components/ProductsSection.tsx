import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/fashionData';
import { Star, Heart, Eye, ShoppingBag, SlidersHorizontal, Check, Zap } from 'lucide-react';

interface ProductsSectionProps {
  products?: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onDirectBuy?: (product: Product, size?: string, color?: string) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenAdmin?: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products = PRODUCTS,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onDirectBuy,
  onQuickView,
  wishlist,
  onToggleWishlist,
  onOpenAdmin,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'low' | 'high' | 'rating'>('featured');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const filterTabs = [
    { id: 'all', label: 'All Products' },
    { id: 'women', label: "Women's" },
    { id: 'men', label: "Men's" },
    { id: 'accessories', label: 'Accessories' },
    { id: 'shoes', label: 'Footwear & Bags' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, sortBy]);

  const handleAddWithFeedback = (product: Product) => {
    onAddToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section id="shop" className="section py-[70px] px-[7%] bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section title matching user spec */}
        <div className="section-title text-center mb-[40px]">
          <h2 className="text-[28px] sm:text-[35px] font-bold text-[#222222] mb-[10px]">
            Featured Collection
          </h2>
          <p className="text-[#777777] text-sm sm:text-base max-w-lg mx-auto">
            Discover our most coveted seasonal essentials, tailored with precision and premium craftsmanship.
          </p>
        </div>

        {/* Filter Bar & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-filter-${tab.id}`}
                  onClick={() => onSelectCategory(tab.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#111111] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-sm text-gray-600">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Sort By:</span>
            <select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products by"
              className="bg-transparent border border-gray-200 rounded px-2.5 py-1.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#e8b04b] cursor-pointer"
            >
              <option value="featured">Featured & Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid matching user CSS: .products, .product, .product-img, .sale, .product-info, etc. */}
        <div className="products grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px]">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isAdded = !!addedIds[product.id];

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="product group bg-white rounded-[6px] overflow-hidden shadow-[0_3px_15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-[5px] flex flex-col justify-between"
              >
                <div>
                  {/* Image container with user styling .product-img */}
                  <div className="product-img relative h-[300px] overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      loading="lazy"
                    />

                    {/* Sale Badge matching user spec */}
                    {product.isSale && (
                      <span className="sale absolute top-[12px] left-[12px] bg-[#111111] text-white px-[10px] py-[6px] text-[12px] font-bold tracking-wider rounded-[2px] z-10">
                        {product.saleTag || 'SALE'}
                      </span>
                    )}

                    {/* Wishlist Heart on top right */}
                    <button
                      id={`wishlist-toggle-${product.id}`}
                      onClick={() => onToggleWishlist(product.id)}
                      className={`absolute top-[12px] right-[12px] w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                        isWishlisted
                          ? 'bg-red-50 text-red-500 shadow-sm'
                          : 'bg-white/80 backdrop-blur-xs text-gray-700 hover:text-red-500 hover:bg-white'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick View Hover Button */}
                    <button
                      id={`quick-view-${product.id}`}
                      onClick={() => onQuickView(product)}
                      className="absolute inset-x-4 bottom-4 py-2.5 bg-white/95 text-[#111111] text-xs font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 hover:bg-[#e8b04b] hover:text-black cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>QUICK VIEW</span>
                    </button>
                  </div>

                  {/* Product Info container matching user spec */}
                  <div className="product-info p-[18px]">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
                      {product.category}
                    </span>

                    <h3
                      className="text-[16px] font-bold text-[#222222] mb-[8px] line-clamp-1 hover:text-[#e8b04b] transition-colors cursor-pointer"
                      onClick={() => onQuickView(product)}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Rating stars matching user spec (#e8b04b) */}
                    <div className="rating flex items-center gap-1 text-[#e8b04b] mb-[10px]">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-[#e8b04b] text-[#e8b04b]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium ml-1">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>

                    {/* Price & Old Price matching user spec */}
                    <div className="price text-[18px] font-bold text-[#222222] mb-[15px] flex items-center">
                      <span>${product.price.toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="old-price text-[#999999] line-through text-[14px] font-normal ml-[8px]">
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-[18px] pb-[18px] space-y-2">
                  <button
                    id={`buy-now-${product.id}`}
                    type="button"
                    onClick={() => {
                      if (onDirectBuy) {
                        onDirectBuy(product);
                      } else {
                        handleAddWithFeedback(product);
                      }
                    }}
                    className="w-full py-2.5 px-3 bg-[#e8b04b] hover:bg-[#d69d38] text-stone-950 font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 fill-stone-950" />
                    <span>সরাসরি অর্ডার করুন (Buy Now)</span>
                  </button>

                  <button
                    id={`add-to-cart-${product.id}`}
                    type="button"
                    onClick={() => handleAddWithFeedback(product)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border ${
                      isAdded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ব্যাগে যুক্ত হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-stone-300" />
                        <span>কার্ট-এ রাখুন (Add to Bag)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {products.length === 0 ? 'বর্তমানে কোনো প্রোডাক্ট নেই' : 'এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি'}
            </h3>
            <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
              {products.length === 0
                ? 'ডিফল্ট সকল প্রোডাক্ট রিমুভ করা হয়েছে। আপনি অ্যাডমিন প্যানেল থেকে আপনার নিজস্ব প্রোডাক্ট যুক্ত করতে পারেন।'
                : 'অন্য কোনো ক্যাটাগরি সিলেক্ট করুন অথবা অ্যাডমিন প্যানেলে নতুন প্রোডাক্ট যুক্ত করুন।'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {products.length > 0 && selectedCategory !== 'all' && (
                <button
                  onClick={() => onSelectCategory('all')}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  সব প্রোডাক্ট দেখুন
                </button>
              )}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-5 py-2.5 bg-[#111111] hover:bg-[#e8b04b] text-white hover:text-black text-sm font-bold rounded-lg transition-colors shadow-md cursor-pointer"
                >
                  + প্রোডাক্ট যুক্ত করুন (Admin Panel)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
