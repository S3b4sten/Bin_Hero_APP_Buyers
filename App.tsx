
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SellForm from './components/SellForm';
import CartDrawer from './components/CartDrawer';
import TransactionsPage from './components/TransactionsPage';
import PaymentModal from './components/PaymentModal';
import { Product, CartItem, Transaction } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Retour client, emballage légèrement ouvert mais produit comme neuf. Qualité sonore exceptionnelle garantie.',
    originalPrice: 249,
    category: 'High-Tech',
    imageUrl: 'https://sm.pcmag.com/t/pcmag_uk/review/a/apple-airp/apple-airpods-pro-2nd-generation-with-magsafe-charging-case_f9fh.1200.jpg',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Boutique Alpha'
  },
  {
    id: '2',
    name: 'Robot Pâtissier KitchenAid',
    description: 'Modèle d\'exposition, parfait état de marche. Idéal pour pâtissiers amateurs et professionnels.',
    originalPrice: 499,
    category: 'Cuisine',
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP._b6VcRMm-9GyD0EmJgUbngHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Chef Corner'
  },
  {
    id: '3',
    name: 'Tapis de Yoga Pro',
    description: 'Épais et antidérapant. Emballage carton abîmé lors de la livraison, produit intact.',
    originalPrice: 85,
    category: 'Sport',
    imageUrl: 'https://www.yogom.fr/wp-content/uploads/2024/01/Mix-tapis-d-eyoga-Yogom-400x400.jpeg',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'FitLife Store'
  },
  {
    id: '4',
    name: 'Lego Star Wars Millenium Falcon',
    description: 'Scellés intacts, petite griffure sur la boîte. Un classique pour tous les collectionneurs.',
    originalPrice: 160,
    category: 'Jeux',
    imageUrl: 'https://th.bing.com/th/id/R.04ba8bc6b3e835e6e102107567f60c56?rik=70JFYJOkUlAFiQ&pid=ImgRaw&r=0',
    createdAt: new Date().toISOString(),
    sellerName: 'Toy Palace'
  },
  {
    id: '5',
    name: 'Machine Espresso Sage',
    description: 'Café de qualité professionnelle. Légère rayure sur le bac d\'égouttage.',
    originalPrice: 650,
    category: 'Cuisine',
    imageUrl: 'https://choicemart.co.uk/wp-content/uploads/2020/10/sage-espresso-machine.jpg',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Chef Corner'
  },
  {
    id: '6',
    name: 'VTT Rockrider ST 540',
    description: 'Vélo de montagne robuste. Retour pour erreur de taille.',
    originalPrice: 450,
    category: 'Sport',
    imageUrl: 'https://vendre-son-velo.com/wp-content/uploads/listing-uploads/cover/2024/12/velo.jpg',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'FitLife Store'
  },
  {
    id: '7',
    name: 'iPhone 15 Pro Max',
    description: 'Modèle de démonstration, batterie à 100%. État comme neuf.',
    originalPrice: 1299,
    category: 'High-Tech',
    imageUrl: 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https://substack-post-media.s3.amazonaws.com/public/images/028e0308-738c-4faa-a82f-23d17c19709a_2310x1300.jpeg',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Boutique Alpha'
  },
  {
    id: '8',
    name: 'Chaise Gaming Razer',
    description: 'Ergonomie premium pour le jeu. Boîte endommagée au transport.',
    originalPrice: 380,
    category: 'Mobilier',
    imageUrl: 'https://www.topchaisegamer.com/wp-content/uploads/2021/02/IMG_20210203_183049-1-768x675.jpg',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Pro Gamer Gear'
  },
  {
    id: '9',
    name: 'Appareil Photo Sony A7 III',
    description: 'Boîtier nu, très peu de déclenchements. Retour client rapide.',
    originalPrice: 1800,
    category: 'Photo',
    imageUrl: 'https://alpinemag.fr/wp-content/uploads/2019/04/jocelynchavy_sonyA7III-2358-1080x720.jpg',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Focus Optique'
  },
  {
    id: '10',
    name: 'Enceinte Bluetooth Marshall',
    description: 'Style vintage, son puissant. Emballage scellé mais carton taché.',
    originalPrice: 220,
    category: 'Audio',
    imageUrl: 'https://www.meilleure-innovation.com/wp-content/uploads/2023/03/marshall-middleton-enceinte-bluetooth.png',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Boutique Alpha'
  }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'transactions'>('home');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: string[] = ['All', ...Array.from(new Set(products.map(p => p.category)) as Set<string>)];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const addProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const addToCart = (product: Product, currentPrice: number) => {
    const newItem: CartItem = {
      ...product,
      currentPriceAtAddition: currentPrice
    };
    setCart([...cart, newItem]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirmed = () => {
    const total = cart.reduce((sum, item) => sum + item.currentPriceAtAddition, 0);
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      items: [...cart],
      total: total
    };
    setTransactions([newTx, ...transactions]);
    setCart([]);
    setIsPaymentModalOpen(false);
    setCurrentPage('transactions');
  };

  const selectCategory = (cat: string) => {
    setFilter(cat);
    setIsCategoryMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#062e1e] font-sans selection:bg-[#10b981] selection:text-white">
      <Navbar 
        onSellClick={() => setIsSellModalOpen(true)} 
        onCartClick={() => setIsCartOpen(true)}
        onTransactionsClick={() => setCurrentPage('transactions')}
        cartCount={cart.length}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {currentPage === 'home' ? (
          <>
            {/* Hero Section Restored (Spacious) */}
            <section className="mb-10 bg-[#062e1e] text-white p-8 md:p-12 rounded-[2.5rem] border-4 border-[#062e1e] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_8px_0_0_#10b981]">
              <div className="relative z-10 w-full md:w-3/4 text-left">
                <div className="bg-[#10b981] text-[#062e1e] inline-block px-4 py-1 rounded-md text-[11px] font-black uppercase tracking-[0.2em] mb-6 border-2 border-[#062e1e]">
                  Ventes Flash Quotidiennes
                </div>
                <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter leading-none mb-6 uppercase">
                  PRIX EN CHUTE <span className="text-[#10b981] underline decoration-4 underline-offset-4">LIBRE</span>
                </h2>
                <p className="text-white text-xl md:text-2xl font-black max-w-xl leading-tight opacity-100">
                  Liquidation dynamique<br />
                  -15% par jour !<br />
                  Prenez action ou <br />
                  Perdez la chance
                </p>
              </div>
              
              <div className="hidden md:flex w-1/4 items-center justify-end">
                <div className="w-48 h-48 bg-white/10 backdrop-blur-2xl rounded-[3rem] border-4 border-white/20 flex flex-col items-center justify-center text-center p-6 transform rotate-1 shadow-2xl">
                   <div className="text-6xl font-black text-[#10b981] leading-none mb-1 tracking-tighter">-85%</div>
                   <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white opacity-90">MAX OFFRE</div>
                </div>
              </div>
            </section>

            {/* Category Menu with Increased Label Size */}
            <div className="relative mb-10" ref={categoryMenuRef}>
              <button 
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`flex items-center gap-4 bg-white border-4 border-[#062e1e] px-6 py-4 rounded-xl shadow-[0_4px_0_0_#062e1e] hover:translate-y-[-2px] transition-all group`}
              >
                <span className="text-xs font-black text-[#10b981] uppercase tracking-[0.2em]">BACS :</span>
                <span className="text-lg font-black text-[#062e1e] uppercase tracking-tighter">
                  {filter === 'All' ? 'TOUS LES ARTICLES' : filter}
                </span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-[#062e1e] transition-transform duration-300 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-full md:w-auto min-w-[280px] bg-white border-4 border-[#062e1e] rounded-[1.5rem] p-4 z-[60] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => selectCategory(cat)}
                        className={`px-5 py-3 rounded-lg text-sm font-black transition-all border-2 text-left flex items-center justify-between ${
                          filter === cat 
                          ? 'bg-emerald-50 border-[#10b981] text-[#062e1e]' 
                          : 'bg-white border-transparent text-[#062e1e] hover:bg-gray-50'
                        }`}
                      >
                        <span className="uppercase tracking-tight">{cat === 'All' ? 'TOUT VOIR' : cat}</span>
                        {filter === cat && <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          </>
        ) : (
          <TransactionsPage 
            transactions={transactions} 
            onBackToShop={() => setCurrentPage('home')} 
          />
        )}
      </main>

      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart}
        />
      )}

      {isSellModalOpen && (
        <SellForm 
          onClose={() => setIsSellModalOpen(false)} 
          onAddProduct={addProduct} 
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemoveItem={(id) => setCart(cart.filter(i => i.id !== id))}
        onCheckout={handleCheckout}
      />

      {isPaymentModalOpen && (
        <PaymentModal 
          items={cart}
          total={cart.reduce((sum, item) => sum + item.currentPriceAtAddition, 0)}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirmPayment={handlePaymentConfirmed}
        />
      )}

      <footer className="mt-20 border-t-4 border-[#062e1e] py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black italic tracking-tighter text-[#062e1e] mb-2">BINDROP</h1>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Acheter responsable. Acheter malin.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-xs font-black uppercase tracking-widest text-[#062e1e] hover:underline">Conditions</a>
            <a href="#" className="text-xs font-black uppercase tracking-widest text-[#062e1e] hover:underline">Support</a>
            <a href="#" className="text-xs font-black uppercase tracking-widest text-[#062e1e] hover:underline">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
