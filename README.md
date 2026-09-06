# Muslim Daily SuperApp 🕌

[![Build & Lint Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/google-deepmind/antigravity)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange.svg)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue.svg)](https://ai.google.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple.svg)](https://web.dev/progressive-web-apps/)

An all-in-one Islamic daily companion Progressive Web Application (PWA) that seamlessly integrates 10 essential mini-apps into one single interface, backed by Firebase Authentication and shared Cloud Firestore user preferences.

---

## 📱 Integrated Mini-Apps Suite

1. **Prayer Times & Adhan Engine**
   - Astronomical calculations (solar coordinates, equation of time, solar declination).
   - Six calculation methods: MWL, ISNA, Egypt, Umm al-Qura (Makkah), Karachi, and Gulf.
   - Juristic schools for Asr (Standard Shafi'i/Maliki/Hanbali vs. Hanafi).
   - Suhur (Imsak) cutoff, Iftar timing, and Tahajjud (Qiyam al-Layl) night divisions.
   - Audio Adhan playback with real reciters (Makkah, Madinah, Mishary Alafasy).

2. **Holy Quran & Audio Recitation**
   - Full 114 Surahs catalog with Arabic typography (Amiri / Scheherazade New).
   - English translations and transliteration toggles.
   - Verse-by-verse audio recitation playback.
   - 1-tap Ayah bookmarking synced to Firebase Cloud Firestore.

3. **High-Precision Qibla Compass**
   - Spherical trigonometry (Great Circle bearing formula) pointing to the Kaaba in Makkah (21.4225° N, 39.8262° E).
   - Real-time device orientation & magnetometer sensor support with automatic calibration slider.
   - Visual and haptic feedback when aligned within ±3° of the Kaaba.

4. **Smart Digital Tasbih**
   - Tactile count button with Web Audio feedback and haptic vibration emulation.
   - Pre-loaded authentic Hadith Dhikr presets (SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah, etc.).
   - Target progress rings, cycle counters, and persistent lifetime Dhikr tracking synced to user profile.

5. **Daily Adhkar (Hisn al-Muslim)**
   - Morning (Sabah), Evening (Masaa), Post-Prayer, and Sleep supplications.
   - Authentic Arabic, transliteration, English translation, and Sahih Hadith source citations.
   - Interactive repetition countdown buttons and clipboard export.

6. **Muhasabah Spiritual Habit Tracker**
   - 5 Obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) daily checklist.
   - Sunnah prayers check-off (Salat al-Duha, Tahajjud, Salat al-Witr).
   - Fasting tracker (Ramadan, Sunnah Monday/Thursday, White Days, Voluntary).
   - Daily Quran reading page counter and Adhkar completion logging, persisted by date in Firestore.

7. **Zakat Calculator**
   - Real-time evaluation against Gold Nisab (85g) and Silver Nisab (595g) standards.
   - Granular breakdown of cash, bank deposits, precious metals, stocks/shares, and business merchandise.
   - Deductible immediate liabilities and expenses with automatic 2.5% computation.
   - Cloud save and recall functionality.

8. **Halal Food & Mosque Locator**
   - Geo-filtered search for local Masajid, Halal certified dining, and specialty grocers.
   - Facility badges: Jummah prayer, women's prayer area, wudu ablution, parking, and wheelchair accessibility.
   - One-tap Google Maps directions and direct phone calling.

9. **Ask Ilm AI Islamic Assistant**
   - Powered by Google Gemini (`@google/genai`) via a secure Express backend proxy.
   - Answers everyday Islamic practice questions with authentic Quranic & Sunnah context.
   - Clear scholarly disclaimer recommending local Imam consultation for formal fatwas.

10. **Shared User Preferences & Firebase Auth**
    - Single sign-on supporting Email/Password and Anonymous Guest auto-migration.
    - Global preferences (location, calculation method, juristic school, Hijri adjustment, font sizes) shared across all mini-apps.

---

## 🏛️ Architecture & Folder Structure

```
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # Automated CI/CD pipeline (Lint, Typecheck, Build, Deploy)
├── public/
│   ├── manifest.json               # Progressive Web App manifest
│   └── icon.svg                    # Vector app icon
├── src/
│   ├── components/                 # Decoupled mini-apps & UI modules
│   │   ├── AdhkarApp.tsx           # Daily Adhkar reader
│   │   ├── AiAssistantApp.tsx      # Gemini AI assistant interface
│   │   ├── AuthModal.tsx           # Firebase Authentication dialog
│   │   ├── HabitTrackerApp.tsx     # Muhasabah habit tracker
│   │   ├── HomeDashboard.tsx       # Unified home overview
│   │   ├── MoreAppsSheet.tsx       # Bottom sheet mini-apps launcher
│   │   ├── Navbar.tsx              # Top navigation & quick actions
│   │   ├── PlacesApp.tsx           # Halal & Mosque locator
│   │   ├── PrayerTimesApp.tsx      # Prayer timetable & Adhan preview
│   │   ├── QiblaApp.tsx            # Compass & Kaaba bearing engine
│   │   ├── QuranApp.tsx            # Quran reader & audio reciter
│   │   ├── SettingsModal.tsx       # Shared preferences dialog
│   │   ├── TabBar.tsx              # Mobile dock navigation
│   │   ├── TasbihApp.tsx           # Digital Tasbih counter
│   │   └── ZakatApp.tsx            # Zakat calculator
│   ├── context/
│   │   └── AuthContext.tsx         # Single Source of Truth (Auth + Firestore Sync)
│   ├── lib/
│   │   ├── adhkarData.ts           # Authentic supplications & Dhikr presets
│   │   ├── firebase.ts             # Firebase client initialization
│   │   ├── prayerTimes.ts          # Astronomical solar calculations & Hijri calendar
│   │   ├── quranData.ts            # Surah catalog & verse fetcher
│   │   └── soundUtils.ts           # Web Audio synthesizer & Adhan streaming
│   ├── types.ts                    # Strict TypeScript interfaces & models
│   ├── App.tsx                     # Main layout & mini-app router
│   ├── main.tsx                    # React 19 application root
│   └── index.css                   # Tailwind CSS v4 styling
├── firestore.rules                 # Principle-of-least-privilege Firestore rules
├── server.ts                       # Express backend proxy for Gemini AI & SPA serving
├── package.json                    # Dependencies & execution scripts
└── vite.config.ts                  # Vite build tooling configuration
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 20+
- npm or bun

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/muslim-daily-superapp.git
cd muslim-daily-superapp

# Install project dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the following variables are configured:
```env
# Gemini API Key for Ask Ilm AI
GEMINI_API_KEY=your_gemini_api_key_here

# App URL (optional for local dev, defaults to http://localhost:3000)
APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🔒 Security & Firestore Rules
All user documents (preferences, bookmarks, habits, zakat calculations) are strictly isolated using Firebase Auth UID scoping defined in `firestore.rules`:
```
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  match /{allSubcollections=**} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```
Public places and data catalogs remain globally readable while restricting writes.
