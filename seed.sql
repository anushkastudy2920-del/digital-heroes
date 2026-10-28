-- ============================================================================
-- DIGITAL HEROES PLATFORM - SEED DATA SCRIPT
-- ============================================================================

-- Insert Charities
INSERT INTO public.charities (id, name, slug, category, tagline, description, mission, logo_url, banner_url, total_raised, target_goal, website_url, events, featured)
VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Junior Fairways Foundation',
  'junior-fairways',
  'Youth & Sports',
  'Empowering underprivileged youth through mentorship, golf discipline, and education scholarships.',
  'Junior Fairways Foundation provides equipment, coaching, and academic tutoring to children in under-resourced communities across the nation. Over 1,200 kids have joined our academy programs.',
  'To break socio-economic barriers through golf, building tomorrow’s leaders on and off the course.',
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80',
  42850.00,
  75000.00,
  'https://juniorfairways.org',
  '[
    {"id": "e1", "title": "Annual Youth Pro-Am Invitational", "date": "2026-04-18", "location": "Augusta Pines Golf Club", "description": "18-hole scramble partnering junior academy standouts with club professionals."},
    {"id": "e2", "title": "Summer STEM & Swing Camp", "date": "2026-06-12", "location": "Barton Creek Resort", "description": "Week-long day camp integrating golf biomechanics with mathematics."}
  ]'::jsonb,
  true
),
(
  'c2222222-2222-2222-2222-222222222222',
  'Oncology Hope Alliance',
  'oncology-hope-alliance',
  'Health & Oncology',
  'Funding breakthrough pediatric cancer immunotherapy research and clinical trial access.',
  'Partnering with top cancer institutes to support families with travel grants, emotional care packages, and targeted oncology trials that bring children closer to remission.',
  'To eradicate pediatric cancer by advancing next-generation cellular therapies.',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
  89400.00,
  120000.00,
  'https://oncologyhope.org',
  '[
    {"id": "e3", "title": "Birdies for Breakthroughs Charity Open", "date": "2026-05-04", "location": "Pebble Beach Golf Links", "description": "Celebrity fundraising tournament with 100% of proceeds funding leukemia clinical trials."}
  ]'::jsonb,
  true
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Ocean Blue Restoration',
  'ocean-blue-restoration',
  'Environment & Oceans',
  'Removing plastics from marine ecosystems and restoring degraded coral reefs.',
  'Ocean Blue deploys autonomous solar vessels and community diving teams to extract tons of microplastics from coastal waterways and replant heat-resilient coral colonies.',
  'To restore pristine oceans and preserve marine biodiversity for future generations.',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  31200.00,
  50000.00,
  'https://oceanbluerestore.org',
  '[
    {"id": "e4", "title": "Coastal Cleanup & Golf Classic", "date": "2026-05-22", "location": "Torrey Pines South", "description": "Morning beach cleanup followed by twilight 9-hole charity skins match."}
  ]'::jsonb,
  false
),
(
  'c4444444-4444-4444-4444-444444444444',
  'Veterans Green Recovery',
  'veterans-green-recovery',
  'Veteran Welfare',
  'Healing physical trauma and PTSD through adaptive golf therapy and community brotherhood.',
  'Veterans Green Recovery introduces wounded military veterans and first responders to adaptive golf equipment, therapeutic camaraderie, and mental health decompression.',
  'To provide veterans a purposeful pathway to healing and physical rehabilitation through the game of golf.',
  'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1510519138171-c70d76b64028?auto=format&fit=crop&w=1200&q=80',
  64150.00,
  80000.00,
  'https://veteransgreenrecovery.org',
  '[
    {"id": "e5", "title": "Patriot Scramble & Gala Dinner", "date": "2026-07-04", "location": "Whistling Straits (Irish Course)", "description": "Honoring active service members with a 4-person scramble and silent auction."}
  ]'::jsonb,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Historical & Active Draws
INSERT INTO public.draws (id, draw_number, month_year, draw_type, winning_numbers, total_pool, pool_5_match, pool_4_match, pool_3_match, rollover_in, rollover_out, status, simulated_at, published_at)
VALUES
(
  'd1111111-1111-1111-1111-111111111111',
  12,
  'January 2026',
  'random',
  ARRAY[7, 14, 22, 33, 41],
  18500.00,
  7400.00,
  6475.00,
  4625.00,
  0.00,
  7400.00, -- Unclaimed 5-match jackpot rolled over!
  'published',
  '2026-01-31 18:00:00+00',
  '2026-01-31 18:30:00+00'
),
(
  'd2222222-2222-2222-2222-222222222222',
  13,
  'February 2026',
  'algorithmic',
  ARRAY[12, 19, 27, 36, 42],
  26800.00,
  15320.00, -- Includes $7,400 rollover from Jan!
  6790.00,
  4850.00,
  7400.00,
  0.00,
  'published',
  '2026-02-28 18:00:00+00',
  '2026-02-28 18:30:00+00'
),
(
  'd3333333-3333-3333-3333-333333333333',
  14,
  'March 2026',
  'algorithmic',
  ARRAY[8, 15, 23, 34, 40],
  32500.00,
  13000.00,
  11375.00,
  8125.00,
  0.00,
  0.00,
  'simulated',
  NOW(),
  NULL
)
ON CONFLICT (draw_number) DO NOTHING;
