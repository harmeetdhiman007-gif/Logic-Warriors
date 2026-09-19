import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read database safely
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { settings: {}, products: [], sales: [], inquiries: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { settings: {}, products: [], sales: [], inquiries: [] };
  }
}

// Helper function to write database safely
function writeDB(data) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// Full DB sync endpoint
app.get('/api/db', (req, res) => {
  const db = readDB();
  res.json(db);
});

// ================= PRODUCTS API =================
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});

app.post('/api/products', (req, res) => {
  const db = readDB();
  const newProduct = {
    id: `lw-proj-${Date.now().toString().slice(-6)}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.products = db.products || [];
  db.products.unshift(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const db = readDB();
  const index = (db.products || []).findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products[index] = { ...db.products[index], ...req.body };
  writeDB(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDB();
  db.products = (db.products || []).filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Product deleted' });
});

// ================= SALES TRACKER API (OWNER) =================
app.get('/api/sales', (req, res) => {
  const db = readDB();
  res.json(db.sales || []);
});

app.post('/api/sales', (req, res) => {
  const db = readDB();
  const newSale = {
    id: `sale-${Date.now().toString().slice(-6)}`,
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.sales = db.sales || [];
  db.sales.unshift(newSale);
  writeDB(db);
  res.status(201).json(newSale);
});

app.put('/api/sales/:id', (req, res) => {
  const db = readDB();
  const index = (db.sales || []).findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Sale record not found' });
  }
  db.sales[index] = { ...db.sales[index], ...req.body };
  writeDB(db);
  res.json(db.sales[index]);
});

app.delete('/api/sales/:id', (req, res) => {
  const db = readDB();
  db.sales = (db.sales || []).filter(s => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Sale record deleted' });
});

// CSV Export for Sales Ledger
app.get('/api/export-sales', (req, res) => {
  const db = readDB();
  const sales = db.sales || [];
  
  const headers = ['Sale ID', 'Date', 'Customer Name', 'Customer Phone', 'Customer Email', 'Project Title', 'Agreed Price (INR)', 'Payment Status', 'Payment Method', 'Delivery Status', 'Delivery Method', 'Notes'];
  const rows = sales.map(s => [
    `"${s.id || ''}"`,
    `"${s.date || ''}"`,
    `"${(s.customerName || '').replace(/"/g, '""')}"`,
    `"${s.customerPhone || ''}"`,
    `"${s.customerEmail || ''}"`,
    `"${(s.projectTitle || '').replace(/"/g, '""')}"`,
    `"${s.agreedPrice || 0}"`,
    `"${s.paymentStatus || ''}"`,
    `"${s.paymentMethod || ''}"`,
    `"${s.deliveryStatus || ''}"`,
    `"${(s.deliveryMethod || '').replace(/"/g, '""')}"`,
    `"${(s.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="logic-warriors-sales-ledger.csv"');
  res.send(csvContent);
});

// ================= INQUIRIES API =================
app.get('/api/inquiries', (req, res) => {
  const db = readDB();
  res.json(db.inquiries || []);
});

app.post('/api/inquiries', (req, res) => {
  const db = readDB();
  const newInquiry = {
    id: `inq-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    ...req.body
  };
  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);
  writeDB(db);
  res.status(201).json(newInquiry);
});

app.put('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  const index = (db.inquiries || []).findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  db.inquiries[index] = { ...db.inquiries[index], ...req.body };
  writeDB(db);
  res.json(db.inquiries[index]);
});

app.delete('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  db.inquiries = (db.inquiries || []).filter(i => i.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Inquiry deleted' });
});

// ================= OWNER SETTINGS =================
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings || {});
});

app.post('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json(db.settings);
});

// ================= BACKUP & RESTORE =================
app.post('/api/backup-restore', (req, res) => {
  const newDb = req.body;
  if (!newDb || !Array.isArray(newDb.products)) {
    return res.status(400).json({ error: 'Invalid backup format' });
  }
  writeDB(newDb);
  res.json({ success: true, message: 'Database restored successfully' });
});

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Logic Warriors Backend running on http://localhost:${PORT}`);
});
