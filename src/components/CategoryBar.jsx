import React from 'react';
import { 
  Layers, 
  Globe, 
  Cpu, 
  Smartphone, 
  Flame, 
  FileCode, 
  Sparkles, 
  Award, 
  Percent,
  SlidersHorizontal
} from 'lucide-react';

const CATEGORY_ICONS = {
  'All': Layers,
  'Full-Stack Web': Globe,
  'AI & Machine Learning': Sparkles,
  'Mobile Apps': Smartphone,
  'IoT & Hardware': Cpu,
  'Python Automation': FileCode,
};

export default function CategoryBar({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  priceFilter,
  setPriceFilter,
  sortBy,
  setSortBy
}) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[94px] sm:top-[90px] z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 overflow-x-auto py-2.5 no-scrollbar text-xs">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </button>

          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || CodeIcon;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter & Sort Options */}
        <div className="flex items-center gap-3 shrink-0 pl-2 border-l border-slate-200">
          {/* Price Range Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Budget:</span>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Any Price</option>
              <option value="under3000">Under ₹3,000</option>
              <option value="under4000">Under ₹4,000</option>
              <option value="above4000">₹4,000 & Above</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              <option value="featured">Featured / Best Deals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
