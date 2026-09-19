import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import HeroCarousel from './components/HeroCarousel';
import TrustBadges from './components/TrustBadges';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import ContactModal from './components/ContactModal';
import OwnerDashboard from './components/OwnerDashboard';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { fetchAllData } from './services/api';
import { 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  MessageCircle, 
  Lock, 
  ArrowUp, 
  Flame,
  CheckCircle2,
  Heart
} from 'lucide-react';

const CART_STORAGE_KEY = 'logic_warriors_cart_v1';

export default function App() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOwnerOpen, setIsOwnerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Shortlist / Cart items stored in localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Load database from API or localStorage
  const loadData = async () => {
    try {
      const data = await fetchAllData();
      setDbData(data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const products = dbData?.products || [];
  const settings = dbData?.settings || {};

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Search Query Filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      list = list.filter(p => 
        (p.title || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.techStack || []).some(t => t.toLowerCase().includes(query))
      );
    }

    // Price Filter
    if (priceFilter === 'under3000') {
      list = list.filter(p => Number(p.price) < 3000);
    } else if (priceFilter === 'under4000') {
      list = list.filter(p => Number(p.price) < 4000);
    } else if (priceFilter === 'above4000') {
      list = list.filter(p => Number(p.price) >= 4000);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return list;
  }, [products, selectedCategory, searchTerm, priceFilter, sortBy]);

  // Cart / Shortlist Handlers
  const handleToggleCart = (product) => {
    setCartItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceFilter('all');
    setSortBy('featured');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-amber-400">
      
      {/* 1. Amazon/Flipkart Mega Navigation Bar */}
      <Navbar
        settings={settings}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        setIsContactOpen={setIsContactOpen}
        setIsOwnerOpen={setIsOwnerOpen}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Secondary Horizontal Category Navigation Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* 3. Hero Banner Carousel */}
      <HeroCarousel
        setIsContactOpen={setIsContactOpen}
        onBrowseClick={scrollToProducts}
      />

      {/* 4. Assurance & Trust Badges Strip */}
      <TrustBadges />

      {/* 5. Main Catalog Grid Section */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        
        {/* Section Heading & Result Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500 text-slate-950">
                <Flame className="w-4 h-4 fill-current" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedCategory === 'All' ? 'All Verified Projects & Codebases' : selectedCategory}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredProducts.length} projects • Verified 100% bug-free with setup documentation
            </p>
          </div>

          {/* Active Filter Chips if filtered */}
          {(selectedCategory !== 'All' || searchTerm || priceFilter !== 'all') && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">Filtered:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>✕</button>
                </span>
              )}
              {searchTerm && (
                <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>✕</button>
                </span>
              )}
              {priceFilter !== 'all' && (
                <span className="bg-emerald-100 text-emerald-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  {priceFilter}
                  <button onClick={() => setPriceFilter('all')}>✕</button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:underline font-semibold ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No projects found matching your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with different keywords, clear filters, or request a custom-built project directly from Harmeet.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Custom Project</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 pt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                onSelectProduct={setSelectedProduct}
                onToggleCart={handleToggleCart}
                isInCart={cartItems.some(i => i.id === product.id)}
              />
            ))}
          </div>
        )}

      </main>

      {/* 6. Flipkart / Amazon Inspired Footer */}
      <footer className="mt-16 bg-slate-900 text-slate-300">
        {/* Back to Top button (Amazon style) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 transition-colors flex items-center justify-center gap-2 border-b border-slate-700"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            
            {/* Column 1: About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                  LW
                </div>
                <span className="font-extrabold text-base text-white">Logic Warriors</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                India's dedicated showcase and marketplace for verified academic capstones, industry software, AI models, mobile apps & IoT hardware.
              </p>
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Tested • Working Video Proof</span>
              </div>
            </div>

            {/* Column 2: Popular Categories */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
                Top Categories
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => { setSelectedCategory(c); scrollToProducts(); }}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {c} Projects
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact & Direct Connect */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
                Contact Developer
              </h4>
              <p className="text-slate-400">
                Created & maintained by <strong>{settings.ownerName || 'Harmeet Dhiman'}</strong>
              </p>
              <div className="space-y-1.5 text-slate-300 pt-1">
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{settings.ownerPhone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{settings.ownerEmail}</span>
                </p>
              </div>
              <button
                onClick={() => setIsContactOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Column 4: Owner Management */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>Owner Portal</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Log into your private ledger to track all projects people bought, agreed prices, customer phone numbers, and download sales books to CSV.
              </p>
              <button
                onClick={() => setIsOwnerOpen(true)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-lg transition-colors text-xs"
              >
                Access Owner Ledger (PIN Protected)
              </button>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <span>
              © {new Date().getFullYear()} Logic Warriors. All source codes and media rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <span>Built for Developers & Students</span>
              <span>•</span>
              <button onClick={() => setIsOwnerOpen(true)} className="hover:text-amber-400">
                Owner Access
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Modals and Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onToggleCart={handleToggleCart}
          isInCart={cartItems.some(i => i.id === selectedProduct.id)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        settings={settings}
        onOpenProduct={(p) => setSelectedProduct(p)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        settings={settings}
      />

      <OwnerDashboard
        isOpen={isOwnerOpen}
        onClose={() => setIsOwnerOpen(false)}
        dbData={dbData}
        onRefreshData={loadData}
      />

    </div>
  );
}
