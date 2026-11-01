# 🏖️ TripDesk Holidays — "Desk to Destination"

> **Production-ready, experiential India tour & travel web platform with a private Owner Admin Dashboard, dynamic price visibility controls, Google Forms integration, and native light/dark theme architecture.**

---

## 🌟 Core Highlights

- **Luxury Brand Identity**:
  - Dark Chocolate Brown (`#351202`), Mustard Golden Yellow (`#DB9309`), Warm Cream (`#FEFAEE`).
  - Native Dark Mode support (`#120904`, `#1D1008`) with instant toggle switch (☀️ / 🌙).
  - Elegant Typography: *DM Serif Display* (Headings) and *Montserrat* (Body & UI).

- **Curated Pan-India Tour Packages**:
  - Kashmir, Himachal Pradesh, Rajasthan, Kerala, Goa, Uttarakhand, Andaman & Nicobar, Meghalaya.

- **Private Admin Dashboard (`/dashboard`)**:
  - Protected admin suite with master passkey authentication.
  - **Full Package Management (CRUD)**: Title, tagline, state, duration, price, multi-image gallery, YouTube video embed, day-by-day itinerary, inclusions & exclusions.
  - **Auto-Adjusting Dynamic Sections**: Sections without data automatically hide cleanly.
  - **Price Visibility Controls**: Toggle to display prices globally or mark as "Price on Request".
  - **Dynamic Footer Management**: Update office address, phone numbers, email, WhatsApp, and social links in real time.

- **Lead Capture & Customer Interaction**:
  - **"Talk to Specialist" Floating Desk**: Priority callback request widget.
  - **Direct Cloud Sync**: Submissions automatically synchronize with Supabase cloud database.
  - **CSV Export**: Export inquiries and callback leads in one click.

- **Legal & SEO**:
  - Dedicated `/privacy-policy`, `/terms`, and `/sitemap-page`.
  - Dynamic `/sitemap.xml` and `/robots.txt`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (Cloud PostgreSQL) with local fallback
- **Performance**: AVIF/WebP image optimization & Next.js font optimization

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
