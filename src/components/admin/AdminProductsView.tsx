import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Filter, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  Check, 
  Star 
} from 'lucide-react';
import { Product } from '../../types';

interface AdminProductsViewProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleSale: (productId: string) => void;
}

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({
  products,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleSale,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [saleFilter, setSaleFilter] = useState<'all' | 'sale' | 'regular'>('all');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesSale =
      saleFilter === 'all' ||
      (saleFilter === 'sale' && product.isSale) ||
      (saleFilter === 'regular' && !product.isSale);

    return matchesQuery && matchesCategory && matchesSale;
  });

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Category Filter, and Add Button */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">All Categories ({products.length})</option>
            <option value="women">Women's Collection</option>
            <option value="men">Men's Apparel</option>
            <option value="accessories">Luxury Accessories</option>
            <option value="shoes">Footwear & Bags</option>
          </select>

          {/* Sale Filter */}
          <select
            value={saleFilter}
            onChange={(e) => setSaleFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">All Pricing</option>
            <option value="sale">On Sale Only</option>
            <option value="regular">Regular Price</option>
          </select>

          {/* Add Product Button */}
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-stone-900">Delete Product?</h3>
              <p className="text-xs text-stone-500 mt-1">
                This item will be permanently removed from your active store catalog.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Sale Status</th>
                <th className="px-5 py-3.5">Sizes & Colors</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-stone-400">
                    <p className="text-sm font-semibold text-stone-700">বর্তমানে কোনো প্রোডাক্ট নেই</p>
                    <p className="text-xs text-stone-500 mt-1 mb-4">
                      {products.length === 0
                        ? 'আপনার স্টোরের ডিফল্ট প্রোডাক্টগুলো রিমুভ করা হয়েছে। নতুন কালেকশন যুক্ত করতে নিচের বাটনে ক্লিক করুন।'
                        : 'সার্চ বা ফিল্টারের সাথে কোনো প্রোডাক্ট মেলেনি।'}
                    </p>
                    {products.length === 0 ? (
                      <button
                        onClick={onOpenAddProduct}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Product</span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Product image & name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-sm hover:text-amber-700 cursor-pointer" onClick={() => onEditProduct(product)}>
                            {product.name}
                          </div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                            <span>ID: {product.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span className="capitalize px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-stone-900 text-sm">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.oldPrice && (
                        <div className="text-[11px] text-stone-400 line-through">
                          ${product.oldPrice.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Sale Status Toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onToggleSale(product.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          product.isSale
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                        title="Click to toggle sale status"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{product.isSale ? (product.saleTag || 'On Sale') : 'Regular'}</span>
                      </button>
                    </td>

                    {/* Sizes & Colors count */}
                    <td className="px-5 py-3.5">
                      <div className="text-xs text-stone-600 font-medium">
                        {product.sizes?.join(', ') || 'Standard'}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {product.colors?.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-stone-300 inline-block"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                        {(product.colors?.length || 0) > 3 && (
                          <span className="text-[10px] text-stone-400">
                            +{(product.colors?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-amber-50 hover:border-amber-300 text-stone-600 hover:text-amber-800 transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product.id)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 hover:border-rose-300 text-stone-600 hover:text-rose-700 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Stats */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>Tip: Click product title or edit icon to change prices, sizes, or image</span>
        </div>
      </div>
    </div>
  );
};
