# Muslim Daily SuperApp — Technical Architecture Specification 🏛️

## 1. Executive Summary & Architectural Overview

The **Muslim Daily SuperApp** is an enterprise-grade, mobile-first progressive web application engineered under a decoupled **SuperApp & Modular Mini-Application Architecture**. It consolidates 12 specialized Islamic utility modules—spanning astronomical prayer schedules, 10 canonical Quranic Qira'at with Amharic and English translations, a spherical sensor-driven Qibla compass, tactile Dhikr counters, Hisn al-Muslim supplications, habit tracking, Zakat computation, verified Halal geo-discovery, and an AI scholarly assistant powered by Google Gemini 2.5 Flash—into a unified, iOS Human Interface Guidelines (HIG)-compliant application shell.

### 📑 Technical Documentation
- **[Comprehensive SuperApp Guide (README.md)](./README.md)**: Developer guide, How to Make Mini-Apps step-by-step tutorial, getting started, and Cloud Run / Firebase deployment guide.
- **[Parity Master Implementation Plan (PLAN.md)](./PLAN.md)**: Frontend-only architectural blueprint and route-by-route execution plan to achieve 100% functional and UI/UX parity with `https://muslim-daily.web.et/` via pure client engines and direct BaaS integrations.
- **[Product & Engineering Roadmap (ROADMAP.md)](./ROADMAP.md)**: Strategic frontend roadmap and milestone delivery tracks spanning design system parity, Quran Mushaf flow, Solaty analytics, Qaida, Abjad, and client integrations (zero backend development).
- **[Interactive API Documentation (Swagger UI)](/docs)**: Live interactive OpenAPI 3.0 explorer for all endpoints (Qamus, Quran, Prayers, Calendar, Hadith, Duas, AI).
2. **Frontend-Only Expansion & Client Direct Integrations**: All target parity features inspired by `https://muslim-daily.web.et/` (e.g., Noorani Qaida, Abjad calculator, Solaty analytics, Ahlul-Bait family tree, Multi-Quran comparative reader, and Hisn al-Muslim audio) are engineered strictly on the **frontend** using client-side algorithms, static datasets, browser APIs, and direct Firebase BaaS integrations. No custom backend service development or server routes are created for feature parity.
3. **Offline-First Resilience**: Multi-tier caching strategy (in-memory state, synchronous `localStorage` fallback, service worker PWA, and stale-while-revalidate network synchronization) guarantees that prayer times, supplications, and holy scripture remain accessible without network connectivity.
4. **Zero Browser Secret Exposure**: Existing Gemini 2.5 Flash interactions run through the existing backend proxy layer, while all new utility tools run purely on the client side.
5. **Strict Type Safety & Principle-of-Least-Privilege**: Written in strict TypeScript across client modules, bound to granular Firestore security rules matching authenticated user UIDs.

---

## 2. High-Level System Topology

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT LAYER (BROWSER / PWA)                              │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  SuperApp Shell Container (/src/superapp/SuperAppShell.tsx)                                │
│  ├── Top Navigation Bar (Contextual Modals, Hijri Date, Live Indicators)                    │
│  ├── Floating iOS Dock Bar (Home, Quran, Prayer, Duas, App Drawer Launcher)                │
│  ├── Gesture Engine (Pull-to-Refresh, Damped Elastic Curves, Touch Targets ≥44px)           │
│  └── MiniApp Registry Manifest (/src/superapp/miniapps.manifest.ts)                         │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  12 Isolated Mini-Applications (/src/miniapps/)                                             │
│  ├── 🕒 prayer-times       ├── 📖 quran (10 Qira'at)     ├── 🧭 qibla (Magnetometer)        │
│  ├── 📿 tasbih (Haptic)    ├── 🤲 adhkar (Hisn)          ├── 📊 habit-tracker (Muhasabah)   │
│  ├── 💰 zakat (Nisab)      ├── 📍 places (Geo-Locator)   ├── 🤖 ai-assistant (Ask Ilm)      │
│  ├── 💬 quotes (Wisdom)    ├── 🌿 sanctuary (Focus)      ├── 📚 library (Scholarly)         │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  Cross-Cutting Client Services & Storage                                                    │
│  ├── AuthContext Hub (Firebase Auth + Firestore Cloud Sync + Local Fallback)                │
│  ├── Astronomical Calculation Engine (Local Keplerian Solar Formulas & Hijri Matrix)       │
│  ├── Web Audio & Media Engine (HTML5 Reciter Streaming + Web Audio Synthesizer)            │
│  └── Dashboard API Client (Stale-While-Revalidate Caching Layer & Storage Accessors)        │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │ JSON HTTP /api/*
                                               │ (Reverse Proxied via Port 3000)
┌──────────────────────────────────────────────▼──────────────────────────────────────────────┐
│                                  BACKEND RUNTIME (NODE.JS / EXPRESS)                        │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  Server Entry (/server.ts) ──► Application Factory (/server/app.ts)                         │
│  ├── Security & Middlewares (CORS, Express JSON, Logging, Strict Error Handling)            │
│  ├── Config & Env Validation (/server/config/env.ts, /server/config/gemini.ts)              │
│  ├── Master API Router (/server/routes/index.ts)                                            │
│  │   ├── /api/health          ──► HealthController (System Status & Uptime)                 │
│  │   ├── /api/dashboard/*     ──► DashboardController (Daily Aggregate, Next Prayer, Ayah)  │
│  │   ├── /api/places          ──► PlacesController (Masjid & Halal Food Catalog Search)     │
│  │   └── /api/ai/ask          ──► AIController (Gemini 2.5 Flash Scholarly Guidance)        │
│  └── Domain Services (/server/services/)                                                    │
│      ├── gemini.service.ts    (Scholarly System Directives & LLM Execution)                 │
│      ├── places.service.ts    (Geo-filtering & Facility Facets)                             │
│      └── dashboard.service.ts (Server-side Solar Times, Curated Hadiths & Quotes)           │
└──────────────────────────────┬──────────────────────────────────────────────┬───────────────┘
                               │ Private Service Key                          │ Client Auth Token
┌──────────────────────────────▼──────────────┐ ┌─────────────────────────────▼───────────────┐
│           GOOGLE GEMINI 2.5 FLASH           │ │            FIREBASE BAAS ECOSYSTEM           │
├─────────────────────────────────────────────┤ ├──────────────────────────────────────────────┤
│  • Generative AI SDK (@google/genai)        │ │  • Firebase Authentication (Email/Password)  │
│  • Scholarly Islamic Knowledge Synthesis    │ │  • Cloud Firestore (Per-User Sandbox)        │
│  • Strictly Server-Side Authenticated       │ │  • Granular Principle-of-Least-Privilege     │
└─────────────────────────────────────────────┘ └──────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 SuperApp Shell & Micro-Frontend Container
The frontend is structured around a centralized host container (`/src/superapp/SuperAppShell.tsx`):
- **Dynamic View Routing**: Mini-applications are registered in a declarative manifest (`miniapps.manifest.ts`). Each mini-app defines its metadata (`id`, `title`, `description`, `icon`, `category`, and `keywords`).
- **Contextual Navigation & Dock**: The shell renders a sticky iOS-styled top bar displaying the current active app title, Gregorian and Hijri calendar dates, and an action trigger. A floating glassmorphic dock (`TabBar.tsx`) provides instantaneous access to high-frequency views (`home`, `prayer`, `quran`, `adhkar`) alongside a modal bottom sheet launcher (`MoreAppsSheet.tsx`) for secondary mini-apps.
- **Micro-Frontend Sandboxing**: Each mini-app in `/src/miniapps/{name}` is self-contained with its own internal state, view hierarchy, and domain types, interacting with the global environment only via strongly-typed React contexts (`useAuth`, `preferences`).

### 3.2 State Management & Multi-Tier Data Synchronization
The application implements a 3-tier state hierarchy:
1. **Volatile Component State**: Local UI interactions (active tabs, search query filters, modal view toggles, audio playback progress).
2. **Client-Side Persistence (LocalStorage)**:
   - Stores offline prayer calculation preferences (latitude, longitude, calculation method, juristic school, high latitude rule).
   - Caches landing page payloads (`ilm_cache_daily_dashboard`, `ilm_cache_next_prayer`, `ilm_cache_random_ayah`, `ilm_cache_random_hadith`, `ilm_cache_random_quote`).
   - Maintains offline bookmarks, Tasbih lifetime totals, and local habit checkmarks.
3. **Remote BaaS Replication (Cloud Firestore)**:
   - When authenticated, user profiles, cross-device bookmarks, and daily Muhasabah habit logs automatically sync to Firestore paths `/users/{uid}/*`.
   - On network reconnection, local optimistic modifications merge into the cloud document store.

### 3.3 Offline Strategy & Stale-While-Revalidate (SWR)
To guarantee 100% offline availability in regions with intermittent network connectivity:
- **Instant Synchronous Hydration**: State initializes using synchronous cache accessors (`getCachedDailyDashboard()`, `getCachedNextPrayer()`, `getCachedAyah()`). The user experiences 0ms white-screen latency.
- **Background Revalidation**: An asynchronous background network request queries `/api/dashboard/daily`. When the server responds, in-memory state refreshes and the local cache updates silently.
- **Pull-To-Refresh Gesture**: Implements a native iOS-style elastic pull gesture at the top of the landing page, allowing users to manually force a recalculation and network refetch of astronomical and daily data.
- **Offline Status Banner**: A discreet notification banner indicates when cached data is being served due to network disconnection.

### 3.4 Hardware & Sensory Subsystems
- **Audio Subsystem**:
  - **HTML5 Streaming Media**: Delivers high-bitrate recitation of the Holy Quran across all 10 canonical Qira'at (Al-Hussary, Noreen Siddiq, Abdulrasheed Soufi, Mishary Alafasy) with buffered playback and background lock-screen media controls.
  - **Web Audio API Sound Engine (`soundUtils.ts`)**: Synthesizes mechanical tactile click sounds for the digital Tasbih and audio tones for prayer countdown timers without requesting external audio assets.
- **Magnetometer & Spherical Trigonometry (`qibla`)**:
  - Uses the W3C DeviceOrientation API with webkitCompassHeading compensation.
  - Calculates the forward azimuth bearing to the Kaaba $(21.4225^\circ \text{ N}, 39.8262^\circ \text{ E})$ using the Great Circle Haversine formula:
    $$\theta = \text{atan2}(\sin(\Delta \lambda) \cdot \cos(\phi_2), \cos(\phi_1) \cdot \sin(\phi_2) - \sin(\phi_1) \cdot \cos(\phi_2) \cdot \cos(\Delta \lambda))$$
  - Provides subtle haptic vibrations (`navigator.vibrate`) when aligned within $\pm 3^\circ$ of True Qibla.

---

## 4. Backend Architecture

### 4.1 Layered Clean Decoupled Architecture
The backend is organized in the `/server` directory following strict separation of concerns:

```
server/
├── app.ts                  # Express application factory & middleware orchestrator
├── config/
│   ├── env.ts              # Environment variable validation & type-safe parsing
│   └── gemini.ts           # Lazy singleton factory for Google Gen AI SDK
├── controllers/
│   ├── ai.controller.ts    # AI prompt validation & response routing
│   ├── dashboard.controller.ts # Daily dashboard, prayer & quote API controller
│   ├── health.controller.ts    # Healthcheck & uptime diagnostic controller
│   └── places.controller.ts    # Masajid & Halal dining query controller
├── routes/
│   ├── index.ts            # Master API router mounting all sub-routes
│   ├── ai.routes.ts        # /api/ai sub-router
│   ├── dashboard.routes.ts # /api/dashboard sub-router
│   ├── health.routes.ts    # /api/health sub-router
│   └── places.routes.ts    # /api/places sub-router
├── services/
│   ├── gemini.service.ts   # Scholarly Islamic knowledge synthesis service
│   └── places.service.ts   # Geo-directory indexing & facility filter service
└── types/
    └── index.ts            # Shared backend interfaces & HTTP contracts
```

### 4.2 Application Factory Pattern (`server/app.ts`)
The server encapsulates Express configuration within an exportable `createApp()` factory:
- Enables clean automated testing without binding network sockets.
- Mounts standard middlewares: `express.json({ limit: "1mb" })`, CORS configuration, and security headers.
- Attaches the consolidated `/api` master router.
- Integrates Vite development middleware during development mode (`process.env.NODE_ENV !== "production"`) and serves static production assets from `/dist` in production mode.

### 4.3 Google Gemini 2.5 Flash Service Layer
The AI integration utilizes `@google/genai` with a lazy-initialization pattern (`server/config/gemini.ts`):
- **Security**: The Gemini API key is read exclusively from `process.env.GEMINI_API_KEY` on the server and is never passed to the browser bundle.
- **Scholarly Prompt Directives**: The service enforces system instructions ensuring that all responses are anchored in the authentic Quran and Sunnah, citing Surah and Hadith numbers, presenting major juristic opinions respectfully, and clarifying that the AI is an educational tool rather than a Mufti issuing formal Fatwas.

---

## 5. Data Architecture & Security Specifications

### 5.1 Cloud Firestore Schema
User documents are strictly sandboxed within the `/users/{userId}` path:

```
firestore-root/
├── users/
│   └── {userId}/
│       ├── profile: { email, displayName, juristicSchool, calculationMethod, qiraatPreference }
│       ├── bookmarks/
│       │   └── {surahNumber}: { surahNumber, verseNumber, surahName, qiraat, timestamp }
│       ├── habits/
│       │   └── {yyyy-mm-dd}: { fajr, dhuhr, asr, maghrib, isha, duha, tahajjud, fasting }
│       └── zakat/
│           └── {calculationId}: { totalAssets, netZakat, nisabBenchmark, date }
└── places/
    └── {placeId}: { name, category, address, coordinates, facilities, verified }
```

### 5.2 Firestore Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sandboxed user document space: only the authenticated owner may read or write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{allSubcollections=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public directory data: read-only access for all clients
    match /places/{placeId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 6. Build, Packaging & Deployment Pipeline

### 6.1 Unified Build Architecture
The production build pipeline reconciles single-page application bundling with standalone Node.js server execution:
1. **Frontend Compilation**: `vite build` executes standard Rollup bundling, generating optimized static assets, code splits, and hashed chunks into `/dist`.
2. **Backend Compilation**: `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` packages the entire backend TypeScript codebase into a single CommonJS executable file, resolving runtime module issues and accelerating container startup.
3. **Production Entry Point**: The runtime executes `node dist/server.cjs`, serving both the high-performance API endpoints and the static SPA frontend from port `3000`.

### 6.2 CI/CD Automation Matrix (`.github/workflows/ci-cd.yml`)
- **PR Pipeline**: Automated checkout, Node.js 20 environment caching, strict linting (`tsc --noEmit`), and full production build verification.
- **Continuous Deployment**: Merges to `main` trigger automated builds with encrypted secret injection (`GEMINI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`) and deploy directly to production infrastructure.

---

## 7. Qamus Arabic Dictionary, Grammar (Nahw/Sarf) & I'rab Engine

### 7.1 Morphological & Lexical Pipeline
The **Qamus Mini-App** provides deep classical Arabic linguistic analysis:
- **Triliteral Root Extraction**: Canonical root mapping (e.g. ك-ت-ب, ر-ح-م) linked to Quranic frequency indexes.
- **Tashkeel & Diacritics**: Interactive on-screen Tashkeel keyboard (Fatha, Damma, Kasra, Shaddah, Sukun, Tanween).
- **Conjugation Matrix (Awzan)**: Classical 10 Verb Forms (الأوزان العشرة) with Past (ماض), Present (مضارع), Verbal Noun (مصدر), and Participle (اسم الفاعل).
- **I'rab Syntactic Case Parsing**: Color-coded grammatical role breakdowns for verbs, nouns, and particles.
- **Multilingual Support**: Primary translations in English and Amharic, alongside classical definitions from *Lisan al-Arab* and *Hans Wehr*.
- **Quranic Concordance**: Direct ayat citations with highlighted occurrence terms and spiritual reflections.
- **Personal Vocabulary & Flashcards**: Offline-first storage with automatic Firestore sync at `/users/{userId}/vocabulary/{wordId}`.

### 7.2 OpenAPI 3.0 & Swagger UI Architecture
All RESTful endpoints are formally specified in OpenAPI 3.0.3 (`server/docs/openapi.ts`):
- **Interactive Swagger UI**: Served directly at `/docs` and `/api/docs` using Swagger UI CDN.
- **Machine-Readable Spec**: Available in JSON at `/api/docs/swagger.json` and `/api/docs/openapi.json`.
- **Developer Aliases**: Full backward-compatible route aliases for `/qamus` and `/api/qamus`.

---

## 8. Quality Assurance & Performance Metrics

| Metric | Target | Architecture Provision |
|---|---|---|
| **First Contentful Paint (FCP)** | < 1.0s | Instant synchronous cache hydration + local asset bundling |
| **Time to Interactive (TTI)** | < 1.8s | Code-split mini-applications and deferred audio loading |
| **Offline Reliability** | 100% for Core Functions | Local astronomical math engine + LocalStorage SWR caching |
| **Bundle Size Optimization** | Minimized Bloat | Zero local raster/vector image baggage; SVG/CSS vector icons |
| **Security Audit** | Clean | Principle-of-least-privilege Firestore rules + zero browser API keys |
