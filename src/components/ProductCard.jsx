import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageCircle, 
  Eye, 
  Heart, 
  Check, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { getWhatsAppUrl } from '../services/api';

export default function ProductCard({ 
  product, 
  settings, 
  onSelectProduct, 
  onToggleCart, 
  isInCart 
}) {
  const currency = settings.currencySymbol || '₹';
  const whatsappPhone = settings.whatsappNumber || '919876543210';

  const whatsappMessage = `Hi Harmeet / Logic Warriors! I am interested in buying this project:\n\n*Project:* ${product.title}\n*Price:* ${currency}${product.price}\n*ID:* ${product.id}\n\nPlease let me know how to get the source code and demo!`;

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const url = getWhatsAppUrl(whatsappPhone, whatsappMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col group cursor-pointer relative"
    >
      {/* Top Image Preview Container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
          {product.badge && (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow">
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Shortlist / Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCart(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
            isInCart 
              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-red-500'
          }`}
          title={isInCart ? 'Remove from Shortlist' : 'Add to Shortlist'}
        >
          <Heart className={`w-4 h-4 ${isInCart ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Category Pill on bottom of image */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="bg-slate-900/80 backdrop-blur-sm text-blue-300 border border-blue-400/30 text-[10px] font-semibold px-2 py-0.5 rounded">
            {product.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-1 mb-2">
            {(product.techStack || []).slice(0, 3).map((tech, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded border border-slate-200">
                {tech}
              </span>
            ))}
            {(product.techStack || []).length > 3 && (
              <span className="text-slate-400 text-[10px] self-center">
                +{product.techStack.length - 3} more
              </span>
            )}
          </div>

          {/* Project Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating & Assured Badge (Amazon/Flipkart Style) */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating || 4.8}</span>
              <Star className="w-3 h-3 fill-current text-white" />
            </div>
            <span className="text-slate-400 text-xs">
              ({product.reviewCount || 48})
            </span>

            {product.isLogicAssured && (
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Logic Assured</span>
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {product.shortDesc || product.description}
          </p>

          {/* Deliverables Checklist (Flipkart bullet highlights) */}
          <div className="mt-3 py-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full Source Code + DB Included</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Report (DOCX/PDF) & PPT Ready</span>
            </div>
          </div>
        </div>

        {/* Pricing & Call-to-Action Bottom Area */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {currency}{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {currency}{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {product.discount}% off
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-2 rounded-lg shadow transition-all flex items-center justify-center gap-1.5 hover:shadow-emerald-600/30"
              title="Chat directly on WhatsApp to buy"
            >
              <MessageCircle className="w-4 h-4 text-white shrink-0" />
              <span className="truncate">WhatsApp Buy</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">View Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
