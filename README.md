# Muslim Daily SuperApp 🕌

[![Build & Lint Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/google-deepmind/antigravity)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange.svg)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue.svg)](https://ai.google.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple.svg)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.8-blue.svg)](https://www.typescriptlang.org/)

An enterprise-grade, mobile-first **SuperApp** Progressive Web Application (PWA) uniting 12 focused **Mini-Applications** under a single cohesive, iOS Human Interface-inspired shell. Backed by a decoupled Express backend proxy, Firebase Authentication, and Cloud Firestore cloud synchronization.

### 🌐 Live Environments
- **Production / Preview Instance**: [https://ais-pre-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app](https://ais-pre-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app)
- **Development Environment**: [https://ais-dev-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app](https://ais-dev-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app)

### 📑 Technical Documentation
- **[System Architecture Specification (ARCHITECTURE.md)](./ARCHITECTURE.md)**: Deep dive into the SuperApp container model, decoupled Express backend, multi-tier offline caching, audio pipelines, and Firestore security rules.
- **[Product & Engineering Roadmap (ROADMAP.md)](./ROADMAP.md)**: Strategic horizons from current foundation (v1.0) through background Adhan push notifications, wearable companions, and on-device edge AI.

---

## 🏛️ System Architecture: SuperApp & MiniApp Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SUPERAPP CLIENT (SPA)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  SuperApp Shell Container  (/src/superapp/SuperAppShell.tsx)               │
│  ├─ Top Navigation Bar     (/src/superapp/Navbar.tsx)                       │
│  ├─ Floating iOS Dock Bar  (/src/superapp/TabBar.tsx)                       │
│  ├─ MiniApp App Launcher   (/src/superapp/MoreAppsSheet.tsx)                │
│  └─ MiniApp Registry       (/src/superapp/miniapps.manifest.ts)             │
├─────────────────────────────────────────────────────────────────────────────┤
│  12 Modular Mini-Applications (/src/miniapps/)                              │
│  ├─ 🕒 prayer-times       ├─ 📖 quran (10 Qira'at)    ├─ 🧭 qibla          │
│  ├─ 📿 tasbih             ├─ 🤲 adhkar (Hisn)         ├─ 📊 habit-tracker  │
│  ├─ 💰 zakat              ├─ 📍 places (Halal/Mosque) ├─ 🤖 ai-assistant   │
│  ├─ 💬 quotes             ├─ 🌿 sanctuary             ├─ 📚 library        │
├─────────────────────────────────────────────────────────────────────────────┤
│  Global Shared Infrastructure (/src/context/, /src/lib/, /src/types.ts)     │
│  ├─ AuthContext & Local/Cloud Preference State Hub                          │
│  └─ Audio Engine (Adhan, Qira'at Recitations, Tasbih Haptic Audio)          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP /api/* JSON Requests
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         DECOUPLED EXPRESS BACKEND                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Server Runner (/server.ts) ──► Application Factory (/server/app.ts)        │
│  ├─ Config & Env Validation  (/server/config/env.ts, gemini.ts)             │
│  ├─ Modular Routes           (/server/routes/health, ai, places)            │
│  ├─ Controllers Layer        (/server/controllers/*.controller.ts)          │
│  └─ Domain Services          (/server/services/gemini.service.ts, places)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Secure Server-Side Proxies
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                 EXTERNAL CLOUD SERVICES & FIREBASE BAAS                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Google Gemini 2.5 Flash API (Server-Side Secret Authentication)           │
│  • Firebase Cloud Firestore (User Preferences, Bookmarks, Habit Logs)        │
│  • Firebase Authentication (Email/Password & Anonymous Guest Mode)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Directory Structure

```
├── .github/
│   └── workflows/
│       └── ci-cd.yml                     # Automated CI/CD (Lint, Typecheck, Build, Deploy)
├── public/
│   ├── manifest.json                    # Progressive Web App manifest
│   └── icon.svg                         # Vector SuperApp logo
├── server/                              # Decoupled Backend Architecture
│   ├── app.ts                           # Express app factory & middleware pipeline
│   ├── config/
│   │   ├── env.ts                       # Environment variable parser & validator
│   │   └── gemini.ts                    # Lazy-initialized Google Gen AI singleton
│   ├── controllers/
│   │   ├── ai.controller.ts             # AI question handler & validation
│   │   ├── health.controller.ts         # Uptime & service status reporter
│   │   └── places.controller.ts         # Mosque & Halal food query controller
│   ├── routes/
│   │   ├── index.ts                     # Aggregated master API router
│   │   ├── ai.routes.ts                 # /api/ai routes
│   │   ├── health.routes.ts             # /api/health routes
│   │   └── places.routes.ts             # /api/places routes
│   ├── services/
│   │   ├── gemini.service.ts            # Scholarly Islamic assistant engine
│   │   └── places.service.ts            # Verified places search & filtering logic
│   └── types/
│       └── index.ts                     # Backend data models & contract types
├── src/                                 # Frontend Client Codebase
│   ├── App.tsx                          # Root entry point mounting Auth & SuperAppShell
│   ├── main.tsx                         # React 19 bootstrap
│   ├── index.css                        # Tailwind CSS v4 styling rules
│   ├── types.ts                         # Global strict TypeScript definitions
│   ├── context/
│   │   └── AuthContext.tsx              # Single Source of Truth (Auth + Firestore Sync)
│   ├── lib/
│   │   ├── adhkarData.ts                # Authentic Hisn al-Muslim supplications catalog
│   │   ├── firebase.ts                  # Client Firebase SDK initialization
│   │   ├── prayerTimes.ts               # Astronomical solar formulas & Hijri calendar
│   │   ├── qiraatData.ts                # 10 Canonical Qira'at, Riwayahs & Audio reciters
│   │   ├── quranData.ts                 # 114 Surahs catalog & Amharic/English verse API
│   │   └── soundUtils.ts                # Web Audio synthesizer & reciter streaming
│   ├── superapp/                        # SuperApp Host Shell & Navigation System
│   │   ├── index.ts                     # SuperApp barrel export
│   │   ├── SuperAppShell.tsx            # Master viewport & mini-app router
│   │   ├── HomeDashboard.tsx            # SuperApp dashboard & quick launch widgets
│   │   ├── Navbar.tsx                   # Top contextual navigation bar
│   │   ├── TabBar.tsx                   # iOS-style bottom dock navigation
│   │   ├── MoreAppsSheet.tsx            # Bottom sheet launcher for all installed mini-apps
│   │   └── miniapps.manifest.ts         # Mini-applications catalog & metadata registry
│   ├── miniapps/                        # 12 Modular Mini-Applications
│   │   ├── prayer-times/                # Prayer times, calculation methods & Adhan
│   │   ├── quran/                       # Holy Quran with 10 Qira'at, Amharic & Audio
│   │   ├── qibla/                       # Spherical compass & device magnetometer
│   │   ├── tasbih/                      # Tactile digital counter with haptic feedback
│   │   ├── adhkar/                      # Morning, Evening, Post-Prayer & Sleep Hisn
│   │   ├── habit-tracker/               # Daily Muhasabah prayer & fasting checklist
│   │   ├── zakat/                       # Gold/Silver Nisab asset calculation
│   │   ├── places/                      # Verified Halal dining & Masajid geo-search
│   │   ├── ai-assistant/                # Ask Ilm Gemini 2.5 Flash Islamic assistant
│   │   ├── quotes/                      # Quranic reflections & daily pearls
│   │   ├── sanctuary/                   # Focus mode & ambient spiritual reflection
│   │   └── library/                     # Ahlul Bait, Hadith 40, Qaida & Abjad tools
│   └── shared/                          # Reusable UI Dialogs & Primitives
│       └── components/
│           ├── AuthModal.tsx            # Sign in / registration modal
│           ├── SettingsModal.tsx        # Global preferences & Qira'at selector
│           └── OnboardingWizard.tsx     # First-time guided setup wizard
├── firestore.rules                      # Principle-of-least-privilege database rules
├── server.ts                            # Root server entry point (Express + Vite)
├── package.json                         # Build scripts & dependencies
├── tsconfig.json                        # Strict TypeScript compiler options
└── vite.config.ts                       # Vite build configuration
```

---

## 📱 Mini-Applications Suite & Capabilities

### 1. 🕒 Prayer Times & Adhan Engine (`src/miniapps/prayer-times`)
- **Astronomical Calculation Engine**: Solar coordinates, equation of time, and solar declination algorithms.
- **6 International Conventions**: MWL, ISNA, Egyptian General Authority, Umm al-Qura (Makkah), University of Islamic Sciences Karachi, and Gulf Region.
- **Juristic Asr Schools**: Standard (Shafi'i/Maliki/Hanbali) and Hanafi shadow ratios.
- **Night Divisions**: Suhur cutoff (Imsak), Iftar countdown, and Tahajjud (Qiyam al-Layl) last third calculation.
- **Authentic Adhan Playback**: Audio previews from Makkah Al-Mukarramah, Al-Madinah Al-Munawwarah, and Mishary Alafasy.

### 2. 📖 Holy Quran & 10 Canonical Qira'at (`src/miniapps/quran`)
- **All 10 Canonical Readings & Transmissions**: Hafs 'an 'Asim, Ad-Duri 'an Abi 'Amr (prominent in Sudan, Somalia, and the Horn of Africa), Warsh 'an Nafi', Qalun 'an Nafi', As-Soussi, Shu'bah, Khalaf 'an Hamzah, Khallad, Al-Bazzi, and Qunbul.
- **Amharic Translation**: Sheikh Muhammed Sani Habib & Sayyid Muhammed Sadiq (`am.sadiq`), with one-tap toggle between Amharic, English (Sahih International), and Dual Translation mode.
- **Interactive Qira'at Difference Explorer**: Highlights authentic vocalization variants (Usul & Farsh) across ayahs with Arabic roots and reader attribution.
- **Renowned Reciters Audio**: Streaming audio from Sheikh Noreen Muhammad Siddiq (Ad-Duri), Sheikh Mahmoud Khalil Al-Hussary (Warsh/Qalun/Duri/Hafs), Sheikh Abdulrasheed Soufi (Soussi/Khalaf), and Mishary Rashid Alafasy.
- **1-Tap Bookmarks**: Saved locally and synchronized across devices via Cloud Firestore.

### 3. 🧭 High-Precision Qibla Compass (`src/miniapps/qibla`)
- **Spherical Great Circle Bearing**: Computes exact direction to the Kaaba in Makkah (21.4225° N, 39.8262° E).
- **Device Sensors**: Real-time magnetometer & device orientation support with fallback manual orientation calibration.
- **Haptic Feedback**: Vibrates and turns emerald green when aligned within ±3° of the Kaaba.

### 4. 📿 Smart Digital Tasbih (`src/miniapps/tasbih`)
- **Tactile Web Audio & Haptic Clicks**: Emulates mechanical bead interaction.
- **Dhikr Presets**: SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah, La ilaha illallah, and Salawat.
- **Cycle & Target Ring**: Tracks 33/99 cycle completions with persistent lifetime totals.

### 5. 🤲 Daily Adhkar (Hisn al-Muslim) (`src/miniapps/adhkar`)
- **Categorized Sections**: Morning (Sabah), Evening (Masaa), Post-Prayer (Ba'd al-Salah), and Before Sleep.
- **Authentic Hadith Citations**: Sahih al-Bukhari, Sahih Muslim, Abu Dawood, and At-Tirmidhi.
- **Repetition Counters**: Interactive decrement counters with progress completion indicators.

### 6. 📊 Muhasabah Spiritual Habit Tracker (`src/miniapps/habit-tracker`)
- **5 Obligatory Prayers Checklist**: Fajr, Dhuhr, Asr, Maghrib, and Isha.
- **Sunnah & Voluntary Worship**: Salat al-Duha, Tahajjud, Salat al-Witr.
- **Fasting Logger**: Ramadan, Monday/Thursday, White Days (Ayyam al-Beed), and Voluntary fasts.
- **Cloud History**: Daily logs persisted by date in Cloud Firestore.

### 7. 💰 Zakat Wealth Calculator (`src/miniapps/zakat`)
- **Dual Nisab Benchmarks**: Real-time evaluation against Gold Nisab (85g) and Silver Nisab (595g).
- **Comprehensive Asset Evaluation**: Cash, bank balances, gold/silver jewelry, investment portfolios, trade merchandise, and deductible liabilities.
- **Instant 2.5% Calculation**: Accurate net zakat liability determination with cloud save.

### 8. 📍 Halal Food & Mosque Locator (`src/miniapps/places`)
- **Geo-Search Directory**: Verified Masajid and Halal-certified dining.
- **Facility Attributes**: Jummah prayers, women's sections, wudu facilities, wheelchair accessibility, and parking.
- **Direct Actions**: Integrated Google Maps directions and direct phone calling.

### 9. 🤖 Ask Ilm AI Islamic Assistant (`src/miniapps/ai-assistant`)
- **Powered by Google Gemini 2.5 Flash**: Secure server-side proxy route (`/api/ai/ask`).
- **Authentic Quranic & Sunnah Guidance**: Provides clear explanations with Surah/Ayah citations and scholarly disclaimers.

### 10. 💬 Daily Quotes & Wisdom (`src/miniapps/quotes`)
- Curated Quranic pearls, Hadith reflections, and sayings of the righteous predecessors.

### 11. 🌿 Solaty Sanctuary (`src/miniapps/sanctuary`)
- Distraction-free spiritual focus timer with natural ambient sounds (Rain, Makkah ambience, Night Breeze).

### 12. 📚 Scholars' Library (`src/miniapps/library`)
- Biographies of the Ahlul Bait & Noble Companions, 40 Hadith of Imam An-Nawawi, Qaida Nooraniyah Arabic letter guide, and Abjad numerical system calculator.

---

## 🔌 Backend REST API Reference

All API routes are served under the `/api` prefix:

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "app": "Muslim Daily SuperApp Backend",
  "version": "2.5.0",
  "timestamp": "2026-09-10T03:20:00.000Z",
  "services": {
    "geminiConfigured": true,
    "serverUptimeSeconds": 142
  }
}
```

### 2. Ask Ilm AI Knowledge Assistant
- **Endpoint**: `POST /api/ai/ask`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "question": "What are the Sunnah prayers associated with Dhuhr?",
  "language": "English",
  "context": { "userLocation": "London", "juristicSchool": "Standard" }
}
```
- **Response**:
```json
{
  "answer": "Bismillahir-Rahmanir-Rahim. According to the authentic Sunnah..."
}
```

### 3. Places & Halal Locator
- **Endpoint**: `GET /api/places?category=mosque&query=london`
- **Query Parameters**:
  - `category` (optional): `all` | `mosque` | `restaurant` | `grocery`
  - `query` (optional): Keyword search for name, cuisine, or facilities
  - `city` (optional): City filter
- **Response**:
```json
{
  "count": 2,
  "places": [
    {
      "id": "m-1",
      "name": "Islamic Cultural Center & Central Mosque",
      "category": "mosque",
      "address": "146 Park Road, Regent's Park",
      "city": "London",
      "distanceKm": 0.8,
      "rating": 4.9,
      "reviewsCount": 1420,
      "facilities": ["Jummah Prayer", "Women's Area", "Wudu Facilities"]
    }
  ]
}
```

### 4. Dynamic Landing Dashboard & Daily Content
- **Consolidated Daily Bundle**: `GET /api/dashboard/daily?lat=51.5074&lng=-0.1278&method=MWL&school=Standard`
  - Returns a unified payload containing the calculated next prayer countdown, random Quranic ayah with Amharic translation, verified Hadith, and Islamic quote.
  - Automatically cached client-side using a Stale-While-Revalidate pattern with instant LocalStorage hydration.
- **Next Prayer Calculator**: `GET /api/dashboard/next-prayer?lat=51.5074&lng=-0.1278`
- **Random Ayah of the Day**: `GET /api/dashboard/random-ayah`
- **Random Hadith of the Day**: `GET /api/dashboard/random-hadith`
- **Random Islamic Quote**: `GET /api/dashboard/random-quote`

---

## 🔒 Security & Cloud Firestore Rules

User data (profiles, settings, bookmarks, daily habit entries) is protected under principle-of-least-privilege rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{allSubcollections=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /places/{placeId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🚀 Local Development & Execution Guide

### Prerequisites
- Node.js 20.x or higher
- npm or bun

### 1. Installation
```bash
git clone https://github.com/your-org/muslim-daily-superapp.git
cd muslim-daily-superapp
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your Gemini API key:
```bash
cp .env.example .env
```

```env
# Google Gemini API Key for Ask Ilm AI
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Running Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot TypeScript execution (`tsx`) and integrated Vite middleware.

### 4. Production Build
```bash
npm run build
npm start
```
The build script compiles the client SPA into `dist/` and packages the server into a self-contained CommonJS bundle at `dist/server.cjs`.

---

## 🔄 CI/CD Automation Pipeline

Automated GitHub Actions workflow (`.github/workflows/ci-cd.yml`):
1. **Lint & Typecheck**: Runs `tsc --noEmit` to ensure strict type compliance.
2. **Build Verification**: Executes `npm run build` validating both frontend assets and backend server compilation.
3. **Deployment**: Deploys the static frontend to Firebase Hosting / Cloud Run upon successful main branch merge.

