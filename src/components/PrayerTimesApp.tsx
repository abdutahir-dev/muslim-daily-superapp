import React, { useState, useEffect } from "react";
import {
  Clock,
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  Sparkles,
  Sliders,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Info,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { calculatePrayerTimes, getHijriDate } from "../lib/prayerTimes";
import { CalculationMethod, JuristicSchool } from "../types";
import { ADHAN_AUDIO_SOURCES } from "../lib/soundUtils";
import { SolatySanctuaryApp } from "./SolatySanctuaryApp";

interface PrayerTimesAppProps {
  onOpenAuth?: () => void;
  onOpenSettings?: () => void;
}

export const PrayerTimesApp: React.FC<PrayerTimesAppProps> = ({
  onOpenAuth,
  onOpenSettings,
}) => {
  const { preferences, updatePreferences, requestGeolocation } = useAuth();
  const [viewMode, setViewMode] = useState<"sanctuary" | "timetable">("sanctuary");
  const [schedule, setSchedule] = useState(() => calculatePrayerTimes(new Date(), preferences));
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

  // Recalculate prayer schedule when preferences or selected day changes
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + selectedDayOffset);
    setSchedule(calculatePrayerTimes(targetDate, preferences));

    const interval = setInterval(() => {
      const liveDate = new Date();
      liveDate.setDate(liveDate.getDate() + selectedDayOffset);
      setSchedule(calculatePrayerTimes(liveDate, preferences));
    }, 1000);

    return () => clearInterval(interval);
  }, [preferences, selectedDayOffset]);

  if (viewMode === "sanctuary") {
    return (
      <SolatySanctuaryApp
        onSwitchToTimetable={() => setViewMode("timetable")}
        onOpenAuth={onOpenAuth}
        onOpenSettings={onOpenSettings}
      />
    );
  }

  const toggleAdhanPreview = () => {
    if (isPlayingAdhan && audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlayingAdhan(false);
      return;
    }

    const audioUrl = ADHAN_AUDIO_SOURCES[preferences.adhanVoice] || ADHAN_AUDIO_SOURCES.makkah;
    const audio = new Audio(audioUrl);
    audio.onended = () => setIsPlayingAdhan(false);
    audio.onerror = () => {
      setIsPlayingAdhan(false);
    };
    audio.play().catch(() => setIsPlayingAdhan(false));
    setAudioElement(audio);
    setIsPlayingAdhan(true);
  };

  const getPrayerIcon = (id: string) => {
    switch (id) {
      case "fajr":
        return <Moon className="w-4 h-4 text-[#5856D6]" />;
      case "sunrise":
        return <Sunrise className="w-4 h-4 text-[#FF9500]" />;
      case "dhuhr":
        return <Sun className="w-4 h-4 text-[#FF9500]" />;
      case "asr":
        return <Sun className="w-4 h-4 text-[#FF9500]" />;
      case "maghrib":
        return <Sunset className="w-4 h-4 text-[#FF2D55]" />;
      case "isha":
        return <Moon className="w-4 h-4 text-[#5856D6]" />;
      default:
        return <Clock className="w-4 h-4 text-[#007A78]" />;
    }
  };

  return (
    <div id="prayer-times-mini-app" className="space-y-4 pb-20">
      {/* Return to Solaty Sanctuary Button */}
      <button
        type="button"
        onClick={() => setViewMode("sanctuary")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#007A78]/10 text-[#007A78] hover:bg-[#007A78]/20 transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Solaty Prayer Sanctuary</span>
      </button>

      {/* iOS Navigation Header Card */}
      <div className="ios-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
              Prayer Timetable
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#007A78]/10 text-[#007A78] font-semibold">
              {preferences.calculationMethod}
            </span>
          </div>
          <p className="text-[11px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#007A78]" />
            <span>{preferences.city}, {preferences.country}</span>
            <button
              onClick={requestGeolocation}
              className="text-[#007A78] font-medium hover:underline ml-1 cursor-pointer"
            >
              (GPS Refresh)
            </button>
          </p>
        </div>

        {/* Adhan Audio Pill */}
        <button
          id="adhan-audio-preview-button"
          type="button"
          onClick={toggleAdhanPreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
            isPlayingAdhan
              ? "bg-[#FF9500] text-white shadow-xs"
              : "bg-[#007A78]/10 text-[#007A78] hover:bg-[#007A78]/15"
          }`}
        >
          {isPlayingAdhan ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlayingAdhan ? "Stop Audio" : `Adhan (${preferences.adhanVoice})`}</span>
        </button>
      </div>

      {/* iOS Horizontal Day Pill Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
          const d = new Date();
          d.setDate(d.getDate() + offset);
          const isSelected = selectedDayOffset === offset;
          const dayName = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : d.toLocaleDateString([], { weekday: "short" });
          const dayNum = d.getDate();

          return (
            <button
              key={offset}
              type="button"
              onClick={() => setSelectedDayOffset(offset)}
              className={`flex flex-col items-center min-w-[58px] py-2 px-1.5 rounded-[16px] text-center transition-all active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-[#007A78] text-white shadow-xs"
                  : "bg-white text-[#1C1C1E] border border-black/[0.06] hover:bg-[#F2F2F7]"
              }`}
            >
              <span className="text-[10px] font-medium opacity-80">{dayName}</span>
              <span className="text-sm font-bold font-mono mt-0.5">{dayNum}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Prayer Timetable (iOS Inset Grouped Table) */}
      <div className="ios-card overflow-hidden divide-y divide-black/[0.06]">
        {schedule.items.map((item) => {
          const isNext = item.isNext && selectedDayOffset === 0;
          const isCurrent = item.isCurrent && selectedDayOffset === 0;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3.5 transition-colors ${
                isNext ? "bg-[#007A78]/10" : isCurrent ? "bg-black/[0.02]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
                    isNext ? "bg-[#007A78] text-white shadow-xs" : "bg-[#767680]/10"
                  }`}
                >
                  {getPrayerIcon(item.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1C1C1E]">{item.name}</span>
                    {isNext && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#007A78] text-white">
                        Next ({schedule.timeRemainingToNext})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8E8E93] font-arabic">{item.arabicName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-[#1C1C1E] font-mono tracking-tight">
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suhur, Iftar & Qiyam iOS Grouped Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="ios-card p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#5856D6] font-semibold mb-1">
            <Moon className="w-3.5 h-3.5" />
            <span>Suhur (Imsak) End</span>
          </div>
          <p className="text-lg font-bold text-[#1C1C1E] font-mono">{schedule.fajr}</p>
          <p className="text-[10px] text-[#8E8E93] mt-0.5">Stop eating before Fajr begins</p>
        </div>

        <div className="ios-card p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#FF2D55] font-semibold mb-1">
            <Sunset className="w-3.5 h-3.5" />
            <span>Iftar (Sunset)</span>
          </div>
          <p className="text-lg font-bold text-[#1C1C1E] font-mono">{schedule.maghrib}</p>
          <p className="text-[10px] text-[#8E8E93] mt-0.5">Break fast with dates & water</p>
        </div>

        <div className="ios-card p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#007A78] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tahajjud & Qiyam</span>
          </div>
          <p className="text-lg font-bold text-[#1C1C1E] font-mono">{schedule.qiyam}</p>
          <p className="text-[10px] text-[#8E8E93] mt-0.5">Recommended last third of night</p>
        </div>
      </div>

      {/* iOS Inset Calculation Settings */}
      <div className="ios-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1E]">
            <Sliders className="w-3.5 h-3.5 text-[#007A78]" />
            <span>Calculation Method</span>
          </div>
          <span className="text-[10px] text-[#8E8E93]">Shared Cloud Preference</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {(["MWL", "ISNA", "Egypt", "Makkah", "Karachi", "Gulf"] as CalculationMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => updatePreferences({ calculationMethod: method })}
              className={`py-1.5 px-2 rounded-[10px] text-xs font-semibold transition-all text-center active:scale-95 cursor-pointer ${
                preferences.calculationMethod === method
                  ? "bg-[#007A78] text-white shadow-xs"
                  : "bg-[#767680]/10 text-[#1C1C1E] hover:bg-[#767680]/15"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Asr Juristic School Segmented Control */}
        <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
          <span className="text-xs text-[#8E8E93] font-medium">Asr Juristic:</span>
          <div className="flex items-center ios-segmented-control">
            <button
              type="button"
              onClick={() => updatePreferences({ juristicSchool: "standard" })}
              className={`px-3 py-1 text-xs ios-segmented-button cursor-pointer ${
                preferences.juristicSchool === "standard" ? "ios-segmented-button-active" : "text-[#8E8E93]"
              }`}
            >
              Standard (Shafi'i)
            </button>
            <button
              type="button"
              onClick={() => updatePreferences({ juristicSchool: "hanafi" })}
              className={`px-3 py-1 text-xs ios-segmented-button cursor-pointer ${
                preferences.juristicSchool === "hanafi" ? "ios-segmented-button-active" : "text-[#8E8E93]"
              }`}
            >
              Hanafi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
