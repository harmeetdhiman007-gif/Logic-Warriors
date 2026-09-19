import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  MessageCircle, 
  Share2, 
  Copy, 
  Send, 
  Download, 
  Heart,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { getWhatsAppUrl, apiAddInquiry } from '../services/api';

export default function ProductDetailModal({ 
  product, 
  settings, 
  onClose, 
  onToggleCart, 
  isInCart 
}) {
  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [copied, setCopied] = useState(false);
  
  // Inquiry form inside modal
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const currency = settings.currencySymbol || '₹';
  const whatsappPhone = settings.whatsappNumber || '919876543210';

  const whatsappMessage = `Hi Harmeet / Logic Warriors! I want to buy/inquire about this project:\n\n*Project:* ${product.title}\n*Price:* ${currency}${product.price}\n*ID:* ${product.id}\n\nPlease share payment details and setup instructions!`;

  const handleDirectWhatsApp = () => {
    const url = getWhatsAppUrl(whatsappPhone, whatsappMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) {
      alert('Please provide your name and phone number');
      return;
    }
    setSubmitting(true);
    try {
      await apiAddInquiry({
        customerName: buyerName,
        customerPhone: buyerPhone,
        customerEmail: buyerEmail,
        projectId: product.id,
        projectTitle: product.title,
        message: buyerMessage || `Interested in buying ${product.title} (${currency}${product.price})`
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const gallery = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      {/* Modal Card */}
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Product Code: {product.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
              title="Copy Page Link"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleCart(product)}
              className={`p-1.5 rounded hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 ${
                isInCart ? 'text-red-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInCart ? 'fill-red-400' : ''}`} />
              <span className="hidden sm:inline">{isInCart ? 'Shortlisted' : 'Shortlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors ml-2"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
                <img 
                  src={activeImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-all"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded shadow">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-16 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === imgUrl ? 'border-blue-600 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Live Preview Button if available */}
              {product.demoUrl && (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>Launch Live Demo Preview</span>
                </a>
              )}
            </div>

            {/* Right Column: Title, Specs, Pricing (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h1>

                {/* Ratings & Assured */}
                <div className="flex flex-wrap items-center gap-3 mt-2.5">
                  <div className="flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    <span>{product.rating || 4.8}</span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-slate-500 text-xs font-medium">
                    {product.reviewCount || 94} Customer Ratings & Reviews
                  </span>
                  {product.isLogicAssured && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Logic Assured • 100% Tested</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Price Block (Amazon Style) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    {currency}{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {currency}{Number(product.originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Save {product.discount}%
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Inclusive of complete source code, database scripts, IEEE synopsis report, and viva slides.
                </p>
              </div>

              {/* Tech Stack Chips */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(product.techStack || []).map((t, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  About This Project
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Deliverables Checklist (What you will get) */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Package Deliverables Included</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {(product.deliverables || [
                    "Complete clean source code repository",
                    "Database schema & dummy seed data",
                    "Step-by-step setup video tutorial",
                    "IEEE formatted final documentation report",
                    "Presentation slides (PPT) for viva",
                    "1-on-1 Remote Setup Support via AnyDesk"
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant WhatsApp Order Button */}
              <div className="pt-2">
                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span>Instant Order / Chat on WhatsApp ({currency}{Number(product.price).toLocaleString('en-IN')})</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-1.5">
                  Direct connection with Harmeet • Fast response • Instant access link upon payment
                </p>
              </div>

            </div>
          </div>

          {/* Direct Inquiry / Lead Form inside Modal */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 mt-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Prefer to Leave an On-Site Message or Custom Request?
                </h3>
                <p className="text-slate-500 text-xs">
                  Fill out this form and Harmeet will contact you on your WhatsApp/Phone shortly.
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Inquiry Received Successfully!</h4>
                  <p className="text-xs text-emerald-800">
                    Your request for <strong>{product.title}</strong> has been logged into the Logic Warriors system.
                  </p>
                  <button
                    onClick={handleDirectWhatsApp}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Open WhatsApp for Faster Reply
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="e.g. Aman Sharma"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Phone Number *</label>
                      <input 
                        type="text"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email (Optional)</label>
                    <input 
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Questions / Specific Customizations Needed</label>
                    <textarea 
                      rows={2}
                      value={buyerMessage}
                      onChange={(e) => setBuyerMessage(e.target.value)}
                      placeholder="e.g., Do you provide AnyDesk setup? Can you modify the database to PostgreSQL? Need it by tomorrow..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{submitting ? 'Submitting...' : 'Submit Inquiry to Owner'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="bg-slate-100 px-6 py-2.5 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center shrink-0">
          <span>Logic Warriors Assured • All Rights Reserved</span>
          <button onClick={onClose} className="text-blue-600 font-semibold hover:underline">
            Back to Catalog
          </button>
        </div>

      </div>
    </div>
  );
}
