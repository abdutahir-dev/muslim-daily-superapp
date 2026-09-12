import React, { useState, useMemo, useEffect } from "react";
import {
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  Volume2,
  VolumeX,
  Lock,
  User as UserIcon,
  Sparkles,
  MapPin,
  RefreshCw,
  Clock,
  Heart,
  Flame,
  X,
  Moon,
  Sun,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { calculatePrayerTimes } from "../lib/prayerTimes";
import { SolatyDayTracking } from "../types";

interface SolatySanctuaryAppProps {
  onSwitchToTimetable?: () => void;
  onOpenAuth?: () => void;
  onOpenSettings?: () => void;
}

export const SolatySanctuaryApp: React.FC<SolatySanctuaryAppProps> = ({
  onSwitchToTimetable,
  onOpenAuth,
  onOpenSettings,
}) => {
  const {
    user,
    isAuthenticated,
    preferences,
    getSolatyTracking,
    toggleSolatyPrayer,
    toggleSolatySunnah,
    toggleSolatyNafl,
    setSolatyFasting,
    setSolatyJournal,
    updateSolatyTracking,
    requestGeolocation,
    signInWithGoogle,
  } = useAuth();

  // Active viewing date state (defaults to today in YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Active secondary tab (nawafil, fast, journal)
  const [activeTab, setActiveTab] = useState<"nawafil" | "fast" | "journal">("nawafil");

  // Modals state
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptActionName, setAuthPromptActionName] = useState<string>("track prayers");
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [detailPrayerKey, setDetailPrayerKey] = useState<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | null>(null);

  // Audio adhan preview
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [audioRef] = useState<HTMLAudioElement | null>(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("https://cdn.aladhan.com/audio/adhans/c2.mp3");
      audio.preload = "none";
      return audio;
    }
    return null;
  });

  const toggleAdhanPreview = () => {
    if (!audioRef) return;
    if (isPlayingAdhan) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsPlayingAdhan(false);
    } else {
      audioRef.play().catch((err) => console.warn("Audio play prevented:", err));
      setIsPlayingAdhan(true);
      audioRef.onended = () => setIsPlayingAdhan(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
    };
  }, [audioRef]);

  // Derive target date object
  const activeDateObj = useMemo(() => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [selectedDate]);

  // Compute astronomical prayer times for the active date
  const schedule = useMemo(() => {
    return calculatePrayerTimes(activeDateObj, preferences);
  }, [activeDateObj, preferences]);

  // Get tracking data for active date
  const dayTracking: SolatyDayTracking = useMemo(() => {
    return getSolatyTracking(selectedDate);
  }, [selectedDate, getSolatyTracking]);

  // Generate 7 days centered around selected date
  const weekDays = useMemo(() => {
    const days: { dateStr: string; dayAbbr: string; dayNum: number; isSelected: boolean; isToday: boolean }[] = [];
    const baseDate = new Date(activeDateObj);
    // Find Monday of the current week
    const currentDay = baseDate.getDay(); // 0 is Sunday, 1 is Monday
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayAbbr = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      const dayNum = d.getDate();
      days.push({
        dateStr,
        dayAbbr,
        dayNum,
        isSelected: dateStr === selectedDate,
        isToday: dateStr === todayStr,
      });
    }
    return days;
  }, [activeDateObj, selectedDate, todayStr]);

  // Shift week
  const shiftWeek = (offsetDays: number) => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    let completedCount = 0;
    let onTimeCount = 0;
    let jamaahCount = 0;

    (["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).forEach((key) => {
      const p = dayTracking.prayers[key];
      if (p.completed) {
        completedCount++;
        if (p.onTime !== false && !p.isLate) onTimeCount++;
        if (p.inJamaah) jamaahCount++;
      }
    });

    return { completedCount, onTimeCount, jamaahCount };
  }, [dayTracking]);

  // Auth gate interceptor
  const requireAuth = (actionName: string, callback: () => void) => {
    if (!isAuthenticated) {
      setAuthPromptActionName(actionName);
      setShowAuthPrompt(true);
      return;
    }
    callback();
  };

  // Handling Google sign-in directly from prompt
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowAuthPrompt(false);
    } catch (err) {
      console.warn("Google sign-in error:", err);
    }
  };

  // Map prayer times from schedule
  const prayerTimesMap = useMemo(() => {
    const map: Record<string, string> = {
      fajr: "05:18",
      dhuhr: "12:22",
      asr: "15:45",
      maghrib: "18:28",
      isha: "19:26",
      witr: "19:26",
    };
    if (schedule?.items) {
      schedule.items.forEach((item) => {
        if (map[item.id] !== undefined) {
          map[item.id] = item.time;
        }
      });
      // Witr follows Isha or custom timing
      const ishaItem = schedule.items.find((i) => i.id === "isha");
      if (ishaItem) {
        map.witr = ishaItem.time;
      }
    }
    return map;
  }, [schedule]);

  return (
    <div id="solaty-sanctuary-container" className="flex flex-col gap-3 pb-8">
      {/* 1. Header Bar: Logo & App Title + Profile Avatar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-b from-[#00897B] to-[#00695C] text-white flex items-center justify-center shadow-xs">
            <Moon className="w-4 h-4 text-teal-100" />
          </div>
          <span className="text-base font-semibold text-[#1C1C1E] tracking-tight">Muslim Daily</span>
        </div>

        {/* Profile Avatar / Auth Trigger */}
        <button
          type="button"
          onClick={() => {
            if (onOpenAuth) onOpenAuth();
          }}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          title={isAuthenticated ? user?.email || "Account" : "Sign in / Register"}
        >
          {user && !user.isAnonymous && user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Avatar"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#007A78]/30"
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isAuthenticated
                  ? "bg-[#007A78] text-white"
                  : "bg-[#767680]/15 text-[#1C1C1E] border border-dashed border-[#767680]/40"
              }`}
            >
              {isAuthenticated ? (user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          )}
        </button>
      </div>

      {/* 2. Solaty Title Row & Action Buttons */}
      <div className="flex items-center justify-between mt-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1C1E] leading-none">Solaty</h1>
          <p className="text-xs text-[#8E8E93] mt-1 font-normal">Prayer Sanctuary</p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Adhan Audio Bell */}
          <button
            type="button"
            onClick={toggleAdhanPreview}
            title={isPlayingAdhan ? "Stop Adhan" : "Preview Adhan Audio"}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              isPlayingAdhan
                ? "bg-[#FF9500] text-white shadow-xs"
                : "bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:bg-[#F2F2F7]"
            }`}
          >
            {isPlayingAdhan ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Bell className="w-4 h-4 text-[#1C1C1E]" />}
          </button>

          {/* Analytics / Stats Modal */}
          <button
            type="button"
            onClick={() => setShowStatsModal(true)}
            title="Prayer Analytics & Streaks"
            className="w-9 h-9 rounded-full bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:bg-[#F2F2F7] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#1C1C1E]" />
          </button>

          {/* Switch to Full Timetable View */}
          {onSwitchToTimetable && (
            <button
              type="button"
              onClick={onSwitchToTimetable}
              title="Full Prayer Timetable"
              className="w-9 h-9 rounded-full bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:bg-[#F2F2F7] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#1C1C1E]" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Location Row */}
      <div className="flex items-center justify-between text-xs text-[#8E8E93]">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#007A78] shrink-0" />
          <span className="truncate">
            Detected Location:{" "}
            <strong className="font-semibold text-[#1C1C1E]">
              {preferences.city || "Walmara"}, {preferences.country || "Ethiopia"}
            </strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => requestGeolocation()}
          className="p-1 rounded-full hover:bg-black/5 active:scale-95 text-[#007A78] cursor-pointer"
          title="Update GPS"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* 4. Unauthenticated Warning / Suggestion Banner (If Guest or not logged in) */}
      {!isAuthenticated && (
        <div className="rounded-2xl p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">Sign In to Track Your Solaty</p>
              <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
                Prayer tracking, Jama&apos;ah records, and streak histories are securely saved to your account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenAuth) onOpenAuth();
              else setShowAuthPrompt(true);
            }}
            className="shrink-0 px-3 py-1.5 rounded-full bg-[#007A78] hover:bg-[#00695C] active:scale-95 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Sign In
          </button>
        </div>
      )}

      {/* 5. Next Prayer Card */}
      <div className="rounded-2xl bg-white border border-[#E5E5EA] p-4 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">NEXT PRAYER</span>
          <h2 className="text-2xl font-black text-[#007A78] tracking-tight mt-0.5">
            {schedule?.nextPrayer?.name || "Dhuhr"}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-[#1C1C1E] font-mono">
            {schedule?.nextPrayer?.time || "12:22"}
          </span>
          <p className="text-xs text-[#8E8E93] font-mono mt-0.5">
            in {schedule?.timeRemainingToNext || "1h 56m"}
          </p>
        </div>
      </div>

      {/* 6. Metric Bar (3 Columns: COMPLETED, ON TIME, JAMAAH) */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-white border border-[#E5E5EA] p-3 shadow-xs">
          <span className="text-[10px] font-bold text-[#8E8E93] tracking-wider uppercase">COMPLETED</span>
          <p className="text-2xl font-black text-[#1C1C1E] mt-0.5 font-mono">{metrics.completedCount}</p>
        </div>
        <div className="rounded-2xl bg-white border border-[#E5E5EA] p-3 shadow-xs">
          <span className="text-[10px] font-bold text-[#2563EB] tracking-wider uppercase">ON TIME</span>
          <p className="text-2xl font-black text-[#2563EB] mt-0.5 font-mono">{metrics.onTimeCount}</p>
        </div>
        <div className="rounded-2xl bg-white border border-[#E5E5EA] p-3 shadow-xs">
          <span className="text-[10px] font-bold text-[#16A34A] tracking-wider uppercase">JAMAAH</span>
          <p className="text-2xl font-black text-[#16A34A] mt-0.5 font-mono">{metrics.jamaahCount}</p>
        </div>
      </div>

      {/* 7. Date Row & Week Strip */}
      <div className="flex flex-col gap-2">
        {/* Date header & Picker Button */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-[#1C1C1E] font-mono">{selectedDate}</span>
          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#E5E5EA] hover:bg-[#F2F2F7] active:scale-95 text-[#1C1C1E] shadow-2xs transition-all cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#007A78]" />
            <span>Select</span>
          </button>
        </div>

        {/* 7-Day Week Strip with Arrows */}
        <div className="flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => shiftWeek(-7)}
            title="Previous Week"
            className="w-7 h-12 rounded-xl flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 grid grid-cols-7 gap-1">
            {weekDays.map((d) => (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={`flex flex-col items-center py-2 px-0.5 rounded-xl text-center transition-all active:scale-95 cursor-pointer ${
                  d.isSelected
                    ? "border-2 border-[#007A78] bg-[#007A78]/10 text-[#007A78] shadow-xs"
                    : "bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:bg-[#F2F2F7]"
                }`}
              >
                <span className={`text-[9px] font-bold tracking-tight ${d.isSelected ? "text-[#007A78]" : "text-[#8E8E93]"}`}>
                  {d.dayAbbr}
                </span>
                <span className={`text-sm font-bold mt-0.5 font-mono ${d.isSelected ? "text-[#007A78]" : "text-[#1C1C1E]"}`}>
                  {d.dayNum}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => shiftWeek(7)}
            title="Next Week"
            className="w-7 h-12 rounded-xl flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 8. Obligatory & Sunnah Section */}
      <div className="flex flex-col gap-2 mt-1">
        <h3 className="text-sm font-bold text-[#1C1C1E] px-1">Obligatory &amp; Sunnah</h3>

        <div className="rounded-2xl bg-white border border-[#E5E5EA] divide-y divide-[#E5E5EA] overflow-hidden shadow-xs">
          {/* FAJR */}
          <div className="p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Checkbox Circle */}
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Fajr prayer", () => toggleSolatyPrayer(selectedDate, "fajr"))
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.prayers.fajr.completed
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.prayers.fajr.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1C1C1E]">Fajr</span>
                    <span className="text-xs text-[#8E8E93] font-mono">{prayerTimesMap.fajr}</span>
                    {dayTracking.prayers.fajr.completed && dayTracking.prayers.fajr.onTime && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white">
                        ON TIME
                      </span>
                    )}
                    {dayTracking.prayers.fajr.completed && dayTracking.prayers.fajr.inJamaah && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white">
                        JAMAAH
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chevron to open detail sheet */}
              <button
                type="button"
                onClick={() =>
                  requireAuth("edit Fajr details", () => setDetailPrayerKey("fajr"))
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Nested Sub-item: Fajr Sunnah */}
            <div className="pl-9 pr-1 flex items-center justify-between pt-1 border-t border-[#F2F2F7]">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Sunnah prayer", () =>
                      toggleSolatySunnah(selectedDate, "fajr_sunnah")
                    )
                  }
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.sunnah.fajr_sunnah
                      ? "bg-[#16A34A] text-white"
                      : "border-2 border-[#D1D1D6] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.sunnah.fajr_sunnah && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-xs font-medium text-[#3A3A3C]">Sunnah (2 Rak&apos;at)</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("edit Sunnah prayer", () =>
                    toggleSolatySunnah(selectedDate, "fajr_sunnah")
                  )
                }
                className="text-[#C7C7CC] hover:text-[#8E8E93] p-1 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* DHUHR */}
          <div className="p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Dhuhr prayer", () => toggleSolatyPrayer(selectedDate, "dhuhr"))
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.prayers.dhuhr.completed
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.prayers.dhuhr.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1C1C1E]">Dhuhr</span>
                    <span className="text-xs text-[#8E8E93] font-mono">{prayerTimesMap.dhuhr}</span>
                    {dayTracking.prayers.dhuhr.completed && dayTracking.prayers.dhuhr.onTime && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white">
                        ON TIME
                      </span>
                    )}
                    {dayTracking.prayers.dhuhr.completed && dayTracking.prayers.dhuhr.inJamaah && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white">
                        JAMAAH
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  requireAuth("edit Dhuhr details", () => setDetailPrayerKey("dhuhr"))
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Nested Sub-items: Qebliyah & Baediyah */}
            <div className="pl-9 pr-1 flex flex-col gap-1.5 pt-1 border-t border-[#F2F2F7]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      requireAuth("track Qebliyah", () =>
                        toggleSolatySunnah(selectedDate, "dhuhr_qebliyah")
                      )
                    }
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      dayTracking.sunnah.dhuhr_qebliyah
                        ? "bg-[#16A34A] text-white"
                        : "border-2 border-[#D1D1D6] hover:border-[#16A34A]"
                    }`}
                  >
                    {dayTracking.sunnah.dhuhr_qebliyah && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span className="text-xs font-medium text-[#3A3A3C]">Qebliyah (4 Rak&apos;at)</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Qebliyah", () =>
                      toggleSolatySunnah(selectedDate, "dhuhr_qebliyah")
                    )
                  }
                  className="text-[#C7C7CC] hover:text-[#8E8E93] p-1 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      requireAuth("track Baediyah", () =>
                        toggleSolatySunnah(selectedDate, "dhuhr_baediyah")
                      )
                    }
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      dayTracking.sunnah.dhuhr_baediyah
                        ? "bg-[#16A34A] text-white"
                        : "border-2 border-[#D1D1D6] hover:border-[#16A34A]"
                    }`}
                  >
                    {dayTracking.sunnah.dhuhr_baediyah && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span className="text-xs font-medium text-[#3A3A3C]">Baediyah (2 Rak&apos;at)</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Baediyah", () =>
                      toggleSolatySunnah(selectedDate, "dhuhr_baediyah")
                    )
                  }
                  className="text-[#C7C7CC] hover:text-[#8E8E93] p-1 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ASR */}
          <div className="p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Asr prayer", () => toggleSolatyPrayer(selectedDate, "asr"))
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.prayers.asr.completed
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.prayers.asr.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1C1C1E]">Asr</span>
                    <span className="text-xs text-[#8E8E93] font-mono">{prayerTimesMap.asr}</span>
                    {dayTracking.prayers.asr.completed && dayTracking.prayers.asr.onTime && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white">
                        ON TIME
                      </span>
                    )}
                    {dayTracking.prayers.asr.completed && dayTracking.prayers.asr.inJamaah && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white">
                        JAMAAH
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  requireAuth("edit Asr details", () => setDetailPrayerKey("asr"))
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Nested Sub-item: Asr Qebliyah */}
            <div className="pl-9 pr-1 flex items-center justify-between pt-1 border-t border-[#F2F2F7]">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Asr Qebliyah", () =>
                      toggleSolatySunnah(selectedDate, "asr_qebliyah")
                    )
                  }
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.sunnah.asr_qebliyah
                      ? "bg-[#16A34A] text-white"
                      : "border-2 border-[#D1D1D6] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.sunnah.asr_qebliyah && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-xs font-medium text-[#3A3A3C]">Qebliyah (Sunnah)</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Asr Qebliyah", () =>
                    toggleSolatySunnah(selectedDate, "asr_qebliyah")
                  )
                }
                className="text-[#C7C7CC] hover:text-[#8E8E93] p-1 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MAGHRIB */}
          <div className="p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Maghrib prayer", () => toggleSolatyPrayer(selectedDate, "maghrib"))
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.prayers.maghrib.completed
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.prayers.maghrib.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1C1C1E]">Maghrib</span>
                    <span className="text-xs text-[#8E8E93] font-mono">{prayerTimesMap.maghrib}</span>
                    {dayTracking.prayers.maghrib.completed && dayTracking.prayers.maghrib.onTime && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white">
                        ON TIME
                      </span>
                    )}
                    {dayTracking.prayers.maghrib.completed && dayTracking.prayers.maghrib.inJamaah && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white">
                        JAMAAH
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  requireAuth("edit Maghrib details", () => setDetailPrayerKey("maghrib"))
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Nested Sub-item: Maghrib Baediyah */}
            <div className="pl-9 pr-1 flex items-center justify-between pt-1 border-t border-[#F2F2F7]">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Maghrib Baediyah", () =>
                      toggleSolatySunnah(selectedDate, "maghrib_baediyah")
                    )
                  }
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.sunnah.maghrib_baediyah
                      ? "bg-[#16A34A] text-white"
                      : "border-2 border-[#D1D1D6] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.sunnah.maghrib_baediyah && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-xs font-medium text-[#3A3A3C]">Baediyah (2 Rak&apos;at)</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Maghrib Baediyah", () =>
                    toggleSolatySunnah(selectedDate, "maghrib_baediyah")
                  )
                }
                className="text-[#C7C7CC] hover:text-[#8E8E93] p-1 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ISHA */}
          <div className="p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Isha prayer", () => toggleSolatyPrayer(selectedDate, "isha"))
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.prayers.isha.completed
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.prayers.isha.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1C1C1E]">Isha</span>
                    <span className="text-xs text-[#8E8E93] font-mono">{prayerTimesMap.isha}</span>
                    {dayTracking.prayers.isha.completed && dayTracking.prayers.isha.onTime && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white">
                        ON TIME
                      </span>
                    )}
                    {dayTracking.prayers.isha.completed && dayTracking.prayers.isha.inJamaah && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white">
                        JAMAAH
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  requireAuth("edit Isha details", () => setDetailPrayerKey("isha"))
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Nested Sub-item: Isha Baediyah */}
            <div className="pl-9 pr-1 flex items-center justify-between pt-1 border-t border-[#F2F2F7]">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Isha Baediyah", () =>
                      toggleSolatySunnah(selectedDate, "isha_baediyah")
                    )
                  }
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.sunnah.isha_baediyah
                      ? "bg-[#16A34A] text-white"
                      : "border-2 border-[#D1D1D6] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.sunnah.isha_baediyah && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-xs font-medium text-[#3A3A3C]">Baediyah (2 Rak&apos;at)</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Isha Baediyah", () =>
                    toggleSolatySunnah(selectedDate, "isha_baediyah")
                  )
                }
                className="text-[#C7C7CC] hover:text-[#8E8E93] p-1 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WITR */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Witr prayer", () =>
                    toggleSolatySunnah(selectedDate, "witr")
                  )
                }
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  dayTracking.sunnah.witr
                    ? "bg-[#16A34A] text-white shadow-xs"
                    : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                }`}
              >
                {dayTracking.sunnah.witr && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1C1C1E]">Witr</span>
                <span className="text-xs text-[#8E8E93] font-mono">{prayerTimesMap.witr}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                requireAuth("track Witr prayer", () =>
                  toggleSolatySunnah(selectedDate, "witr")
                )
              }
              className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 9. Segment Tabs: [Nawafil (Optional)]  [Fast Tracking]  [Spiritual Journal] */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center border-b border-[#E5E5EA]">
          <button
            type="button"
            onClick={() => setActiveTab("nawafil")}
            className={`pb-2.5 px-3 text-xs font-semibold tracking-tight transition-all relative cursor-pointer ${
              activeTab === "nawafil" ? "text-[#007A78]" : "text-[#8E8E93] hover:text-[#1C1C1E]"
            }`}
          >
            Nawafil (Optional)
            {activeTab === "nawafil" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007A78] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fast")}
            className={`pb-2.5 px-3 text-xs font-semibold tracking-tight transition-all relative cursor-pointer ${
              activeTab === "fast" ? "text-[#007A78]" : "text-[#8E8E93] hover:text-[#1C1C1E]"
            }`}
          >
            Fast Tracking
            {activeTab === "fast" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007A78] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("journal")}
            className={`pb-2.5 px-3 text-xs font-semibold tracking-tight transition-all relative cursor-pointer ${
              activeTab === "journal" ? "text-[#007A78]" : "text-[#8E8E93] hover:text-[#1C1C1E]"
            }`}
          >
            Spiritual Journal
            {activeTab === "journal" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007A78] rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Nawafil (Optional) */}
        {activeTab === "nawafil" && (
          <div className="rounded-2xl bg-white border border-[#E5E5EA] divide-y divide-[#E5E5EA] overflow-hidden shadow-xs">
            {/* DUHA */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Duha prayer", () => toggleSolatyNafl(selectedDate, "duha"))
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.nawafil.duha
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.nawafil.duha && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <span className="text-sm font-bold text-[#1C1C1E]">Duha</span>
                  <p className="text-[11px] text-[#8E8E93]">Forenoon Salat al-Duha (2–8 Rak&apos;at)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Duha prayer", () => toggleSolatyNafl(selectedDate, "duha"))
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* TAHAJJUD */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Tahajjud prayer", () =>
                      toggleSolatyNafl(selectedDate, "tahajjud")
                    )
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.nawafil.tahajjud
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.nawafil.tahajjud && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <span className="text-sm font-bold text-[#1C1C1E]">Tahajjud</span>
                  <p className="text-[11px] text-[#8E8E93]">Night Vigil &amp; Qiyam al-Layl</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Tahajjud prayer", () =>
                    toggleSolatyNafl(selectedDate, "tahajjud")
                  )
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* ISHRAQ */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Ishraq prayer", () =>
                      toggleSolatyNafl(selectedDate, "ishraq")
                    )
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.nawafil.ishraq
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.nawafil.ishraq && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <span className="text-sm font-bold text-[#1C1C1E]">Ishraq</span>
                  <p className="text-[11px] text-[#8E8E93]">15–20 mins post-sunrise prayer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Ishraq prayer", () =>
                    toggleSolatyNafl(selectedDate, "ishraq")
                  )
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* AWWABIN */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    requireAuth("track Awwabin prayer", () =>
                      toggleSolatyNafl(selectedDate, "awwabin")
                    )
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    dayTracking.nawafil.awwabin
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "border-2 border-[#C7C7CC] hover:border-[#16A34A]"
                  }`}
                >
                  {dayTracking.nawafil.awwabin && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <span className="text-sm font-bold text-[#1C1C1E]">Awwabin</span>
                  <p className="text-[11px] text-[#8E8E93]">Post-Maghrib voluntary prayer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  requireAuth("track Awwabin prayer", () =>
                    toggleSolatyNafl(selectedDate, "awwabin")
                  )
                }
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Fast Tracking */}
        {activeTab === "fast" && (
          <div className="rounded-2xl bg-white border border-[#E5E5EA] p-4 flex flex-col gap-3 shadow-xs">
            <div>
              <span className="text-xs font-bold text-[#1C1C1E]">Fasting Status for this Day</span>
              <p className="text-[11px] text-[#8E8E93]">Record your voluntary or obligatory fast.</p>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5">
              {[
                { id: "none", label: "None / Not Fasting" },
                { id: "ramadan", label: "Ramadan" },
                { id: "sunnah_mon", label: "Mon Sunnah" },
                { id: "sunnah_thu", label: "Thu Sunnah" },
                { id: "white_days", label: "White Days (13-15)" },
                { id: "voluntary", label: "Voluntary (Nafl)" },
                { id: "qada", label: "Qada (Make-up)" },
              ].map((f) => {
                const isSelected = dayTracking.fasting === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      requireAuth("record Fasting", () =>
                        setSolatyFasting(selectedDate, f.id as any)
                      )
                    }
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#007A78] text-white shadow-xs"
                        : "bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E]"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Fasting Timing Window */}
            <div className="mt-1 p-3 rounded-xl bg-[#F2F2F7] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8E8E93]">Suhur Ends (Fajr)</span>
                <p className="font-mono font-bold text-[#1C1C1E]">{prayerTimesMap.fajr}</p>
              </div>
              <div className="h-6 w-px bg-[#C7C7CC]" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8E8E93]">Iftar Begins (Maghrib)</span>
                <p className="font-mono font-bold text-[#007A78]">{prayerTimesMap.maghrib}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Spiritual Journal */}
        {activeTab === "journal" && (
          <div className="rounded-2xl bg-white border border-[#E5E5EA] p-4 flex flex-col gap-3 shadow-xs">
            <div>
              <span className="text-xs font-bold text-[#1C1C1E]">Spiritual Muhasabah &amp; Journal</span>
              <p className="text-[11px] text-[#8E8E93]">Capture your state of heart, gratitude, and du&apos;a.</p>
            </div>

            {/* Mood selector */}
            <div>
              <span className="text-[10px] font-bold uppercase text-[#8E8E93]">State of Heart</span>
              <div className="flex items-center gap-1.5 mt-1 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: "peaceful", label: "Peaceful (سكينة)" },
                  { id: "grateful", label: "Grateful (شكر)" },
                  { id: "hopeful", label: "Hopeful (رجاء)" },
                  { id: "seeking_forgiveness", label: "Repentant (توبة)" },
                  { id: "struggling", label: "Striving (جهاد)" },
                ].map((m) => {
                  const isSelected = (dayTracking.journal?.mood || "peaceful") === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        requireAuth("update Spiritual Journal", () =>
                          setSolatyJournal(selectedDate, { mood: m.id as any })
                        )
                      }
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? "bg-[#007A78] text-white shadow-2xs"
                          : "bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#3A3A3C]"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reflection note input */}
            <div>
              <span className="text-[10px] font-bold uppercase text-[#8E8E93]">Daily Reflection</span>
              <textarea
                rows={3}
                value={dayTracking.journal?.note || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  requireAuth("write Journal Note", () => {
                    setSolatyJournal(selectedDate, { note: val });
                  });
                }}
                placeholder="What touched your heart in today's prayer or Quran reading?..."
                className="w-full mt-1 p-2.5 rounded-xl bg-[#F2F2F7] border border-[#E5E5EA] text-xs text-[#1C1C1E] focus:bg-white focus:border-[#007A78] focus:outline-none transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* 10. AUTH SUGGESTION MODAL / SHEET (Triggered when unauthenticated user attempts to track) */}
      {showAuthPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl flex flex-col gap-4 border border-black/[0.08]">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#007A78]/10 text-[#007A78] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1C1C1E] tracking-tight">
                Sign In to Track Your Solaty
              </h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed mt-1">
                To {authPromptActionName}, please sign in or create an account. Your Fardh prayers, Sunnah, Jama&apos;ah records, and spiritual milestones are securely preserved with your account across all devices.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1C1C1E] hover:bg-black active:scale-98 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthPrompt(false);
                  if (onOpenAuth) onOpenAuth();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#007A78] hover:bg-[#00695C] active:scale-98 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>Sign In or Register with Email</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="w-full py-2 px-4 rounded-xl text-xs font-medium text-[#8E8E93] hover:text-[#1C1C1E] transition-all cursor-pointer text-center"
              >
                Browse in Preview Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. PRAYER DETAIL BOTTOM SHEET / MODAL */}
      {detailPrayerKey && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl flex flex-col gap-4 border border-black/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] capitalize">
                  {detailPrayerKey} Record
                </h3>
                <p className="text-xs text-[#8E8E93] font-mono">{selectedDate}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailPrayerKey(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prayer Completed status toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F2F2F7]">
              <div>
                <span className="text-xs font-bold text-[#1C1C1E]">Mark as Performed</span>
                <p className="text-[11px] text-[#8E8E93]">Completed this prayer today</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  requireAuth(`update ${detailPrayerKey} prayer`, () => {
                    toggleSolatyPrayer(selectedDate, detailPrayerKey);
                  });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  dayTracking.prayers[detailPrayerKey].completed ? "bg-[#16A34A]" : "bg-[#C7C7CC]"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    dayTracking.prayers[detailPrayerKey].completed ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* On-Time vs Late Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F2F2F7]">
              <div>
                <span className="text-xs font-bold text-[#1C1C1E]">Prayed On Time</span>
                <p className="text-[11px] text-[#8E8E93]">Performed within its prescribed window</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  requireAuth(`update ${detailPrayerKey} timing`, () => {
                    const current = dayTracking.prayers[detailPrayerKey];
                    updateSolatyTracking(selectedDate, {
                      prayers: {
                        ...dayTracking.prayers,
                        [detailPrayerKey]: {
                          ...current,
                          onTime: !current.onTime,
                          isLate: current.onTime,
                        },
                      },
                    });
                  });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  dayTracking.prayers[detailPrayerKey].onTime ? "bg-[#2563EB]" : "bg-[#C7C7CC]"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    dayTracking.prayers[detailPrayerKey].onTime ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* In Jama'ah Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F2F2F7]">
              <div>
                <span className="text-xs font-bold text-[#1C1C1E]">In Jama&apos;ah (Mosque)</span>
                <p className="text-[11px] text-[#8E8E93]">Multiplied 27x reward</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  requireAuth(`update ${detailPrayerKey} congregation`, () => {
                    const current = dayTracking.prayers[detailPrayerKey];
                    updateSolatyTracking(selectedDate, {
                      prayers: {
                        ...dayTracking.prayers,
                        [detailPrayerKey]: {
                          ...current,
                          inJamaah: !current.inJamaah,
                        },
                      },
                    });
                  });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  dayTracking.prayers[detailPrayerKey].inJamaah ? "bg-[#16A34A]" : "bg-[#C7C7CC]"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    dayTracking.prayers[detailPrayerKey].inJamaah ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDetailPrayerKey(null)}
              className="w-full py-2.5 rounded-xl bg-[#007A78] text-white text-xs font-semibold hover:bg-[#00695C] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 12. DATE PICKER MODAL */}
      {showDatePicker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl flex flex-col gap-3 border border-black/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1C1C1E]">Select Date</span>
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8E8E93] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  setShowDatePicker(false);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-[#E5E5EA] text-sm font-mono text-[#1C1C1E] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedDate(todayStr);
                setShowDatePicker(false);
              }}
              className="w-full py-2 rounded-xl bg-[#007A78]/10 text-[#007A78] text-xs font-semibold hover:bg-[#007A78]/20 cursor-pointer"
            >
              Jump to Today
            </button>
          </div>
        </div>
      )}

      {/* 13. STATS & ANALYTICS MODAL */}
      {showStatsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl flex flex-col gap-4 border border-black/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#007A78]" />
                <h3 className="text-base font-bold text-[#1C1C1E]">Prayer Analytics</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-[#F2F2F7] text-center">
                <span className="text-[10px] uppercase font-bold text-[#8E8E93]">Today Completed</span>
                <p className="text-2xl font-black text-[#1C1C1E] mt-0.5">{metrics.completedCount} / 5</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#F2F2F7] text-center">
                <span className="text-[10px] uppercase font-bold text-[#8E8E93]">Jama&apos;ah Rate</span>
                <p className="text-2xl font-black text-[#16A34A] mt-0.5">
                  {metrics.completedCount > 0
                    ? `${Math.round((metrics.jamaahCount / metrics.completedCount) * 100)}%`
                    : "0%"}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#007A78]/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[#007A78]">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Consistency Streak</span>
              </div>
              <p className="text-xs text-[#007A78] mt-1">
                Keep striving! Every prayer established brings barakah and divine tranquility to your day.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowStatsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1C1C1E] text-white text-xs font-semibold hover:bg-black cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
