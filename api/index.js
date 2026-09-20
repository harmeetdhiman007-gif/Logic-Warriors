import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(cors());
app.use(express.json());

// ──────────────────────────────────────────────
//  Neon PostgreSQL Connection
// ──────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;
let sql;

if (DATABASE_URL) {
  sql = neon(DATABASE_URL);
} else {
  console.warn('⚠️  DATABASE_URL not set — API will return 503.');
}

// ──────────────────────────────────────────────
//  Auto-create tables on first cold start
// ──────────────────────────────────────────────
async function initDB() {
  if (!sql) return;
  try {
    await sql`CREATE TABLE IF NOT EXISTS products   (id TEXT PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS sales      (id TEXT PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS inquiries   (id TEXT PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS settings    (id INT  PRIMARY KEY DEFAULT 1,  data JSONB NOT NULL DEFAULT '{}')`;
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

const dbReady = initDB();

async function guard(res) {
  await dbReady;
  if (!sql) { res.status(503).json({ error: 'DATABASE_URL not configured' }); return false; }
  return true;
}

// ════════════════════════════════════════════════
//  FULL DB SYNC
// ════════════════════════════════════════════════
app.get('/api/db', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const [products, sales, inquiries, sRows] = await Promise.all([
      sql`SELECT data FROM products   ORDER BY created_at DESC`,
      sql`SELECT data FROM sales      ORDER BY created_at DESC`,
      sql`SELECT data FROM inquiries   ORDER BY created_at DESC`,
      sql`SELECT data FROM settings    WHERE id = 1`,
    ]);
    res.json({
      products:  products.map(r => r.data),
      sales:     sales.map(r => r.data),
      inquiries: inquiries.map(r => r.data),
      settings:  sRows[0]?.data || {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database read failed' });
  }
});

// ════════════════════════════════════════════════
//  PRODUCTS
// ════════════════════════════════════════════════
app.get('/api/products', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const rows = await sql`SELECT data FROM products ORDER BY created_at DESC`;
    res.json(rows.map(r => r.data));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch products' }); }
});

app.post('/api/products', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const p = { id: `lw-proj-${Date.now().toString().slice(-6)}`, ...req.body, createdAt: new Date().toISOString() };
    await sql`INSERT INTO products (id, data) VALUES (${p.id}, ${JSON.stringify(p)})`;
    res.status(201).json(p);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add product' }); }
});

app.put('/api/products/:id', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const [existing] = await sql`SELECT data FROM products WHERE id = ${req.params.id}`;
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    const updated = { ...existing.data, ...req.body };
    await sql`UPDATE products SET data = ${JSON.stringify(updated)} WHERE id = ${req.params.id}`;
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update product' }); }
});

app.delete('/api/products/:id', async (req, res) => {
  if (!await guard(res)) return;
  try {
    await sql`DELETE FROM products WHERE id = ${req.params.id}`;
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to delete product' }); }
});

// ════════════════════════════════════════════════
//  SALES
// ════════════════════════════════════════════════
app.get('/api/sales', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const rows = await sql`SELECT data FROM sales ORDER BY created_at DESC`;
    res.json(rows.map(r => r.data));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch sales' }); }
});

app.post('/api/sales', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const s = { id: `sale-${Date.now().toString().slice(-6)}`, date: req.body.date || new Date().toISOString().split('T')[0], ...req.body };
    await sql`INSERT INTO sales (id, data) VALUES (${s.id}, ${JSON.stringify(s)})`;
    res.status(201).json(s);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add sale' }); }
});

app.put('/api/sales/:id', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const [existing] = await sql`SELECT data FROM sales WHERE id = ${req.params.id}`;
    if (!existing) return res.status(404).json({ error: 'Sale not found' });
    const updated = { ...existing.data, ...req.body };
    await sql`UPDATE sales SET data = ${JSON.stringify(updated)} WHERE id = ${req.params.id}`;
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update sale' }); }
});

app.delete('/api/sales/:id', async (req, res) => {
  if (!await guard(res)) return;
  try {
    await sql`DELETE FROM sales WHERE id = ${req.params.id}`;
    res.json({ success: true, message: 'Sale deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to delete sale' }); }
});

// CSV Export
app.get('/api/export-sales', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const rows = await sql`SELECT data FROM sales ORDER BY created_at DESC`;
    const sales = rows.map(r => r.data);
    const headers = ['Sale ID','Date','Customer Name','Customer Phone','Customer Email','Project Title','Agreed Price (INR)','Payment Status','Payment Method','Delivery Status','Delivery Method','Notes'];
    const csvRows = sales.map(s => [
      `"${s.id || ''}"`, `"${s.date || ''}"`,
      `"${(s.customerName || '').replace(/"/g, '""')}"`, `"${s.customerPhone || ''}"`,
      `"${s.customerEmail || ''}"`, `"${(s.projectTitle || '').replace(/"/g, '""')}"`,
      `"${s.agreedPrice || 0}"`, `"${s.paymentStatus || ''}"`,
      `"${s.paymentMethod || ''}"`, `"${s.deliveryStatus || ''}"`,
      `"${(s.deliveryMethod || '').replace(/"/g, '""')}"`, `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="logic-warriors-sales.csv"');
    res.send(csv);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Export failed' }); }
});

// ════════════════════════════════════════════════
//  INQUIRIES
// ════════════════════════════════════════════════
app.get('/api/inquiries', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const rows = await sql`SELECT data FROM inquiries ORDER BY created_at DESC`;
    res.json(rows.map(r => r.data));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch inquiries' }); }
});

app.post('/api/inquiries', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const inq = { id: `inq-${Date.now().toString().slice(-6)}`, date: new Date().toISOString().split('T')[0], status: 'Pending', ...req.body };
    await sql`INSERT INTO inquiries (id, data) VALUES (${inq.id}, ${JSON.stringify(inq)})`;
    res.status(201).json(inq);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add inquiry' }); }
});

app.put('/api/inquiries/:id', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const [existing] = await sql`SELECT data FROM inquiries WHERE id = ${req.params.id}`;
    if (!existing) return res.status(404).json({ error: 'Inquiry not found' });
    const updated = { ...existing.data, ...req.body };
    await sql`UPDATE inquiries SET data = ${JSON.stringify(updated)} WHERE id = ${req.params.id}`;
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update inquiry' }); }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  if (!await guard(res)) return;
  try {
    await sql`DELETE FROM inquiries WHERE id = ${req.params.id}`;
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to delete inquiry' }); }
});

// ════════════════════════════════════════════════
//  SETTINGS
// ════════════════════════════════════════════════
app.get('/api/settings', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const rows = await sql`SELECT data FROM settings WHERE id = 1`;
    res.json(rows[0]?.data || {});
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch settings' }); }
});

app.post('/api/settings', async (req, res) => {
  if (!await guard(res)) return;
  try {
    const rows = await sql`SELECT data FROM settings WHERE id = 1`;
    const current = rows[0]?.data || {};
    const merged = { ...current, ...req.body };
    await sql`INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(merged)}) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(merged)}`;
    res.json(merged);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update settings' }); }
});

// ════════════════════════════════════════════════
//  BACKUP & RESTORE
// ════════════════════════════════════════════════
app.post('/api/backup-restore', async (req, res) => {
  if (!await guard(res)) return;
  const db = req.body;
  if (!db || !Array.isArray(db.products)) return res.status(400).json({ error: 'Invalid backup format' });

  try {
    // Clear existing data
    await sql`DELETE FROM products`;
    await sql`DELETE FROM sales`;
    await sql`DELETE FROM inquiries`;

    // Insert restored data
    for (const p of db.products) {
      await sql`INSERT INTO products (id, data) VALUES (${p.id}, ${JSON.stringify(p)}) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(p)}`;
    }
    for (const s of (db.sales || [])) {
      await sql`INSERT INTO sales (id, data) VALUES (${s.id}, ${JSON.stringify(s)}) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(s)}`;
    }
    for (const i of (db.inquiries || [])) {
      await sql`INSERT INTO inquiries (id, data) VALUES (${i.id}, ${JSON.stringify(i)}) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(i)}`;
    }
    if (db.settings) {
      await sql`INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(db.settings)}) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(db.settings)}`;
    }

    res.json({ success: true, message: 'Database restored successfully' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Restore failed' }); }
});

// Health check
app.get('/api/health', async (req, res) => {
  const dbOk = sql ? await sql`SELECT 1`.then(() => true).catch(() => false) : false;
  res.json({ status: 'ok', database: dbOk ? 'connected' : 'disconnected', timestamp: new Date().toISOString() });
});

export default app;
