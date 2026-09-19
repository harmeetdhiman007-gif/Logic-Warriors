import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../services/api';

export default function FloatingWhatsApp({ settings }) {
  const whatsappPhone = settings.whatsappNumber || '919876543210';
  const message = "Hi Harmeet! I'm browsing Logic Warriors and want to inquire about your projects.";

  const handleClick = () => {
    window.open(getWhatsAppUrl(whatsappPhone, message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip on hover / desktop */}
      <div className="hidden sm:block bg-slate-900 text-white text-xs py-1.5 px-3 rounded-full shadow-lg border border-slate-700 font-medium">
        Chat with Harmeet <span className="text-emerald-400 font-bold">• Online</span>
      </div>

      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        title="Open WhatsApp Chat"
      >
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        <MessageCircle className="w-7 h-7 text-white fill-white/20 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
