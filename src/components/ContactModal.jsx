import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { getWhatsAppUrl, apiAddInquiry } from '../services/api';

export default function ContactModal({ isOpen, onClose, settings }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const whatsappPhone = settings.whatsappNumber || '919876543210';
  const ownerPhone = settings.ownerPhone || '+91 98765 43210';
  const ownerEmail = settings.ownerEmail || 'contact@logicwarriors.dev';

  const handleQuickWhatsApp = () => {
    const text = `Hi Harmeet / Logic Warriors! I visited your website and would like to talk regarding a project/custom software.`;
    window.open(getWhatsAppUrl(whatsappPhone, text), '_blank', 'noopener,noreferrer');
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill your name and phone number');
      return;
    }

    setLoading(true);
    try {
      const fullMessage = `Custom Request: ${customTopic || 'General Inquiry'}\nBudget: ${budget || 'Flexible'}\nDeadline: ${deadline || 'Not specified'}\nDetails: ${message}`;
      await apiAddInquiry({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        projectId: 'custom-req',
        projectTitle: customTopic ? `Custom: ${customTopic}` : 'Custom Project Inquiry',
        message: fullMessage
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Direct Developer Support</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Contact Logic Warriors
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Talk directly to <strong>{settings.ownerName || 'Harmeet Dhiman'}</strong> for ready projects, custom development, or discounts.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* WhatsApp */}
            <button
              onClick={handleQuickWhatsApp}
              className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 transition-all text-left flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">WhatsApp Chat</span>
                <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2">
                <span className="text-xs font-semibold text-emerald-950 block">Instant Reply</span>
                <span className="text-[10px] text-emerald-700">Click to open chat</span>
              </div>
            </button>

            {/* Direct Phone */}
            <a
              href={`tel:${ownerPhone.replace(/\s+/g, '')}`}
              className="p-3.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100/80 transition-all text-left flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800">Direct Phone</span>
                <PhoneCall className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2">
                <span className="text-xs font-semibold text-blue-950 block">{ownerPhone}</span>
                <span className="text-[10px] text-blue-700">Available 9 AM - 10 PM</span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${ownerEmail}`}
              className="p-3.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100/80 transition-all text-left flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-800">Email Support</span>
                <Mail className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2">
                <span className="text-xs font-semibold text-purple-950 block truncate">{ownerEmail}</span>
                <span className="text-[10px] text-purple-700">Formal queries & quotations</span>
              </div>
            </a>
          </div>

          {/* Custom Project Form */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Have a Custom College / Client Project Requirement?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit your project specifications below and receive a guaranteed quote and timeline within 2 hours.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Message Successfully Logged!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you, <strong>{name}</strong>. Your project request has been logged in Harmeet's queue.
                </p>
                <button
                  onClick={handleQuickWhatsApp}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg mt-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Also ping on WhatsApp</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Harmeet / Aman"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Phone *</label>
                    <input 
                      type="text" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Project Domain</label>
                    <input 
                      type="text" 
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g. AI / MERN / Flutter"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Approx Budget (₹)</label>
                    <input 
                      type="text" 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. ₹3,000 - ₹5,000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deadline Date</label>
                    <input 
                      type="text" 
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="e.g. Within 3 days"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Details / Requirements</label>
                  <textarea 
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Briefly describe what features you need (e.g. user login, payment gateway, specific sensor, etc.)..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{loading ? 'Sending...' : 'Send Custom Project Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
