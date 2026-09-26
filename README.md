# Muslim Daily SuperApp 🕌

[![CI/CD Pipeline](https://github.com/abdutahir-dev/muslim-daily-superapp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/abdutahir-dev/muslim-daily-superapp/actions/workflows/ci-cd.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-success.svg)](https://abdutahir-dev.github.io/muslim-daily-superapp/)
[![Firebase Auth & Firestore](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange.svg)](https://firebase.google.com/)
[![Cloud Functions v2](https://img.shields.io/badge/Cloud%20Functions-v2%20Serverless-blueviolet.svg)](https://firebase.google.com/docs/functions)
[![PWA Ready](https://img.shields.io/badge/PWA-Workbox%20Offline-purple.svg)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.8-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Unit%20Tests-Vitest%20Passing-brightgreen.svg)](https://vitest.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8.svg)](https://tailwindcss.com/)

An enterprise-grade, mobile-first **SuperApp** Progressive Web Application (PWA) uniting 13 focused **Mini-Applications** under a single cohesive, Apple iOS Human Interface Guidelines (HIG)-inspired container shell. Built with **React 19**, **TypeScript 5.8** (`strict: true`), **Tailwind CSS v4**, **Vite + Workbox Service Worker**, **Cloud Functions v2**, and direct **Firebase Cloud Firestore & Authentication** synchronization.

---

### 🌐 Live Environments & Documentation
- **Production Live Demo (GitHub Pages)**: [https://abdutahir-dev.github.io/muslim-daily-superapp/](https://abdutahir-dev.github.io/muslim-daily-superapp/)
- **Cloud Run Preview Instance**: [https://ais-pre-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app](https://ais-pre-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app)
- **Development Environment**: [https://ais-dev-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app](https://ais-dev-2zciucuq66kbvohlge4dk3-201444007982.europe-west2.run.app)
- **[Interactive API Documentation (Swagger UI)](/docs)**: Live interactive OpenAPI 3.0 explorer for backend endpoints (`/docs` & `/api/docs`).
- **[System Architecture Specification (ARCHITECTURE.md)](./ARCHITECTURE.md)**: Deep dive into the SuperApp container model, audio engine, offline caching, and Firestore security rules.
- **[Parity Master Implementation Plan (PLAN.md)](./PLAN.md)**: Frontend-only architectural blueprint and route-by-route execution plan for UI/UX parity.
- **[Product & Engineering Roadmap (ROADMAP.md)](./ROADMAP.md)**: Strategic roadmap and milestone delivery tracks.

---

## 📑 Table of Contents
1. [SuperApp & Mini-App Architecture](#-superapp--mini-app-architecture)
2. [Getting Started Guide](#-getting-started-guide)
3. [How to Make Mini-Apps](#-how-to-make-mini-apps-step-by-step)
4. [Development Guide](#-development-guide)
5. [Deployment Guide](#-deployment-guide)
6. [Mini-Applications Suite](#-mini-applications-suite)
7. [Backend REST API & Swagger](#-backend-rest-api--swagger)
8. [Security & Firestore Rules](#-security--firestore-rules)

---

## 🏛️ SuperApp & Mini-App Architecture

The Muslim Daily codebase is engineered around the **SuperApp Micro-Modular Architecture**:
- **SuperApp Shell**: A persistent, distraction-free container providing global navigation (iOS Bottom Dock `TabBar`, Top Context Bar `Navbar`), application drawer (`MoreAppsSheet`), user authentication context (`AuthContext`), global audio streams, and preference persistence.
- **Mini-Applications**: Completely decoupled, domain-specific modules housed in `src/miniapps/`. Each mini-app encapsulates its own views, subcomponents, and local state while consuming standardized global contexts.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SUPERAPP CLIENT (SPA)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  SuperApp Shell Container  (/src/superapp/SuperAppShell.tsx)               │
│  ├─ Top Navigation Bar     (/src/components/Navbar.tsx)                     │
│  ├─ Floating iOS Dock Bar  (/src/components/TabBar.tsx)                     │
│  ├─ MiniApp App Launcher   (/src/components/MoreAppsSheet.tsx)              │
│  └─ MiniApp Registry       (/src/superapp/miniapps.manifest.ts)             │
├─────────────────────────────────────────────────────────────────────────────┤
│  13 Modular Mini-Applications (/src/miniapps/)                              │
│  ├─ 🕒 prayer-times       ├─ 📖 quran (10 Qira'at)    ├─ 🧭 qibla          │
│  ├─ 📿 tasbih             ├─ 🤲 adhkar (Hisn)         ├─ 📊 habit-tracker  │
│  ├─ 💰 zakat              ├─ 📍 places (Halal/Mosque) ├─ 🤖 ai-assistant   │
│  ├─ 💬 quotes             ├─ 📖 qamus (Arabic Lexicon)├─ 🌿 sanctuary      │
│  └─ 📚 library (Hadith/Qaida/Abjad/Ahlul-Bait)                              │
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
│  ├─ Modular Routes           (/server/routes/health, ai, places, qamus)     │
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

## 🏁 Getting Started Guide

Follow this guide to get Muslim Daily running locally on your workstation in under 3 minutes.

### 1. Prerequisites
- **Node.js**: `v20.x` or higher (Node 22 LTS recommended)
- **Package Manager**: `npm` (v10+), `pnpm`, or `bun`
- **Modern Web Browser**: Chrome, Edge, Safari, or Firefox with Web Audio and Geolocation support

### 2. Quick Start Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/muslim-daily-superapp.git
cd muslim-daily-superapp

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the development server
npm run dev
```

The application starts immediately on **`http://localhost:3000`** (or your sandboxed container URL) with integrated Hot Module Replacement (HMR) and live TypeScript compilation.

### 3. Environment Variables Configuration

Copy `.env.example` to `.env`. Sensitive server-side keys are **never** exposed to the browser:

```env
# ==============================================================================
# SERVER CONFIGURATION
# ==============================================================================
NODE_ENV=development
PORT=3000

# ==============================================================================
# GOOGLE GEMINI AI CONFIGURATION (Server-Side Only)
# ==============================================================================
# Required for Ask Ilm AI scholarly guidance & Qamus morphology assistant
GEMINI_API_KEY=your_gemini_api_key_here

# ==============================================================================
# CLIENT-SIDE FIREBASE BAAS CONFIGURATION (Optional Override)
# ==============================================================================
# If not provided, the app uses pre-configured sandbox credentials
# VITE_FIREBASE_API_KEY=
# VITE_FIREBASE_AUTH_DOMAIN=
# VITE_FIREBASE_PROJECT_ID=
# VITE_FIREBASE_STORAGE_BUCKET=
# VITE_FIREBASE_MESSAGING_SENDER_ID=
# VITE_FIREBASE_APP_ID=
```

### 4. PWA Installation (Mobile & Desktop)
- **iOS Safari**: Tap the **Share** button (`⎙`) -> Tap **"Add to Home Screen"**.
- **Android Chrome**: Tap the three-dot menu (`⋮`) -> Tap **"Install app"** or **"Add to Home screen"**.
- **Desktop Chrome / Edge**: Click the install icon in the URL bar (`⊕ Install Muslim Daily`).

---

## 🧩 How to Make Mini-Apps (Step-by-Step)

Creating a new Mini-App for the Muslim Daily SuperApp is streamlined, modular, and type-safe. Follow these 6 steps to build and register your mini-app.

```
Step 1: Create Directory ──► Step 2: Register ID in types.ts
            │
            ▼
Step 3: Add to Manifest  ──► Step 4: Mount in SuperAppShell
            │
            ▼
Step 5: Use Shared Hooks ──► Step 6: Apply iOS HIG Design Rules
```

### Step 1: Create the Mini-App Directory & Component
Create a new folder in `src/miniapps/` named after your application (e.g. `src/miniapps/sadaqah/`):

```tsx
// src/miniapps/sadaqah/index.tsx
import React, { useState } from "react";
import { Heart, Plus, History, Coins } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export interface SadaqahAppProps {
  onOpenAuth?: () => void;
}

export const SadaqahApp: React.FC<SadaqahAppProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [totalGiven, setTotalGiven] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");

  const handleLogSadaqah = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      setTotalGiven((prev) => prev + val);
      setAmount("");
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#00A86B] to-[#007A4D] rounded-2xl p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Charity & Giving
            </span>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">Sadaqah Tracker</h1>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-baseline justify-between">
          <span className="text-sm text-emerald-100">Total Recorded</span>
          <span className="text-2xl font-extrabold tracking-tight">${totalGiven.toFixed(2)}</span>
        </div>
      </div>

      {/* Quick Log Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Coins className="w-4 h-4 text-[#00A86B]" />
          Record Voluntary Charity
        </h2>
        <form onSubmit={handleLogSadaqah} className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount ($)..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#00A86B] hover:bg-[#008f5a] text-white font-medium text-sm rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Log
          </button>
        </form>
      </div>

      {/* Guest Cloud Sync Prompt */}
      {!user && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-center justify-between">
          <span>Sign in to sync your charity logs securely across devices.</span>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="text-[#00A86B] font-bold hover:underline ml-2"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
};
```

### Step 2: Register the Mini-App ID in `src/types.ts`
Open `src/types.ts` and add your unique mini-app identifier to the `MiniAppId` union type:

```typescript
// src/types.ts
export type MiniAppId =
  | "home"
  | "prayer"
  | "quran"
  | "quotes"
  | "qibla"
  | "tasbih"
  | "adhkar"
  | "habits"
  | "zakat"
  | "places"
  | "ai"
  | "assistant"
  | "qamus"
  | "sadaqah"; // 👈 Add your new Mini-App ID here
```

### Step 3: Register Metadata in `src/superapp/miniapps.manifest.ts`
Add the metadata configuration in `src/superapp/miniapps.manifest.ts`:

```typescript
// src/superapp/miniapps.manifest.ts
import { MiniAppMetadata } from "../types";

export const MINI_APPS_MANIFEST: MiniAppMetadata[] = [
  // ... existing apps ...
  {
    id: "sadaqah",
    title: "Sadaqah Tracker",
    subtitle: "Log voluntary charity, goals & habits",
    category: "worship", // "worship" | "quran" | "lifestyle" | "knowledge" | "utilities"
    iconName: "Heart",   // Must match an icon from lucide-react
    badge: "New",        // Optional badge text (e.g., "New", "10 Qira'at", "Beta")
    isPrimaryTab: false, // true = visible on the bottom dock, false = inside "More Apps" sheet
    order: 13,
  },
];
```

### Step 4: Mount the Mini-App in `src/superapp/SuperAppShell.tsx`
Import your mini-app and add it to the `renderActiveMiniApp()` switch statement:

```tsx
// src/superapp/SuperAppShell.tsx
import { SadaqahApp } from "../miniapps/sadaqah";

// Inside renderActiveMiniApp():
case "sadaqah":
  return <SadaqahApp onOpenAuth={() => setIsAuthOpen(true)} />;
```

### Step 5: Leverage Shared Services & Utilities
Your mini-app can immediately consume global features:
- **Authentication & Cloud Persistence**:
  ```tsx
  import { useAuth } from "../../context/AuthContext";
  const { user, preferences, updatePreferences } = useAuth();
  ```
- **Prayer & Astronomical Calculation**:
  ```tsx
  import { getPrayerTimes, getNextPrayerCountdown } from "../../lib/prayerTimes";
  ```
- **Web Audio & Haptic Clicks**:
  ```tsx
  import { playClickSound, playVibrationHaptic } from "../../lib/soundUtils";
  ```
- **Icons**: Always import directly from `lucide-react` (e.g. `import { Heart } from "lucide-react"`).

### Step 6: Design System Rules for Mini-Apps
1. **Apple HIG & Touch Targets**: All interactive buttons, chips, and pills must have a minimum touch target size of **44px × 44px**.
2. **Color Palette**: Use standard emerald brand primary (`#00A86B` / `#10B981`), cool slate neutrals (`#1F2937`, `#6B7280`), and light background surfaces (`#F4F5F7`, `#FFFFFF`).
3. **Typography**: Ensure Arabic typography uses `font-arabic` (Amiri/Scheherazade), UI uses `font-sans` (Plus Jakarta Sans/Inter), and numerals use `font-mono`.
4. **Spacing**: Top-level containers should use `space-y-4` or `space-y-5` with `pb-12` to prevent clipping behind the bottom dock.

---

## 🛠️ Development Guide

### 1. Technology Stack Matrix

| Layer | Technology | Key Libraries / Frameworks |
|---|---|---|
| **Frontend Framework** | React 19.x | Strict Functional Components, Hooks, Context API |
| **Language & Typings**| TypeScript 5.8 | Strict compiler options (`strict: true`, `noImplicitAny`) |
| **Styling & Design**  | Tailwind CSS v4 | `@tailwindcss/vite`, CSS Variables, Mobile-First iOS HIG |
| **Icons & Media**     | Lucide React | Standardized icon library (`lucide-react`) |
| **Animations**        | Motion | Hardware-accelerated fluid transitions (`motion/react`) |
| **Backend API Layer** | Express 4.x & tsx | Decoupled REST controllers, OpenAPI 3.0, Gemini SDK |
| **Database & Auth**   | Firebase 12.x | Cloud Firestore subcollections, Firebase Authentication |
| **Build & Tooling**   | Vite 6 & esbuild | Dual compilation: Vite SPA frontend + esbuild server bundle |

### 2. Available Scripts

| Command | Purpose | Output / Action |
|---|---|---|
| `npm run dev` | Starts local full-stack development server | Runs `tsx server.ts` at `http://localhost:3000` |
| `npm run lint` | Typechecks the entire TypeScript codebase | Executes `tsc --noEmit` without emitting files |
| `npm run build` | Full production build (Frontend + Backend) | Produces `dist/` (client static assets) and `dist/server.cjs` |
| `npm start` | Boots the compiled production server | Executes `node dist/server.cjs` on port 3000 |
| `npm run clean` | Cleans previous build artifacts | Deletes `dist/` and temporary build files |
| `npm run preview` | Previews the compiled static frontend | Boots Vite's built-in preview server |

### 3. Code Standards & Best Practices
- **Strict TypeScript**: Never use `any`. Define strongly-typed domain interfaces in `src/types.ts` or local `types.ts` within the mini-app folder.
- **Top-Level Imports**: Place all imports at the top of files using named import syntax:
  ```typescript
  // ✅ Correct
  import { useState, useEffect } from "react";
  import { BookOpen, Sparkles } from "lucide-react";

  // ❌ Prohibited
  const { useState } = require("react");
  ```
- **Zero Inline CSS**: Style exclusively using Tailwind CSS utility classes. Avoid `<div style={{ ... }}>`.
- **Unique HTML IDs**: Add distinct `id` attributes to actionable buttons, inputs, and container cards for accessibility and automated testing.
- **Lazy Initialization of SDKs**: For server-side SDKs (such as `@google/genai`), always use lazy singletons to avoid crash-on-startup when keys are being configured:
  ```typescript
  // server/config/gemini.ts
  let aiInstance: GoogleGenAI | null = null;
  export function getGeminiClient(): GoogleGenAI {
    if (!aiInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
      aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
  }
  ```

---

## 🚢 Deployment Guide

Muslim Daily is designed to deploy seamlessly to container runtimes (Cloud Run, Docker, Kubernetes) and static hosting providers (Firebase Hosting, Vercel).

### 1. Production Build Pipeline
The production build compiles both the client SPA and the Express backend into a single deployable unit:

```bash
npm run build
```

This command triggers:
1. **`vite build`**: Compiles React 19, Tailwind CSS v4, and assets into static, tree-shaken bundles in `dist/`.
2. **`esbuild server.ts`**: Bundles backend TypeScript into a single CommonJS executable at `dist/server.cjs`, resolving all relative imports and keeping external node modules external (`--packages=external`).

### 2. Running in Production
```bash
# Starts the compiled bundle
npm start
```
The server binds to `0.0.0.0:3000`, serving API routes at `/api/*`, OpenAPI Swagger UI at `/docs`, and falling back to `dist/index.html` for client-side routing.

### 3. Deploying to Google Cloud Run (Container)

Muslim Daily runs natively in a containerized environment. Build and deploy using the Google Cloud CLI (`gcloud`):

```bash
# 1. Build the container image via Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/muslim-daily-superapp

# 2. Deploy to Cloud Run
gcloud run deploy muslim-daily-superapp \
  --image gcr.io/YOUR_PROJECT_ID/muslim-daily-superapp \
  --platform managed \
  --region europe-west2 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

> **Container Ingress Rule**: The reverse proxy routes external traffic exclusively to port **3000**. Never override the port with custom variables.

### 4. Deploying to Firebase Hosting

To deploy the static frontend to Firebase Hosting:

```bash
# 1. Install Firebase CLI & login
npm install -g firebase-tools
firebase login

# 2. Deploy static hosting assets
firebase deploy --only hosting
```

### 5. Automated CI/CD with GitHub Actions

The repository includes a production-grade GitHub Actions workflow at `.github/workflows/ci-cd.yml` configured with strict multi-stage verification:

1. **Pull Request (PR) Quality Pipeline**:
   - **ESLint & Strict TypeScript**: Runs `npm run lint` (`tsc --noEmit` with `strict: true`).
   - **Automated Unit Testing**: Runs `npm test` (`vitest run`) for Keplerian astronomical solar formulas, Qibla geodetic bearing, and Quranic metadata consistency.
   - **Cloud Functions Compilation**: Compiles serverless v2 TypeScript functions (`cd functions && npm run build`).
   - **Production Bundling**: Builds client application assets with `npm run build`.

2. **Continuous Deployment (CD) Pipeline** (on merge to `main`):
   - **Firebase Hosting**: Deploys static SPA distribution to Firebase live hosting channels.
   - **Firebase Cloud Functions**: Deploys backend v2 serverless triggers and callable APIs (`firebase deploy --only functions`).
   - **GitHub Pages Auto-Deployment**: Publishes bundled distribution with SPA 404 routing fallback to GitHub Pages.
     > **GitHub Pages Configuration Tip**: In your GitHub repository, go to **Settings > Pages > Build and deployment**. Under **Source**, choose **GitHub Actions** (recommended) so GitHub serves the production bundle generated by the pipeline rather than raw uncompiled source files.

#### Required GitHub Secrets & Environment Variables:
Navigate to **Repository Settings > Secrets and variables > Actions** and configure:
- `FIREBASE_SERVICE_ACCOUNT`: Service account JSON string with Firebase Admin and Hosting permissions.
- `FIREBASE_PROJECT_ID`: Your target Firebase project ID (e.g. `ai-studio-d237f989-cbad-4655-8121-5746d143c310`).
- `GEMINI_API_KEY`: *(Optional)* Google Gemini API key for server-side endpoints.

---

## 📱 Mini-Applications Suite

| # | Mini-App | Directory | Core Capabilities |
|---|---|---|---|
| 1 | **Prayer Times** | `src/miniapps/prayer-times` | Keplerian solar formulas, 6 calculation conventions, Asr juristic schools, Adhan audio preview |
| 2 | **Holy Quran** | `src/miniapps/quran` | 10 Canonical Qira'at, Amharic (ሙሐመድ ሳኒ) & English (Sahih) translations, Arabic Tafsir (الميسر), Random Ayahs Generator (7 Ayahs default), Surah Historical Context (أسباب النزول), and high-fidelity audio recitations |
| 3 | **Qibla Compass** | `src/miniapps/qibla` | Great-circle Kaaba calculation, device orientation magnetometer, haptic alignment feedback |
| 4 | **Smart Tasbih** | `src/miniapps/tasbih` | Tactile bead counter, haptic clicks, 33/99/100 presets, persistent lifetime counters |
| 5 | **Daily Adhkar** | `src/miniapps/adhkar` | Authentic Hisn al-Muslim supplications (Morning, Evening, After Prayer, Sleep) with counter |
| 6 | **Habit Tracker** | `src/miniapps/habit-tracker`| 5 Fard prayers, Sunnah, Witr, Tahajjud, Fasting tracker, cloud synchronization |
| 7 | **Zakat Calculator**| `src/miniapps/zakat` | Dual Gold/Silver Nisab thresholds, asset & liability valuation, instant 2.5% calculation |
| 8 | **Places & Mosques**| `src/miniapps/places` | Verified Masajid and Halal-certified dining directory with distance, directions, and facilities |
| 9 | **Ask Ilm AI** | `src/miniapps/ai-assistant` | Gemini 2.5 Flash Islamic scholar assistant with Quran/Hadith citations and contextual advice |
| 10| **Daily Quotes** | `src/miniapps/quotes` | Quranic reflections, Hadith pearls, and sayings of the Salaf with one-tap copy & share |
| 11| **Qamus Lexicon** | `src/miniapps/qamus` | Classical Arabic dictionary, root explorer, morphology (Sarf), and grammatical analysis (I'rab) |
| 12| **Sanctuary** | `src/miniapps/sanctuary` | Distraction-free spiritual focus timer with natural ambient sounds (Rain, Makkah ambience) |
| 13| **Library** | `src/miniapps/library` | Ahlul-Bait family tree, 40 Hadith Nawawi, Noorani Qaida Arabic alphabet, and Abjad calculator |

---

## 🔌 Backend REST API & Swagger

Muslim Daily features an interactive **Swagger UI** available in development and production at:
- **`GET /docs`** (or `GET /api/docs`)

### Core API Endpoints

```
GET  /api/health                 # Backend health & uptime diagnostics
GET  /api/quran/random           # Random Ayahs generator with quad-lingual translations & Tafsir
GET  /api/quran/surahs           # 114 Surahs metadata list
GET  /api/quran/surahs/:num/historical # Surah place of revelation, Asbab al-Nuzul & virtues
GET  /api/quran/surahs/:number   # Surah verses and translations
POST /api/ai/ask                 # Ask Ilm Gemini 2.5 Flash query endpoint
GET  /api/places                 # Halal food & Masajid geo-search directory
GET  /api/qamus/search           # Arabic dictionary & root morphology lookup
POST /api/qamus/irab             # Sentence grammatical parsing (I'rab)
GET  /api/dashboard/daily        # Consolidated prayer, ayah, hadith & quote bundle
```

---

## 🔒 Security & Firestore Rules

All user data (profiles, settings, bookmarks, habit history, and dhikr logs) is secured by principle-of-least-privilege rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated users can only read/write their own document hierarchy
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{allSubcollections=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    // Public read-only directories
    match /places/{placeId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🤝 Contributing & Community

We welcome contributions from the community! To contribute a new Mini-App or feature:
1. Fork the repository & create a feature branch (`git checkout -b feature/my-new-miniapp`).
2. Follow the [How to Make Mini-Apps](#-how-to-make-mini-apps-step-by-step) guide.
3. Run `npm run lint` and `npm run build` to verify clean compilation.
4. Submit a Pull Request with a clear description of changes.

---

**Muslim Daily SuperApp** — *Crafted with devotion for the global Ummah.*
