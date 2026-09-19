# Muslim Daily SuperApp — Frontend Master Implementation Plan (PLAN.MD)
## Client-Side Architecture & UI/UX Parity Plan for https://muslim-daily.web.et/

---

## 1. Executive Summary & Core Architectural Constraint

> **Direct Client-Side Architecture Directive**:
> This implementation plan is strictly constrained to **frontend-only client architecture and client-side integrations**. It does **NOT** require or include custom backend service development. All functionality—spanning astronomical prayer calculations, Quran text rendering, 10 Qira'at comparisons, Hadith, Duas, audio streaming, Abjad gematria, Noorani Qaida, Solaty analytics, and offline persistence—is powered purely within the client-side SPA (React + TypeScript + Vite) using client-side algorithms, bundled or CDN static assets, and direct client integrations (Firebase BaaS SDK, browser Web APIs, and client-safe public endpoints).

---

## 2. Client-Side Integration & Engine Matrix (No Backend Development)

| Capability / Module | Client-Side Engine & Direct Integration Method | Data Source & Mechanism |
|---|---|---|
| **Astronomical Prayer Calculations** | Local calculation formulas (Keplerian solar declination, equation of time, solar altitude angles) | Runs directly in browser via client-side algorithms (MWL, ISNA, Egypt, Makkah, Karachi, Gulf, Hanafi/Standard) |
| **Qibla Direction** | Spherical Great-Circle Trigonometry (`atan2` formula to Kaaba `21.4225° N, 39.8262° E`) + Device Orientation API | Browser `window.DeviceOrientationEvent` or compass heading fallback |
| **Reverse Geocoding** | Client `fetch()` to `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=...&longitude=...` | No API keys needed; executed entirely from the client |
| **Holy Quran Text & Translations** | Bundled static JSON catalogs + Quran.com / AlQuran.cloud public client CDN | Client-side memory indexing; instant search without backend |
| **Multi-Quran Comparison** | Client-side comparative layout engine | Parallel rendering of Hafs, Warsh, Ad-Duri texts with English & Amharic side-by-side |
| **Audio Streaming** | Client HTML5 `Audio` & Web Audio API | Direct CDN streams: IslamCan Adhan (`/adhan-makkah.mp3`), EveryAyah audio CDNs, GitHub Arabic Alphabet Audio |
| **Noorani Qaida Learning** | Client interactive letter grid + Web Audio | Audio fetched directly from `https://raw.githubusercontent.com/guillaumeschmitt/arabic-alphabet-audio/master/audio/${letter}.mp3` |
| **Abjad Gematria Calculator** | Pure client-side string parser & lookup table | Algorithmic character mapping (Kabir & Saghir systems) executed in-memory |
| **Ahlul-Bait Family Tree** | Client SVG / CSS tree hierarchy + local biographical dataset | Static structured genealogical data rendered with interactive client modals |
| **Hadith 40 Nawawi** | Static curated collection with bilingual translations | In-memory dataset with client-side text filtering and search |
| **Hisn al-Muslim Duas** | Comprehensive supplication database | Client dataset categorized by prayer, morning/evening, travel, with audio recitation links |
| **Solaty Prayer Tracker & Analytics** | React state + SVG / Recharts data visualization | Stored in `localStorage` with automated Firestore BaaS backup |
| **Data Persistence & Accounts** | Direct Firebase Client SDK (Auth + Firestore) | `signInWithPopup`, `signInAnonymously`, `doc()`, `setDoc()`, `getDocs()`, fallback to `localStorage` |
| **Avatar Generation** | Client SVG rendering from DiceBear | `https://api.dicebear.com/7.x/micah/svg?seed=${username}` |
| **Social Sharing** | Native Web Share API + Intent URLs | `navigator.share()` with WhatsApp (`wa.me`), Telegram (`t.me`), and Facebook direct URLs |

---

## 3. Target Route Architecture (26 Distinct Frontend Views)

All 26 routes discovered on `https://muslim-daily.web.et/` are mapped directly to frontend views and components within the React client router / SuperApp Shell:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REACT ROUTER / SUPERAPP SHELL                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Home & Routine Dashboard                                                 │
│    ├── /                     -> HomeDashboard (Daily companion, prayer countdown, streak) │
│    ├── /daily-companion      -> DailyCompanionView (Morning-to-night checklist)        │
│    ├── /wisdom               -> WisdomQuotesView (Daily pearls, one-tap copy card)    │
│    └── /analytics            -> SpiritualAnalyticsView (Aggregate prayer/dhikr stats)  │
│                                                                             │
│ 2. Quranic Suite                                                            │
│    ├── /quran                -> QuranReaderApp (Surah catalog & dual reader)           │
│    ├── /surah/:id            -> SurahDetailView (Verse-by-verse & Mushaf flow)        │
│    ├── /quran/surahs         -> SurahIndexView (Quick numerical jump index)           │
│    ├── /quran/bookmarks      -> QuranBookmarksView (Saved verses list)                │
│    ├── /quran/favorites      -> QuranFavoritesView (Favorited reflections)            │
│    ├── /quran/random         -> RandomAyahView (Discovery card with translation)       │
│    └── /multi-quran          -> MultiQuranComparativeView (Dual translation/Qira'at)   │
│                                                                             │
│ 3. Prayer, Timetable & Solaty Tracker                                       │
│    ├── /prayers              -> PrayerTimesView (Solar timetable, method selector)    │
│    ├── /solaty               -> SolatyTrackerView (Daily 5 fard + sunnah + qada)       │
│    └── /solaty/analytics     -> SolatyAnalyticsView (Punctuality heatmaps & streaks)   │
│                                                                             │
│ 4. Supplications & Prophetic Traditions                                     │
│    ├── /duas                 -> DuasHisnView (Categorized Hisn al-Muslim + audio)     │
│    └── /hadith               -> HadithNawawiView (40 Hadith with commentary/lessons)   │
│                                                                             │
│ 5. Classical Islamic Tools & Heritage                                       │
│    ├── /tasbih               -> TasbihApp (Smart haptic digital bead counter)         │
│    ├── /qaida                -> NooraniQaidaView (Alphabet & audio pronunciation)      │
│    ├── /abjad                -> AbjadCalculatorView (Classical gematria Hisab Jummal)  │
│    ├── /ahlul-bait           -> AhlulBaitFamilyTreeView (Visual genealogy tree)        │
│    ├── /ahlul-bait/list      -> AhlulBaitListView (Biographical index)                │
│    └── /ahlul-bait/:id       -> AhlulBaitDetailView (Personality profile hero)         │
│                                                                             │
│ 6. Community, Calendar & User Profile                                       │
│    ├── /calendar             -> HijriCalendarView (Dual Hijri-Gregorian interactive)   │
│    ├── /community            -> CommunityKhatmahView (Shared 30 Juz reading circles)   │
│    ├── /profile              -> ProfileView (DiceBear avatar, cloud sync status)       │
│    └── /settings             -> SettingsModalView (Typography, themes, methods)        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. UI/UX Design System Specification (100% Target Parity)

### 4.1 Color Palettes & Quran Themes
The target site implements 4 dedicated reading environments via CSS variables:
1. **Light Theme** (`quran-theme-light`):
   - Background: `#fdfcf8` / Surface: `#ffffff`
   - Text: `#1f2937`
   - Accent: `#10b981`
   - Active Ayah Highlight: `rgba(16, 185, 129, 0.08)`
2. **Dark Theme** (`quran-theme-dark`):
   - Background: `#0f172a` / Surface: `rgba(15, 23, 42, 0.8)`
   - Text: `#e2e8f0`
   - Accent: `#38bdf8`
   - Active Ayah Highlight: `rgba(59, 130, 246, 0.18)`
3. **Sepia Theme** (`quran-theme-sepia`):
   - Background: `#f6efe4` / Surface: `#fff8ef`
   - Text: `#3b2f2f`
   - Accent: `#d97706`
   - Active Ayah Highlight: `rgba(217, 119, 6, 0.12)`
4. **Night Blue Theme** (`quran-theme-night`):
   - Background: `#0b1c2c` / Surface: `rgba(11, 28, 44, 0.9)`
   - Text: `#dbe7f5`
   - Accent: `#38bdf8`
   - Active Ayah Highlight: `rgba(56, 189, 248, 0.18)`

### 4.2 Typography Hierarchy
- **Classical Arabic Recitation**: Amiri (`font-arabic`), Scheherazade New, and Uthmanic Neo (`AlQuranNeov5x1`).
- **Urdu / Nastaliq Option**: Mehr Nastaliq (`Nastaleeq_COLOR`).
- **UI Interface**: Plus Jakarta Sans / Inter (`font-sans`), monospace font for astronomical coordinates and counters (`font-mono`).

### 4.3 Responsive Layouts & Focus Mode
- **Mobile First**:
  - Sticky header with quick actions.
  - Floating iOS bottom dock (`TabBar`) with slide-up application drawer (`MoreAppsSheet`).
  - Mobile Floating Action Button (FAB) for fast Surah and Ayah navigation.
  - Pull-to-refresh mechanism for prayer times and daily content.
- **Desktop Enhanced (`>900px`)**:
  - Split view featuring a 320px sticky left panel (quick Surah jump index, reading stats, and saved bookmarks).
  - Main reading canvas occupying the remaining viewport.
- **Focus Reading Mode (`body.focus-reading`)**:
  - Automatically hides the bottom tab bar and application header.
  - Full-screen distraction-free Quranic recitation canvas.

---

## 5. Client State Persistence & Storage Architecture

All state is preserved offline-first on the client side, with seamless background synchronization to Firebase Firestore when the user signs in:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATION STATE                        │
├────────────────────────────────────────────────────────────────────────┤
│ • AuthContext (Current user, login status, sync progress)             │
│ • Local React State (Active tab, audio playback state, theme)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                ▼                                       ▼
┌───────────────────────────────┐       ┌────────────────────────────────┐
│   BROWSER LOCALSTORAGE KEYS   │       │   DIRECT FIRESTORE BAAS SYNC   │
├───────────────────────────────┤       ├────────────────────────────────┤
│ • appSettings                 │       │ /users/{userId}                │
│ • prayerLocation              │       │  ├── /bookmarks                │
│ • duaFavorites                │◄─────►│  ├── /favorites                │
│ • duaRemindersEnabled         │       │  ├── /solaty_logs              │
│ • tasbih_sessions             │       │  ├── /tasbih_sessions          │
│ • qaida_mastered              │       │  ├── /vocabulary               │
│ • abjad_history               │       │  └── /habits                   │
│ • bookmarks & favorites       │       │                                │
│ • calendar_locale             │       │ Direct client SDK read/write   │
│ • calendar_sync_queue         │       │ with handleFirestoreError      │
└───────────────────────────────┘       └────────────────────────────────┘
```

---

## 6. Phased Frontend Implementation Breakdown

### Phase 1: Client Shell, Global Themes & Routing
- [ ] Implement client-side URL routing supporting all 26 paths in `SuperAppShell`.
- [ ] Configure global CSS variables for the 4 Quran themes (`Light`, `Dark`, `Sepia`, `Night`).
- [ ] Implement `body.focus-reading` mode toggle for distraction-free reading.
- [ ] Build desktop 320px sticky sidebar and mobile Floating Action Button (FAB).
- [ ] Add DiceBear Micah avatar client generator to the profile view.
- [ ] Verify pull-to-refresh and one-tap quote copy on the home dashboard.

### Phase 2: Complete Quran & Multi-Quran Suite (Frontend Only)
- [ ] Implement dual Quran reading modes:
  - **Verse-by-Verse Mode**: Card-based with audio trigger, translation sheets, and bookmarking.
  - **Mushaf Flow Mode**: Continuous Arabic text with circular ayah separators and active ayah highlight.
- [ ] Build `/multi-quran` side-by-side comparative reader for parallel translation and Qira'at reading.
- [ ] Implement `/quran/random` Ayah Discovery card with full translation and Tafsir reflection.
- [ ] Build `/quran/bookmarks` and `/quran/favorites` views with instant jump-to-ayah and local/Firestore sync.

### Phase 3: Solaty Prayer Tracker & Analytics
- [ ] Build `/solaty` prayer checklist (Fard, Sunnah Rawatib, Witr, Tahajjud, and Qada makeup counter).
- [ ] Build `/solaty/analytics` with interactive SVG/Recharts tracking punctuality, streaks, and monthly completion heatmaps.
- [ ] Integrate client reverse geocoding via `api.bigdatacloud.net` with manual search fallback.
- [ ] Build multi-reciter Adhan audio player with Makkah, Madinah, and Alafasy streams.

### Phase 4: Noorani Qaida, Abjad & Ahlul-Bait Heritage
- [ ] Build `/qaida` interactive Arabic alphabet learning app:
  - 28 letters in isolated, initial, medial, and final forms.
  - Audio pronunciation streaming from GitHub raw audio repository.
  - Interactive "Mastered" progress tracker syncing to `qaida_mastered`.
- [ ] Build `/abjad` classical Arabic gematria calculator:
  - Real-time text analysis breaking down sentences into letter numerical values.
  - Toggle between Kabir (Major) and Saghir (Minor) systems.
  - Calculation history with copy and save capabilities (`abjad_history`).
- [ ] Build `/ahlul-bait` interactive family tree & biographical directory:
  - Interactive family tree layout (`family-tree-page`, `family-tree-node`).
  - Biography hero cards with historical timeline, lineage, virtues, and children.

### Phase 5: 40 Hadith Nawawi, Duas Audio & Hijri Calendar
- [ ] Build `/hadith` 40 Hadith Nawawi complete reader:
  - Full Arabic text, English & Amharic translations, commentary, and lessons.
  - Client-side search across Arabic and English text with bookmarking.
- [ ] Elevate `/duas` mini-app:
  - Audio recitation playback for supplications.
  - Reminder scheduling toggles (`duaRemindersEnabled`).
  - Social sharing directly to WhatsApp, Telegram, and native Web Share.
- [ ] Build `/calendar` dual Hijri-Gregorian interactive monthly view:
  - Islamic occasion countdown badges (Ramadan, Eid al-Fitr, Eid al-Adha, Ashura).
  - Offline sync queue for custom religious appointments (`calendar_sync_queue`).

### Phase 6: Community Khatmah, Daily Companion & Final Verification
- [ ] Build `/community` collective Khatm al-Quran tracker allowing users to reserve and complete Juz portions.
- [ ] Build `/daily-companion` guided spiritual routine with morning, afternoon, and evening milestones.
- [ ] Validate zero backend requirements: verify all features operate offline with client-side calculations and direct Firebase BaaS integrations.
- [ ] Ensure full verification with `tsc --noEmit` and `vite build`.
