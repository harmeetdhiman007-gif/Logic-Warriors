import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MessageCircle, ShieldCheck, Zap } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    tag: "LOGIC WARRIORS MEGA SHOWCASE",
    title: "100% Tested Projects & Verified Source Code",
    subtitle: "Complete Fullstack, AI/ML, Flutter & IoT projects with IEEE reports, PPT slides & viva defense preparation.",
    badge: "50% FLAT DISCOUNT THIS WEEK",
    bgGradient: "from-blue-950 via-slate-900 to-indigo-950",
    accentColor: "text-amber-400",
    buttonText: "Browse Top Projects",
    buttonAction: "scroll",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    tag: "CUSTOM SOFTWARE & COLLEGE PROJECTS",
    title: "Need a Custom Project Tailored to Your Syllabus?",
    subtitle: "Direct 1-on-1 contact with Harmeet. We build custom web apps, machine learning models, mobile apps & IoT hardware.",
    badge: "DIRECT WHATSAPP & ANYDESK SETUP",
    bgGradient: "from-slate-950 via-emerald-950 to-slate-900",
    accentColor: "text-emerald-400",
    buttonText: "Inquire via WhatsApp",
    buttonAction: "contact",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    tag: "LOGIC PRIME ASSURANCE",
    title: "Zero Errors. Working Demo Video Before Purchase.",
    subtitle: "Every codebase is verified on fresh virtual machines. Includes full database schema, clean README, and post-delivery setup assistance.",
    badge: "FREE VIVA PREP & ARCHITECTURE DIAGRAMS",
    bgGradient: "from-slate-950 via-purple-950 to-blue-950",
    accentColor: "text-amber-300",
    buttonText: "Explore Bestsellers",
    buttonAction: "scroll",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80"
  }
];

export default function HeroCarousel({ setIsContactOpen, onBrowseClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const slide = BANNERS[currentSlide];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white shadow-xl">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity transition-all duration-700 scale-105"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      
      {/* Gradient Mask */}
      <div className={`relative bg-gradient-to-r ${slide.bgGradient} bg-opacity-90 px-4 sm:px-12 py-10 sm:py-16`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Text Content */}
          <div className="max-w-2xl space-y-3 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Badge */}
            <div className="pt-1">
              <span className="inline-block bg-amber-500 text-slate-950 font-extrabold text-[11px] sm:text-xs px-3 py-1 rounded shadow-md">
                ⚡ {slide.badge}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
              <button
                onClick={() => {
                  if (slide.buttonAction === 'contact') {
                    setIsContactOpen(true);
                  } else {
                    onBrowseClick();
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>{slide.buttonText}</span>
                <span>→</span>
              </button>

              <button
                onClick={() => setIsContactOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Talk to Harmeet</span>
              </button>
            </div>
          </div>

          {/* Flipkart / Amazon style Offer card box */}
          <div className="hidden lg:block w-80 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl z-10">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs pb-3 border-b border-slate-800">
              <Zap className="w-4 h-4" />
              <span>LOGIC WARRIORS ADVANTAGE</span>
            </div>
            
            <div className="mt-3 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Broken Code:</strong> All projects thoroughly checked & bug-fixed.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Full Documentation:</strong> Synopsis report, UML diagrams & PPT ready.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant Handover:</strong> GitHub repository access or Google Drive ZIP.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Viva Assistance:</strong> We explain the code so you pass with flying colors.</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Starting from</span>
              <span className="text-amber-400 font-extrabold text-lg">₹2,499</span>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        title="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        title="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
