# Logic Warriors 🛡️
> **India's Premier Tech Project & Source Code Marketplace**

An Amazon / Flipkart styled e-commerce platform designed for **Logic Warriors** by Harmeet Dhiman. Visitors can browse verified software projects, view prices and discounts, and directly contact the owner via WhatsApp or call to purchase. Includes a secure, private Owner Portal for tracking projects sold, revenue, customer contacts, and selling prices.

---

## 🌟 Key Features

### 🛒 1. Customer-Facing Showcase (Amazon / Flipkart Style)
- **Mega Header Navigation**:
  - Central search bar with real-time multi-tag and description filtering.
  - Category selector dropdown.
  - "Deliver to All India" instant digital download & setup indicator.
  - Cart / Shortlist drawer to bundle multiple projects for combo inquiries.
- **Secondary Category Strip**:
  - Horizontal quick pills (*Full-Stack Web*, *AI & Machine Learning*, *Mobile Apps*, *IoT & Hardware*, *Python Automation*).
  - Price filters (*Under ₹3000*, *Under ₹4000*, *₹4000 & Above*).
  - Sorting (*Featured*, *Price: Low to High*, *Price: High to Low*, *Top Customer Rated*).
- **Flipkart/Amazon Hero Banner Carousel**:
  - Automated promotions for project drops, custom development requests, and verified code guarantees.
- **Product Card & Catalog Grid**:
  - Ratings & reviews breakdown (e.g. 4.9 ★).
  - Special Selling Price in ₹, M.R.P strike-through, and discount percentage tags.
  - "Logic Assured" 100% bug-free badges.
  - Tech stack tags (React, Node, Python, Flutter, etc.).
  - 1-Tap **WhatsApp Buy** button with pre-filled message.
- **Comprehensive Product Details Modal**:
  - Screenshot gallery with thumbnail switching.
  - Live Demo & GitHub preview links.
  - What's Included checklist (Source Code, Database, Setup Video, IEEE Report, PPT, 1-on-1 AnyDesk Setup).
  - In-modal direct customer inquiry form.
- **Floating WhatsApp Widget**:
  - Sticky bottom-right chat button with online indicator for immediate contact.

---

### 💼 2. Private Owner Dashboard ("For Myself")
- **PIN Protected Access**:
  - Accessible via the "Owner Portal" link in the navbar or footer.
  - **Default PIN:** `1234` (customizable in settings).
- **Sales & Projects Sold Ledger (Core Tracking System)**:
  - Table of all sales: Customer Name, Phone, Email, Project Bought, Agreed Selling Price, Payment Status (*Paid*, *Partial Advance*, *Pending*), Delivery Status, Delivery Method (*GitHub*, *Drive*, *ZIP*), and Private Notes.
  - Search and filter sales by customer name, project title, phone number, or payment status.
  - **"Record New Sale" Modal**: Quick form to record any deal finalized on WhatsApp, call, or offline.
  - **Export Sales to CSV / Excel**: One-click download of the complete sales ledger for offline bookkeeping.
- **Financial Analytics Overview**:
  - Total Sales Revenue (₹)
  - Total Projects Sold
  - Average Project Selling Price (₹)
  - Outstanding / Pending Payments (₹)
- **Customer Inquiries Inbox**:
  - Logs all messages and leads submitted on the website.
  - One-click **"Convert to Sale"** button to auto-fill customer info directly into the sales ledger.
- **Store Catalog Management (CRUD)**:
  - Add new projects with custom images, prices, tech tags, descriptions, and demo links.
  - Edit or delete existing projects.
- **Owner Profile & Settings**:
  - Change Owner PIN, WhatsApp number, phone number, email, and UPI ID.
  - Download JSON database backups.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Both Backend & Frontend in Development Mode
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### 3. Production Build
```bash
npm run build
npm run server
```

---

## 🔒 Owner Access Credentials
- **Default PIN:** `1234`
- You can change this PIN anytime in the **Settings & Backup** tab inside the Owner Dashboard.

---

## 📁 Project Structure
```
logic-warriors/
├── public/
│   └── logo.svg                 # Logic Warriors Shield Logo
├── server/
│   ├── data/
│   │   └── db.json              # Local JSON database (Products, Sales, Inquiries, Settings)
│   └── index.js                 # Express REST API & CSV exporter
├── src/
│   ├── components/
│   │   ├── CartDrawer.jsx       # Shortlist & bundle inquiry drawer
│   │   ├── CategoryBar.jsx      # Secondary category navigation & filters
│   │   ├── ContactModal.jsx     # Direct contact & custom request modal
│   │   ├── FloatingWhatsApp.jsx # Sticky bottom-right WhatsApp quick chat
│   │   ├── HeroCarousel.jsx     # Amazon/Flipkart style promotional banner
│   │   ├── Navbar.jsx           # Mega search header with delivery pill
│   │   ├── OwnerDashboard.jsx   # Private PIN-protected sales ledger & analytics
│   │   ├── ProductCard.jsx      # Amazon/Flipkart style product cards
│   │   ├── ProductDetailModal.jsx # Full gallery, specs & instant order modal
│   │   └── TrustBadges.jsx      # Verified code & 1-on-1 support strip
│   ├── services/
│   │   └── api.js               # Dual persistence (Server API + localStorage fallback)
│   ├── App.jsx                  # Root application coordinator
│   ├── index.css                # Tailwind base & custom animations
│   └── main.jsx                 # React DOM mount point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---
© Logic Warriors • Built with React, Tailwind CSS, Express, and Lucide.
