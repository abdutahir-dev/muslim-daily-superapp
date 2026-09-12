export interface PrayerLogRecord {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  jamaahCount?: number;
  sunnahCompleted?: number;
  updatedAt: string;
}

export interface TasbihState {
  target: number;
  currentCount: number;
  lifetimeCount: number;
  selectedPhrase: string;
  history: Array<{ timestamp: number; phrase: string; count: number }>;
  updatedAt: string;
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
  updatedAt: string;
}

// In-memory persistent cache for serverless synchronization layer
const userPrayerLogs = new Map<string, Record<string, PrayerLogRecord>>();
const userTasbihState = new Map<string, TasbihState>();
const userBookmarks = new Map<string, BookmarkRecord[]>();
const userKhatmahPlans = new Map<string, KhatmahPlan>();

export class FirebaseSyncService {
  public static getPrayerLogs(userId: string): Record<string, PrayerLogRecord> {
    return userPrayerLogs.get(userId) || {};
  }

  public static savePrayerLogs(userId: string, record: PrayerLogRecord): Record<string, PrayerLogRecord> {
    const existing = userPrayerLogs.get(userId) || {};
    existing[record.date] = { ...record, updatedAt: new Date().toISOString() };
    userPrayerLogs.set(userId, existing);
    return existing;
  }

  public static getTasbih(userId: string): TasbihState {
    return (
      userTasbihState.get(userId) || {
        target: 33,
        currentCount: 0,
        lifetimeCount: 0,
        selectedPhrase: "سُبْحَانَ اللَّهِ",
        history: [],
        updatedAt: new Date().toISOString(),
      }
    );
  }

  public static saveTasbih(userId: string, state: Partial<TasbihState>): TasbihState {
    const current = this.getTasbih(userId);
    const updated: TasbihState = {
      ...current,
      ...state,
      updatedAt: new Date().toISOString(),
    };
    userTasbihState.set(userId, updated);
    return updated;
  }

  public static getBookmarks(userId: string): BookmarkRecord[] {
    return userBookmarks.get(userId) || [];
  }

  public static saveBookmarks(userId: string, bookmarks: BookmarkRecord[]): BookmarkRecord[] {
    userBookmarks.set(userId, bookmarks);
    return bookmarks;
  }

  public static getKhatmah(userId: string): KhatmahPlan {
    return (
      userKhatmahPlans.get(userId) || {
        id: `khatmah_${userId}`,
        title: "30-Day Ramadan Quran Khatmah",
        targetDays: 30,
        pagesPerDay: 20,
        currentPage: 1,
        totalPages: 604,
        startDate: new Date().toISOString().split("T")[0],
        targetCompletionDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        completedDays: 0,
        status: "active",
        updatedAt: new Date().toISOString(),
      }
    );
  }

  public static updateKhatmah(userId: string, plan: Partial<KhatmahPlan>): KhatmahPlan {
    const current = this.getKhatmah(userId);
    const updated: KhatmahPlan = {
      ...current,
      ...plan,
      updatedAt: new Date().toISOString(),
    };
    userKhatmahPlans.set(userId, updated);
    return updated;
  }
}
