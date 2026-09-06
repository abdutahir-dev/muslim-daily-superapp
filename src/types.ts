export type MiniAppId =
  | "home"
  | "prayer"
  | "quran"
  | "qibla"
  | "tasbih"
  | "adhkar"
  | "habits"
  | "zakat"
  | "places"
  | "ai"
  | "assistant";

export type TabId = MiniAppId;

export type CalculationMethod =
  | "MWL" // Muslim World League (18°, 17°)
  | "ISNA" // Islamic Society of North America (15°, 15°)
  | "Egypt" // Egyptian General Authority of Survey (19.5°, 17.5°)
  | "Makkah" // Umm Al-Qura University, Makkah (18.5°, 90 min)
  | "Karachi" // University of Islamic Sciences, Karachi (18°, 18°)
  | "Gulf"; // Gulf 19.5°, 90 min

export type JuristicSchool = "standard" | "hanafi"; // standard = Shafi'i, Maliki, Hanbali

export interface UserPreferences {
  calculationMethod: CalculationMethod;
  juristicSchool: JuristicSchool;
  hijriAdjustmentDays: number;
  adhanEnabled: boolean;
  adhanVoice: "makkah" | "madinah" | "alafasy";
  arabicFontSize: "md" | "lg" | "xl";
  arabicScript: "uthmani" | "indopak";
  showTransliteration: boolean;
  hapticFeedback: boolean;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timeFormat24h: boolean;
  onboardingCompleted: boolean;
  notificationsEnabled: boolean;
  fajrWakeupOffsetMinutes: number;
  dailyGoalQuranPages: number;
  dailyGoalTasbihCount: number;
  theme: "light" | "dark" | "system";
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  calculationMethod: "MWL",
  juristicSchool: "standard",
  hijriAdjustmentDays: 0,
  adhanEnabled: true,
  adhanVoice: "makkah",
  arabicFontSize: "lg",
  arabicScript: "uthmani",
  showTransliteration: true,
  hapticFeedback: true,
  city: "London",
  country: "United Kingdom",
  latitude: 51.5074,
  longitude: -0.1278,
  timeFormat24h: false,
  onboardingCompleted: false,
  notificationsEnabled: true,
  fajrWakeupOffsetMinutes: 20,
  dailyGoalQuranPages: 4,
  dailyGoalTasbihCount: 100,
  theme: "light",
};

export interface PrayerTimeItem {
  id: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha" | "qiyam";
  name: string;
  arabicName: string;
  time: string; // HH:mm format
  date: Date;
  isPassed: boolean;
  isNext: boolean;
  isCurrent: boolean;
}

export interface DailyPrayersSchedule {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qiyam: string;
  items: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  timeRemainingToNext: string;
  progressPercentage: number;
}

export interface HijriDateInfo {
  day: number;
  monthName: string;
  monthNameArabic: string;
  year: number;
  formatted: string;
  formattedArabic: string;
}

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  translationEnglish: string;
  revelationType: "Meccan" | "Medinan";
  totalVerses: number;
  juzNumber: number;
  audioReciterAlafasy: string;
}

export interface AyahItem {
  numberInSurah: number;
  textArabic: string;
  transliteration: string;
  translation: string;
  audioUrl?: string;
  juz: number;
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
  note?: string;
}

export interface DhikrPreset {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  virtue: string;
  targetCount: number;
  audioUrl?: string;
}

export interface TasbihState {
  currentCount: number;
  targetCount: number;
  cyclesCompleted: number;
  selectedDhikrId: string;
  lifetimeCount: number;
}

export interface AdhkarItem {
  id: string;
  category: "morning" | "evening" | "prayer" | "sleeping" | "protection";
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  targetCount: number;
}

export interface HabitTrackerDay {
  date: string; // YYYY-MM-DD
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  sunnah: {
    duha: boolean;
    tahajjud: boolean;
    witr: boolean;
  };
  fasting: "none" | "ramadan" | "sunnah_monday" | "sunnah_thursday" | "white_days" | "voluntary";
  quranPagesRead: number;
  adhkarMorning: boolean;
  adhkarEvening: boolean;
  charitySadaqah: boolean;
}

export interface ZakatState {
  cashInHand: number;
  bankSavings: number;
  goldGrams: number;
  goldPricePerGram: number;
  silverGrams: number;
  silverPricePerGram: number;
  stocksShares: number;
  businessGoods: number;
  moneyOwedToYou: number;
  liabilitiesDebts: number;
  expensesDue: number;
  currency: string;
  lastCalculated?: string;
}

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
