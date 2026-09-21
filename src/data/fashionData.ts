import { CategoryInfo, Product } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'women',
    name: "Women's Collection",
    itemCount: '0 Items',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'men',
    name: "Men's Apparel",
    itemCount: '0 Items',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'accessories',
    name: 'Luxury Accessories',
    itemCount: '0 Items',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shoes',
    name: 'Footwear & Bags',
    itemCount: '0 Items',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  },
];

// All default products removed as requested by user
export const PRODUCTS: Product[] = [];
