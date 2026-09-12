import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Clock,
  BookOpen,
  Compass,
  CircleDot,
  Heart,
  Star,
  Share2,
  Copy,
  RotateCw,
  Search,
  ExternalLink,
  ChevronRight,
  Settings,
  User as UserIcon,
  Edit3,
  Users,
  Check,
  Sparkles,
  ArrowRight,
  ArrowDown,
  X,
  Flame,
  WifiOff,
} from "lucide-react";
import { MiniAppId } from "../types";
import { useAuth } from "../context/AuthContext";
import { calculatePrayerTimes } from "../lib/prayerTimes";
import { SURAH_LIST } from "../lib/quranData";
import { QaidaModal } from "./QaidaModal";
import { AhlulBaitModal } from "./AhlulBaitModal";
import { AbjadModal } from "./AbjadModal";
import { HadithModal } from "./HadithModal";
import {
  fetchDailyDashboard,
  fetchRandomAyah,
  fetchRandomHadith,
  fetchRandomQuote,
  getCachedDailyDashboard,
  getCachedNextPrayer,
  getCachedAyah,
  getCachedHadith,
  getCachedQuote,
  NextPrayerInfo,
  RandomAyahItem,
  RandomHadithItem,
  RandomQuoteItem,
} from "../lib/dashboardApi";

interface HomeDashboardProps {
  onNavigate?: (tab: MiniAppId) => void;
  onSelectApp?: (tab: MiniAppId) => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
}

interface CuratedAyah {
  badge: string;
  surahNumber: number;
  arabic: string;
  translation: string;
  translationAmharic: string;
  buttonLabel: string;
}

const CURATED_AYAHS: CuratedAyah[] = [
  {
    badge: "Maryam [ 78 - 84 ]",
    surahNumber: 19,
    arabic: "أَطَّلَعَ الْغَيْبَ أَمِ اتَّخَذَ عِندَ الرَّحْمَٰنِ عَهْدًا",
    translation: "Has he looked into the unseen, or has he taken from the Most Merciful a covenant?",
    translationAmharic: "ሩቁን ምሥጢር ዐወቀን? ወይስ ከአልረሕማን ዘንድ ቃል ኪዳንን ያዘ?",
    buttonLabel: "Read Ayahs [ 78 - 84 ]",
  },
  {
    badge: "Al-Baqarah [ 152 ]",
    surahNumber: 2,
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    translationAmharic: "አስታውሱኝም፤ አስታውሳችኋለሁና፡፡ ለእኔም አመስግኑ፤ አትካዱኝም፡፡",
    buttonLabel: "Read Ayah [ 152 ]",
  },
  {
    badge: "Ash-Sharh [ 5 - 6 ]",
    surahNumber: 94,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
    translationAmharic: "ከችግርም ጋር ምቾት አልለ፡፡ ከችግር ጋር በእርግጥ ምቾት አልለ፡፡",
    buttonLabel: "Read Ayahs [ 5 - 6 ]",
  },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onSelectApp,
  onOpenSettings,
  onOpenAuth,
}) => {
  const navigate = onSelectApp || onNavigate || (() => {});
  const { user, preferences, todayHabit } = useAuth();
  const [schedule, setSchedule] = useState(() =>
    calculatePrayerTimes(new Date(), preferences)
  );

  // Modals state
  const [isQaidaOpen, setIsQaidaOpen] = useState(false);
  const [isAhlulBaitOpen, setIsAhlulBaitOpen] = useState(false);
  const [isAbjadOpen, setIsAbjadOpen] = useState(false);
  const [isHadithOpen, setIsHadithOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Backend-fetched dynamic landing page state with instant local cache initialization
  const [nextPrayerBackend, setNextPrayerBackend] = useState<NextPrayerInfo | null>(() => getCachedNextPrayer());
  const [fetchedAyah, setFetchedAyah] = useState<RandomAyahItem | null>(() => getCachedAyah());
  const [fetchedHadith, setFetchedHadith] = useState<RandomHadithItem | null>(() => getCachedHadith());
  const [fetchedQuote, setFetchedQuote] = useState<RandomQuoteItem | null>(() => getCachedQuote());
  const [isOfflineData, setIsOfflineData] = useState<boolean>(() => {
    const cached = getCachedDailyDashboard();
    return !!cached?.isOfflineData || (typeof navigator !== "undefined" && !navigator.onLine);
  });

  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isRefreshingAyah, setIsRefreshingAyah] = useState(false);
  const [isRefreshingHadith, setIsRefreshingHadith] = useState(false);
  const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);

  // Monitor online/offline browser network status
  useEffect(() => {
    const handleOnline = () => setIsOfflineData(false);
    const handleOffline = () => setIsOfflineData(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Ayah of the Day fallback
  const [ayahIndex, setAyahIndex] = useState(0);
  const activeAyah = fetchedAyah || {
    id: "fallback-ayah",
    badge: CURATED_AYAHS[ayahIndex].badge,
    surahNumber: CURATED_AYAHS[ayahIndex].surahNumber,
    surahNameArabic: "مريم",
    surahNameEnglish: "Maryam",
    arabic: CURATED_AYAHS[ayahIndex].arabic,
    translation: CURATED_AYAHS[ayahIndex].translation,
    translationAmharic: CURATED_AYAHS[ayahIndex].translationAmharic,
    buttonLabel: CURATED_AYAHS[ayahIndex].buttonLabel,
  };

  const [isAyahStarred, setIsAyahStarred] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState(false);

  // Quote Card State
  const [isQuoteStarred, setIsQuoteStarred] = useState(false);
  const [isQuoteLiked, setIsQuoteLiked] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Dua Card State
  const [isDuaStarred, setIsDuaStarred] = useState(false);
  const [isDuaLiked, setIsDuaLiked] = useState(false);
  const [copiedDua, setCopiedDua] = useState(false);

  // Fetch initial landing page data from backend API (/api/dashboard/daily) with Stale-While-Revalidate caching
  useEffect(() => {
    let isMounted = true;
    setIsLoadingDashboard(true);

    fetchDailyDashboard({
      lat: preferences.latitude,
      lng: preferences.longitude,
      method: preferences.calculationMethod,
      school: preferences.juristicSchool,
    })
      .then((data) => {
        if (!isMounted) return;
        setNextPrayerBackend(data.nextPrayer);
        setFetchedAyah(data.randomAyah);
        setFetchedHadith(data.randomHadith);
        setFetchedQuote(data.randomQuote);
        setIsOfflineData(!!data.isOfflineData);
      })
      .catch((err) => {
        console.warn("Backend landing data fetch fallback to offline cache or client engine:", err);
        setIsOfflineData(true);
      })
      .finally(() => {
        if (isMounted) setIsLoadingDashboard(false);
      });

    return () => {
      isMounted = false;
    };
  }, [preferences]);

  // Pull-to-refresh mechanism state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef<number>(0);
  const PULL_THRESHOLD = 60; // Distance in px to trigger pull-to-refresh

  // Function to perform full refresh of prayer times and daily content
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Recalculate local solar prayer times engine
      setSchedule(calculatePrayerTimes(new Date(), preferences));

      // 2. Fetch fresh landing page daily data from backend REST endpoint
      const data = await fetchDailyDashboard({
        lat: preferences.latitude,
        lng: preferences.longitude,
        method: preferences.calculationMethod,
        school: preferences.juristicSchool,
      });

      setNextPrayerBackend(data.nextPrayer);
      setFetchedAyah(data.randomAyah);
      setFetchedHadith(data.randomHadith);
      setFetchedQuote(data.randomQuote);
      setIsOfflineData(!!data.isOfflineData);
    } catch (err) {
      console.warn("Pull-to-refresh failed, maintaining current cache:", err);
      setIsOfflineData(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 5) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const dy = currentY - touchStartY.current;

    if (dy > 0 && window.scrollY <= 5) {
      // Damped pull curve formula
      const distance = Math.min(Math.pow(dy, 0.82), 100);
      setPullDistance(distance);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    setIsPulling(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setPullDistance(50);
      await refreshAllData();
      setTimeout(() => setPullDistance(0), 400);
    } else {
      setPullDistance(0);
    }
  };

  // Handler to fetch a new random Ayah from backend
  const handleRefreshAyah = async () => {
    setIsRefreshingAyah(true);
    try {
      const ayah = await fetchRandomAyah();
      setFetchedAyah(ayah);
    } catch (err) {
      console.error("Failed to fetch next random Ayah from backend", err);
      setAyahIndex((prev) => (prev + 1) % CURATED_AYAHS.length);
    } finally {
      setIsRefreshingAyah(false);
    }
  };

  // Handler to fetch a new random Hadith from backend
  const handleRefreshHadith = async () => {
    setIsRefreshingHadith(true);
    try {
      const hadith = await fetchRandomHadith();
      setFetchedHadith(hadith);
    } catch (err) {
      console.error("Failed to fetch random Hadith from backend", err);
    } finally {
      setIsRefreshingHadith(false);
    }
  };

  // Handler to fetch a new random Quote from backend
  const handleRefreshQuote = async () => {
    setIsRefreshingQuote(true);
    try {
      const quote = await fetchRandomQuote();
      setFetchedQuote(quote);
    } catch (err) {
      console.error("Failed to fetch random Quote from backend", err);
    } finally {
      setIsRefreshingQuote(false);
    }
  };


  // Update prayer time countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSchedule(calculatePrayerTimes(new Date(), preferences));
    }, 1000);
    return () => clearInterval(timer);
  }, [preferences]);

  // Derive greeting based on time of day
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "GOOD MORNING"
      : currentHour < 17
      ? "GOOD AFTERNOON"
      : "GOOD EVENING";

  // Derive user's display name or fallback to "ABDU"
  const userName = useMemo(() => {
    if (user?.displayName) {
      return user.displayName.split(" ")[0].toUpperCase();
    }
    if (user?.email) {
      const prefix = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      if (prefix.toLowerCase().includes("abdu")) return "ABDU";
      return prefix.toUpperCase();
    }
    return "ABDU";
  }, [user]);

  // Calculate prayer goal percentage (e.g. default 20% if 1 logged, or minimum 20% to match aesthetic)
  const prayersCheckedCount = Object.values(todayHabit.prayers).filter(Boolean).length;
  const prayerGoalPercent = Math.max(20, Math.round((prayersCheckedCount / 5) * 100));

  // Search filter results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();

    const matchingSurahs = SURAH_LIST.filter(
      (s) =>
        s.nameEnglish.toLowerCase().includes(query) ||
        s.translationEnglish.toLowerCase().includes(query) ||
        (s.translationAmharic && s.translationAmharic.includes(query)) ||
        s.nameArabic.includes(searchQuery) ||
        String(s.number) === query
    ).slice(0, 3);

    const matchingDuas = [
      {
        title: "Subhan-Allahi wa bihamdihi",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        category: "Tasbih & Forgiveness",
      },
      {
        title: "Ayat al-Kursi",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        category: "Protection & Throne",
      },
      {
        title: "Sayyid al-Istighfar",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ",
        category: "Supreme Forgiveness",
      },
    ].filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.arabic.includes(searchQuery) ||
        d.category.toLowerCase().includes(query)
    );

    return {
      surahs: matchingSurahs,
      duas: matchingDuas,
    };
  }, [searchQuery]);

  const handleShareAyah = () => {
    const textToShare =
      preferences.quranTranslation === "amharic"
        ? `"${activeAyah.arabic}"\n${activeAyah.translationAmharic}\n[ተርጓሚ፡ ሙሐመድ ሳኒ ሐቢብ] — ${activeAyah.badge}`
        : preferences.quranTranslation === "both"
        ? `"${activeAyah.arabic}"\n${activeAyah.translationAmharic}\n${activeAyah.translation} — ${activeAyah.badge}`
        : `"${activeAyah.arabic}"\n${activeAyah.translation} — ${activeAyah.badge}`;

    navigator.clipboard.writeText(textToShare);
    setCopiedAyah(true);
    setTimeout(() => setCopiedAyah(false), 2000);
  };

  const handleShareQuote = () => {
    const arabic = fetchedQuote?.arabic || "... عَنِ الفَحْشَاءِ وَالظُّلْمِ";
    const translation =
      fetchedQuote?.translation ||
      "Verily Allah, the Glorified, has enjoined justice and benevolence and has forbidden indecency and injustice";
    const source = fetchedQuote?.source || "غرر الحكم ودرر الكلم";
    const author = fetchedQuote?.author ? ` (${fetchedQuote.author})` : "";
    const category = fetchedQuote?.category ? ` [${fetchedQuote.category}]` : "";

    const textToShare = `✨ Islamic Pearl of Wisdom${category} ✨\n\n"${arabic}"\n\n"${translation}"\n\n— ${source}${author}\n\nShared via Muslim Daily App`;

    navigator.clipboard.writeText(textToShare);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleShareDua = () => {
    navigator.clipboard.writeText(
      `سُبْحَانَ اللَّهِ وَبِحَمْدِهِ\n"Whoever says 'Subhan-Allahi wa bihamdihi' 100 times a day, his sins are forgiven even if they were like the foam of the sea." [Bukhari]`
    );
    setCopiedDua(true);
    setTimeout(() => setCopiedDua(false), 2000);
  };

  return (
    <div
      id="landing-page-root"
      className="space-y-4 pb-20 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-To-Refresh Visual Indicator Banner */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          style={{
            height: `${isRefreshing ? 52 : Math.min(pullDistance, 70)}px`,
            opacity: Math.min(pullDistance / 35, 1),
          }}
          className="overflow-hidden transition-all duration-150 ease-out flex items-center justify-center bg-teal-50 border border-teal-200/80 rounded-xl text-teal-800 text-xs font-semibold space-x-2 shadow-2xs"
        >
          <RotateCw
            className={`w-4 h-4 text-[#00B074] ${
              isRefreshing
                ? "animate-spin"
                : pullDistance >= PULL_THRESHOLD
                ? "rotate-180 transition-transform duration-200"
                : ""
            }`}
          />
          <span>
            {isRefreshing
              ? "Refreshing prayer times & daily content from server..."
              : pullDistance >= PULL_THRESHOLD
              ? "Release to refetch data..."
              : "Pull down to refresh page"}
          </span>
        </div>
      )}

      {/* 1. Header: Muslim Daily Logo & User Profile Avatar */}
      <header
        id="landing-header"
        className="flex items-center justify-between pt-1 pb-1"
      >
        <div className="flex items-center gap-2.5">
          {/* Islamic Star / Medallion Logo */}
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-[#009688] via-[#00B074] to-[#00C853] text-white flex items-center justify-center shadow-xs shadow-teal-900/10">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Islamic 8-pointed star */}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
            Muslim Daily
          </h1>
        </div>

        {/* User Profile Avatar */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="relative w-10 h-10 rounded-full bg-amber-50 border-2 border-[#00B074]/30 overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
          title="Profile & Account"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-100 to-amber-200 text-slate-700">
              {/* Illustrated Avatar Head with kufi/turban cap */}
              <div className="w-4 h-2 rounded-t-full bg-teal-700 mb-0.5" />
              <div className="w-4 h-4 rounded-full bg-amber-300 border border-amber-400" />
            </div>
          )}
        </button>
      </header>

      {/* 2. Greeting & Prayer Goal */}
      <section
        id="greeting-section"
        className="flex items-end justify-between pt-1 pb-1"
      >
        <div>
          <p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">
            {greeting}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight mt-0.5">
            {userName}
          </h2>
          {/* Accent teal/green line */}
          <div className="h-1.5 w-24 bg-[#00B074] rounded-full mt-2" />
        </div>

        <button
          type="button"
          onClick={() => navigate("prayer")}
          className="flex flex-col items-end cursor-pointer group active:scale-95 transition-transform"
          title="Open Prayer Sanctuary & Track Prayers"
        >
          <span className="text-[10px] font-bold tracking-wider text-[#64748B] group-hover:text-[#00B074] transition-colors uppercase">
            PRAYER GOAL
          </span>
          <div className="mt-1">
            <span className="bg-[#00B074] group-hover:bg-[#009688] text-white text-xs font-bold px-3 py-0.5 rounded-full inline-block shadow-2xs transition-colors">
              {prayerGoalPercent}%
            </span>
          </div>
        </button>
      </section>

      {/* Offline Storage Status Indicator Banner */}
      {isOfflineData && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-800 animate-in fade-in duration-200 shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Working Offline — Showing cached Prayer, Ayah & Hadith</span>
          </div>
          <span className="text-[10px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full font-mono font-semibold">
            Offline Cache
          </span>
        </div>
      )}

      {/* 3. Search Bar with Live Suggestions */}
      <section id="search-section" className="relative">
        <div className="bg-white rounded-xl border border-gray-200/80 px-4 py-3 flex items-center gap-3 shadow-xs">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Quran, Hadith, or Duas..."
            className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {searchResults && (
          <div className="absolute top-full left-0 right-0 z-30 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            {searchResults.surahs.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Surahs
                </p>
                <div className="space-y-1">
                  {searchResults.surahs.map((surah) => (
                    <button
                      key={surah.number}
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        navigate("quran");
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          {surah.number}. {surah.nameEnglish}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1.5">
                          ({surah.translationEnglish})
                        </span>
                      </div>
                      <span className="font-arabic text-sm font-semibold text-[#00B074]">
                        {surah.nameArabic}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.duas.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Duas & Adhkar
                </p>
                <div className="space-y-1">
                  {searchResults.duas.map((dua, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        navigate("adhkar");
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{dua.title}</p>
                        <span className="text-[10px] text-slate-400">{dua.category}</span>
                      </div>
                      <span className="font-arabic text-xs text-slate-700">
                        {dua.arabic}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. Next Prayer Banner Card (Deep Blue Ocean Card - Backend Fetched) */}
      <section
        id="next-prayer-banner"
        onClick={() => navigate("prayer")}
        className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#1752AA] via-[#1E5BB5] to-[#2563EB] text-white p-5 shadow-md shadow-blue-900/10 cursor-pointer active:scale-[0.99] transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold tracking-widest text-blue-200 uppercase">
                NEXT PRAYER
              </span>
              <span className="text-[9px] bg-white/20 text-white font-mono px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Backend API
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-wide text-white mt-0.5">
              {nextPrayerBackend?.name?.toUpperCase() || schedule.nextPrayer?.name?.toUpperCase() || "DHUHR"}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-3xl font-bold font-mono tracking-tight text-white block">
              {nextPrayerBackend?.time || schedule.nextPrayer?.time || "12:22"}
            </span>
            <span className="text-xs text-blue-100/90 font-medium block mt-0.5">
              In {nextPrayerBackend?.timeRemaining || schedule.timeRemainingToNext || "1h 52m"}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Ayah of the Day Card (Backend Fetched) */}
      <section
        id="ayah-of-the-day-card"
        className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-xs space-y-3"
      >
        {/* Card Header: Green Badge & Action Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#00B074] text-white text-xs font-semibold px-3 py-1 rounded-[6px] shadow-2xs">
              {activeAyah.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAyahStarred(!isAyahStarred)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isAyahStarred
                  ? "text-amber-500 bg-amber-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title={isAyahStarred ? "Saved to Favorites" : "Save Ayah"}
            >
              <Star className={`w-4 h-4 ${isAyahStarred ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleShareAyah}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Share / Copy Ayah"
            >
              {copiedAyah ? (
                <Check className="w-4 h-4 text-[#00B074]" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleRefreshAyah}
              disabled={isRefreshingAyah}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              title="Fetch New Random Ayah from Backend"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshingAyah ? "animate-spin text-[#00B074]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Prominent Arabic Calligraphy */}
        <div className="py-2.5 space-y-2">
          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl text-center text-[#0F172A] leading-loose font-normal"
          >
            {activeAyah.arabic}
          </p>

          {/* Translation according to user preference */}
          {preferences.quranTranslation === "amharic" ? (
            <div className="text-center px-2">
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {activeAyah.translationAmharic}
              </p>
              <p className="text-[10px] text-teal-700/80 mt-0.5 font-medium">
                (ትርጉም፡ ሙሐመድ ሳኒ ሐቢብ)
              </p>
            </div>
          ) : preferences.quranTranslation === "both" ? (
            <div className="text-center px-2 space-y-1">
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {activeAyah.translationAmharic}
              </p>
              <p className="text-xs text-slate-500 italic leading-relaxed">
                "{activeAyah.translation}"
              </p>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-center text-slate-600 italic px-2 leading-relaxed">
              "{activeAyah.translation}"
            </p>
          )}
        </div>

        {/* Read Ayahs Link */}
        <div className="pt-2 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => navigate("quran")}
            className="text-sm font-semibold text-slate-800 hover:text-[#00B074] transition-colors cursor-pointer py-1 inline-block"
          >
            {activeAyah.buttonLabel}
          </button>
        </div>
      </section>

      {/* 6. Hadith of the Day Card (Backend Fetched) */}
      <section
        id="hadith-of-the-day-card"
        className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              {fetchedHadith?.title || "Hadith of the Day"}
            </h3>
            <span className="text-[9px] bg-teal-50 text-teal-700 border border-teal-200 font-medium px-2 py-0.5 rounded-full">
              Backend API
            </span>
          </div>

          <button
            type="button"
            onClick={handleRefreshHadith}
            disabled={isRefreshingHadith}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Fetch New Random Hadith from Backend"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshingHadith ? "animate-spin text-[#00B074]" : ""}`} />
          </button>
        </div>

        {/* Arabic Hadith text */}
        <p
          dir="rtl"
          className="font-arabic text-base sm:text-[17px] text-right text-slate-800 leading-relaxed font-normal"
        >
          {fetchedHadith?.arabic ||
            "حدثنا عثمان بن أبي شيبة، حدثنا زيد بن الحباب، حدثنا معاوية بن صالح، عن ربيعة بن يزيد، عن أبي إدريس الخولاني، عن جبير بن نفير الحضرمي، عن عقبة بن عامر الجهني، أن رسول الله صلى الله عليه وسلم قال \" ما من أحد يتوضأ فيحسن الوضوء ويصلي ركعتين يقبل بقلبه ووجهه عليهما إلا وجبت له الجنة\""}
        </p>

        {/* Translation */}
        <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
          "{fetchedHadith?.translation || "Whenever a Muslim performs ablution properly, then stands and offers two raka'ahs with undivided heart and face, Paradise becomes guaranteed for him."}"
        </p>

        <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsHadithOpen(true)}
            className="text-slate-500 font-medium hover:text-[#00B074] transition-colors"
          >
            {fetchedHadith?.source || "Sahih Muslim & Sunan Abi Dawud"}
          </button>
          <button
            type="button"
            onClick={() => setIsHadithOpen(true)}
            className="text-[#00B074] font-semibold hover:underline cursor-pointer"
          >
            Explore Hadith Collection &rarr;
          </button>
        </div>
      </section>

      {/* 7. Quotes Card (Backend Fetched) */}
      <section
        id="quotes-card"
        className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="border border-[#00B074] text-[#00B074] px-3 py-0.5 rounded-full text-xs font-medium">
              {fetchedQuote?.category || "مدح العدل"}
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
              Backend API
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuoteStarred(!isQuoteStarred)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isQuoteStarred
                  ? "text-amber-500 bg-amber-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title="Save Quote"
            >
              <Star className={`w-4 h-4 ${isQuoteStarred ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsQuoteLiked(!isQuoteLiked)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isQuoteLiked
                  ? "text-rose-500 bg-rose-50"
                  : "text-gray-400 hover:text-rose-500 hover:bg-gray-50"
              }`}
              title="Like Quote"
            >
              <Heart className={`w-4 h-4 ${isQuoteLiked ? "fill-current text-rose-500" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleShareQuote}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                copiedQuote
                  ? "bg-emerald-50 text-[#00B074]"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title="One-Tap Copy for Social Media"
            >
              {copiedQuote ? (
                <Check className="w-4 h-4 text-[#00B074]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleShareQuote}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Share Quote"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRefreshQuote}
              disabled={isRefreshingQuote}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              title="Fetch New Random Quote from Backend"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshingQuote ? "animate-spin text-[#00B074]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Arabic text */}
        <p
          dir="rtl"
          className="font-arabic text-xl sm:text-2xl text-right text-[#0F172A] leading-loose font-normal"
        >
          {fetchedQuote?.arabic || "... عَنِ الفَحْشَاءِ وَالظُّلْمِ"}
        </p>

        {/* English translation */}
        <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed text-center sm:text-left">
          "{fetchedQuote?.translation || "Verily Allah, the Glorified, has enjoined justice and benevolence and has forbidden indecency and injustice"}"
        </p>

        {/* Source citation and One-Tap Copy Pill for Social Media */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={handleShareQuote}
            className="flex items-center gap-1.5 bg-[#00B074]/10 hover:bg-[#00B074]/20 text-[#00B074] text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
            title="One-tap copy quote formatted for social media"
          >
            {copiedQuote ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00B074]" />
                <span>Copied for Social Media!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#00B074]" />
                <span>One-Tap Copy for Social</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 italic">
              {fetchedQuote?.author ? `By ${fetchedQuote.author}` : ""}
            </span>
            <button
              type="button"
              onClick={() => navigate("quotes")}
              className="text-[#009688] font-arabic text-sm hover:underline cursor-pointer font-medium"
            >
              {fetchedQuote?.source || "غرر الحكم ودرر الكلم"} &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 8. Daily Dua Card */}
      <section
        id="daily-dua-card"
        className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="border border-[#00B074] text-[#00B074] px-3 py-0.5 rounded-full text-xs font-medium">
            Daily Dua
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDuaStarred(!isDuaStarred)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isDuaStarred
                  ? "text-amber-500 bg-amber-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title="Save Dua"
            >
              <Star className={`w-4 h-4 ${isDuaStarred ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsDuaLiked(!isDuaLiked)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isDuaLiked
                  ? "text-rose-500 bg-rose-50"
                  : "text-gray-400 hover:text-rose-500 hover:bg-gray-50"
              }`}
              title="Like Dua"
            >
              <Heart className={`w-4 h-4 ${isDuaLiked ? "fill-current text-rose-500" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleShareDua}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Share Dua"
            >
              {copiedDua ? (
                <Check className="w-4 h-4 text-[#00B074]" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("adhkar")}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Refresh / View Fortress of the Muslim"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Large Prominent Dua */}
        <div className="text-center py-1">
          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl text-center text-[#0F172A] font-bold"
          >
            .سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
          </p>
        </div>

        {/* Explanation / Hadith text */}
        <p
          dir="rtl"
          className="font-arabic text-xs sm:text-sm text-center text-slate-600 leading-relaxed font-normal"
        >
          حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ. لَمْ يَأْتِ أَحَدٌ يَوْمَ الْقِيَامَةِ بِأَفْضَلَ مِمَّا جَاءَ بِهِ إِلَّا أَحَدٌ قَالَ مِثْلَ مَا قَالَ أَوْ زَادَ عَلَيْهِ
        </p>

        {/* Bottom Tag */}
        <div className="text-center pt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={() => navigate("adhkar")}
            className="text-xs font-semibold text-[#00B074] hover:underline cursor-pointer"
          >
            Daily Dua
          </button>
        </div>
      </section>

      {/* 9. Featured Modules (2 Rows of 5 items) */}
      <section id="featured-modules-section" className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-base font-bold text-slate-900">Featured Modules</h3>
          <button
            type="button"
            onClick={() => navigate("prayer")}
            className="text-sm font-semibold text-[#00B074] hover:opacity-80 transition-opacity cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* 2 Rows of 5 Square Cards */}
        <div className="grid grid-cols-5 gap-2">
          {/* Row 1 */}
          {/* 1. Qaida */}
          <button
            type="button"
            onClick={() => setIsQaidaOpen(true)}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-emerald-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#00B074] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Edit3 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Qaida
            </span>
          </button>

          {/* 2. Multi Quran */}
          <button
            type="button"
            onClick={() => navigate("quran")}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-blue-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Multi Quran
            </span>
          </button>

          {/* 3. Profile */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-blue-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <UserIcon className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Profile
            </span>
          </button>

          {/* 4. Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-orange-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Settings
            </span>
          </button>

          {/* 5. Solaty */}
          <button
            type="button"
            onClick={() => navigate("prayer")}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-emerald-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#00B074] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Solaty
            </span>
          </button>

          {/* Row 2 */}
          {/* 6. Ahlul Bait */}
          <button
            type="button"
            onClick={() => setIsAhlulBaitOpen(true)}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-blue-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Ahlul Bait
            </span>
          </button>

          {/* 7. Abjad */}
          <button
            type="button"
            onClick={() => setIsAbjadOpen(true)}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-orange-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Abjad
            </span>
          </button>

          {/* 8. Hadith */}
          <button
            type="button"
            onClick={() => setIsHadithOpen(true)}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-orange-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Hadith
            </span>
          </button>

          {/* 9. Tasbih */}
          <button
            type="button"
            onClick={() => navigate("tasbih")}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-emerald-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#00B074] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <CircleDot className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Tasbih
            </span>
          </button>

          {/* 10. Quotes */}
          <button
            type="button"
            onClick={() => navigate("quotes")}
            className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex flex-col items-center justify-center text-center hover:border-rose-200 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#FF2D55] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-800 tracking-tight">
              Quotes
            </span>
          </button>
        </div>
      </section>

      {/* 10. Featured Surah Card */}
      <section
        id="featured-surah-card"
        onClick={() => navigate("quran")}
        className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-xs space-y-2 cursor-pointer hover:border-gray-200 transition-colors"
      >
        <h3 className="text-sm font-bold text-slate-900">Featured Surah</h3>

        <div className="flex items-center justify-between py-1">
          <div>
            <h4 className="text-xl font-bold text-slate-900">Ya-Sin</h4>
            <p className="text-xs text-slate-400 mt-0.5">83 verses | makkah</p>
          </div>

          <span className="text-3xl font-bold text-[#00B074] font-arabic">
            يس
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <span className="font-semibold text-[#00B074] flex items-center gap-1 hover:underline">
            View All &gt;
          </span>
          <span className="text-slate-400">Updated weekly</span>
        </div>
      </section>

      {/* 11. Start Your Quran Journey Card */}
      <section
        id="quran-journey-card"
        className="bg-[#F8FAFC] rounded-[20px] p-5 border border-slate-200/60 space-y-1"
      >
        <p className="text-xs text-slate-500 font-medium">
          Start Your Quran Journey
        </p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Quran
        </h3>
        <p className="text-xs text-slate-500">
          Tap to explore new chapters
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate("quran")}
            className="border border-[#00B074] text-[#00B074] bg-white hover:bg-[#00B074]/5 px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            Explore
          </button>
        </div>
      </section>

      {/* Modals for Featured Modules */}
      <QaidaModal
        isOpen={isQaidaOpen}
        onClose={() => setIsQaidaOpen(false)}
      />
      <AhlulBaitModal
        isOpen={isAhlulBaitOpen}
        onClose={() => setIsAhlulBaitOpen(false)}
      />
      <AbjadModal
        isOpen={isAbjadOpen}
        onClose={() => setIsAbjadOpen(false)}
      />
      <HadithModal
        isOpen={isHadithOpen}
        onClose={() => setIsHadithOpen(false)}
      />
    </div>
  );
};
