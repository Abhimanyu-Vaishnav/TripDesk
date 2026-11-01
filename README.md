# 🏖️ TripDesk Holidays — "Desk to Destination"

> **Production-ready, ultra-smooth, animation-rich tour & travel web platform with a private Owner Admin Dashboard, dynamic price controls, Google Forms integration, and light/dark theme architecture.**

---

## 🌟 Core Features

- **Luxury Brand System**:
  - Dark Chocolate Brown (`#351202`), Mustard Golden Yellow (`#DB9309`), Warm Cream (`#FEFAEE`).
  - Native Dark Mode support (`#120904`, `#1D1008`) with instant toggle switch (☀️ / 🌙).
  - Typography: *DM Serif Display* (Headings) and *Montserrat* (Body & UI).

- **8 Curated Pan-India Tour Packages (Pre-loaded)**:
  - Kashmir, Himachal Pradesh, Rajasthan, Kerala, Goa, Uttarakhand, Andaman & Nicobar, Meghalaya.

- **Private Owner Dashboard (`/dashboard`)**:
  - Protected route with unique master credentials.
  - **Full Package Management (CRUD)**: Title, tagline, state, duration, price, multi-image gallery, YouTube video embed, day-by-day itinerary, inclusions & exclusions.
  - **Auto-Adjusting Dynamic Sections**: Empty fields (such as video link or highlights) automatically hide without leaving empty spaces.
  - **Price Visibility Control**: Toggle to hide prices globally or per package (displays "Price on Request" for custom quotes).
  - **Dynamic Footer Management**: Update office address, phone numbers, email, WhatsApp, and social links live from the dashboard.

- **Lead Capture & Customer Interaction**:
  - **"Talk to Specialist" Floating Desk**: Direct priority callback request widget.
  - **Real-Time Dashboard Notifications**: Audio-visual alert banner for incoming callback requests.
  - **CSV Export**: Download all inquiries into a structured spreadsheet.
  - **Google Forms / Google Sheets Live Sync**: Embed your Google Form iframe directly from dashboard settings.

- **Legal & SEO Suite**:
  - Dedicated `/privacy-policy`, `/terms`, and `/sitemap-page` directory.
  - Dynamic `/sitemap.xml` and `/robots.txt`.

---

## 🔐 Admin Dashboard Access

- **URL**: `/dashboard`
- **Username**: `tripdesk_owner`
- **Password**: `TripDesk@2026#Secure!`

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build & run
npm run build
npm run start
```

---

## 📂 Project Structure

```
Tripdesk/
├── app/
│   ├── dashboard/             # Private Owner Admin Dashboard
│   ├── packages/[slug]/       # Tour package detail pages with gallery lightbox
│   ├── privacy-policy/        # Privacy policy page
│   ├── terms/                 # Terms of service page
│   ├── sitemap-page/          # HTML sitemap directory
│   ├── sitemap.ts             # Dynamic XML sitemap generator
│   ├── robots.ts              # Robots.txt crawler instructions
│   ├── globals.css            # Tailwind CSS theme & custom dark variant
│   ├── layout.tsx             # Root layout with fonts & theme provider
│   └── page.tsx               # Landing page
├── components/
│   ├── contact/               # Inquiry form & Google Form embed frame
│   ├── home/                  # Hero with search filter, states grid, why us
│   ├── packages/              # Package cards & quick preview modal
│   └── ui/                    # Floating CTA, dynamic footer, navbar, logo
├── context/
│   └── ThemeContext.tsx       # Light / Dark mode state management
├── lib/
│   ├── mockData.ts            # 8 verified India packages
│   └── storage.ts             # Data persistence (packages, settings, leads)
└── types/
    └── index.ts               # TypeScript models & interfaces
```

---

## 👤 Author

- **Developer**: Abhimanyu Vaishnav
- **Email**: abhimanyuvaishnav2017@gmail.com
