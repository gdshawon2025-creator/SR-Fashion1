import React from 'react';
import { CATEGORIES } from '../data/fashionData';
import { ArrowUpRight } from 'lucide-react';

interface CategoriesSectionProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="section py-[70px] px-[7%] bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto">
        <div className="section-title text-center mb-[40px]">
          <h2 className="text-[28px] sm:text-[35px] font-bold text-[#222222] mb-[10px]">
            Top Categories
          </h2>
          <p className="text-[#777777] text-sm sm:text-base max-w-lg mx-auto">
            Explore our curated selections crafted for style, versatility, and everyday sophistication.
          </p>
        </div>

        <div className="categories grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`category group h-[220px] relative overflow-hidden rounded-[5px] cursor-pointer shadow-sm transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-[#e8b04b] ring-offset-2' : ''
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                  loading="lazy"
                />

                {/* Gradient and Title matching user's spec */}
                <div className="category-title absolute bottom-0 w-full p-[20px] text-white bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-between">
                  <div>
                    <h3 className="text-[22px] font-bold tracking-tight text-white group-hover:text-[#e8b04b] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-gray-300 font-medium tracking-wide">
                      {cat.itemCount}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#e8b04b] group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
