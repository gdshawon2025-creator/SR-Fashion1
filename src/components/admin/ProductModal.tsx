import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Camera,
  RefreshCw,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
import { Product, ProductColor } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Standard'];

const POPULAR_COLORS: ProductColor[] = [
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Midnight Black', hex: '#111111' },
  { name: 'Camel Tan', hex: '#c19a6b' },
  { name: 'Navy Blue', hex: '#1d2a44' },
  { name: 'Sage Green', hex: '#8a9a86' },
  { name: 'Burgundy', hex: '#6b1d2f' },
  { name: 'Charcoal', hex: '#333333' },
  { name: 'Champagne', hex: '#f0e6d2' }
];

// Helper to optimize and convert user uploaded files to standard lightweight Data URL
function optimizeImageFile(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'women' | 'men' | 'accessories' | 'shoes'>('women');
  const [price, setPrice] = useState<string>('');
  const [oldPrice, setOldPrice] = useState<string>('');
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isSale, setIsSale] = useState(false);
  const [saleTag, setSaleTag] = useState('-20%');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([
    { name: 'Midnight Black', hex: '#111111' },
    { name: 'Camel Tan', hex: '#c19a6b' }
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#bfa15f');
  const [errorMessage, setErrorMessage] = useState('');

  // Image upload modes and states
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price.toString());
      setOldPrice(productToEdit.oldPrice ? productToEdit.oldPrice.toString() : '');
      setImage(productToEdit.image);
      setGallery(productToEdit.gallery || []);
      setDescription(productToEdit.description);
      setIsSale(!!productToEdit.isSale);
      setSaleTag(productToEdit.saleTag || '-20%');
      setSelectedSizes(productToEdit.sizes || ['S', 'M']);
      setSelectedColors(productToEdit.colors || [{ name: 'Midnight Black', hex: '#111111' }]);
    } else {
      setName('');
      setCategory('women');
      setPrice('');
      setOldPrice('');
      setImage('');
      setGallery([]);
      setDescription('');
      setIsSale(false);
      setSaleTag('-20%');
      setSelectedSizes(['S', 'M', 'L']);
      setSelectedColors([
        { name: 'Midnight Black', hex: '#111111' },
        { name: 'Camel Tan', hex: '#c19a6b' }
      ]);
    }
    setErrorMessage('');
    setImageSourceMode('upload');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleMainFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsProcessingImage(true);
    setErrorMessage('');

    try {
      const dataUrl = await optimizeImageFile(file);
      setImage(dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleGalleryFilesSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    setErrorMessage('');

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await optimizeImageFile(file);
        newUrls.push(dataUrl);
      }
      setGallery((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || 'গ্যালারির ছবি আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleMainFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleToggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSizeInput.trim().toUpperCase();
    if (clean && !selectedSizes.includes(clean)) {
      setSelectedSizes([...selectedSizes, clean]);
      setCustomSizeInput('');
    }
  };

  const handleAddColor = () => {
    if (customColorName.trim()) {
      const exists = selectedColors.some(
        (c) => c.name.toLowerCase() === customColorName.trim().toLowerCase()
      );
      if (!exists) {
        setSelectedColors([...selectedColors, { name: customColorName.trim(), hex: customColorHex }]);
        setCustomColorName('');
      }
    }
  };

  const handleRemoveColor = (nameToRemove: string) => {
    if (selectedColors.length > 1) {
      setSelectedColors(selectedColors.filter((c) => c.name !== nameToRemove));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('প্রোডাক্টের নাম লিখুন (Product name is required).');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMessage('একটি সঠিক বিক্রয়মূল্য প্রদান করুন (Valid price > 0 required).');
      return;
    }

    if (!image.trim()) {
      setErrorMessage('দয়া করে প্রোডাক্টের একটি মূল ছবি আপলোড করুন অথবা ছবির লিঙ্ক দিন (Product image is required).');
      return;
    }

    const numOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;

    const fullGallery = [image.trim(), ...gallery.filter((g) => g && g !== image.trim())];

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `sr-${Date.now()}`,
      name: name.trim(),
      category,
      price: numPrice,
      oldPrice: numOldPrice && numOldPrice > numPrice ? numOldPrice : undefined,
      rating: productToEdit?.rating || 5.0,
      reviewsCount: productToEdit?.reviewsCount || 1,
      image: image.trim(),
      gallery: fullGallery,
      isSale: isSale,
      saleTag: isSale ? saleTag : undefined,
      description:
        description.trim() ||
        `${name} - প্রিমিয়াম কোয়ালিটি ফেব্রিক ও আকর্ষণীয় ডিজাইনে তৈরি। সরাসরি অর্ডার করুন।`,
      sizes: selectedSizes,
      colors: selectedColors,
      inStock: true,
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {productToEdit ? 'প্রোডাক্ট এডিট করুন (Edit Product)' : 'নতুন প্রোডাক্ট যুক্ত করুন (Add New Product)'}
            </h2>
            <p className="text-xs text-stone-500">
              {productToEdit
                ? `প্রোডাক্ট #${productToEdit.id} আপডেট করা হচ্ছে`
                : 'আপনার স্টোরে নতুন পণ্য লাইভ করতে তথ্য ও ছবি প্রদান করুন'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Product Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                প্রোডাক্টের নাম (Product Title) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: প্রিমিয়াম সিল্ক থ্রি-পিস বা শার্ট"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                ক্যাটাগরি (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                <option value="women">Women's Collection (মহিলাদের কালেকশন)</option>
                <option value="men">Men's Apparel (পুরুষদের পোশাক)</option>
                <option value="accessories">Luxury Accessories (এক্সেসরিজ)</option>
                <option value="shoes">Footwear & Bags (জুতো ও ব্যাগ)</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                বিক্রয়মূল্য Selling Price ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="45.00"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                পূর্বের দাম Regular Price ($) (ঐচ্ছিক)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="65.00"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Sale Promotion Toggle */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSale}
                onChange={(e) => setIsSale(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <div>
                <span className="text-xs font-bold text-stone-800">অফার বা সেল ব্যাজ দিন (Sale Item)</span>
                <p className="text-[11px] text-stone-500">পণ্যের ওপর ডিসকাউন্ট ব্যাজ ও কাটা দাম প্রদর্শিত হবে</p>
              </div>
            </label>

            {isSale && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">ব্যাজ:</span>
                <input
                  type="text"
                  value={saleTag}
                  onChange={(e) => setSaleTag(e.target.value)}
                  placeholder="-20% বা HOT"
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-amber-700 bg-white"
                />
              </div>
            )}
          </div>

          {/* DIRECT IMAGE UPLOAD SECTION */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>প্রোডাক্টের ছবি যুক্ত করুন (Product Photos) *</span>
              </label>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setImageSourceMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    imageSourceMode === 'upload'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>সরাসরি আপলোড</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    imageSourceMode === 'url'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>ছবির লিঙ্ক</span>
                </button>
              </div>
            </div>

            {/* Hidden Input for Device File Picker */}
            <input
              ref={mainFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleMainFileSelect(e.target.files)}
            />

            <input
              ref={galleryFileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleGalleryFilesSelect(e.target.files)}
            />

            {/* Option A: Direct Device Upload Box */}
            {imageSourceMode === 'upload' && (
              <div>
                {!image ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => mainFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-amber-500 bg-amber-50/80 scale-[0.99]'
                        : 'border-stone-300 hover:border-amber-500 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-stone-900">
                        {isProcessingImage
                          ? 'ছবি প্রসেস হচ্ছে...'
                          : 'সরাসরি ছবি আপলোড করতে এখানে ক্লিক করুন'}
                      </p>
                      <p className="text-xs text-stone-500">
                        ফোন বা কম্পিউটারের গ্যালারি / ফাইল থেকে ছবি নির্বাচন করুন অথবা ড্র্যাগ করুন
                      </p>
                      <p className="text-[11px] text-stone-400 font-medium">
                        JPG, PNG, WebP (অটোমেটিক অপ্টিমাইজড হবে)
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Main Image Preview */
                  <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-300 bg-stone-100 shrink-0 relative group">
                      <img
                        src={image}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>মূল ছবি সফলভাবে যুক্ত হয়েছে</span>
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        প্রোডাক্ট কার্ড এবং ক্যাটালগে এই ছবিটি প্রদর্শিত হবে।
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => mainFileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>ছবি পরিবর্তন করুন</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>মুছে ফেলুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Option B: Image URL Input Box */}
            {imageSourceMode === 'url' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                  />
                  {image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-stone-100">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-700">টেমপ্লেট স্যাম্পল:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImage(
                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-amber-700 hover:underline cursor-pointer"
                  >
                    Dress
                  </button>
                  •
                  <button
                    type="button"
                    onClick={() =>
                      setImage(
                        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-amber-700 hover:underline cursor-pointer"
                  >
                    Suit
                  </button>
                  •
                  <button
                    type="button"
                    onClick={() =>
                      setImage(
                        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-amber-700 hover:underline cursor-pointer"
                  >
                    Bag
                  </button>
                  •
                  <button
                    type="button"
                    onClick={() =>
                      setImage(
                        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-amber-700 hover:underline cursor-pointer"
                  >
                    Shoes
                  </button>
                </div>
              </div>
            )}

            {/* Additional Gallery Photos */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700">
                  অতিরিক্ত ছবি / গ্যালারি ({gallery.length})
                </span>
                <button
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ আরো ছবি যোগ করুন</span>
                </button>
              </div>

              {gallery.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {gallery.map((gImg, idx) => (
                    <div
                      key={idx}
                      className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-300 bg-white group shadow-2xs"
                    >
                      <img src={gImg} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-stone-400 italic">
                  পণ্যটির বিভিন্ন কোণ বা বিস্তারিত প্রদর্শনের জন্য একাধিক ছবি যোগ করতে পারেন।
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              পণ্যের বিবরণ (Product Description)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="পণ্যের ফেব্রিক, ফিটিং, সাইজ ও ডেলিভারি সংক্রান্ত বিবরণ লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Available Sizes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              উপলব্ধ সাইজসমূহ (Available Sizes)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DEFAULT_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSize(size)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              কালার নির্বাচন Colors ({selectedColors.length})
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedColors.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-full border border-stone-200 bg-white text-xs font-medium text-stone-800 shadow-2xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  {selectedColors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(c.name)}
                      className="text-stone-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Add Preset Color */}
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-stone-400">Presets:</span>
              {POPULAR_COLORS.map((pc) => (
                <button
                  key={pc.name}
                  type="button"
                  onClick={() => {
                    if (!selectedColors.some((c) => c.name === pc.name)) {
                      setSelectedColors([...selectedColors, pc]);
                    }
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded border border-stone-200 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-stone-300"
                    style={{ backgroundColor: pc.hex }}
                  />
                  <span>{pc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-sm font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
            >
              {productToEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
