
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { calculateCurrentPrice, formatCurrency, getDayCount } from '../utils';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, currentPrice: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const [currentPrice, setCurrentPrice] = useState(calculateCurrentPrice(product.originalPrice, product.createdAt));
  const day = getDayCount(product.createdAt);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(product.originalPrice, product.createdAt));
    }, 60000);
    return () => clearInterval(timer);
  }, [product]);

  const discountPercent = Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100);

  const handleComparePrice = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(product.name + " prix neuf")}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-y-auto leading-tight">
      <div className="max-w-5xl mx-auto px-6 py-4">
        {/* Navigation Bar resserrée */}
        <button 
          onClick={onClose}
          className="mb-4 flex items-center gap-2 text-[#062e1e] font-black uppercase tracking-widest text-xs hover:translate-x-[-2px] transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux Bacs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Image Section */}
          <div className="relative bg-gray-100 rounded-[2rem] border-2 border-[#062e1e] overflow-hidden aspect-square">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <div className="absolute bottom-4 left-4 bg-[#10b981] text-[#062e1e] border-2 border-[#062e1e] px-3 py-1 rounded-xl text-3xl font-black italic tracking-tighter transform -rotate-2">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col py-0">
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-50 text-[#062e1e] border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="bg-white text-[#062e1e] border border-[#062e1e] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  JOUR {day}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-black text-[#062e1e] leading-none uppercase tracking-tighter mb-2 italic">
                {product.name}
              </h1>
              <p className="text-[#10b981] font-black text-[10px] uppercase tracking-widest">Vendeur: {product.sellerName}</p>
            </div>

            <p className="text-gray-700 text-sm font-medium mb-4 leading-snug">
              {product.description}
            </p>

            {/* Price Box resserrée */}
            <div className="bg-emerald-50 border-2 border-[#062e1e] rounded-2xl p-4 mb-4 relative">
               <div className="flex justify-between items-center relative z-10">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase mb-0 block">D'origine</span>
                  <span className="text-base font-bold text-gray-400 line-through leading-none">{formatCurrency(product.originalPrice)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-[#10b981] uppercase mb-0 block tracking-wider">AUJOURD'HUI</span>
                  <span className="text-3xl font-black text-[#062e1e] tabular-nums tracking-tighter leading-none">{formatCurrency(currentPrice)}</span>
                </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onAddToCart(product, currentPrice)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#062e1e] text-white rounded-xl font-black uppercase text-sm tracking-widest border-2 border-[#062e1e] shadow-[0_3px_0_0_#10b981] active:translate-y-1 active:shadow-none transition-all"
              >
                AJOUTER AU PANIER
              </button>
              
              <button 
                onClick={handleComparePrice}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white text-[#062e1e] rounded-xl border-2 border-[#062e1e] text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Comparer le prix
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
