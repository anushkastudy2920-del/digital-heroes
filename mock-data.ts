import { User, Subscription, GolfScore, Charity, Draw, DrawWinner, Donation } from '@/types';

export const INITIAL_CHARITIES: Charity[] = [
  {
    id: 'charity-1',
    name: 'Junior Fairways Foundation',
    slug: 'junior-fairways',
    category: 'Youth & Sports',
    tagline: 'Empowering underprivileged youth through mentorship, golf discipline, and education scholarships.',
    description: 'Junior Fairways Foundation provides equipment, coaching, and academic tutoring to children in under-resourced communities across the nation. Over 1,200 kids have joined our academy programs.',
    mission: 'To break socio-economic barriers through golf, building tomorrow’s leaders on and off the course.',
    logoUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80',
    totalRaised: 42850.00,
    targetGoal: 75000.00,
    websiteUrl: 'https://juniorfairways.org',
    events: [
      {
        id: 'e1',
        title: 'Annual Youth Pro-Am Invitational',
        date: '2026-04-18',
        location: 'Augusta Pines Golf Club',
        description: '18-hole scramble partnering junior academy standouts with club professionals.'
      },
      {
        id: 'e2',
        title: 'Summer STEM & Swing Camp',
        date: '2026-06-12',
        location: 'Barton Creek Resort',
        description: 'Week-long day camp integrating golf biomechanics with mathematics.'
      }
    ],
    featured: true
  },
  {
    id: 'charity-2',
    name: 'Oncology Hope Alliance',
    slug: 'oncology-hope-alliance',
    category: 'Health & Oncology',
    tagline: 'Funding breakthrough pediatric cancer immunotherapy research and clinical trial access.',
    description: 'Partnering with top cancer institutes to support families with travel grants, emotional care packages, and targeted oncology trials that bring children closer to remission.',
    mission: 'To eradicate pediatric cancer by advancing next-generation cellular therapies.',
    logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    totalRaised: 89400.00,
    targetGoal: 120000.00,
    websiteUrl: 'https://oncologyhope.org',
    events: [
      {
        id: 'e3',
        title: 'Birdies for Breakthroughs Charity Open',
        date: '2026-05-04',
        location: 'Pebble Beach Golf Links',
        description: 'Celebrity fundraising tournament with 100% of proceeds funding leukemia clinical trials.'
      }
    ],
    featured: true
  },
  {
    id: 'charity-3',
    name: 'Ocean Blue Restoration',
    slug: 'ocean-blue-restoration',
    category: 'Environment & Oceans',
    tagline: 'Removing plastics from marine ecosystems and restoring degraded coral reefs.',
    description: 'Ocean Blue deploys autonomous solar vessels and community diving teams to extract tons of microplastics from coastal waterways and replant heat-resilient coral colonies.',
    mission: 'To restore pristine oceans and preserve marine biodiversity for future generations.',
    logoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    totalRaised: 31200.00,
    targetGoal: 50000.00,
    websiteUrl: 'https://oceanbluerestore.org',
    events: [
      {
        id: 'e4',
        title: 'Coastal Cleanup & Golf Classic',
        date: '2026-05-22',
        location: 'Torrey Pines South',
        description: 'Morning beach cleanup followed by twilight 9-hole charity skins match.'
      }
    ],
    featured: false
  },
  {
    id: 'charity-4',
    name: 'Veterans Green Recovery',
    slug: 'veterans-green-recovery',
    category: 'Veteran Welfare',
    tagline: 'Healing physical trauma and PTSD through adaptive golf therapy and community brotherhood.',
    description: 'Veterans Green Recovery introduces wounded military veterans and first responders to adaptive golf equipment, therapeutic camaraderie, and mental health decompression.',
    mission: 'To provide veterans a purposeful pathway to healing and physical rehabilitation through the game of golf.',
    logoUrl: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1510519138171-c70d76b64028?auto=format&fit=crop&w=1200&q=80',
    totalRaised: 64150.00,
    targetGoal: 80000.00,
    websiteUrl: 'https://veteransgreenrecovery.org',
    events: [
      {
        id: 'e5',
        title: 'Patriot Scramble & Gala Dinner',
        date: '2026-07-04',
        location: 'Whistling Straits (Irish Course)',
        description: 'Honoring active service members with a 4-person scramble and silent auction.'
      }
    ],
    featured: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@digitalheroes.demo',
    fullName: 'Eleanor Vance (Platform Administrator)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    handicap: 8.2,
    homeClub: 'St. Andrews Old Course',
    createdAt: '2025-09-01T00:00:00Z'
  },
  {
    id: 'user-alex',
    email: 'alex.hero@digitalheroes.demo',
    fullName: 'Alex Sterling',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    handicap: 12.4,
    homeClub: 'Royal Melbourne',
    createdAt: '2025-10-15T00:00:00Z'
  },
  {
    id: 'user-marcus',
    email: 'marcus.golf@digitalheroes.demo',
    fullName: 'Marcus Brody (Draw #13 Winner)',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    handicap: 15.0,
    homeClub: 'Kingston Heath',
    createdAt: '2025-11-20T00:00:00Z'
  },
  {
    id: 'user-sarah',
    email: 'sarah.putt@digitalheroes.demo',
    fullName: 'Sarah Jenkins (Lapsed Member)',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    handicap: 21.6,
    homeClub: 'Victoria Golf Club',
    createdAt: '2025-12-05T00:00:00Z'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-admin',
    userId: 'user-admin',
    plan: 'yearly',
    status: 'active',
    amount: 190.00,
    charityPercentage: 25,
    charityId: 'charity-1',
    currentPeriodStart: '2026-01-01T00:00:00Z',
    currentPeriodEnd: '2027-01-01T00:00:00Z',
    cancelAtPeriodEnd: false
  },
  {
    id: 'sub-alex',
    userId: 'user-alex',
    plan: 'monthly',
    status: 'active',
    amount: 19.00,
    charityPercentage: 15,
    charityId: 'charity-2',
    currentPeriodStart: '2026-03-01T00:00:00Z',
    currentPeriodEnd: '2026-04-01T00:00:00Z',
    cancelAtPeriodEnd: false
  },
  {
    id: 'sub-marcus',
    userId: 'user-marcus',
    plan: 'yearly',
    status: 'active',
    amount: 190.00,
    charityPercentage: 20,
    charityId: 'charity-4',
    currentPeriodStart: '2026-02-01T00:00:00Z',
    currentPeriodEnd: '2027-02-01T00:00:00Z',
    cancelAtPeriodEnd: false
  },
  {
    id: 'sub-sarah',
    userId: 'user-sarah',
    plan: 'monthly',
    status: 'lapsed',
    amount: 19.00,
    charityPercentage: 10,
    charityId: 'charity-3',
    currentPeriodStart: '2026-01-01T00:00:00Z',
    currentPeriodEnd: '2026-02-01T00:00:00Z',
    cancelAtPeriodEnd: true
  }
];

export const INITIAL_SCORES: GolfScore[] = [
  // Alex Sterling's 5 retained scores
  { id: 's1', userId: 'user-alex', score: 38, playedAt: '2026-03-24', courseName: 'Royal Melbourne', createdAt: '2026-03-24T18:00:00Z' },
  { id: 's2', userId: 'user-alex', score: 34, playedAt: '2026-03-21', courseName: 'Kingston Heath', createdAt: '2026-03-21T17:30:00Z' },
  { id: 's3', userId: 'user-alex', score: 41, playedAt: '2026-03-18', courseName: 'Metropolitan Golf Club', createdAt: '2026-03-18T18:15:00Z' },
  { id: 's4', userId: 'user-alex', score: 29, playedAt: '2026-03-14', courseName: 'Victoria Golf Club', createdAt: '2026-03-14T19:00:00Z' },
  { id: 's5', userId: 'user-alex', score: 36, playedAt: '2026-03-09', courseName: 'Peninsula Kingswood', createdAt: '2026-03-09T16:45:00Z' },

  // Marcus Brody's 5 retained scores (Matched [12, 19, 27, 36] in Draw #13!)
  { id: 's6', userId: 'user-marcus', score: 12, playedAt: '2026-03-22', courseName: 'The Lakes', createdAt: '2026-03-22T17:00:00Z' },
  { id: 's7', userId: 'user-marcus', score: 19, playedAt: '2026-03-19', courseName: 'New South Wales Golf Club', createdAt: '2026-03-19T18:00:00Z' },
  { id: 's8', userId: 'user-marcus', score: 27, playedAt: '2026-03-15', courseName: 'The Australian', createdAt: '2026-03-15T16:30:00Z' },
  { id: 's9', userId: 'user-marcus', score: 36, playedAt: '2026-03-10', courseName: 'Concord Golf Club', createdAt: '2026-03-10T17:45:00Z' },
  { id: 's10', userId: 'user-marcus', score: 44, playedAt: '2026-03-05', courseName: 'Avondale', createdAt: '2026-03-05T18:20:00Z' },

  // Sarah Jenkins's scores
  { id: 's11', userId: 'user-sarah', score: 24, playedAt: '2026-01-20', courseName: 'Commonwealth Golf Club', createdAt: '2026-01-20T17:00:00Z' },
  { id: 's12', userId: 'user-sarah', score: 31, playedAt: '2026-01-14', courseName: 'Yarra Yarra', createdAt: '2026-01-14T18:00:00Z' }
];

export const INITIAL_DRAWS: Draw[] = [
  {
    id: 'draw-12',
    drawNumber: 12,
    monthYear: 'January 2026',
    drawType: 'random',
    winningNumbers: [7, 14, 22, 33, 41],
    totalPool: 18500.00,
    pool5Match: 7400.00, // 40%
    pool4Match: 6475.00, // 35%
    pool3Match: 4625.00, // 25%
    rolloverIn: 0.00,
    rolloverOut: 7400.00, // Unclaimed 5-match jackpot rolled over!
    status: 'published',
    simulatedAt: '2026-01-31T18:00:00Z',
    publishedAt: '2026-01-31T18:30:00Z',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'draw-13',
    drawNumber: 13,
    monthYear: 'February 2026',
    drawType: 'algorithmic',
    winningNumbers: [12, 19, 27, 36, 42],
    totalPool: 26800.00,
    pool5Match: 15320.00, // $7,920 base + $7,400 rollover from Jan!
    pool4Match: 6790.00,
    pool3Match: 4850.00,
    rolloverIn: 7400.00,
    rolloverOut: 0.00,
    status: 'published',
    simulatedAt: '2026-02-28T18:00:00Z',
    publishedAt: '2026-02-28T18:30:00Z',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'draw-14',
    drawNumber: 14,
    monthYear: 'March 2026',
    drawType: 'algorithmic',
    winningNumbers: [8, 15, 23, 34, 40],
    totalPool: 34250.00,
    pool5Match: 13700.00,
    pool4Match: 11987.50,
    pool3Match: 8562.50,
    rolloverIn: 0.00,
    rolloverOut: 0.00,
    status: 'simulated',
    simulatedAt: '2026-03-25T12:00:00Z',
    createdAt: '2026-03-01T00:00:00Z'
  }
];

export const INITIAL_WINNERS: DrawWinner[] = [
  {
    id: 'win-marcus-13',
    drawId: 'draw-13',
    userId: 'user-marcus',
    userName: 'Marcus Brody',
    userEmail: 'marcus.golf@digitalheroes.demo',
    matchedNumbers: [12, 19, 27, 36],
    matchTier: 4,
    prizeAmount: 2263.33,
    proofImageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    proofSubmittedAt: '2026-03-02T10:15:00Z',
    verificationStatus: 'pending', // Pending Admin verification
    payoutStatus: 'pending',
    adminNotes: 'Submitted official scorecard screenshot from GolfLink handicap system.'
  },
  {
    id: 'win-david-12',
    drawId: 'draw-12',
    userId: 'user-david',
    userName: 'David Miller',
    userEmail: 'david.m@example.com',
    matchedNumbers: [7, 14, 22, 33],
    matchTier: 4,
    prizeAmount: 2158.33,
    proofImageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
    proofSubmittedAt: '2026-02-02T14:20:00Z',
    verificationStatus: 'approved',
    payoutStatus: 'paid',
    verifiedAt: '2026-02-03T11:00:00Z',
    paidAt: '2026-02-04T15:30:00Z',
    adminNotes: 'Scorecard verified with Royal Sydney Golf Club database.'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-1',
    userId: 'user-alex',
    charityId: 'charity-2',
    charityName: 'Oncology Hope Alliance',
    donorName: 'Alex Sterling',
    donorEmail: 'alex.hero@digitalheroes.demo',
    amount: 150.00,
    isIndependent: true,
    createdAt: '2026-03-15T14:30:00Z'
  },
  {
    id: 'don-2',
    charityId: 'charity-1',
    charityName: 'Junior Fairways Foundation',
    donorName: 'Anonymous Supporter',
    donorEmail: 'supporter@golfdigest.com',
    amount: 500.00,
    isIndependent: true,
    createdAt: '2026-03-20T09:15:00Z'
  }
];
