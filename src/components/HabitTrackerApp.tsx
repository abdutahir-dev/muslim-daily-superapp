import React from "react";
import {
  Calendar,
  CheckCircle2,
  Flame,
  BookOpen,
  Moon,
  Heart,
  Award,
  Sparkles,
  Plus,
  Minus,
  UtensilsCrossed,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { HabitTrackerDay } from "../types";

export const HabitTrackerApp: React.FC = () => {
  const {
    todayHabit,
    togglePrayerHabit,
    toggleSunnahHabit,
    setFastingHabit,
    setQuranPagesRead,
    toggleAdhkarHabit,
  } = useAuth();

  const prayersList = [
    { key: "fajr" as const, name: "Fajr", arabic: "الفجر" },
    { key: "dhuhr" as const, name: "Dhuhr", arabic: "الظهر" },
    { key: "asr" as const, name: "Asr", arabic: "العصر" },
    { key: "maghrib" as const, name: "Maghrib", arabic: "المغرب" },
    { key: "isha" as const, name: "Isha", arabic: "العشاء" },
  ];

  const sunnahList = [
    { key: "duha" as const, name: "Salat al-Duha (Forenoon)", reward: "Charity for 360 joints" },
    { key: "tahajjud" as const, name: "Qiyam al-Layl (Tahajjud)", reward: "Best prayer after obligatory" },
    { key: "witr" as const, name: "Salat al-Witr", reward: "Beloved Sunnah of Prophet (pbuh)" },
  ];

  const fastingOptions: { id: HabitTrackerDay["fasting"]; label: string }[] = [
    { id: "none", label: "None" },
    { id: "ramadan", label: "Ramadan" },
    { id: "sunnah_monday", label: "Mon Sunnah" },
    { id: "sunnah_thursday", label: "Thu Sunnah" },
    { id: "white_days", label: "White Days" },
    { id: "voluntary", label: "Voluntary" },
  ];

  const fardhCompletedCount = Object.values(todayHabit.prayers).filter(Boolean).length;
  const sunnahCompletedCount = Object.values(todayHabit.sunnah).filter(Boolean).length;
  const fardhPercentage = Math.round((fardhCompletedCount / 5) * 100);

  return (
    <div id="habit-tracker-mini-app" className="space-y-3.5 pb-20">
      {/* Apple Health / Activity Style Header Banner */}
      <div className="ios-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Circular mini progress */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                className="text-[#E5E5EA]"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#007A78"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray="100"
                strokeDashoffset={100 - fardhPercentage}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-[#1C1C1E]">
              {fardhPercentage}%
            </span>
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
              Daily Muhasabah
            </h2>
            <p className="text-[11px] text-[#8E8E93]">Spiritual accountability & habit logger</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold font-mono text-[#007A78]">
            {fardhCompletedCount}/5
          </span>
          <p className="text-[9px] text-[#8E8E93] uppercase font-medium">Prayers</p>
        </div>
      </div>

      {/* 1. Obligatory (Fardh) Prayers - iOS Inset Group */}
      <div className="ios-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#1C1C1E]">5 Obligatory Prayers (Fardh)</h3>
          <span className="text-[10px] text-[#8E8E93]">Tap to mark completed</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {prayersList.map((p) => {
            const isDone = todayHabit.prayers[p.key];
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => togglePrayerHabit(p.key)}
                className={`flex flex-col items-center justify-center p-2 rounded-[14px] border transition-all active:scale-95 cursor-pointer ${
                  isDone
                    ? "bg-[#34C759]/10 border-[#34C759]/40 text-[#1C1C1E]"
                    : "bg-[#767680]/5 border-transparent text-[#8E8E93] hover:bg-[#767680]/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 transition-colors ${
                    isDone ? "bg-[#34C759] text-white shadow-xs" : "border border-[#C7C7CC] bg-white"
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] font-semibold">{p.name}</span>
                <span className="font-arabic text-[10px] text-[#8E8E93] mt-0.5">{p.arabic}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Fasting Tracker - iOS Segmented Control */}
      <div className="ios-card p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#FF9500]" />
          <h3 className="text-xs font-semibold text-[#1C1C1E]">Fasting (Sawm)</h3>
        </div>

        <div className="ios-segmented-control grid grid-cols-3 sm:grid-cols-6 gap-0.5">
          {fastingOptions.map((opt) => {
            const isSelected = todayHabit.fasting === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFastingHabit(opt.id)}
                className={`py-1.5 text-[11px] ios-segmented-button cursor-pointer ${
                  isSelected ? "ios-segmented-button-active" : "text-[#8E8E93]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quran Daily Reading Tracker - iOS Stepper */}
      <div className="ios-card p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-[#007A78]/10 text-[#007A78] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#1C1C1E]">Quran Pages Read</h3>
            <p className="text-[10px] text-[#8E8E93]">Daily target: 4 pages (1 hizb)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuranPagesRead(Math.max(0, todayHabit.quranPagesRead - 1))}
            className="w-7 h-7 rounded-full bg-[#767680]/12 text-[#1C1C1E] active:scale-95 flex items-center justify-center cursor-pointer transition-transform"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-bold font-mono text-[#1C1C1E] w-6 text-center">
            {todayHabit.quranPagesRead}
          </span>
          <button
            type="button"
            onClick={() => setQuranPagesRead(todayHabit.quranPagesRead + 1)}
            className="w-7 h-7 rounded-full bg-[#007A78] text-white active:scale-95 flex items-center justify-center cursor-pointer transition-transform shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Sunnah & Voluntary Prayers */}
      <div className="ios-card p-4 space-y-2.5">
        <h3 className="text-xs font-semibold text-[#1C1C1E]">Sunnah & Voluntary Prayers</h3>

        <div className="divide-y divide-black/[0.06]">
          {sunnahList.map((s) => {
            const isDone = todayHabit.sunnah[s.key];
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => toggleSunnahHabit(s.key)}
                className="w-full flex items-center justify-between py-2.5 active:scale-[0.99] transition-all cursor-pointer text-left"
              >
                <div>
                  <span className="text-xs font-semibold text-[#1C1C1E]">{s.name}</span>
                  <p className="text-[10px] text-[#8E8E93]">{s.reward}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isDone ? "bg-[#34C759] text-white shadow-xs" : "border border-[#C7C7CC] bg-white"
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Morning & Evening Adhkar Checklist */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => toggleAdhkarHabit("morning")}
          className={`ios-card p-3 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer ${
            todayHabit.adhkarMorning ? "bg-[#34C759]/10 border-[#34C759]/30" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                todayHabit.adhkarMorning ? "bg-[#34C759] text-white" : "border border-[#C7C7CC]"
              }`}
            >
              {todayHabit.adhkarMorning && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-xs font-semibold text-[#1C1C1E]">Morning Adhkar</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggleAdhkarHabit("evening")}
          className={`ios-card p-3 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer ${
            todayHabit.adhkarEvening ? "bg-[#34C759]/10 border-[#34C759]/30" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                todayHabit.adhkarEvening ? "bg-[#34C759] text-white" : "border border-[#C7C7CC]"
              }`}
            >
              {todayHabit.adhkarEvening && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-xs font-semibold text-[#1C1C1E]">Evening Adhkar</span>
          </div>
        </button>
      </div>
    </div>
  );
};
