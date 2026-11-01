# 🏖️ TripDesk Holidays — "Desk to Destination"

> **Production-ready, ultra-smooth, animation-rich India tour & travel web platform with a private Owner Admin Dashboard, dynamic price controls, Google Forms integration, and light/dark theme architecture.**

![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Smooth_14.9-FF0055?style=for-the-badge&logo=framer)
![Vercel Ready](https://img.shields.io/badge/Vercel-Ready_to_Deploy-000000?style=for-the-badge&logo=vercel)

---

## 🌟 Highlights & Capabilities

- 🎨 **Bespoke Luxury Visual System**:
  - **Primary / Dark Chocolate Brown**: `#351202`
  - **Accent / Mustard Golden Yellow**: `#DB9309`
  - **Background / Warm Cream**: `#FEFAEE`
  - **Dark Mode**: Rich obsidian luxury palette (`#120904`, `#1D1008`) with instant toggle switch (☀️ / 🌙).
  - **Typography**: Headings in *DM Serif Display*, body & UI in *Montserrat*.
- 🏔️ **8 Curated Pan-India Tour Packages (Pre-loaded)**:
  - Kashmir (Dal Lake & Gulmarg)
  - Himachal Pradesh (Manali, Solang & Kasol Parvati Trail)
  - Rajasthan (Jaipur, Jodhpur & Udaipur Royal Havelis)
  - Kerala (Munnar Tea Hills & Alleppey Houseboats)
  - Goa (Sunsets, Catamarans & Latin Quarters)
  - Uttarakhand (Rishikesh Rafting & Mussoorie Hills)
  - Andaman (Radhanagar Beach & Scuba Paradise)
  - Meghalaya (Cherrapunji & Living Root Bridges)
- ⚙️ **Private Owner Control Center (`/dashboard`)**:
  - Hidden from public navbar (accessible strictly via `/dashboard`).
  - Protected with unique master credentials.
  - **Full Package Management (CRUD)** with multi-image gallery URLs, YouTube embed showcase, day-wise itinerary editor, inclusions, exclusions, and highlights.
  - **Auto-Adjusting Layouts**: If any field (e.g., video link, highlights) is left empty, the section automatically hides with zero placeholder gaps.
  - **Direct Package Price Showcase Toggle**: Hide all prices globally or per package to display **"Price on Request"** and capture custom quotation inquiries.
  - **Dynamic Footer Management**: Update office address, phone numbers, email, WhatsApp, and social links live from the dashboard.
- 💬 **Lead Capture & Real-Time Specialist Notifications**:
  - **"Talk to Specialist" Floating Desk**: Instant priority callback requests.
  - Dashboard audio-visual alerts (`🔔 New Callback Alert`) for pending traveler requests.
  - **One-Click Export**: Download all inquiries into structured CSV/Excel format.
  - **Google Forms / Google Sheets Live Sync**: Embed your Google Form iframe directly from dashboard settings.
- 📄 **Complete Legal & SEO Suite**:
  - Dedicated `/privacy-policy` and `/terms` pages.
  - Interactive `/sitemap-page` directory + dynamic `/sitemap.xml` and `/robots.txt`.

---

## 🔐 Admin Dashboard Access

- **URL**: `http://localhost:3000/dashboard` *(or `https://your-domain.vercel.app/dashboard`)*
- **Username / ID**: `tripdesk_owner` *(or `admin`)*
- **Master Password**: `TripDesk@2026#Secure!` *(or `tripdesk2026`)*

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v18.18+` or `v20.x`
- npm `v9+` or `v10+`

### 2. Clone & Install
```bash
git clone https://github.com/<your-username>/tripdesk.git
cd tripdesk

# Install dependencies
npm install
```

### 3. Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel (One-Click)

1. Push your repository to **GitHub**:
   ```bash
   git remote add origin https://github.com/<your-username>/tripdesk.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `tripdesk` repository.
4. Leave build settings as default:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **Deploy**. Your site will be live on an ultra-fast global edge network in seconds!

---

## 📂 Project Architecture

```
Tripdesk/
├── app/
│   ├── dashboard/             # Private Owner Admin Suite (protected route)
│   ├── packages/[slug]/       # Dynamic Tour Package detail routes with Lightbox
│   ├── privacy-policy/        # Legal privacy & data rights page
│   ├── terms/                 # Terms of service, bookings & cancellation slabs
│   ├── sitemap-page/          # Human-friendly HTML Sitemap Directory
│   ├── sitemap.ts             # Dynamic XML sitemap generator (/sitemap.xml)
│   ├── robots.ts              # SEO crawler instructions (/robots.txt)
│   ├── globals.css            # Tailwind CSS v4 custom theme & dark variant
│   ├── layout.tsx             # Root layout with DM Serif & Montserrat typography
│   └── page.tsx               # Homepage (Hero, State Grid, Trending Packages)
├── components/
│   ├── contact/
│   │   └── InquiryForm.tsx    # Responsive lead capture & Google Forms frame
│   ├── home/
│   │   ├── HeroSection.tsx    # Hero with high-contrast text & search filters
│   │   ├── ExploreStatesSection.tsx  # Pan-India interactive state cards
│   │   └── WhyUsSection.tsx   # Trust badges & advantages
│   ├── packages/
│   │   ├── PackageCard.tsx    # Card with price-toggle logic & hover lift
│   │   └── PackageDetailModal.tsx # Quick-view modal with tabbed details
│   └── ui/
│       ├── FloatingCTA.tsx    # "Talk to Specialist" callback widget
│       ├── Footer.tsx         # Dynamic footer connected to dashboard settings
│       ├── Logo.tsx           # Multi-variant logo component with SVG fallback
│       └── Navbar.tsx         # Sticky navigation with Light/Dark mode toggle
├── context/
│   └── ThemeContext.tsx       # Smooth theme provider (localStorage + system-sync)
├── lib/
│   ├── mockData.ts            # 8 pre-loaded verified India packages
│   └── storage.ts             # Local storage persistence for packages, settings & leads
└── types/
    └── index.ts               # Strict TypeScript models & interfaces
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Hybrid SSG/SSR, static generation, Turbopack |
| **TypeScript** | Type-safe models for packages, settings & leads |
| **Tailwind CSS v4** | Hardware-accelerated, zero-runtime utility styling |
| **Framer Motion** | Lightweight, lag-free staggered scroll reveals |
| **Lucide React** | Feather-light SVG icons |
| **Canvas Confetti** | Delightful lead submission celebration effects |

---

## 👤 Author & Support

- **Lead Developer**: Abhimanyu Vaishnav
- **Email**: [abhimanyuvaishnav2017@gmail.com](mailto:abhimanyuvaishnav2017@gmail.com)
- **Official Desk**: [desk@tripdeskholidays.com](mailto:desk@tripdeskholidays.com)
- **Tagline**: *Desk to Destination*

---

*Crafted with ❤️ for passionate travelers across India.*
