-- ========================================================
-- TRIPDESK HOLIDAYS - SUPABASE DATABASE INITIALIZATION
-- ========================================================

-- 1. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  state TEXT NOT NULL,
  location TEXT NOT NULL,
  duration JSONB NOT NULL DEFAULT '{"days": 5, "nights": 4}',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  hide_price BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  rating NUMERIC DEFAULT 4.9,
  reviews_count INT DEFAULT 1,
  banner_image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]',
  video_url TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  theme TEXT DEFAULT 'Nature',
  highlights JSONB DEFAULT '[]',
  inclusions JSONB DEFAULT '[]',
  exclusions JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  group_size TEXT DEFAULT 'Customizable',
  best_time_to_visit TEXT DEFAULT 'Year-round',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS & SPECIALIST CALLBACKS TABLE
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'general_inquiry',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  destination TEXT DEFAULT '',
  travel_date TEXT DEFAULT '',
  travelers_count INT DEFAULT 2,
  budget_range TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  package_id TEXT,
  package_title TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SITE SETTINGS TABLE (Footer & Config)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary_settings',
  hide_all_prices BOOLEAN DEFAULT FALSE,
  contact_mode TEXT DEFAULT 'google_form',
  google_form_embed_url TEXT DEFAULT '',
  company_name TEXT DEFAULT 'TripDesk Holidays',
  tagline TEXT DEFAULT 'Desk to Destination',
  about_text TEXT DEFAULT '',
  contact_address TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  contact_landline TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  response_timing_text TEXT DEFAULT '⚡ Response time: Under 2 hours',
  copyright_text TEXT DEFAULT '© 2026 TripDesk Holidays LLP. All Rights Reserved.',
  hero_title TEXT DEFAULT 'From Desk to Dream Destination',
  hero_slides JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) BUT ALLOW PUBLIC READ/WRITE FOR ANON KEY
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on packages" ON packages FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on packages" ON packages FOR ALL USING (true);

CREATE POLICY "Allow public read access on leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow public update on leads" ON leads FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on site_settings" ON site_settings FOR ALL USING (true);

