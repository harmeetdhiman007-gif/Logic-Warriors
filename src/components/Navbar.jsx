import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  PhoneCall, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Menu, 
  X, 
  Heart,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  settings, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories,
  cartItems, 
  setIsCartOpen, 
  setIsContactOpen, 
  setIsOwnerOpen,
  onResetFilters
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Top Banner / Announcement Bar (Amazon/Flipkart style) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
            Verified Code
          </span>
          <span className="hidden sm:inline text-slate-300">
            Welcome to <strong className="text-white">Logic Warriors</strong> — All projects come with 100% Tested Source Code, Docs, PPT & Viva Prep!
          </span>
          <span className="sm:hidden text-slate-300">
            100% Working Code & Complete Documentation!
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs shrink-0">
          <button 
            onClick={() => setIsContactOpen(true)}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Need Custom Project?</span>
          </button>
          <span className="text-slate-700">|</span>
          <button 
            onClick={() => setIsOwnerOpen(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="Owner Management Portal"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Owner Login</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="amazon-gradient text-white px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={onResetFilters}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans">
                  LOGIC<span className="text-amber-400 font-black">WARRIORS</span>
                </span>
              </div>
              <p className="text-[10px] text-blue-300 flex items-center gap-1 font-medium tracking-wide">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                PROJECTS & SOURCE CODE
              </p>
            </div>
          </div>

          {/* Delivery Pin Info (Amazon Style) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 hover:outline hover:outline-1 hover:outline-white p-1 rounded cursor-pointer shrink-0">
            <MapPin className="w-4 h-4 text-amber-400 mt-1" />
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 block">Deliver to</span>
              <span className="font-bold text-white text-xs">All India (Instant)</span>
            </div>
          </div>

          {/* Mega Search Bar (Flipkart / Amazon style) */}
          <div className="flex-1 max-w-2xl mx-1 sm:mx-2">
            <div className="flex rounded-md overflow-hidden shadow-md focus-within:ring-2 focus-within:ring-amber-400 bg-white">
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hidden md:block bg-slate-100 text-slate-800 text-xs px-2.5 py-2 border-r border-slate-300 focus:outline-none cursor-pointer hover:bg-slate-200"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Input */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects (e.g., E-Commerce, Deepfake, Flutter, Python, IoT)..."
                className="w-full px-3 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none placeholder-slate-400"
              />

              {/* Clear button if typed */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}

              {/* Search Button (Amazon Orange / Amber) */}
              <button 
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 flex items-center justify-center transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Contact / Inquire Button */}
            <button
              onClick={() => setIsContactOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded shadow transition-all hover:shadow-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Contact Owner</span>
            </button>

            {/* Cart / Shortlist Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 p-1.5 rounded hover:outline hover:outline-1 hover:outline-white relative transition-all"
              title="View Shortlisted Projects"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <span className="text-[10px] text-slate-400 block">Shortlist</span>
                <span className="font-bold text-white">Inquire</span>
              </div>
            </button>

            {/* Owner Lock Shortcut Button */}
            <button
              onClick={() => setIsOwnerOpen(true)}
              className="hidden lg:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold px-2.5 py-1.5 rounded border border-slate-700 hover:border-amber-400/50 transition-all"
              title="Owner Sales Tracker & Management"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search category selector dropdown */}
        <div className="md:hidden mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
          <span className="text-xs text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700 flex-1 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 text-sm space-y-3">
          <button
            onClick={() => { setIsContactOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between p-2 rounded bg-emerald-700 text-white font-semibold text-xs"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact Harmeet / WhatsApp
            </span>
            <span>→</span>
          </button>
          <button
            onClick={() => { setIsOwnerOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between p-2 rounded bg-slate-800 text-amber-400 font-semibold text-xs border border-amber-400/30"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Owner Sales Tracker & Dashboard
            </span>
            <span>→</span>
          </button>
        </div>
      )}
    </header>
  );
}
