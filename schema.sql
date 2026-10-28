-- ============================================================================
-- DIGITAL HEROES PLATFORM - SUPABASE POSTGRESQL SCHEMA (PRD 2026 EDITION)
-- Golf Performance, Charity Giving & Monthly Draw Engine
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin', 'public')),
  avatar_url TEXT,
  handicap NUMERIC(4, 1) DEFAULT 14.5,
  home_club TEXT DEFAULT 'St. Andrews Links',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CHARITIES DIRECTORY TABLE
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Youth & Sports', 'Health & Oncology', 'Environment & Oceans', 'Veteran Welfare', 'Community & Education')),
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  mission TEXT NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  total_raised NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  target_goal NUMERIC(12, 2) NOT NULL DEFAULT 50000.00,
  website_url TEXT,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lapsed', 'cancelled')),
  amount NUMERIC(10, 2) NOT NULL DEFAULT 19.00, -- $19/mo or $190/yr
  charity_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (charity_percentage >= 10.00 AND charity_percentage <= 100.00),
  charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. GOLF SCORES TABLE (Strict 1-45 Stableford, 1 per date, max 5 rolling FIFO)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  played_at DATE NOT NULL,
  course_name TEXT DEFAULT 'Royal Melbourne',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_score_date UNIQUE (user_id, played_at)
);

-- 5. DRAWS TABLE
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_number INTEGER NOT NULL UNIQUE,
  month_year TEXT NOT NULL,
  draw_type TEXT NOT NULL CHECK (draw_type IN ('random', 'algorithmic')),
  winning_numbers INTEGER[] NOT NULL CHECK (cardinality(winning_numbers) = 5),
  total_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pool_5_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 40% + rollover
  pool_4_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 35%
  pool_3_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 25%
  rollover_in NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  rollover_out NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'simulated', 'published')),
  simulated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DRAW WINNERS & VERIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.draw_winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  matched_numbers INTEGER[] NOT NULL,
  match_tier INTEGER NOT NULL CHECK (match_tier IN (3, 4, 5)),
  prize_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  proof_image_url TEXT,
  proof_submitted_at TIMESTAMPTZ,
  verification_status TEXT NOT NULL DEFAULT 'none' CHECK (verification_status IN ('none', 'pending', 'approved', 'rejected')),
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid')),
  verified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. INDEPENDENT DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  charity_name TEXT NOT NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  is_independent BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- DATABASE TRIGGERS & BUSINESS LOGIC ENFORCEMENT
-- ============================================================================

-- Function: 5-Score Rolling FIFO Window Enforcement (§ 05)
-- When a user inserts a score, if total scores exceed 5, automatically drop the oldest
CREATE OR REPLACE FUNCTION public.enforce_five_score_limit()
RETURNS TRIGGER AS $$
DECLARE
  excess_count INT;
BEGIN
  SELECT COUNT(*) - 5 INTO excess_count
  FROM public.scores
  WHERE user_id = NEW.user_id;

  IF excess_count > 0 THEN
    DELETE FROM public.scores
    WHERE id IN (
      SELECT id FROM public.scores
      WHERE user_id = NEW.user_id
      ORDER BY played_at ASC, created_at ASC
      LIMIT excess_count
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_five_score_limit ON public.scores;
CREATE TRIGGER trg_enforce_five_score_limit
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION public.enforce_five_score_limit();

-- Function: Automatically create profile on Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'subscriber')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles:
CREATE POLICY "Public profiles can be viewed by all authenticated users"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Charities:
CREATE POLICY "Charities viewable by anyone"
ON public.charities FOR SELECT USING (true);

CREATE POLICY "Only admins can insert/update/delete charities"
ON public.charities FOR ALL USING (public.is_admin());

-- Subscriptions:
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert/update their own subscription"
ON public.subscriptions FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Scores:
CREATE POLICY "Users can view their own scores"
ON public.scores FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert/update/delete their own scores"
ON public.scores FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Draws:
CREATE POLICY "Anyone can view published draws"
ON public.draws FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can manage draws"
ON public.draws FOR ALL USING (public.is_admin());

-- Draw Winners:
CREATE POLICY "Winners can view their own winnings or published winners"
ON public.draw_winners FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Winners can submit proof for their own claim"
ON public.draw_winners FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins have full control over winners"
ON public.draw_winners FOR ALL USING (public.is_admin());

-- Donations:
CREATE POLICY "Anyone can view donation totals, donors can view own"
ON public.donations FOR SELECT USING (true);

CREATE POLICY "Anyone can make a donation"
ON public.donations FOR INSERT WITH CHECK (true);

-- ============================================================================
-- STORAGE BUCKET CONFIGURATION (for Scorecard Proof Uploads)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('scorecard-proofs', 'scorecard-proofs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated users to upload scorecard proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scorecard-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to scorecard proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'scorecard-proofs');
