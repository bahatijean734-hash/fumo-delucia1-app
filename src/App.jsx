import React, { useState, useEffect } from 'react';
import { ShoppingCart, Phone, MapPin, MessageCircle, Trash2, Plus, Minus, Home, Menu, X, ChefHat } from 'lucide-react';

// --- DONNÉES PRODUITS ---
// REMPLACEZ LES LIENS D'IMAGES PAR VOS PROPRES PHOTOS (Format recommandé: .jpg ou .png)
const PRODUCTS = [
  {
    id: 1,
    category: 'volaille',
    name: 'Poulet Entier Fumé',
    description: 'Poulet fermier fumé au bois de hêtre, goût authentique.',
    weight: '3 kg',
    priceDisplay: '28,000 FC', 
    priceValue: 28000,         
    image: 'https://images.unsplash.com/photo-1598103356248-c477ad9475ac?auto=format&fit=crop&q=80&w=800' 
  },
  {
    id: 2,
    category: 'volaille',
    name: 'Cuisses de Poulet Fumées',
    description: 'Lot de 3 cuisses juteuses et parfaitement fumées.',
    weight: '3 pièces',
    priceDisplay: '12,000 FC',
    priceValue: 12000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800' 
  },
  {
    id: 3,
    category: 'poisson',
    name: 'Tilapia Fumé',
    description: 'Tilapia frais du lac, fumé traditionnellement.',
    weight: '3 pièces',
    priceDisplay: '28,000 FC',
    priceValue: 28000,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800' 
  },
  {
    id: 4,
    category: 'viande',
    name: 'Porc Fumé Spécial',
    description: 'Viande de porc marinée et fumée lentement.',
    weight: '1 kg',
    priceDisplay: '18,000 FC',
    priceValue: 18000,
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800' 
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'volaille', label: 'Volaille' },
  { id: 'poisson', label: 'Poisson' },
  { id: 'viande', label: 'Viande' },
];

export default function App() {
  const [view, setView] = useState('home'); 
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNotification, setShowNotification] = useState(false);

  // --- LOGIQUE PANIER ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerNotification();
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- LOGIQUE WHATSAPP ---
  const sendOrderToWhatsApp = () => {
    const phoneNumber = "243975126117"; 
    let message = `Bonjour Fumo Delucia 👋\n\nJe souhaite passer une commande :\n`;
    
    cart.forEach(item => {
      message += `▪️ ${item.name} (${item.weight}) x${item.quantity} - ${item.priceDisplay}\n`;
    });

    message += `\n💰 Total: ${cartTotal.toLocaleString()} FC`;
    message += `\n\n📍 Quartier : _______\n📞 Téléphone : _______\n\nMerci.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // --- COMPOSANTS ---

  const Header = () => (
    <div className="bg-gradient-to-r from-orange-900 to-red-900 text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center border-b border-orange-800">
      <div className="flex items-center gap-2" onClick={() => setView('home')}>
        <div className="bg-black p-1 rounded-full text-orange-500 border border-orange-700">
          <ChefHat size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wider uppercase">Fumo Delucia</h1>
          <p className="text-xs text-orange-300">Le goût du vrai fumé</p>
        </div>
      </div>
      <div className="relative" onClick={() => setView('cart')}>
        <ShoppingCart size={24} className="text-orange-100" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full border border-black">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="fixed bottom-0 w-full bg-black border-t border-gray-800 flex justify-around p-3 z-50 pb-safe shadow-2xl">
      <button onClick={() => setView('home')} className={`flex flex-col items-center transition-colors ${view === 'home' ? 'text-orange-500' : 'text-gray-500'}`}>
        <Home size={24} />
        <span className="text-xs mt-1 font-medium">Accueil</span>
      </button>
      <button onClick={() => setView('menu')} className={`flex flex-col items-center transition-colors ${view === 'menu' ? 'text-orange-500' : 'text-gray-500'}`}>
        <Menu size={24} />
        <span className="text-xs mt-1 font-medium">Produits</span>
      </button>
      <button onClick={() => setView('cart')} className={`flex flex-col items-center transition-colors ${view === 'cart' ? 'text-orange-500' : 'text-gray-500'}`}>
        <ShoppingCart size={24} />
        <span className="text-xs mt-1 font-medium">Panier</span>
      </button>
      <button onClick={() => setView('contact')} className={`flex flex-col items-center transition-colors ${view === 'contact' ? 'text-orange-500' : 'text-gray-500'}`}>
        <MessageCircle size={24} />
        <span className="text-xs mt-1 font-medium">Contact</span>
      </button>
    </div>
  );

  return (
    <div className="font-sans text-gray-100 bg-black min-h-screen">
      <Header />
      
      <main className="max-w-md mx-auto bg-black min-h-screen shadow-2xl border-x border-gray-900 relative">
        {view === 'home' && (
          <div className="pb-24 animate-fadeIn">
            <div className="relative h-72 bg-gray-900">
              <img src="https://images.unsplash.com/photo-1524182576066-109053ac2774?auto=format&fit=crop&q=80&w=800" alt="BBQ" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <h2 className="text-4xl font-extrabold mb-2 text-orange-500 drop-shadow-xl tracking-wide uppercase">Fumé au bois</h2>
                <p className="text-lg mb-6 max-w-md text-gray-200">Découvrez nos saveurs authentiques.</p>
                <button onClick={() => setView('menu')} className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-900/50 hover:bg-orange-500 transition transform active:scale-95">COMMANDER</button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-100 mb-4 border-l-4 border-orange-600 pl-3">Nos Spécialités</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div onClick={() => {setActiveCategory('volaille'); setView('menu')}} className="bg-gray-900 border border-gray-800 p-5 rounded-xl cursor-pointer hover:bg-gray-800 transition shadow-lg">
                  <span className="text-4xl">🍗</span>
                  <p className="font-bold mt-2 text-orange-400">Volaille</p>
                </div>
                <div onClick={() => {setActiveCategory('poisson'); setView('menu')}} className="bg-gray-900 border border-gray-800 p-5 rounded-xl cursor-pointer hover:bg-gray-800 transition shadow-lg">
                  <span className="text-4xl">🐟</span>
                  <p className="font-bold mt-2 text-blue-400">Poisson</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'menu' && (
          <div className="pb-24 bg-black min-h-screen">
            <div className="flex overflow-x-auto gap-2 p-4 bg-black/95 backdrop-blur-sm sticky top-[60px] z-40 border-b border-gray-800 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat.id ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-800 text-gray-400'}`}>{cat.label}</button>
              ))}
            </div>
            <div className="p-4 grid gap-6">
              {(activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory)).map(product => (
                <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/80 text-orange-400 px-3 py-1 rounded-full text-sm font-bold border border-orange-900">{product.priceDisplay}</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white">{product.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{product.description}</p>
                      <p className="text-xs font-semibold text-orange-400 mt-2 bg-orange-900/20 inline-block px-2 py-1 rounded border border-orange-900/30">Poids: {product.weight}</p>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full mt-4 bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition"><Plus size={18} />Ajouter au panier</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="pb-24 p-4 min-h-screen bg-black text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4"><ShoppingCart className="text-orange-500" />Votre Panier</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <ShoppingCart size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400">Votre panier est vide</p>
                <button onClick={() => setView('menu')} className="mt-4 text-orange-500 font-bold underline">Retour au menu</button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-900 border border-gray-800 p-3 rounded-xl flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-sm text-orange-400">{item.priceDisplay}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-gray-800 rounded-full border border-gray-700"><Minus size={14} /></button>
                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-gray-800 rounded-full border border-gray-700"><Plus size={14} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2"><Trash2 size={20} /></button>
                  </div>
                ))}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl mt-6 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Total à payer</span>
                    <span className="text-2xl font-bold text-orange-500">{cartTotal.toLocaleString()} FC</span>
                  </div>
                  <button onClick={sendOrderToWhatsApp} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-green-500 transition animate-pulse"><MessageCircle size={24} />Commander sur WhatsApp</button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'contact' && (
          <div className="pb-24 p-4 min-h-screen bg-black flex flex-col items-center justify-center text-center">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
              <div className="w-24 h-24 bg-black border-2 border-orange-600 rounded-full mx-auto flex items-center justify-center mb-6 text-orange-500">
                <ChefHat size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Fumo Delucia</h2>
              <p className="text-gray-400 mb-8 font-medium">Une question ? Un besoin particulier ?</p>
              <button onClick={() => window.open('https://wa.me/243975126117')} className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition shadow-xl shadow-green-900/30"><MessageCircle size={24} />Discuter sur WhatsApp</button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
      
      {showNotification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-orange-500 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span className="text-orange-500 font-bold">✔</span> Produit ajouté au panier
        </div>
      )}
    </div>
  );
}
