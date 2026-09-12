# Muslim Daily SuperApp — Product & Engineering Roadmap 🗺️

## Strategic Vision

The **Muslim Daily SuperApp** is committed to serving the global Ummah with an authentic, privacy-respecting, and aesthetically pristine digital companion. By combining strict adherence to authentic Quranic and Sunnah scholarship with modern software architecture—micro-frontend modularity, offline-first reliability, Apple iOS Human Interface elegance, and Google Gemini AI intelligence—the application provides a seamless spiritual utility that remains completely functional anywhere in the world, regardless of network connectivity.

---

## Core Guiding Principles

1. **Authenticity & Scholarly Vetting**: All Quranic texts, canonical Qira'at readings, Hadith references, and supplications must be traced to authentic, verified classical sources.
2. **Offline-First Reliability**: Core spiritual duties (prayer calculations, Qibla heading, Holy Quran, daily Adhkar, Tasbih) must never depend on an active internet connection.
3. **Privacy-First (Zero Telemetry)**: Worship, personal habits, and reflections are sacred. User data is strictly private and sandboxed with no behavioral tracking, advertising beacons, or third-party data broker integrations.
4. **Delightful Craft & Ergonomics**: Built with iOS HIG design discipline—44px+ touch targets, elastic gestures, subtle haptics, and zero visual clutter.

---

## Horizon Overview & Delivery Milestones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HORIZON 1: Foundation & Core Ecosystem (v1.0 - v1.5)           [COMPLETED]   │
│ • SuperApp Shell Container & 12 Modular Mini-Applications                   │
│ • 10 Canonical Qira'at with Amharic & English Translations                  │
│ • Astronomical Prayer Times & Qibla Compass Engine                          │
│ • Google Gemini 2.5 Flash Server-Side AI Knowledge Proxy                   │
│ • Stale-While-Revalidate Dashboard API with Offline Storage Caching         │
│ • One-Tap Social Media Quote Sharing & Pull-to-Refresh Gesture Controls     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ HORIZON 2: Community Sync & Edge Capabilities (v2.0)           [Q3-Q4 2026]  │
│ • Background Service Worker Web Push Notifications for Adhan                │
│ • Offline Quran Audio Download Manager via CacheStorage API                 │
│ • Halal Food Ingredient Scanner via Gemini Vision OCR                       │
│ • Collaborative Community Khatm al-Quran Reading Circles                    │
│ • Full Riyad as-Salihin with Categorized Scholarly Explanations             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ HORIZON 3: Wearables, Community Hub & Language Hub (v3.0)      [Q1-Q2 2027]  │
│ • Apple Watch & Wear OS Native Companion Apps                               │
│ • Masjid Community Portal (Jummah Timings & Local Announcements)            │
│ • Multilingual Expansion (Oromo, Somali, Tigrinya, Swahili, Urdu)           │
│ • Classical Mirath (Islamic Inheritance Shares) Calculator                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ HORIZON 4: Edge Intelligence & Verified Waqf Ledger (v4.0)     [Q3-Q4 2027+] │
│ • On-Device Gemini Nano Integration for 100% Offline AI Guidance            │
│ • Decentralized Waqf & Sadaqah Jariyah Micro-Donations Ledger               │
│ • Crowdsourced Halal Dining & Verified Masjid Geo-Network                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Milestone Roadmap

### 🏁 Horizon 1: Core Platform & Foundation (v1.0 – v1.5) — *Current Production Baseline*

- [x] **SuperApp Container Architecture**: Built modular host shell (`SuperAppShell.tsx`) with floating iOS dock (`TabBar.tsx`) and dynamic app launcher (`MoreAppsSheet.tsx`).
- [x] **Holy Quran with 10 Canonical Qira'at**:
  - Implemented Hafs, Warsh, Qalun, Ad-Duri (Horn of Africa & Sudan), As-Soussi, Shu'bah, Khalaf, Khallad, Al-Bazzi, and Qunbul.
  - Complete Amharic translation by Sheikh Muhammed Sani Habib & Sayyid Muhammed Sadiq.
  - Renowned audio reciters (Al-Hussary, Noreen Siddiq, Abdulrasheed Soufi, Mishary Alafasy).
- [x] **Astronomical Calculation Engine**: Solar declination algorithms supporting 6 global conventions (MWL, ISNA, Makkah, Karachi, Egypt, Gulf) and Hanafi/Standard Asr shadow ratios.
- [x] **Hardware-Integrated Qibla Compass**: Great Circle Haversine azimuth bearing with real-time magnetometer and haptic alignment cues.
- [x] **Sensory Tasbih & Hisn al-Muslim Adhkar**: Web Audio synthesis for tactile bead clicks, cycle tracking, and authenticated daily supplications.
- [x] **Muhasabah Habit Tracker & Zakat Engine**: Daily 5-prayer checklists, fasting records, and dual-Nisab (Gold/Silver) Zakat calculations synced with Cloud Firestore.
- [x] **Decoupled Backend Architecture**: Layered Express API (`/server`) featuring Google Gemini 2.5 Flash scholarly integration, places geo-directory, and health monitors.
- [x] **Stale-While-Revalidate (SWR) Offline Caching**: Persistent `localStorage` layer hydrating the landing page instantly, combined with an offline status banner.
- [x] **One-Tap Quote Social Sharing**: Formatted social media export with Arabic calligraphy, translation, and attribution citations.
- [x] **Pull-To-Refresh Interaction**: Native elastic gesture at the top of the landing page to trigger immediate cache revalidation and astronomical updates.

---

### 🚀 Horizon 2: Community Sync & Edge Capabilities (v2.0) — *Target: Q3 – Q4 2026*

#### 1. Background Service Worker Push Notifications (Adhan & Reminders)
- Implement Web Push API with VAPID authentication for scheduled prayer alerts.
- Register background synchronization events in the Service Worker to recalculate prayer times dynamically at midnight.
- Custom notification audio chimes conforming to user sound preferences.

#### 2. Offline Quran Audio Download Manager
- Utilize the browser's `CacheStorage` API to enable selective, surah-by-surah and riwayah-by-riwayah audio downloads.
- Visual download progress indicators with granular storage management (inspect byte usage and purge cache).

#### 3. Halal Ingredient Vision Scanner
- Leverage Gemini 2.5 Flash Vision OCR through the `/api/ai` backend proxy.
- Users capture photos of packaged food ingredient lists; the system automatically flags non-Halal E-numbers, porcine gelatin, animal rennet, and questionable additives.

#### 4. Community Khatm Al-Quran Circles
- Enable families and study groups to initiate collaborative Khatm circles.
- Real-time page-by-page progress synchronization via Firestore subcollections with privacy-controlled sharing links.

#### 5. Scholarly Library Expansion
- Ingest complete *Riyad as-Salihin* and *Shamail al-Muhammadiyyah* with searchable English and Amharic glossaries.

---

### ⌚ Horizon 3: Wearables, Community Hub & Language Hub (v3.0) — *Target: Q1 – Q2 2027*

#### 1. WatchOS & Wear OS Companion Apps
- Standalone smart-wrist extensions for glanceable complications:
  - Next prayer countdown ring on the watch face.
  - Digital crown-driven Tasbih counter with distinct Taptic engine haptics.
  - Silent vibration alarms for Fajr and Tahajjud.

#### 2. Masjid Community Portal
- Masajid administrators can verify and publish local Iqamah schedules, Jummah times, and Ramadhan Taraweeh updates.
- Real-time prayer adjustment offsets (e.g., "+15 minutes after Adhan for Iqamah").

#### 3. Multilingual Regional Translations
- Expand translation coverage for the Horn of Africa and East Africa:
  - Afaan Oromoo (Oromo) Quranic translation.
  - Somali, Tigrinya, and Swahili translations.
  - Urdu and Bengali language packs for broader global reach.

#### 4. Mirath (Islamic Inheritance) Engine
- Rigorous mathematical calculator based on Quranic *Fara'id* shares according to classical Sunni jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali).

---

### 🌐 Horizon 4: Edge Intelligence & Verified Waqf Ledger (v4.0) — *Target: Q3 – Q4 2027 & Beyond*

#### 1. On-Device Edge Neural Models (Gemini Nano)
- Integrate WebNN / on-device LLMs for 100% offline scholarly Q&A without sending network requests.
- Immediate responses for common Fiqh questions, Arabic grammar queries, and Tajweed rules.

#### 2. Transparent Waqf & Sadaqah Jariyah Ledger
- Direct, zero-commission charitable micro-contributions for water wells, Quran printing, and educational endowments.
- Transparent reporting with project completion proofs and real-time updates.

#### 3. Crowdsourced Halal & Prayer Space Verification Network
- Community-reviewed listings for prayer spaces in international airports, universities, and transit stations with photo verification and ablution amenity tags.

---

## Technical Debt & Infrastructure Governance

| Area | Current State | Planned Evolution | Target Milestone |
|---|---|---|---|
| **Audio Storage** | Streamed from CDN endpoints | Hybrid CacheStorage with LRU eviction | v2.0 |
| **Testing Coverage** | Strict TypeScript compilation & manual checks | Vitest unit testing suite + Playwright E2E integration tests | v2.0 |
| **PWA Service Worker** | Standard offline fallback | Custom Workbox pipeline with background sync | v2.1 |
| **State Management** | React Context (`AuthContext`) | Granular Zustand state slices for mini-apps | v2.5 |
| **Server Scaling** | Containerized Express on Cloud Run | Edge Functions with multi-region CDN caching | v3.0 |

---

## Risk Management & Mitigation Matrix

| Risk Factor | Probability | Impact | Mitigation Strategy |
|---|---|---|---|
| **Inaccurate Prayer Times** | Low | High | Rigorous mathematical validation against USNO astronomical tables; explicit disclaimers and manual minute calibration offsets in Settings. |
| **Astronomical Calculation Drift** | Low | Medium | Daily recalculation cycle; support for 6 international conventions to match local Islamic authorities. |
| **Device Magnetometer Noise** | Medium | Medium | In-app compass calibration guide (figure-8 motion); automatic GPS true-north fallback. |
| **AI Hallucinations on Fiqh Matters** | Medium | High | Strict system prompt constraining answers to verified citations; prominent scholarly disclaimer directing users to qualified local Muftis. |
| **Network Outages in Developing Regions** | High | High | Offline-first architecture with instant local caching; 100% functionality for core worship utilities without internet. |
