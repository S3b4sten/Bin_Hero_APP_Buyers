
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { calculateCurrentPrice, formatCurrency, getDayCount } from '../utils';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [currentPrice, setCurrentPrice] = useState(calculateCurrentPrice(product.originalPrice, product.createdAt));
  const day = getDayCount(product.createdAt);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(product.originalPrice, product.createdAt));
    }, 60000);
    return () => clearInterval(timer);
  }, [product]);

  const discountPercent = Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100);

  return (
    <article 
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border-2 border-[#062e1e] overflow-hidden flex flex-col h-full shadow-[0_4px_0_0_#062e1e] hover:translate-y-[-4px] hover:shadow-[0_8px_0_0_#062e1e] transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 border-b-2 border-[#062e1e]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white border-2 border-[#062e1e] px-3 py-1 rounded-full text-xs font-black text-[#062e1e] shadow-sm">
          JOUR {day}
        </div>
        {discountPercent > 0 && (
          <div className="absolute bottom-3 left-3 bg-[#10b981] text-[#062e1e] border-4 border-[#062e1e] px-3 py-1 rounded-xl text-3xl font-black italic tracking-tighter shadow-lg transform -rotate-2">
            -{discountPercent}%
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="text-lg font-black text-[#062e1e] mb-2 leading-tight line-clamp-2 uppercase tracking-tight">{product.name}</h3>
        <div className="flex justify-between items-end">
          <span className="text-gray-400 line-through text-xs font-bold mb-1">{formatCurrency(product.originalPrice)}</span>
          <span className="text-3xl font-black text-[#10b981] tabular-nums leading-none tracking-tighter">{formatCurrency(currentPrice)}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
