#!/usr/bin/env node
/**
 * Logic Warriors — Neon Database Seeder
 *
 * Reads server/data/db.json and inserts all records into the Neon PostgreSQL
 * database specified by DATABASE_URL in your .env file.
 *
 * Usage:
 *   1. Copy .env.example → .env and paste your Neon connection string.
 *   2. Run:  node scripts/seed.js
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set. Create a .env file from .env.example first.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seed() {
  // 1. Read the local JSON data
  const dbPath = join(__dirname, '..', 'server', 'data', 'db.json');
  const data = JSON.parse(readFileSync(dbPath, 'utf-8'));

  // 2. Create tables
  console.log('🔧 Creating tables …');
  await sql`CREATE TABLE IF NOT EXISTS products   (id TEXT PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS sales      (id TEXT PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS inquiries   (id TEXT PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS settings    (id INT  PRIMARY KEY DEFAULT 1,  data JSONB NOT NULL DEFAULT '{}')`;
  console.log('✅ Tables ready');

  // 3. Seed products
  const products = data.products || [];
  console.log(`📦 Seeding ${products.length} products …`);
  for (const p of products) {
    await sql`INSERT INTO products (id, data) VALUES (${p.id}, ${JSON.stringify(p)})
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
  }

  // 4. Seed sales
  const sales = data.sales || [];
  console.log(`💰 Seeding ${sales.length} sales …`);
  for (const s of sales) {
    await sql`INSERT INTO sales (id, data) VALUES (${s.id}, ${JSON.stringify(s)})
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
  }

  // 5. Seed inquiries
  const inquiries = data.inquiries || [];
  console.log(`📩 Seeding ${inquiries.length} inquiries …`);
  for (const i of inquiries) {
    await sql`INSERT INTO inquiries (id, data) VALUES (${i.id}, ${JSON.stringify(i)})
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
  }

  // 6. Seed settings
  console.log('⚙️  Seeding settings …');
  await sql`INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(data.settings || {})})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;

  console.log('\n🎉 Database seeded successfully!');
  console.log(`   Products : ${products.length}`);
  console.log(`   Sales    : ${sales.length}`);
  console.log(`   Inquiries: ${inquiries.length}`);
  console.log(`   Settings : loaded`);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
