/**
 * Backend Server Types & Interfaces
 */

export interface PlaceItem {
  id: string;
  name: string;
  category: "mosque" | "restaurant" | "grocery";
  address: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  facilities?: string[];
  cuisine?: string;
  halalCertification?: string;
  priceRange?: string;
  features?: string[];
  phone?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface AskAiRequest {
  question: string;
  language?: string;
  context?: Record<string, unknown>;
}

export interface AskAiResponse {
  answer?: string;
  error?: string;
  details?: string;
}

export interface HealthCheckResponse {
  status: "ok" | "degraded";
  app: string;
  version: string;
  timestamp: string;
  services: {
    geminiConfigured: boolean;
    serverUptimeSeconds: number;
  };
}

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
}

export * from "./qamus.types";

