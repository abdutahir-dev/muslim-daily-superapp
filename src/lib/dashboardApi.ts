export interface NextPrayerInfo {
  name: string;
  time: string;
  timeRemaining: string;
  allPrayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  location: string;
  calculationMethod: string;
}

export interface RandomAyahItem {
  id: string;
  badge: string;
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  arabic: string;
  translation: string;
  translationAmharic: string;
  buttonLabel: string;
}

export interface RandomHadithItem {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  translationAmharic?: string;
  source: string;
  book: string;
  category: string;
}

export interface RandomQuoteItem {
  id: string;
  category: string;
  arabic: string;
  translation: string;
  translationAmharic?: string;
  source: string;
  author?: string;
}

export interface DailyDashboardResponse {
  timestamp: string;
  nextPrayer: NextPrayerInfo;
  randomAyah: RandomAyahItem;
  randomHadith: RandomHadithItem;
  randomQuote: RandomQuoteItem;
  cachedAt?: string;
  isOfflineData?: boolean;
}

// LocalStorage Cache Keys
const CACHE_KEYS = {
  DAILY_DASHBOARD: "ilm_cache_daily_dashboard",
  NEXT_PRAYER: "ilm_cache_next_prayer",
  AYAH: "ilm_cache_random_ayah",
  HADITH: "ilm_cache_random_hadith",
  QUOTE: "ilm_cache_random_quote",
};

// Safe LocalStorage getters/setters
export function getStorageCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed to read cache for key: ${key}`, err);
    return null;
  }
}

export function setStorageCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to write cache for key: ${key}`, err);
  }
}

// Explicit Offline Cache Accessors for Instant Synchronous Initial Render
export function getCachedDailyDashboard(): DailyDashboardResponse | null {
  return getStorageCache<DailyDashboardResponse>(CACHE_KEYS.DAILY_DASHBOARD);
}

export function getCachedNextPrayer(): NextPrayerInfo | null {
  return getStorageCache<NextPrayerInfo>(CACHE_KEYS.NEXT_PRAYER);
}

export function getCachedAyah(): RandomAyahItem | null {
  return getStorageCache<RandomAyahItem>(CACHE_KEYS.AYAH);
}

export function getCachedHadith(): RandomHadithItem | null {
  return getStorageCache<RandomHadithItem>(CACHE_KEYS.HADITH);
}

export function getCachedQuote(): RandomQuoteItem | null {
  return getStorageCache<RandomQuoteItem>(CACHE_KEYS.QUOTE);
}

/**
 * Network-First strategy with automatic offline cache fallback for Daily Dashboard
 */
export async function fetchDailyDashboard(params?: {
  lat?: number;
  lng?: number;
  method?: string;
  school?: string;
}): Promise<DailyDashboardResponse> {
  const query = new URLSearchParams();
  if (params?.lat !== undefined) query.set("lat", String(params.lat));
  if (params?.lng !== undefined) query.set("lng", String(params.lng));
  if (params?.method) query.set("method", params.method);
  if (params?.school) query.set("school", params.school);

  try {
    const res = await fetch(`/api/dashboard/daily?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    const data: DailyDashboardResponse = await res.json();
    
    // Store in offline cache
    const cachedPayload: DailyDashboardResponse = {
      ...data,
      cachedAt: new Date().toISOString(),
      isOfflineData: false,
    };
    setStorageCache(CACHE_KEYS.DAILY_DASHBOARD, cachedPayload);
    setStorageCache(CACHE_KEYS.NEXT_PRAYER, data.nextPrayer);
    setStorageCache(CACHE_KEYS.AYAH, data.randomAyah);
    setStorageCache(CACHE_KEYS.HADITH, data.randomHadith);
    setStorageCache(CACHE_KEYS.QUOTE, data.randomQuote);

    return cachedPayload;
  } catch (err) {
    console.warn("Network request failed for fetchDailyDashboard, checking offline cache...", err);
    const cached = getCachedDailyDashboard();
    if (cached) {
      return {
        ...cached,
        isOfflineData: true,
      };
    }
    throw err;
  }
}

/**
 * Network-First strategy with cache fallback for Next Prayer
 */
export async function fetchNextPrayer(params?: {
  lat?: number;
  lng?: number;
  method?: string;
  school?: string;
}): Promise<NextPrayerInfo> {
  const query = new URLSearchParams();
  if (params?.lat !== undefined) query.set("lat", String(params.lat));
  if (params?.lng !== undefined) query.set("lng", String(params.lng));
  if (params?.method) query.set("method", params.method);
  if (params?.school) query.set("school", params.school);

  try {
    const res = await fetch(`/api/dashboard/next-prayer?${query.toString()}`);
    if (!res.ok) throw new Error(`Server status ${res.status}`);
    const data: NextPrayerInfo = await res.json();
    setStorageCache(CACHE_KEYS.NEXT_PRAYER, data);
    return data;
  } catch (err) {
    console.warn("Failed to fetch next prayer online, trying cache...", err);
    const cached = getCachedNextPrayer();
    if (cached) return cached;
    throw err;
  }
}

/**
 * Network-First strategy with cache fallback for Random Ayah
 */
export async function fetchRandomAyah(): Promise<RandomAyahItem> {
  try {
    const res = await fetch("/api/dashboard/random-ayah");
    if (!res.ok) throw new Error(`Server status ${res.status}`);
    const data: RandomAyahItem = await res.json();
    setStorageCache(CACHE_KEYS.AYAH, data);
    return data;
  } catch (err) {
    console.warn("Failed to fetch random Ayah online, trying cache...", err);
    const cached = getCachedAyah();
    if (cached) return cached;
    throw err;
  }
}

/**
 * Network-First strategy with cache fallback for Random Hadith
 */
export async function fetchRandomHadith(): Promise<RandomHadithItem> {
  try {
    const res = await fetch("/api/dashboard/random-hadith");
    if (!res.ok) throw new Error(`Server status ${res.status}`);
    const data: RandomHadithItem = await res.json();
    setStorageCache(CACHE_KEYS.HADITH, data);
    return data;
  } catch (err) {
    console.warn("Failed to fetch random Hadith online, trying cache...", err);
    const cached = getCachedHadith();
    if (cached) return cached;
    throw err;
  }
}

/**
 * Network-First strategy with cache fallback for Random Quote
 */
export async function fetchRandomQuote(): Promise<RandomQuoteItem> {
  try {
    const res = await fetch("/api/dashboard/random-quote");
    if (!res.ok) throw new Error(`Server status ${res.status}`);
    const data: RandomQuoteItem = await res.json();
    setStorageCache(CACHE_KEYS.QUOTE, data);
    return data;
  } catch (err) {
    console.warn("Failed to fetch random quote online, trying cache...", err);
    const cached = getCachedQuote();
    if (cached) return cached;
    throw err;
  }
}

