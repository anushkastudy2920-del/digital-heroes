# Digital Heroes · Golf Performance & Charity Draw Platform

> **PRD Level 1 Full-Stack Trainee Assignment · Edition 2026**  
> Built strictly to the specifications of the Digital Heroes Product Requirements Document (Version 1.0).

---

## 🌟 Executive Summary

**Digital Heroes** is a subscription-driven web platform that unifies golf performance tracking, charitable giving, and a monthly draw-based reward engine. 

Designed under the **"Feel, not fairway"** design philosophy (§ 12), the interface deliberately avoids clichéd golf imagery (plaid, grass, heavy clubs) in favor of a sleek, dark neo-luxury editorial aesthetic that puts philanthropic impact and transparent mathematical gaming at the forefront.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14/15 (App Router, TypeScript)** | Production standard, SSR/SSG capabilities, typed server actions, and robust API endpoints. |
| **Styling & Motion** | **Tailwind CSS + Glassmorphism + Canvas Confetti** | Dark obsidian palette (`#090d14`), emerald/gold accents, micro-interactions, responsive mobile-first UI. |
| **Database & Auth** | **Supabase (PostgreSQL + RLS + Storage)** | Relational schemas, triggers for 5-score FIFO rolling window, storage bucket for scorecard proofs. |
| **Payment Gateway** | **Stripe Test Mode (PCI-Compliant)** | Flexible checkout for monthly ($19) and discounted yearly ($190) subscription plans. |
| **Deployment** | **Vercel + Supabase Cloud** | Zero-downtime continuous deployment on dedicated, independent accounts. |

---

## 📋 PRD Compliance & Business Logic Matrix

### 1. Score Management System (§ 05)
- **Stableford Scoring**: Strict validation for scores between `1` and `45` points.
- **Single Score Per Date**: Enforced unique `(user_id, played_at)` constraint preventing duplicate entries on the same date.
- **5-Score Rolling FIFO Rule**: The system retains strictly the **latest 5 scores**. Submitting a 6th score automatically drops the oldest entry.
- **Reverse Chronological Display**: Displays most recent round first with average score and best round badges.

### 2. Dual Monthly Draw Engine (§ 06 & § 07)
- **Random Draw**: Cryptographic uniform random selection of 5 numbers from 1 to 45.
- **Algorithmic Draw**: Weighted probability based on the frequency distribution of community scores logged across active players.
- **Prize Pool Split**:
  - **5-Number Match (40%)**: Wins the main jackpot. If unclaimed, **100% of this pool rolls over** into the subsequent month's 5-match jackpot!
  - **4-Number Match (35%)**: Split equally among all 4-match winners (no rollover).
  - **3-Number Match (25%)**: Split equally among all 3-match winners (no rollover).
- **Admin Simulation Engine**: Administrators run real-time simulations to preview projected winners, prize shares, and rollover totals before publishing.

### 3. Charity & Impact Engine (§ 08)
- **10% Minimum Guarantee**: Every subscriber directs a minimum of 10% of their subscription fee to a chosen charity.
- **Voluntary Adjustment**: Interactive slider allows members to voluntarily increase their allocation (up to 50%+).
- **Independent Donations**: Decoupled donation modal allowing any visitor or golfer to make direct, non-gameplay contributions.
- **Charity Directory**: Multi-category filtering (Youth, Oncology, Oceans, Veterans), fundraising progress bars, and upcoming charity golf days.

### 4. Winner Verification & Payout Lifecycle (§ 09)
- **Eligibility**: Verification workflow triggers only for winners who match 3, 4, or 5 numbers.
- **Scorecard Proof Upload**: Winners submit screenshots of official platform or club scorecards with notes.
- **Admin Review Modal**: Administrators inspect submitted screenshots and **Approve** or **Reject** with recorded review notes.
- **Payout State Machine**: Transitions from `Pending` ➔ `Paid` upon recorded admin action.

### 5. Five Admin Control Surfaces (§ 11)
- **01 User Management**: View/edit golfer profiles, inspect rolling scores, manage subscription states.
- **02 Draw Management**: Toggle draw logic (Random vs. Algorithmic), run simulations, publish results.
- **03 Charity Management**: Add, edit, and delete partner charities and fundraising targets.
- **04 Winners Management**: View all winners, verify scorecard proof submissions, disburse payouts.
- **05 Reports & Analytics**: Live platform stats: Total golfers, active subscriptions, total prize pool, total charity donations.

---

## 🔑 Test Credentials (For Reviewers & Evaluators)

A floating **"Digital Heroes Reviewer Mode"** switcher is present in the top navigation bar, allowing 1-click persona switching without typing:

| Role | Persona Name | Email | Password | PRD Test Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Eleanor Vance | `admin@digitalheroes.demo` | `password123` | Full access to Draw Simulator, Winner Verification, Charity CRUD, and Analytics. |
| **Active Subscriber** | Alex Sterling | `alex.hero@digitalheroes.demo` | `password123` | 5 active rolling scores, 15% charity allocation to Oncology Hope, upcoming draw ticket. |
| **Draw Winner** | Marcus Brody | `marcus.golf@digitalheroes.demo` | `password123` | Draw #13 4-match winner ($2,263.33). Test scorecard proof upload and claim flow. |
| **Lapsed Member** | Sarah Jenkins | `sarah.putt@digitalheroes.demo` | `password123` | Tests access control and restricted state alerts when subscription has expired. |

---

## 🗄️ Database Setup (Supabase)

To link to a **NEW** Supabase project as instructed:

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run [`supabase/schema.sql`](./supabase/schema.sql) to set up tables, triggers, and Row Level Security (RLS) policies.
4. Paste and run [`supabase/seed.sql`](./supabase/seed.sql) to populate initial charities, historical draws, and test accounts.
5. In **Storage**, verify the `scorecard-proofs` bucket is created.
6. Copy your project URL and Anon Key into your `.env.local` file.

---

## 🚀 Local Development & Build Verification

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (verifies TypeScript & linting)
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment to Vercel

1. Push this repository to a **new** GitHub account or repo.
2. Sign in to [Vercel](https://vercel.com) using a **new** account.
3. Import the `digital-heroes` repository.
4. Add the following Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-new-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
   - `STRIPE_SECRET_KEY`: `your-stripe-key` (optional; falls back to high-fidelity test sandbox)
5. Click **Deploy**. Your application will be live at `https://digital-heroes-xxxx.vercel.app`.

---

## ✅ Evaluation Checklist (§ 16.1)

- [x] User signup & login with role enforcement
- [x] Subscription flow (Monthly $19 & Discounted Yearly $190)
- [x] Score entry — 1-45 Stableford range, single date enforcement, 5-score rolling FIFO limit
- [x] Draw system logic & simulation (Random vs. Algorithmic frequency weighting)
- [x] Mathematical prize distribution (40% / 35% / 25%, equal split, 5-match jackpot rollover)
- [x] Charity selection, minimum 10% guarantee, voluntary slider, and independent donations
- [x] Winner verification flow with scorecard screenshot upload & admin payout tracking
- [x] User dashboard with all 5 required modules functional
- [x] Admin console with all 5 operational control surfaces
- [x] "Feel, not fairway" modern luxury dark UI with subtle micro-interactions
- [x] Fully responsive across desktop, tablet, and mobile devices
