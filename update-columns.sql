-- ========================================================
-- TRIPDESK HOLIDAYS - ADD MISSING COLUMNS TO SITE_SETTINGS
-- ========================================================

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'From Desk to Dream Destination',
ADD COLUMN IF NOT EXISTS hero_slides JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS pinterest_url TEXT DEFAULT '';

-- Refresh Schema Cache
NOTIFY pgrst, 'reload schema';

