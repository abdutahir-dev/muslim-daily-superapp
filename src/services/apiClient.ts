import { auth } from "../lib/firebase";
import {
  QamusEntry,
  QamusGrammarRule,
  QamusLookupRequest,
  QamusLookupResponse,
  QamusRootInfo,
} from "../types";

/**
 * Muslim Daily REST API Client & Firebase BaaS Service
 * Built with strict TypeScript typings, automatic Firebase Auth token attachment,
 * resilient exponential retry logic, and offline-first caching.
 */

// ==========================================
// 1. TYPED MODELS (OpenAPI 3.0 Conforming)
// ==========================================

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  error?: string;
  details?: string;
  count?: number;
  [key: string]: any;
}

// --- Quran Module Models ---
export interface Surah {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  translationEnglish: string;
  translationAmharic?: string;
  revelationType: "Meccan" | "Medinan";
  totalVerses: number;
  juzNumber: number;
  audioReciterAlafasy?: string;
}

export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translationEnglish: string;
  translationAmharic?: string;
  transliteration?: string;
  audioUrl?: string;
  juzNumber?: number;
}

export interface SurahDetailResponse {
  surah: Surah;
  verses: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
  subfolder: string;
  bitrate: string;
  format: string;
  cdnBase: string;
}

// --- Prayer Times & Calendar Models ---
export interface PrayerTimesToday {
  location: string;
  calculationMethod: string;
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  nextPrayer: {
    name: string;
    time: string;
    timeRemaining: string;
  };
  qibla: {
    azimuth: number;
    compassBearing: string;
  };
}

export interface PrayerDayCalendar {
  date: string;
  hijriDate: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
  lastThirdOfNight: string;
  qiblaDirection: number;
}

export interface HijriDateToday {
  hijri: {
    day: number;
    monthName: string;
    year: number;
    formatted: string;
    formattedArabic: string;
    weekday: string;
  };
  gregorian: {
    date: string;
    formatted: string;
  };
}

export interface IslamicEvent {
  title: string;
  titleArabic: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  description: string;
  recommendedActions: string[];
}

export interface QiblaResponse {
  coordinates: { lat: number; lng: number };
  kaabaCoordinates: { lat: number; lng: number };
  qibla: {
    azimuth: number;
    compassBearing: string;
  };
}

// --- Hadith Library Models ---
export interface HadithBook {
  slug: string;
  name: string;
  nameArabic: string;
  author: string;
  totalHadith: number;
  totalChapters: number;
  description: string;
}

export interface HadithItem {
  id: string;
  hadithNumber: number;
  arabic: string;
  translationEnglish: string;
  translationAmharic?: string;
  narrator: string;
  grade?: string;
  bookSlug: string;
  chapterNumber: number;
}

export interface HadithChapterResponse {
  bookSlug: string;
  chapterNumber: number;
  title: string;
  titleArabic: string;
  hadiths: HadithItem[];
}

// --- Duas & Adhkar Models ---
export interface DuaCategory {
  id: string;
  name: string;
  nameArabic: string;
  icon: string;
  count: number;
  description: string;
}

export interface DuaItem {
  id: string;
  categoryId: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  translationAmharic?: string;
  repeatCount: number;
  virtue?: string;
  reference: string;
  audioUrl?: string;
}

// --- Firebase BaaS Sync Models ---
export interface PrayerLogRecord {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  jamaahCount?: number;
  sunnahCompleted?: number;
  updatedAt?: string;
}

export interface TasbihSyncState {
  target: number;
  currentCount: number;
  lifetimeCount: number;
  selectedPhrase: string;
  history: Array<{ timestamp: number; phrase: string; count: number }>;
  updatedAt?: string;
}

export interface BookmarkRecord {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  juzNumber: number;
  pageNumber: number;
  note?: string;
  timestamp: number;
}

export interface KhatmahPlan {
  id: string;
  title: string;
  targetDays: number;
  pagesPerDay: number;
  currentPage: number;
  totalPages: number;
  startDate: string;
  targetCompletionDate: string;
  completedDays: number;
  status: "active" | "completed" | "paused";
  updatedAt?: string;
}

// --- DeenBot Models ---
export interface DeenBotChatMessage {
  role: "user" | "model" | "assistant" | "system";
  content: string;
}

export interface DeenBotChatRequest {
  message: string;
  history?: DeenBotChatMessage[];
  language?: string;
}

export interface DeenBotChatResponse {
  reply: string;
  citations?: Array<{ title: string; reference: string; source: "Quran" | "Hadith" | "Scholar" }>;
  suggestedQuestions?: string[];
  error?: string;
}

// ==========================================
// 2. OFFLINE CACHE MANAGER
// ==========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

class OfflineCacheManager {
  private prefix = "muslim_daily_cache_";

  public get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      const parsed: CacheEntry<T> = JSON.parse(item);
      if (Date.now() - parsed.timestamp > parsed.ttlMs) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }

  public set<T>(key: string, data: T, ttlMs = 1000 * 60 * 60 * 24): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttlMs,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (e) {
      console.warn("Offline cache storage quota exceeded or unavailable:", e);
    }
  }
}

const cacheManager = new OfflineCacheManager();

// ==========================================
// 3. CORE HTTP CLIENT & INTERCEPTOR
// ==========================================

const getBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl.replace(/\/$/, "");
  }
  // Default to origin `/api`
  return "/api";
};

interface RequestOptions extends RequestInit {
  skipCache?: boolean;
  ttlMs?: number;
  retries?: number;
}

async function fetchWithRetry<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipCache = false, ttlMs = 1000 * 60 * 60 * 12, retries = 2, ...fetchOptions } = options;
  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const method = fetchOptions.method || "GET";
  const cacheKey = `${method}_${endpoint}`;

  // Check offline cache for GET requests
  if (method === "GET" && !skipCache) {
    const cached = cacheManager.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Inject Firebase Auth ID token if signed in
  const headers = new Headers(fetchOptions.headers || {});
  headers.set("Accept", "application/json");

  try {
    if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken(false);
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
    }
  } catch (err) {
    console.warn("Could not attach Firebase Auth token:", err);
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
      }

      const json = await response.json();
      const extractedData = (json.data !== undefined ? json.data : json) as T;

      // Cache GET results
      if (method === "GET") {
        cacheManager.set(cacheKey, extractedData, ttlMs);
      }

      return extractedData;
    } catch (error) {
      attempt++;
      if (attempt > retries) {
        // If network failed completely and this was a GET, attempt fallback cache even if expired
        if (method === "GET") {
          try {
            const raw = localStorage.getItem(`muslim_daily_cache_${cacheKey}`);
            if (raw) {
              const parsed = JSON.parse(raw);
              console.info("Using stale offline cached data for:", endpoint);
              return parsed.data as T;
            }
          } catch {}
        }
        throw error;
      }
      // Exponential backoff wait
      await new Promise((res) => setTimeout(res, 400 * Math.pow(2, attempt)));
    }
  }

  throw new Error(`Failed request to ${endpoint} after ${retries} attempts.`);
}

// ==========================================
// 4. API CLIENT DOMAIN SERVICES
// ==========================================

export const apiClient = {
  /**
   * 1. 📖 Quran & Recitation Module
   */
  quran: {
    async getSurahs(): Promise<Surah[]> {
      return fetchWithRetry<Surah[]>("/quran/surahs", { ttlMs: 1000 * 60 * 60 * 24 * 7 });
    },

    async getSurah(number: number): Promise<SurahDetailResponse> {
      return fetchWithRetry<SurahDetailResponse>(`/quran/surahs/${number}`, { ttlMs: 1000 * 60 * 60 * 24 * 3 });
    },

    async getAyah(surah: number, ayah: number): Promise<Ayah> {
      return fetchWithRetry<Ayah>(`/quran/ayah/${surah}/${ayah}`, { ttlMs: 1000 * 60 * 60 * 24 * 7 });
    },

    async search(query: string, lang: "ar" | "en" = "en"): Promise<Ayah[]> {
      return fetchWithRetry<Ayah[]>(`/quran/search?q=${encodeURIComponent(query)}&lang=${lang}`, { skipCache: false });
    },

    async getReciters(): Promise<Reciter[]> {
      return fetchWithRetry<Reciter[]>("/quran/reciters", { ttlMs: 1000 * 60 * 60 * 24 * 14 });
    },

    async getAudio(reciterId: string, surah: number, ayah: number): Promise<{ audioUrl: string; reciter: Reciter }> {
      return fetchWithRetry<{ audioUrl: string; reciter: Reciter }>(`/quran/audio/${reciterId}/${surah}/${ayah}`);
    },
  },

  /**
   * 2. 🕌 Prayer Times & Hijri Calendar
   */
  prayers: {
    async getToday(lat = 9.03, lng = 38.74, method = "MWL", school = "standard"): Promise<PrayerTimesToday> {
      return fetchWithRetry<PrayerTimesToday>(
        `/prayers/today?lat=${lat}&lng=${lng}&method=${method}&school=${school}`,
        { ttlMs: 1000 * 60 * 30 }
      );
    },

    async getCalendar(month: number, year: number, lat = 9.03, lng = 38.74): Promise<{ days: PrayerDayCalendar[] }> {
      return fetchWithRetry<{ days: PrayerDayCalendar[] }>(
        `/prayers/calendar?month=${month}&year=${year}&lat=${lat}&lng=${lng}`,
        { ttlMs: 1000 * 60 * 60 * 24 }
      );
    },

    async getQibla(lat = 9.03, lng = 38.74): Promise<QiblaResponse> {
      return fetchWithRetry<QiblaResponse>(`/prayers/qibla?lat=${lat}&lng=${lng}`, { ttlMs: 1000 * 60 * 60 * 24 * 30 });
    },
  },

  calendar: {
    async getHijriToday(): Promise<HijriDateToday> {
      return fetchWithRetry<HijriDateToday>("/calendar/hijri-today", { ttlMs: 1000 * 60 * 60 * 4 });
    },

    async getEvents(hijriYear = 1448): Promise<{ events: IslamicEvent[] }> {
      return fetchWithRetry<{ events: IslamicEvent[] }>(`/calendar/events?year=${hijriYear}`, { ttlMs: 1000 * 60 * 60 * 24 * 7 });
    },
  },

  /**
   * 3. 📜 Hadith Library & Collections
   */
  hadith: {
    async getBooks(): Promise<HadithBook[]> {
      return fetchWithRetry<HadithBook[]>("/hadith/books", { ttlMs: 1000 * 60 * 60 * 24 * 14 });
    },

    async getChapter(bookSlug: string, chapterNumber = 1): Promise<HadithChapterResponse> {
      return fetchWithRetry<HadithChapterResponse>(`/hadith/${bookSlug}/${chapterNumber}`, { ttlMs: 1000 * 60 * 60 * 24 * 7 });
    },

    async getDaily(): Promise<HadithItem> {
      return fetchWithRetry<HadithItem>("/hadith/daily", { ttlMs: 1000 * 60 * 60 * 8 });
    },

    async search(query: string, bookSlug?: string): Promise<HadithItem[]> {
      const bookParam = bookSlug ? `&book=${bookSlug}` : "";
      return fetchWithRetry<HadithItem[]>(`/hadith/search?q=${encodeURIComponent(query)}${bookParam}`);
    },
  },

  /**
   * 4. 🤲 Duas & Daily Adhkar (Hisn al-Muslim)
   */
  duas: {
    async getCategories(): Promise<DuaCategory[]> {
      return fetchWithRetry<DuaCategory[]>("/duas/categories", { ttlMs: 1000 * 60 * 60 * 24 * 14 });
    },

    async getByCategory(categoryId: string): Promise<DuaItem[]> {
      return fetchWithRetry<DuaItem[]>(`/duas/category/${categoryId}`, { ttlMs: 1000 * 60 * 60 * 24 * 7 });
    },

    async getDaily(): Promise<DuaItem> {
      return fetchWithRetry<DuaItem>("/duas/daily", { ttlMs: 1000 * 60 * 60 * 8 });
    },

    async getAudio(duaId: string): Promise<{ id: string; audioUrl: string }> {
      return fetchWithRetry<{ id: string; audioUrl: string }>(`/duas/${duaId}/audio`);
    },
  },

  /**
   * 5. 📿 Tasbih & Daily Tracker (Firestore BaaS Sync)
   */
  firebase: {
    async getPrayerLogs(): Promise<Record<string, PrayerLogRecord>> {
      return fetchWithRetry<Record<string, PrayerLogRecord>>("/firebase/prayer-logs", { skipCache: true });
    },

    async savePrayerLogs(record: PrayerLogRecord): Promise<Record<string, PrayerLogRecord>> {
      return fetchWithRetry<Record<string, PrayerLogRecord>>("/firebase/prayer-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    },

    async getTasbih(): Promise<TasbihSyncState> {
      return fetchWithRetry<TasbihSyncState>("/firebase/tasbih", { skipCache: true });
    },

    async saveTasbih(state: Partial<TasbihSyncState>): Promise<TasbihSyncState> {
      return fetchWithRetry<TasbihSyncState>("firebase/tasbih", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
    },

    async getBookmarks(): Promise<BookmarkRecord[]> {
      return fetchWithRetry<BookmarkRecord[]>("/firebase/bookmarks", { skipCache: true });
    },

    async saveBookmarks(bookmarks: BookmarkRecord[]): Promise<BookmarkRecord[]> {
      return fetchWithRetry<BookmarkRecord[]>("/firebase/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarks }),
      });
    },

    async getKhatmah(): Promise<KhatmahPlan> {
      return fetchWithRetry<KhatmahPlan>("/firebase/khatmah", { skipCache: true });
    },

    async saveKhatmah(plan: Partial<KhatmahPlan>): Promise<KhatmahPlan> {
      return fetchWithRetry<KhatmahPlan>("/firebase/khatmah", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
    },
  },

  /**
   * 6. 🤖 DeenBot (Islamic AI Q&A Assistant)
   */
  deenbot: {
    async chat(request: DeenBotChatRequest): Promise<DeenBotChatResponse> {
      return fetchWithRetry<DeenBotChatResponse>("/deenbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        skipCache: true,
      });
    },
  },

  /**
   * 7. 📖 Qamus (Arabic Classical Dictionary, I'rab Grammar & Lexicon)
   */
  qamus: {
    async lookup(params: QamusLookupRequest): Promise<QamusLookupResponse> {
      return fetchWithRetry<QamusLookupResponse>("/qamus/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        ttlMs: 1000 * 60 * 60 * 24 * 7, // Cache dictionary responses for 7 days
      });
    },

    async getRoots(): Promise<{ roots: QamusRootInfo[] }> {
      return fetchWithRetry<{ roots: QamusRootInfo[] }>("/qamus/roots", {
        ttlMs: 1000 * 60 * 60 * 24 * 14,
      });
    },

    async getGrammarRules(): Promise<{ rules: QamusGrammarRule[] }> {
      return fetchWithRetry<{ rules: QamusGrammarRule[] }>("/qamus/grammar-rules", {
        ttlMs: 1000 * 60 * 60 * 24 * 14,
      });
    },
  },
};

export default apiClient;
