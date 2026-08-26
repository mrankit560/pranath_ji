-- =========================================================================
-- SHRI PRANNATH JI DIGITAL GYAN PORTAL — COMPLETE POSTGRESQL SCHEMA
-- Paste this entire SQL into Supabase SQL Editor and click RUN
-- =========================================================================

-- 1. EVENTS & UTSAVS
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title_hi TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  description_hi TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  has_specific_time BOOLEAN DEFAULT true,
  time_str TEXT DEFAULT '',
  location TEXT DEFAULT '',
  image TEXT DEFAULT '',
  speaker TEXT DEFAULT '',
  event_type TEXT DEFAULT 'festival',
  livestream_url TEXT DEFAULT '',
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SCRIPTURES & PDF BOOKS
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY,
  title_hi TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  author_hi TEXT DEFAULT '',
  author_en TEXT DEFAULT '',
  description_hi TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  category TEXT DEFAULT 'all',
  language TEXT DEFAULT 'hi',
  cover_url TEXT DEFAULT '',
  pdf_url TEXT DEFAULT '',
  pages INTEGER DEFAULT 1,
  book_blog_hi TEXT DEFAULT '',
  book_blog_en TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HOLY DHAMS & ASHRAM LOCATIONS
CREATE TABLE IF NOT EXISTS public.dhams (
  id TEXT PRIMARY KEY,
  name_hi TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  description_hi TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  location TEXT DEFAULT '',
  map_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  phone TEXT DEFAULT '',
  order_num INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ARTICLES & BLOGS
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title_hi TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  content_hi TEXT NOT NULL,
  content_en TEXT DEFAULT '',
  summary_hi TEXT DEFAULT '',
  summary_en TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  featured_image TEXT DEFAULT '',
  author TEXT DEFAULT '',
  category TEXT DEFAULT 'prannath-ji',
  tags JSONB DEFAULT '[]'::jsonb,
  read_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. VIDEOS & DISCOURSES
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  youtube_id TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  description_hi TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  category TEXT DEFAULT 'satsang',
  speaker TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  thumbnail TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  is_live BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. AUDIO & AARTI TRACKS
CREATE TABLE IF NOT EXISTS public.audio_tracks (
  id TEXT PRIMARY KEY,
  title_hi TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  audio_url TEXT NOT NULL,
  cover_url TEXT DEFAULT '',
  category TEXT DEFAULT 'aarti',
  speaker TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  order_num INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. CHITWANI BOOKS
CREATE TABLE IF NOT EXISTS public.chitwani_books (
  id TEXT PRIMARY KEY,
  title_hi TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  description_hi TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  author TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  pdf_url TEXT DEFAULT '',
  pages INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CHITWANI VIDEOS
CREATE TABLE IF NOT EXISTS public.chitwani_videos (
  id TEXT PRIMARY KEY,
  title_hi TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  youtube_id TEXT NOT NULL,
  speaker TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  description_hi TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. PORTAL SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address_hi TEXT DEFAULT '',
  address_en TEXT DEFAULT '',
  google_maps_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  whatsapp_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. ABOUT CONTENT
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. DAILY THOUGHT
CREATE TABLE IF NOT EXISTS public.daily_thought (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  quote_hi TEXT NOT NULL,
  quote_en TEXT DEFAULT '',
  author_hi TEXT DEFAULT '',
  author_en TEXT DEFAULT '',
  source_hi TEXT DEFAULT '',
  source_en TEXT DEFAULT '',
  date TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chitwani_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chitwani_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_thought ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ PERMISSIONS (Anyone can read spiritual content)
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public Read Dhams" ON public.dhams FOR SELECT USING (true);
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Read Videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public Read Audio" ON public.audio_tracks FOR SELECT USING (true);
CREATE POLICY "Public Read Chitwani Books" ON public.chitwani_books FOR SELECT USING (true);
CREATE POLICY "Public Read Chitwani Videos" ON public.chitwani_videos FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read About" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public Read Thought" ON public.daily_thought FOR SELECT USING (true);

-- ANON & AUTH MUTATION PERMISSIONS FOR ADMIN CMS
CREATE POLICY "Anon Full Access Events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Books" ON public.books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Dhams" ON public.dhams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Videos" ON public.videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Audio" ON public.audio_tracks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Chitwani Books" ON public.chitwani_books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Chitwani Videos" ON public.chitwani_videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access About" ON public.about_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Thought" ON public.daily_thought FOR ALL USING (true) WITH CHECK (true);

-- 12. STORAGE BUCKET & POLICIES FOR UPLOADS (PDF Books, Covers, Images)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('uploads', 'uploads', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Storage Uploads') THEN
    CREATE POLICY "Public Read Storage Uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon Full Access Storage Uploads') THEN
    CREATE POLICY "Anon Full Access Storage Uploads" ON storage.objects FOR ALL USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');
  END IF;
END $$;

