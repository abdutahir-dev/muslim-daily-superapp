import React, { useState, useMemo } from "react";
import {
  Compass,
  CircleDot,
  Heart,
  Flame,
  Coins,
  MapPin,
  Bot,
  BookA,
  BookOpen,
  Clock,
  Sparkles,
  Search,
  ChevronRight,
  ShieldCheck,
  Star,
  ExternalLink,
} from "lucide-react";
import { MiniAppId } from "../types";

interface AppsPageProps {
  onSelectApp: (appId: MiniAppId) => void;
}

interface AppDefinition {
  id: MiniAppId;
  title: string;
  arabicTitle: string;
  subtitle: string;
  category: "worship" | "knowledge" | "lifestyle";
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  featured?: boolean;
  badgeText?: string;
  description: string;
}

export const AppsPage: React.FC<AppsPageProps> = ({ onSelectApp }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "worship" | "knowledge" | "lifestyle">("all");

  const appsList: AppDefinition[] = [
    {
      id: "qibla",
      title: "Qibla Direction",
      arabicTitle: "اتجاه القبلة",
      subtitle: "Accurate Kaaba compass & GPS bearing",
      category: "worship",
      icon: Compass,
      iconBg: "bg-emerald-600",
      iconColor: "text-white",
      featured: true,
      description: "Real-time compass with true North calibration, device orientation sensors, and distance to Makkah.",
    },
    {
      id: "tasbih",
      title: "Tasbih & Dhikr",
      arabicTitle: "المسبحة الإلكترونية",
      subtitle: "Digital prayer beads with vibration & goals",
      category: "worship",
      icon: CircleDot,
      iconBg: "bg-teal-600",
      iconColor: "text-white",
      featured: true,
      description: "Interactive counter with haptic feedback, custom targets (33, 99, 1000), and lifetime dhikr history.",
    },
    {
      id: "adhkar",
      title: "Daily Adhkar",
      arabicTitle: "أذكار المسلم",
      subtitle: "Morning, evening & prayer fortress",
      category: "worship",
      icon: Heart,
      iconBg: "bg-rose-600",
      iconColor: "text-white",
      description: "Authentic supplications from Hisn al-Muslim with Arabic script, transliteration, virtues, and audio.",
    },
    {
      id: "habits",
      title: "Habit Tracker & Solaty",
      arabicTitle: "سجل الصلوات والعادات",
      subtitle: "Track 5 daily prayers, sunnah & fasting",
      category: "worship",
      icon: Flame,
      iconBg: "bg-amber-600",
      iconColor: "text-white",
      featured: true,
      description: "Detailed Salah logging (on-time, in jama'ah), nawafil (Duha, Tahajjud, Witr), and fasting tracker.",
    },
    {
      id: "zakat",
      title: "Zakat Calculator",
      arabicTitle: "حاسبة الزكاة",
      subtitle: "Gold, silver, cash & savings calculator",
      category: "lifestyle",
      icon: Coins,
      iconBg: "bg-indigo-600",
      iconColor: "text-white",
      description: "Compliant calculation using live or custom Nisab values across multiple asset classes.",
    },
    {
      id: "places",
      title: "Halal Places & Masajid",
      arabicTitle: "مساجد وأماكن حلال",
      subtitle: "Find nearby mosques & halal food",
      category: "lifestyle",
      icon: MapPin,
      iconBg: "bg-sky-600",
      iconColor: "text-white",
      description: "Geolocation discovery for verified masajid, prayer spaces, and halal restaurants.",
    },
    {
      id: "qamus",
      title: "Qamus Arabic Dictionary",
      arabicTitle: "قاموس القرآن",
      subtitle: "Quranic roots, meanings & vocabulary",
      category: "knowledge",
      icon: BookA,
      iconBg: "bg-violet-600",
      iconColor: "text-white",
      description: "Comprehensive lexical search for classical Arabic root words, definitions, and occurrences.",
    },
    {
      id: "ai",
      title: "AI Islamic Assistant",
      arabicTitle: "المساعد الذكي",
      subtitle: "Knowledge companion grounded in authentic sources",
      category: "knowledge",
      icon: Bot,
      iconBg: "bg-[#007A78]",
      iconColor: "text-white",
      featured: true,
      description: "Ask questions regarding fiqh guidelines, Quranic reflections, and historical context.",
    },
    {
      id: "prayer",
      title: "Prayer Times",
      arabicTitle: "مواقيت الصلاة",
      subtitle: "Accurate timetable & Adhan alerts",
      category: "worship",
      icon: Clock,
      iconBg: "bg-blue-600",
      iconColor: "text-white",
      description: "Custom calculation methods (MWL, ISNA, Egypt, Makkah, Karachi) with Fajr to Isha notifications.",
    },
    {
      id: "quran",
      title: "The Holy Quran",
      arabicTitle: "القرآن الكريم",
      subtitle: "Complete Mushaf, audio recitations & tafsir",
      category: "knowledge",
      icon: BookOpen,
      iconBg: "bg-emerald-700",
      iconColor: "text-white",
      description: "Read 114 Surahs with translation, audio streaming, ayah bookmarks, and reading styles.",
    },
    {
      id: "quotes",
      title: "Daily Quotes & Wisdom",
      arabicTitle: "حكم وأقوال",
      subtitle: "Daily hadiths and inspiring reflections",
      category: "knowledge",
      icon: Sparkles,
      iconBg: "bg-fuchsia-600",
      iconColor: "text-white",
      description: "Heart-softening quotes from the Prophet ﷺ, the Sahabah, and righteous scholars.",
    },
  ];

  const filteredApps = useMemo(() => {
    return appsList.filter((app) => {
      const matchesCategory =
        selectedCategory === "all" || app.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        app.title.toLowerCase().includes(query) ||
        app.subtitle.toLowerCase().includes(query) ||
        app.arabicTitle.includes(query) ||
        app.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [appsList, selectedCategory, searchQuery]);

  const featuredApps = useMemo(() => {
    return appsList.filter((app) => app.featured);
  }, [appsList]);

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <section className="bg-gradient-to-br from-[#00695C] via-[#007A78] to-[#004D40] text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-teal-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-teal-200 font-semibold">
              SuperApp Suite
            </span>
            <span className="text-xs font-arabic text-teal-100">الأدوات والتطبيقات</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Apps & Tools Hub
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-md leading-relaxed">
            All Islamic utilities in one place. Instant access to prayer tracking, Qibla compass, Tasbih, Zakat, and Arabic lexicons.
          </p>
        </div>
      </section>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps, tools, trackers, or calculators..."
          className="w-full bg-white text-slate-800 text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#007A78] focus:border-transparent placeholder:text-slate-400 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Segmented Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
            selectedCategory === "all"
              ? "bg-white text-slate-900 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All ({appsList.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("worship")}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
            selectedCategory === "worship"
              ? "bg-white text-slate-900 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Salah & Dhikr
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("knowledge")}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
            selectedCategory === "knowledge"
              ? "bg-white text-slate-900 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Knowledge & Quran
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("lifestyle")}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
            selectedCategory === "lifestyle"
              ? "bg-white text-slate-900 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Calculators & Places
        </button>
      </div>

      {/* Featured Quick Launch (Shown when not actively searching) */}
      {!searchQuery && selectedCategory === "all" && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Highlights
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">One-tap launch</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {featuredApps.slice(0, 4).map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={`featured-${app.id}`}
                  type="button"
                  onClick={() => onSelectApp(app.id)}
                  className="bg-white hover:bg-slate-50/80 active:scale-[0.98] transition-all p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-start text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className={`w-9 h-9 rounded-xl ${app.iconBg} ${app.iconColor} flex items-center justify-center shadow-xs`}>
                      <Icon className="w-5 h-5 stroke-[2px]" />
                    </div>
                    <span className="text-xs font-arabic text-slate-400 group-hover:text-[#007A78] transition-colors">
                      {app.arabicTitle}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug group-hover:text-[#007A78] transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {app.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Complete Apps List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {selectedCategory === "all" ? "All Applications" : "Filtered Tools"}
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            {filteredApps.length} {filteredApps.length === 1 ? "app" : "apps"}
          </span>
        </div>

        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs">
            <p className="text-sm font-medium text-slate-700">No applications found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for something else like &ldquo;tasbih&rdquo;, &ldquo;zakat&rdquo;, or &ldquo;quran&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 px-3.5 py-1.5 bg-[#007A78] text-white text-xs font-medium rounded-xl hover:bg-[#00695C] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onSelectApp(app.id)}
                  className="bg-white hover:bg-slate-50 active:scale-[0.99] transition-all p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                    <div className={`w-11 h-11 shrink-0 rounded-2xl ${app.iconBg} ${app.iconColor} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5.5 h-5.5 stroke-[2.1px]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#007A78] transition-colors truncate">
                          {app.title}
                        </h3>
                        <span className="text-xs font-arabic text-slate-400 shrink-0">
                          {app.arabicTitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {app.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-slate-300 group-hover:text-[#007A78] group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-5 h-5 stroke-[2px]" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Offline & Security Guarantee Footer */}
      <footer className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>All apps operate with full offline caching & secure cloud sync</span>
      </footer>
    </div>
  );
};
