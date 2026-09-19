# Muslim Daily SuperApp — Frontend Product & Engineering Roadmap (ROADMAP.MD)
## Client-Side Parity Roadmap for https://muslim-daily.web.et/ (Frontend Only)

---

## 1. Scope & Strategic Intent

> **Frontend Architecture Directive**:
> This roadmap governs the frontend delivery of **100% functional, visual, and architectural parity** with `https://muslim-daily.web.et/`. All features are engineered strictly on the **client-side** (React + TypeScript + Vite + Tailwind CSS) using local algorithms, bundled datasets, public client endpoints, and direct Firebase BaaS integrations. **No custom backend service development or server-side routes are introduced or required.**

---

## 2. Frontend Parity Milestones & Track Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TRACK A: Shell, Themes & Navigation Parity (Frontend v1.1)                  │
│ • Client Router supporting all 26 target URLs without server dependencies   │
│ • 4 Quran Themes: Light (#FDFCFA), Dark (#0F172A), Sepia, Night             │
│ • Responsive Layouts: 320px Desktop Sticky Sidebar + Mobile Floating Button │
│ • Focus-Reading Mode (body.focus-reading) for distraction-free Mushaf       │
│ • Client DiceBear Micah avatar generator for profile views                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ TRACK B: Holy Quran & Multi-Quran Comparison (Frontend v1.2)                │
│ • Continuous Mushaf Flow Reading Mode with inline circular Ayah badges      │
│ • Verse-by-Verse Reader with tajweed highlights & translation sheets        │
│ • Multi-Quran Comparative Reader (/multi-quran) with side-by-side columns   │
│ • Random Ayah Discovery (/quran/random) with Tafsir & client translations   │
│ • Quran Bookmarks (/quran/bookmarks) & Favorites (/quran/favorites)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ TRACK C: Solaty Tracker & Prayer Analytics (Frontend v1.3)                  │
│ • Solaty Prayer Checklist (Fard, Sunnah, Witr, Tahajjud, Qada makeup)       │
│ • Solaty Analytics (/solaty/analytics) with client SVG & Recharts heatmaps  │
│ • Client reverse geocoding (api.bigdatacloud.net) & Adhan audio preview     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ TRACK D: Noorani Qaida, Abjad & Heritage (Frontend v1.4)                    │
│ • Interactive Noorani Qaida (/qaida) with GitHub raw audio streaming        │
│ • Abjad Gematria Calculator (/abjad) with client Kabir & Saghir algorithms  │
│ • Ahlul-Bait Interactive Family Tree & biographical cards (/ahlul-bait)     │
│ • Smart Digital Tasbih with haptic feedback & preset ring targets           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ TRACK E: Hadith, Duas, Calendar & Community (Frontend v1.5)                 │
│ • 40 Hadith of Imam An-Nawawi (/hadith) with in-memory search & commentary  │
│ • Hisn al-Muslim Duas (/duas) with audio streams & Web Share integration    │
│ • Dual Hijri-Gregorian interactive monthly calendar (/calendar)             │
│ • Community Khatmah (/community) collective 30-Juz progress tracker         │
│ • Daily Companion spiritual routine checklist (/daily-companion)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ TRACK F: Direct Firebase BaaS Sync & PWA Offline Optimization (v2.0)        │
│ • Bidirectional sync between localStorage and Cloud Firestore subcollections│
│ • Service Worker caching for complete offline client-side functionality     │
│ • Zero backend development verification: pure client execution & BaaS       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Frontend Tracks & Integration Breakdown

### 🎨 Track A: Client Shell, Layout & Design System
- **26 Client-Side Routes**:
  Ensure single-page routing without page reloads across all routes:
  `/`, `/quran`, `/surah/:id`, `/quran/surahs`, `/quran/bookmarks`, `/quran/favorites`, `/quran/random`, `/multi-quran`, `/prayers`, `/solaty`, `/solaty/analytics`, `/duas`, `/hadith`, `/calendar`, `/community`, `/analytics`, `/daily-companion`, `/wisdom`, `/profile`, `/settings`, `/ahlul-bait`, `/ahlul-bait/list`, `/ahlul-bait/:id`, `/tasbih`, `/qaida`, `/abjad`.
- **4 Dedicated Quran Reading Themes**:
  - `quran-theme-light`: Background `#fdfcf8`, text `#1f2937`, accent `#10b981`.
  - `quran-theme-dark`: Background `#0f172a`, text `#e2e8f0`, accent `#38bdf8`.
  - `quran-theme-sepia`: Background `#f6efe4`, text `#3b2f2f`, accent `#d97706`.
  - `quran-theme-night`: Background `#0b1c2c`, text `#dbe7f5`, accent `#38bdf8`.
- **Desktop & Mobile Adaptations**:
  - 320px sticky sidebar on screens `>900px` for quick navigation, reading stats, and saved items.
  - Floating Action Button (FAB) on mobile viewports for quick Surah jumping.
  - `focus-reading` mode hiding headers and docks during continuous Quranic recitation.
- **Client Avatar Integration**:
  - Real-time client avatar rendering using `https://api.dicebear.com/7.x/micah/svg?seed=${username}`.

---

### 📖 Track B: Quran Suite & Multi-Quran Comparison (Frontend Only)
- **Continuous Mushaf Flow Mode**:
  - Client-side text flow rendered with classical Arabic fonts (`Amiri`, `AlQuranNeov5x1`, `Nastaleeq`).
  - Circular ayah separator badges with embedded Eastern Arabic numerals.
  - Active Ayah highlighter synchronized with client HTML5 audio.
- **Verse-by-Verse Mode**:
  - Individual verse cards with audio trigger, copy, bookmark, and share actions.
  - Bottom slide-up translation sheets with English and Amharic translations.
- **Multi-Quran Engine (`/multi-quran`)**:
  - Client-side comparative columns comparing translations (Sahih International, Sani Habib Amharic) and canonical Qira'at (Hafs, Warsh, Ad-Duri).
- **Random Ayah Discovery (`/quran/random`)**:
  - Full-card reflection view with one-tap refresh, Arabic calligraphy, translation, and audio.
- **Bookmarks & Favorites (`/quran/bookmarks`, `/quran/favorites`)**:
  - Instant jump-to-ayah with persistent client storage and Firestore BaaS backup.

---

### 🕌 Track C: Solaty & Prayer Performance Analytics
- **Solaty Prayer Companion (`/solaty`)**:
  - Daily prayer checklist for all 5 obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha).
  - Voluntary prayer tracking: Sunnah Rawatib, Duha, Witr, and Tahajjud.
  - Qada (missed prayer) makeup tracking counter with quick increment/decrement.
- **Solaty Analytics (`/solaty/analytics`)**:
  - Client-rendered weekly and monthly completion percentages using SVG / Recharts.
  - On-time vs. delayed prayer consistency heatmaps.
  - Longest streak tracking and weekly spiritual punctuality scores.
- **Client Reverse Geocoding & Adhan**:
  - Automatic city resolution via client `fetch('https://api.bigdatacloud.net/data/reverse-geocode-client')`.
  - Adhan audio preview featuring Makkah, Madinah, and Alafasy streams.

---

### 🔤 Track D: Noorani Qaida, Abjad & Islamic Heritage
- **Interactive Noorani Qaida (`/qaida`)**:
  - 28 Arabic letters in isolated, initial, medial, and final forms.
  - Client pronunciation audio streamed from `https://raw.githubusercontent.com/guillaumeschmitt/arabic-alphabet-audio/master/audio/${letter}.mp3`.
  - "Mastered" progress tracker syncing to `localStorage` and Firestore (`qaida_mastered`).
- **Abjad Gematria Calculator (`/abjad`)**:
  - Real-time sentence decomposition into classical letter numerical values in-memory.
  - Toggle between Kabir (Major) and Saghir (Minor) counting systems.
  - Calculation logs and history drawer (`abjad_history`).
- **Ahlul-Bait Interactive Genealogy (`/ahlul-bait`, `/ahlul-bait/list`, `/ahlul-bait/:id`)**:
  - Interactive family tree layout linking the Prophet Muhammad (PBUH) to his family and descendants.
  - Biography hero cards with lifespan, virtues, and key historical lessons.
- **Smart Digital Tasbih (`/tasbih`)**:
  - Target ring progress indicators (33, 99, 100, custom) with haptic feedback.
  - Lifetime tasbih session logs (`tasbih_sessions`).

---

### 📚 Track E: Hadith 40 Nawawi, Duas, Calendar & Community
- **40 Hadith of Imam An-Nawawi (`/hadith`)**:
  - Full Arabic text, English translation, Amharic translation, commentary, and lessons.
  - Instant in-memory client text search across Arabic and English terms.
- **Hisn al-Muslim Duas (`/duas`)**:
  - Categorized supplications with Arabic tashkeel, transliteration, and benefits.
  - Audio recitation playback via public CDN audio.
  - Reminder notification scheduling via browser Notification API (`duaRemindersEnabled`).
- **Dual Hijri-Gregorian Calendar (`/calendar`)**:
  - Interactive monthly grid with highlighted Islamic holy occasions.
  - Offline sync queue for custom religious appointments (`calendar_sync_queue`).
- **Community Khatmah (`/community`)**:
  - Collective Quran reading circle allowing users to claim individual Juz portions via Firestore BaaS.
- **Daily Companion (`/daily-companion`)**:
  - Structured morning, afternoon, and evening worship milestones.

---

### ⚙️ Track F: Direct Firebase BaaS Sync & Offline PWA Hardening
- **Zero Backend Requirement**:
  - All features function 100% within the client runtime.
  - Direct Firebase Client SDK usage for Auth and Firestore operations with `handleFirestoreError`.
- **Offline-First Resilience**:
  - Immediate local state hydration from `localStorage` ensuring 100% offline availability for all 26 views.
- **PWA Capabilities**:
  - Service worker asset caching and standalone app manifest installation.
