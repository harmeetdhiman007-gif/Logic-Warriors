// Robust API service with automatic localStorage fallback
const STORAGE_KEY = 'logic_warriors_store_v1';

// Initial fallback state if offline or no backend
const DEFAULT_INITIAL_STATE = {
  settings: {
    ownerName: "Harmeet Dhiman",
    brandName: "Logic Warriors",
    ownerPhone: "+91 98765 43210",
    whatsappNumber: "919876543210",
    ownerEmail: "contact@logicwarriors.dev",
    upiId: "harmeet@upi",
    ownerPin: "1234",
    currencySymbol: "₹",
    tagline: "India's Premier Tech Project & Source Code Marketplace"
  },
  products: [],
  sales: [],
  inquiries: []
};

// Local storage helpers
export function getLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return null;
}

export function saveLocalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

// Fetch all database records
export async function fetchAllData() {
  try {
    const res = await fetch('/api/db');
    if (res.ok) {
      const data = await res.json();
      saveLocalData(data);
      return data;
    }
  } catch (err) {
    console.warn('Backend not reachable, loading from localStorage cache:', err.message);
  }

  const local = getLocalData();
  if (local) return local;

  // Fallback to initial seed if empty
  return DEFAULT_INITIAL_STATE;
}

// Product Actions
export async function apiAddProduct(product) {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error, falling back to local storage:', err);
  }
  
  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  const newProduct = {
    id: `lw-proj-${Date.now().toString().slice(-6)}`,
    ...product,
    createdAt: new Date().toISOString()
  };
  current.products.unshift(newProduct);
  saveLocalData(current);
  return newProduct;
}

export async function apiUpdateProduct(id, product) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  const index = current.products.findIndex(p => p.id === id);
  if (index !== -1) {
    current.products[index] = { ...current.products[index], ...product };
    saveLocalData(current);
    return current.products[index];
  }
  return null;
}

export async function apiDeleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  current.products = current.products.filter(p => p.id !== id);
  saveLocalData(current);
  return true;
}

// Sales Actions (Owner)
export async function apiAddSale(sale) {
  try {
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  const newSale = {
    id: `sale-${Date.now().toString().slice(-6)}`,
    date: sale.date || new Date().toISOString().split('T')[0],
    ...sale
  };
  current.sales = current.sales || [];
  current.sales.unshift(newSale);
  saveLocalData(current);
  return newSale;
}

export async function apiUpdateSale(id, sale) {
  try {
    const res = await fetch(`/api/sales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  const index = (current.sales || []).findIndex(s => s.id === id);
  if (index !== -1) {
    current.sales[index] = { ...current.sales[index], ...sale };
    saveLocalData(current);
    return current.sales[index];
  }
  return null;
}

export async function apiDeleteSale(id) {
  try {
    const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  current.sales = (current.sales || []).filter(s => s.id !== id);
  saveLocalData(current);
  return true;
}

// Inquiries Actions
export async function apiAddInquiry(inquiry) {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  const newInquiry = {
    id: `inq-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    ...inquiry
  };
  current.inquiries = current.inquiries || [];
  current.inquiries.unshift(newInquiry);
  saveLocalData(current);
  return newInquiry;
}

export async function apiUpdateInquiry(id, update) {
  try {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  const index = (current.inquiries || []).findIndex(i => i.id === id);
  if (index !== -1) {
    current.inquiries[index] = { ...current.inquiries[index], ...update };
    saveLocalData(current);
    return current.inquiries[index];
  }
  return null;
}

export async function apiDeleteInquiry(id) {
  try {
    const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  current.inquiries = (current.inquiries || []).filter(i => i.id !== id);
  saveLocalData(current);
  return true;
}

// Settings
export async function apiUpdateSettings(settings) {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API error:', err);
  }

  const current = getLocalData() || DEFAULT_INITIAL_STATE;
  current.settings = { ...current.settings, ...settings };
  saveLocalData(current);
  return current.settings;
}

// Generate WhatsApp Link helper
export function getWhatsAppUrl(phone, text) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(text || '');
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
