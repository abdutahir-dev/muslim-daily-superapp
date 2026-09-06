import React, { useEffect, useState } from "react";
import {
  Clock,
  BookOpen,
  Compass,
  CircleDot,
  Heart,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  ChevronRight,
  Volume2,
  Share2,
  Coins,
  Store,
  BotMessageSquare,
  Flame,
  Check,
} from "lucide-react";
import { MiniAppId } from "../types";
import { useAuth } from "../context/AuthContext";
import { calculatePrayerTimes, getHijriDate } from "../lib/prayerTimes";
import { DAILY_INSPIRATION_VERSES } from "../lib/quranData";

interface HomeDashboardProps {
  onNavigate?: (tab: MiniAppId) => void;
  onSelectApp?: (tab: MiniAppId) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, onSelectApp }) => {
  const navigate = onSelectApp || onNavigate || (() => {});
  const { preferences, todayHabit, togglePrayerHabit, lifetimeDhikrCount } = useAuth();
  const [schedule, setSchedule] = useState(() => calculatePrayerTimes(new Date(), preferences));
  const [dailyVerse] = useState(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return DAILY_INSPIRATION_VERSES[dayOfYear % DAILY_INSPIRATION_VERSES.length];
  });
  const [copiedVerse, setCopiedVerse] = useState(false);

  // Recalculate prayer times every second to keep live countdown accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setSchedule(calculatePrayerTimes(new Date(), preferences));
    }, 1000);
    return () => clearInterval(timer);
  }, [preferences]);

  const hijri = getHijriDate(new Date(), preferences.hijriAdjustmentDays);

  // Calculate daily habit completion
  const prayersCheckedCount = Object.values(todayHabit.prayers).filter(Boolean).length;
  const habitCompletionRate = Math.round((prayersCheckedCount / 5) * 100);

  const handleCopyVerse = () => {
    navigator.clipboard.writeText(
      `"${dailyVerse.arabic}"\n${dailyVerse.translation} — ${dailyVerse.surah}`
    );
    setCopiedVerse(true);
    setTimeout(() => setCopiedVerse(false), 2000);
  };

  return (
    <div id="home-dashboard-view" className="space-y-4 pb-20">
      {/* 1. iOS Hero Widget: Live Prayer Countdown */}
      <section
        id="hero-prayer-card"
        className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#005D56] via-[#004B46] to-[#003834] text-white p-5 shadow-sm border border-black/10"
      >
        {/* iOS subtle concentric geometric accents */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-white/10 opacity-30 pointer-events-none" />
        <div className="absolute right-4 -bottom-14 w-36 h-36 rounded-full border border-white/10 opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
              <Clock className="w-3 h-3 text-teal-200" />
              <span>Next: {schedule.nextPrayer?.name || "Fajr"}</span>
            </div>
            <span className="text-xs font-semibold tracking-wide text-teal-200 font-mono">
              {schedule.nextPrayer?.time}
            </span>
          </div>

          {/* Large SF Pro Countdown Display */}
          <div className="my-3.5">
            <p className="text-[11px] uppercase tracking-wider text-teal-200/80 font-medium">
              Time Remaining
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono mt-0.5">
              {schedule.timeRemainingToNext}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-teal-100/80">
              <MapPin className="w-3 h-3 text-teal-300" />
              <span>{preferences.city}</span>
              <span className="opacity-40">•</span>
              <span>Qiyam: {schedule.qiyam}</span>
            </div>
          </div>

          {/* iOS Inset Ribbon for All 6 Times */}
          <div className="grid grid-cols-6 gap-1 pt-3 border-t border-white/10">
            {schedule.items.map((item) => {
              const isNext = item.isNext;
              const isPassed = item.isPassed;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center py-1.5 rounded-xl text-center transition-all ${
                    isNext
                      ? "bg-white/20 text-white font-semibold backdrop-blur-md"
                      : isPassed
                      ? "text-teal-200/50"
                      : "text-teal-100/90"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-tight">{item.name}</span>
                  <span className="text-[11px] font-bold mt-0.5 font-mono">{item.time}</span>
                  <span className="text-[9px] text-teal-200/70 font-arabic">{item.arabicName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. iOS Health/Activity Style: Daily Spiritual Habits Ring & Prayers */}
      <section
        id="spiritual-habits-widget"
        className="ios-card p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[10px] bg-[#34C759]/15 text-[#34C759] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1C1C1E] tracking-tight">
                Spiritual Habits (Muhasabah)
              </h3>
              <p className="text-[11px] text-[#8E8E93]">Daily prayers & sunnah checklist</p>
            </div>
          </div>
          <button
            onClick={() => navigate("habits")}
            className="text-xs font-semibold text-[#007A78] hover:opacity-80 flex items-center gap-0.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Prayers Interactive Checkboxes */}
        <div className="grid grid-cols-5 gap-1.5">
          {(
            [
              { key: "fajr", label: "Fajr", time: schedule.fajr },
              { key: "dhuhr", label: "Dhuhr", time: schedule.dhuhr },
              { key: "asr", label: "Asr", time: schedule.asr },
              { key: "maghrib", label: "Maghrib", time: schedule.maghrib },
              { key: "isha", label: "Isha", time: schedule.isha },
            ] as const
          ).map((prayer) => {
            const isDone = todayHabit.prayers[prayer.key];
            return (
              <button
                key={prayer.key}
                type="button"
                onClick={() => togglePrayerHabit(prayer.key)}
                className={`flex flex-col items-center justify-center p-2 rounded-[14px] border transition-all active:scale-95 cursor-pointer ${
                  isDone
                    ? "bg-[#34C759]/10 border-[#34C759]/30 text-[#1C1C1E]"
                    : "bg-[#F2F2F7] border-black/[0.04] text-[#1C1C1E] hover:bg-[#E5E5EA]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 transition-all ${
                    isDone
                      ? "bg-[#34C759] text-white shadow-xs"
                      : "border-[1.5px] border-[#C7C7CC] bg-white"
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] font-semibold leading-tight">{prayer.label}</span>
                <span className="text-[9px] text-[#8E8E93] font-mono mt-0.5">{prayer.time}</span>
              </button>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px]">
          <span className="text-[#8E8E93]">
            <span className="font-semibold text-[#1C1C1E]">{prayersCheckedCount} of 5</span> prayers logged today
          </span>
          <div className="w-20 bg-[#E5E5EA] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#34C759] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${habitCompletionRate}%` }}
            />
          </div>
        </div>
      </section>

      {/* 3. iOS Apps Grid (App Clips / Home Widgets aesthetic) */}
      <section id="mini-apps-grid" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93]">
            Integrated Mini Apps
          </h3>
          <span className="text-[11px] text-[#8E8E93]">10 Apps</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* 1. Prayer Times */}
          <button
            type="button"
            onClick={() => navigate("prayer")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#007A78]/10 text-[#007A78] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Prayer Times</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#007A78] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                Timetable, Adhan & Qiyam
              </p>
            </div>
          </button>

          {/* 2. Holy Quran */}
          <button
            type="button"
            onClick={() => navigate("quran")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#34C759]/10 text-[#34C759] flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Holy Quran</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#34C759] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                114 Surahs, Audio & Bookmarks
              </p>
            </div>
          </button>

          {/* 3. Qibla Compass */}
          <button
            type="button"
            onClick={() => navigate("qibla")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Qibla Compass</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#007AFF] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                Bearing & distance to Kaaba
              </p>
            </div>
          </button>

          {/* 4. Digital Tasbih */}
          <button
            type="button"
            onClick={() => navigate("tasbih")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center mb-3">
              <CircleDot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Smart Tasbih</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#FF9500] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                {lifetimeDhikrCount} lifetime dhikr
              </p>
            </div>
          </button>

          {/* 5. Daily Adhkar */}
          <button
            type="button"
            onClick={() => navigate("adhkar")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#FF2D55]/10 text-[#FF2D55] flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Daily Adhkar</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#FF2D55] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                Hisn al-Muslim fortress
              </p>
            </div>
          </button>

          {/* 6. Ask Ilm AI */}
          <button
            type="button"
            onClick={() => navigate("ai")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group bg-gradient-to-br from-white to-[#5856D6]/5"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#5856D6]/15 text-[#5856D6] flex items-center justify-center mb-3">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Ask Ilm AI</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#5856D6]" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                Gemini knowledge assistant
              </p>
            </div>
          </button>

          {/* 7. Zakat Calculator */}
          <button
            type="button"
            onClick={() => navigate("zakat")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#00897B]/10 text-[#00897B] flex items-center justify-center mb-3">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Zakat</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#00897B] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                Nisab & wealth calculation
              </p>
            </div>
          </button>

          {/* 8. Halal & Mosques */}
          <button
            type="button"
            onClick={() => navigate("places")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#32ADE6]/10 text-[#32ADE6] flex items-center justify-center mb-3">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Halal & Mosques</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#32ADE6] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                Nearby Masajid & dining
              </p>
            </div>
          </button>

          {/* 9. Habit Tracker */}
          <button
            type="button"
            onClick={() => navigate("habits")}
            className="ios-card p-3.5 flex flex-col items-start justify-between text-left active:scale-[0.97] transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">Habit Tracker</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#AF52DE] transition-colors" />
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 line-clamp-1">
                Fasting, Sunnah & Quran log
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 4. iOS Quote Card: Daily Ayah Inspiration */}
      <section
        id="daily-ayah-card"
        className="ios-card p-4 space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#007A78]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayah of the Day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#8E8E93]">{dailyVerse.surah}</span>
            <button
              type="button"
              onClick={handleCopyVerse}
              className="p-1 rounded-md text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer"
              title="Copy Ayah"
            >
              {copiedVerse ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <p dir="rtl" className="font-arabic text-xl sm:text-2xl text-right text-[#1C1C1E] leading-relaxed my-2 font-normal">
          {dailyVerse.arabic}
        </p>

        <p className="text-xs sm:text-sm text-[#3A3A3C] leading-relaxed italic">
          "{dailyVerse.translation}"
        </p>
      </section>
    </div>
  );
};
