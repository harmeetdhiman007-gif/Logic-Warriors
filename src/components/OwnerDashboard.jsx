import React, { useState, useMemo } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users, 
  Plus, 
  Download, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  Layers, 
  MessageSquare, 
  Settings, 
  ShieldCheck, 
  Save, 
  Database, 
  ExternalLink,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { 
  apiAddSale, 
  apiUpdateSale, 
  apiDeleteSale, 
  apiAddProduct, 
  apiUpdateProduct, 
  apiDeleteProduct, 
  apiUpdateInquiry, 
  apiDeleteInquiry, 
  apiUpdateSettings 
} from '../services/api';

export default function OwnerDashboard({ 
  isOpen, 
  onClose, 
  dbData, 
  onRefreshData 
}) {
  const settings = dbData?.settings || {};
  const products = dbData?.products || [];
  const sales = dbData?.sales || [];
  const inquiries = dbData?.inquiries || [];
  const currency = settings.currencySymbol || '₹';

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('sales'); // 'sales', 'inquiries', 'products', 'settings'

  // Sales Filtering & Search
  const [saleSearch, setSaleSearch] = useState('');
  const [saleStatusFilter, setSaleStatusFilter] = useState('all');

  // New / Edit Sale Modal State
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [saleFormData, setSaleFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    projectId: '',
    projectTitle: '',
    agreedPrice: '',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI / Google Pay',
    deliveryStatus: 'Delivered',
    deliveryMethod: 'GitHub Repo Transfer + Google Drive',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Product CRUD Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productFormData, setProductFormData] = useState({
    title: '',
    category: 'Full-Stack Web',
    price: '',
    originalPrice: '',
    discount: 50,
    badge: 'Logic Prime',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    techStack: 'React, Node.js, MongoDB',
    shortDesc: '',
    description: '',
    deliverables: 'Source Code, Database Scripts, IEEE Report, PPT',
    demoUrl: '',
    githubPreview: ''
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    ownerName: settings.ownerName || 'Harmeet Dhiman',
    brandName: settings.brandName || 'Logic Warriors',
    ownerPhone: settings.ownerPhone || '+91 98765 43210',
    whatsappNumber: settings.whatsappNumber || '919876543210',
    ownerEmail: settings.ownerEmail || 'contact@logicwarriors.dev',
    upiId: settings.upiId || 'harmeet@upi',
    ownerPin: settings.ownerPin || '1234',
    currencySymbol: settings.currencySymbol || '₹',
    tagline: settings.tagline || "India's Premier Tech Project Marketplace"
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!isOpen) return null;

  // PIN Authentication Handler
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = settings.ownerPin || '1234';
    if (enteredPin === correctPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Financial Analytics Calculations
  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, s) => sum + Number(s.agreedPrice || 0), 0);
  }, [sales]);

  const paidRevenue = useMemo(() => {
    return sales.reduce((sum, s) => {
      if (s.paymentStatus === 'Paid') return sum + Number(s.agreedPrice || 0);
      if (s.paymentStatus === 'Partial (Advance)') return sum + (Number(s.agreedPrice || 0) * 0.5);
      return sum;
    }, 0);
  }, [sales]);

  const pendingAmount = totalRevenue - paidRevenue;
  const avgSalePrice = sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0;

  // Filtered Sales
  const filteredSales = sales.filter((s) => {
    const matchesSearch = 
      (s.customerName || '').toLowerCase().includes(saleSearch.toLowerCase()) ||
      (s.projectTitle || '').toLowerCase().includes(saleSearch.toLowerCase()) ||
      (s.customerPhone || '').includes(saleSearch);
    
    const matchesStatus = saleStatusFilter === 'all' || s.paymentStatus === saleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sales Action Handlers
  const handleOpenNewSale = (prefillData = null) => {
    setEditingSaleId(null);
    if (prefillData) {
      setSaleFormData({
        customerName: prefillData.customerName || '',
        customerPhone: prefillData.customerPhone || '',
        customerEmail: prefillData.customerEmail || '',
        projectId: prefillData.projectId || '',
        projectTitle: prefillData.projectTitle || '',
        agreedPrice: prefillData.agreedPrice || '',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI / Google Pay',
        deliveryStatus: 'Delivered',
        deliveryMethod: 'GitHub Repo Transfer + Google Drive',
        date: new Date().toISOString().split('T')[0],
        notes: prefillData.notes || ''
      });
    } else {
      setSaleFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        projectId: products[0]?.id || '',
        projectTitle: products[0]?.title || '',
        agreedPrice: products[0]?.price || '',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI / Google Pay',
        deliveryStatus: 'Delivered',
        deliveryMethod: 'GitHub Repo Transfer + Google Drive',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setIsSaleModalOpen(true);
  };

  const handleEditSale = (sale) => {
    setEditingSaleId(sale.id);
    setSaleFormData({
      customerName: sale.customerName || '',
      customerPhone: sale.customerPhone || '',
      customerEmail: sale.customerEmail || '',
      projectId: sale.projectId || '',
      projectTitle: sale.projectTitle || '',
      agreedPrice: sale.agreedPrice || '',
      paymentStatus: sale.paymentStatus || 'Paid',
      paymentMethod: sale.paymentMethod || 'UPI / Google Pay',
      deliveryStatus: sale.deliveryStatus || 'Delivered',
      deliveryMethod: sale.deliveryMethod || '',
      date: sale.date || new Date().toISOString().split('T')[0],
      notes: sale.notes || ''
    });
    setIsSaleModalOpen(true);
  };

  const handleSaveSale = async (e) => {
    e.preventDefault();
    if (!saleFormData.customerName || !saleFormData.agreedPrice) {
      alert('Please provide customer name and price');
      return;
    }

    if (editingSaleId) {
      await apiUpdateSale(editingSaleId, saleFormData);
    } else {
      await apiAddSale(saleFormData);
    }
    setIsSaleModalOpen(false);
    onRefreshData();
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      await apiDeleteSale(id);
      onRefreshData();
    }
  };

  // CSV Export Download
  const handleExportCSV = () => {
    window.open('/api/export-sales', '_blank');
  };

  // Convert Inquiry to Sale
  const handleConvertInquiry = (inq) => {
    handleOpenNewSale({
      customerName: inq.customerName,
      customerPhone: inq.customerPhone,
      customerEmail: inq.customerEmail,
      projectId: inq.projectId,
      projectTitle: inq.projectTitle,
      notes: `Converted from Inquiry #${inq.id}. Message: ${inq.message}`
    });
  };

  // Product CRUD
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductFormData({
      title: '',
      category: 'Full-Stack Web',
      price: 2999,
      originalPrice: 5999,
      discount: 50,
      badge: 'Logic Prime',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      techStack: 'React, Node.js, Express, MongoDB',
      shortDesc: '',
      description: '',
      deliverables: 'Source Code, Database Scripts, IEEE Report, PPT',
      demoUrl: '',
      githubPreview: ''
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (p) => {
    setEditingProductId(p.id);
    setProductFormData({
      title: p.title,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || '',
      discount: p.discount || 0,
      badge: p.badge || '',
      image: p.image,
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack,
      shortDesc: p.shortDesc || '',
      description: p.description || '',
      deliverables: Array.isArray(p.deliverables) ? p.deliverables.join(', ') : p.deliverables,
      demoUrl: p.demoUrl || '',
      githubPreview: p.githubPreview || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productFormData,
      price: Number(productFormData.price),
      originalPrice: Number(productFormData.originalPrice),
      discount: Number(productFormData.discount),
      techStack: productFormData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      deliverables: productFormData.deliverables.split(',').map(s => s.trim()).filter(Boolean),
      isLogicAssured: true,
      inStock: true
    };

    if (editingProductId) {
      await apiUpdateProduct(editingProductId, payload);
    } else {
      await apiAddProduct(payload);
    }
    setIsProductModalOpen(false);
    onRefreshData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product from your website catalog?')) {
      await apiDeleteProduct(id);
      onRefreshData();
    }
  };

  // Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await apiUpdateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    onRefreshData();
  };

  // Database JSON Backup download
  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `logic-warriors-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 text-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-white">Owner Portal & Sales Ledger</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Private & Protected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track all projects people bought, agreed prices, customer contacts & store management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Lock Dashboard"
              >
                Lock Session
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lock Screen if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-400/40 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-white">Enter Owner PIN to Access</h3>
              <p className="text-xs text-slate-400">
                This dashboard tracks your private revenue, projects people bought, customer phone numbers, and pricing ledger.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4 w-full max-w-xs">
              <div className="relative">
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  value={enteredPin}
                  onChange={(e) => { setEnteredPin(e.target.value); setPinError(false); }}
                  placeholder="Enter 4-digit PIN (default: 1234)"
                  className="w-full text-center tracking-[0.4em] text-lg font-bold bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {pinError && (
                <div className="text-red-400 text-xs font-semibold flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Incorrect PIN. (Default is 1234)</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl transition-colors shadow-lg"
              >
                Unlock Dashboard
              </button>
            </form>

            <div className="text-[11px] text-slate-500">
              Default owner PIN is set to <strong className="text-slate-300">1234</strong>. You can change this in Owner Settings.
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Content */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Executive Analytics Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800">
              
              {/* Total Revenue */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Sales Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-2">
                  {currency}{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                  From {sales.length} logged sales
                </div>
              </div>

              {/* Total Projects Sold */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Projects Sold</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-2">
                  {sales.length} Units
                </div>
                <div className="text-[10px] text-blue-400 font-semibold mt-1">
                  Avg: {currency}{avgSalePrice.toLocaleString('en-IN')} / project
                </div>
              </div>

              {/* Pending / Due Revenue */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Pending / Due Payments</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 mt-2">
                  {currency}{pendingAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Advances & unpaid orders
                </div>
              </div>

              {/* Active Inquiries */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Customer Leads / Inquiries</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-2">
                  {inquiries.length} Inquiries
                </div>
                <div className="text-[10px] text-purple-400 font-semibold mt-1">
                  From website visitors
                </div>
              </div>

            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-slate-900 px-6 border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'sales'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Sales & Projects Sold ({sales.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'inquiries'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Customer Inquiries ({inquiries.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'products'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Catalog Products ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'settings'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings & Backup</span>
                </button>
              </div>

              {/* Action Buttons depending on tab */}
              {activeTab === 'sales' && (
                <div className="flex items-center gap-2 shrink-0 py-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                    title="Export complete sales records to Excel/CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => handleOpenNewSale()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Record New Sale</span>
                  </button>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="shrink-0 py-2">
                  <button
                    onClick={handleOpenNewProduct}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project to Store</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: SALES & PROJECTS SOLD LEDGER */}
            {activeTab === 'sales' && (
              <div className="p-4 sm:p-6 space-y-4">
                
                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={saleSearch}
                      onChange={(e) => setSaleSearch(e.target.value)}
                      placeholder="Search customer, project, phone..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs text-slate-400">Payment Status:</span>
                    <select
                      value={saleStatusFilter}
                      onChange={(e) => setSaleStatusFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-400"
                    >
                      <option value="all">All Payments</option>
                      <option value="Paid">Fully Paid</option>
                      <option value="Partial (Advance)">Partial (Advance)</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Sales Ledger Table */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4 font-bold">Date & ID</th>
                        <th className="py-3 px-4 font-bold">Customer Details</th>
                        <th className="py-3 px-4 font-bold">Project Bought</th>
                        <th className="py-3 px-4 font-bold">Price Sold</th>
                        <th className="py-3 px-4 font-bold">Payment</th>
                        <th className="py-3 px-4 font-bold">Delivery Status</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredSales.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            No sales records found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredSales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-slate-900/60 transition-colors">
                            
                            {/* Date & ID */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-semibold text-white block">{sale.date}</span>
                              <span className="text-[10px] text-slate-500 font-mono">#{sale.id}</span>
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-200 block">{sale.customerName}</span>
                              <span className="text-[11px] text-slate-400">{sale.customerPhone}</span>
                              {sale.customerEmail && (
                                <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">{sale.customerEmail}</span>
                              )}
                            </td>

                            {/* Project Title */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="font-semibold text-blue-400 block line-clamp-2">
                                {sale.projectTitle}
                              </span>
                              {sale.notes && (
                                <span className="text-[10px] text-slate-400 line-clamp-1 italic mt-0.5">
                                  "{sale.notes}"
                                </span>
                              )}
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="text-sm font-black text-amber-400">
                                {currency}{Number(sale.agreedPrice || 0).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-slate-500 block">{sale.paymentMethod || 'UPI'}</span>
                            </td>

                            {/* Payment Status Badge */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                sale.paymentStatus === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : sale.paymentStatus === 'Partial (Advance)'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {sale.paymentStatus === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                                {sale.paymentStatus === 'Partial (Advance)' && <Clock className="w-3 h-3" />}
                                {sale.paymentStatus}
                              </span>
                            </td>

                            {/* Delivery Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="text-[11px] text-slate-300 font-medium block">
                                {sale.deliveryStatus || 'Delivered'}
                              </span>
                              <span className="text-[10px] text-slate-500 truncate max-w-[140px] block">
                                {sale.deliveryMethod || 'GitHub Repo'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditSale(sale)}
                                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                                  title="Edit Sale Record"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSale(sale.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 2: INQUIRIES & LEADS INBOX */}
            {activeTab === 'inquiries' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-200">
                    Incoming Customer Inquiries ({inquiries.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Click "Convert to Sale" once a customer agrees to buy.
                  </span>
                </div>

                <div className="space-y-3">
                  {inquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                      No incoming customer inquiries right now.
                    </div>
                  ) : (
                    inquiries.map((inq) => (
                      <div key={inq.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-slate-700 transition-colors">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{inq.customerName}</span>
                            <span className="text-[10px] text-slate-500">{inq.date}</span>
                            <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30">
                              {inq.status || 'Pending'}
                            </span>
                          </div>

                          <div className="text-xs text-amber-400 font-semibold">
                            Project: {inq.projectTitle}
                          </div>

                          <p className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 whitespace-pre-wrap">
                            {inq.message}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                            <span>📞 {inq.customerPhone}</span>
                            {inq.customerEmail && <span>✉️ {inq.customerEmail}</span>}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
                          <button
                            onClick={() => handleConvertInquiry(inq)}
                            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Convert to Sale</span>
                          </button>
                          
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this inquiry?')) {
                                await apiDeleteInquiry(inq.id);
                                onRefreshData();
                              }
                            }}
                            className="text-slate-500 hover:text-red-400 text-xs p-1.5 rounded hover:bg-slate-800"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCT CATALOG CRUD */}
            {activeTab === 'products' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition-colors">
                      <div>
                        <div className="aspect-[16/9] relative bg-slate-900">
                          <img src={p.image} alt="" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {p.category}
                          </div>
                        </div>
                        <div className="p-3.5 space-y-2">
                          <h4 className="font-bold text-sm text-white line-clamp-1">{p.title}</h4>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-amber-400">
                              {currency}{Number(p.price).toLocaleString('en-IN')}
                            </span>
                            {p.originalPrice && (
                              <span className="text-xs text-slate-500 line-through">
                                {currency}{Number(p.originalPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {p.shortDesc || p.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SETTINGS & BACKUP */}
            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
                <form onSubmit={handleSaveSettings} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>Owner Contact & Brand Profile</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={settingsForm.ownerName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Store Brand Name</label>
                      <input
                        type="text"
                        value={settingsForm.brandName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        WhatsApp Number (with country code, no +)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        placeholder="e.g. 919876543210"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Display Phone Number</label>
                      <input
                        type="text"
                        value={settingsForm.ownerPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ownerPhone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Owner Email</label>
                      <input
                        type="email"
                        value={settingsForm.ownerEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ownerEmail: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Owner Access PIN (4 digits)</label>
                      <input
                        type="password"
                        maxLength={8}
                        value={settingsForm.ownerPin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ownerPin: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {settingsSaved && (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Settings updated successfully!</span>
                      </span>
                    )}
                    <button
                      type="submit"
                      className="ml-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </form>

                {/* Database Backup & Disaster Recovery */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Data Backup & Safe Storage</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    All your sales, products, and leads are saved on the filesystem and synced to localStorage. You can also download an offline backup anytime.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleDownloadBackup}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Download JSON Backup</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Download Excel / CSV Sales Book</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* MODAL: RECORD OR EDIT SALE */}
        {isSaleModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-sm text-amber-400">
                  {editingSaleId ? 'Edit Sale Record' : 'Record New Sale in Ledger'}
                </h3>
                <button 
                  onClick={() => setIsSaleModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSale} className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={saleFormData.customerName}
                      onChange={(e) => setSaleFormData({ ...saleFormData, customerName: e.target.value })}
                      placeholder="e.g. Aman Sharma"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Customer Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={saleFormData.customerPhone}
                      onChange={(e) => setSaleFormData({ ...saleFormData, customerPhone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={saleFormData.customerEmail}
                    onChange={(e) => setSaleFormData({ ...saleFormData, customerEmail: e.target.value })}
                    placeholder="customer@gmail.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Project Bought / Custom Project Title *</label>
                  <input
                    type="text"
                    required
                    value={saleFormData.projectTitle}
                    onChange={(e) => setSaleFormData({ ...saleFormData, projectTitle: e.target.value })}
                    placeholder="e.g. Full-Stack E-Commerce Platform"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Agreed Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={saleFormData.agreedPrice}
                      onChange={(e) => setSaleFormData({ ...saleFormData, agreedPrice: e.target.value })}
                      placeholder="e.g. 3500"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Sale Date</label>
                    <input
                      type="date"
                      value={saleFormData.date}
                      onChange={(e) => setSaleFormData({ ...saleFormData, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Payment Status</label>
                    <select
                      value={saleFormData.paymentStatus}
                      onChange={(e) => setSaleFormData({ ...saleFormData, paymentStatus: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Paid">Fully Paid</option>
                      <option value="Partial (Advance)">Partial (Advance)</option>
                      <option value="Pending">Pending Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Payment Mode</label>
                    <input
                      type="text"
                      value={saleFormData.paymentMethod}
                      onChange={(e) => setSaleFormData({ ...saleFormData, paymentMethod: e.target.value })}
                      placeholder="UPI / GPay / Cash"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Delivery Status</label>
                    <select
                      value={saleFormData.deliveryStatus}
                      onChange={(e) => setSaleFormData({ ...saleFormData, deliveryStatus: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Delivered">Delivered & Set up</option>
                      <option value="In Progress">Setup In Progress</option>
                      <option value="Pending">Pending Handover</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Delivery Method</label>
                    <input
                      type="text"
                      value={saleFormData.deliveryMethod}
                      onChange={(e) => setSaleFormData({ ...saleFormData, deliveryMethod: e.target.value })}
                      placeholder="GitHub / Google Drive / ZIP"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Private Notes / Remarks</label>
                  <textarea
                    rows={2}
                    value={saleFormData.notes}
                    onChange={(e) => setSaleFormData({ ...saleFormData, notes: e.target.value })}
                    placeholder="e.g., Helped with AnyDesk setup on his laptop. Final year CS student."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSaleModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                  >
                    {editingSaleId ? 'Update Record' : 'Save to Ledger'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PRODUCT */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-xl rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-sm text-blue-400">
                  {editingProductId ? 'Edit Store Product' : 'Add New Project to Store'}
                </h3>
                <button 
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.title}
                    onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                    placeholder="e.g. AI-Powered Medical Diagnosis System"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="Full-Stack Web">Full-Stack Web</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                      <option value="IoT & Hardware">IoT & Hardware</option>
                      <option value="Python Automation">Python Automation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={productFormData.badge}
                      onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                      placeholder="e.g. Bestseller / Logic Prime"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                      placeholder="e.g. 3499"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">M.R.P Price (₹)</label>
                    <input
                      type="number"
                      value={productFormData.originalPrice}
                      onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                      placeholder="e.g. 6999"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={productFormData.discount}
                      onChange={(e) => setProductFormData({ ...productFormData, discount: e.target.value })}
                      placeholder="50"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productFormData.image}
                    onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={productFormData.techStack}
                    onChange={(e) => setProductFormData({ ...productFormData, techStack: e.target.value })}
                    placeholder="React, Node.js, MongoDB, Tailwind"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Short Summary (1-2 sentences)</label>
                  <input
                    type="text"
                    value={productFormData.shortDesc}
                    onChange={(e) => setProductFormData({ ...productFormData, shortDesc: e.target.value })}
                    placeholder="Quick overview for product card"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    placeholder="Complete features, architecture, and system details"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Live Demo Preview URL</label>
                    <input
                      type="url"
                      value={productFormData.demoUrl}
                      onChange={(e) => setProductFormData({ ...productFormData, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">GitHub Preview URL</label>
                    <input
                      type="url"
                      value={productFormData.githubPreview}
                      onChange={(e) => setProductFormData({ ...productFormData, githubPreview: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  >
                    {editingProductId ? 'Update Product' : 'Add to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
