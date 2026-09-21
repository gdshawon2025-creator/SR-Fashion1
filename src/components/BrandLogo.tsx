import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  light?: boolean;
  className?: string;
  imgClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  light = true,
  className = '',
  imgClassName = '',
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { img: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-xl sm:text-2xl', sub: 'text-[10px]' },
    lg: { img: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-2xl sm:text-[28px]', sub: 'text-xs' },
    xl: { img: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-3xl sm:text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <div className="relative shrink-0">
        <img
          src="/sr-fashion-logo.jpg"
          alt="SR Fashion Logo"
          referrerPolicy="no-referrer"
          className={`rounded-full object-cover shadow-xs border-2 border-amber-500/70 transition-transform duration-200 hover:scale-105 ${currentSize.img} ${imgClassName}`}
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-bold tracking-wider font-serif ${currentSize.text} ${
              light ? 'text-white' : 'text-stone-900'
            }`}
          >
            SR <span className="text-[#e8b04b]">Fashion</span>
          </span>
        </div>
      )}
    </div>
  );
};
