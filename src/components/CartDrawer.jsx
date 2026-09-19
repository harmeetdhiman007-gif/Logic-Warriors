import React from 'react';
import { X, Trash2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '../services/api';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onClearCart, 
  settings,
  onOpenProduct 
}) {
  if (!isOpen) return null;

  const currency = settings.currencySymbol || '₹';
  const whatsappPhone = settings.whatsappNumber || '919876543210';

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const bundleMessage = `Hi Harmeet / Logic Warriors! I have shortlisted these ${cartItems.length} projects from your website:\n\n` +
    cartItems.map((item, idx) => `${idx + 1}. *${item.title}* - ${currency}${item.price} (ID: ${item.id})`).join('\n') +
    `\n\n*Total Estimated Price:* ${currency}${totalPrice}\n\nPlease let me know if any combo discount is available and how to proceed!`;

  const handleBundleWhatsApp = () => {
    const url = getWhatsAppUrl(whatsappPhone, bundleMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">
              Shortlisted Projects ({cartItems.length})
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-16 h-16 stroke-1 mb-3 text-slate-300" />
              <h4 className="font-bold text-slate-700 text-sm">Your Shortlist is Empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Click the heart icon on any project to shortlist it and inquire about multiple projects at once.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 items-center group">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-16 h-14 object-cover rounded-lg border border-slate-200 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => { onOpenProduct(item); onClose(); }}
                    className="font-bold text-xs text-slate-900 line-clamp-1 hover:text-blue-600 cursor-pointer"
                  >
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-blue-600 font-medium">{item.category}</span>
                  <div className="text-xs font-black text-slate-800 mt-1">
                    {currency}{Number(item.price).toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                  title="Remove from shortlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-slate-600 font-medium">Bundle Total ({cartItems.length} items):</span>
              <span className="text-lg font-black text-slate-900">
                {currency}{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleBundleWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire All via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <button 
                onClick={onClearCart}
                className="text-slate-400 hover:text-red-500 underline"
              >
                Clear Shortlist
              </button>
              <span>Instant response on WhatsApp</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
