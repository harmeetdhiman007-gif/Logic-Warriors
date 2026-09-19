import React from 'react';
import { ShieldCheck, Zap, Headphones, FileText } from 'lucide-react';

export default function TrustBadges() {
  const BADGES = [
    {
      icon: Zap,
      title: "Instant Code Delivery",
      desc: "GitHub invite & Google Drive access within minutes",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      icon: ShieldCheck,
      title: "100% Tested & Verified",
      desc: "Zero syntax bugs with video proof before payment",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Headphones,
      title: "Direct WhatsApp & Call",
      desc: "Personal assistance directly from Harmeet",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: FileText,
      title: "Complete Documentation",
      desc: "IEEE project report, PPT slides & Viva defense QA",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="bg-white border-y border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {BADGES.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className={`p-2.5 rounded-lg ${b.bg} ${b.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{b.title}</h4>
                <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 leading-snug">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
