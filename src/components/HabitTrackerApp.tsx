import React, { useState } from "react";
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
  Lock,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { HabitTrackerDay } from "../types";

interface HabitTrackerAppProps {
  onOpenAuth?: () => void;
}

export const HabitTrackerApp: React.FC<HabitTrackerAppProps> = ({ onOpenAuth }) => {
  const {
    user,
    isAuthenticated,
    signInWithGoogle,
    todayHabit,
    togglePrayerHabit,
    toggleSunnahHabit,
    setFastingHabit,
    setQuranPagesRead,
    toggleAdhkarHabit,
  } = useAuth();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authActionName, setAuthActionName] = useState("track your prayer");

  const requireAuth = (action: string, callback: () => void) => {
    if (!isAuthenticated) {
      setAuthActionName(action);
      setShowAuthPrompt(true);
      return;
    }
    callback();
  };

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
                onClick={() => requireAuth(`track ${p.name} prayer`, () => togglePrayerHabit(p.key))}
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
                onClick={() => requireAuth(`track ${s.name}`, () => toggleSunnahHabit(s.key))}
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

      {/* Auth Prompt Modal */}
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
                Sign In to Track Prayers
              </h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed mt-1">
                To {authActionName}, please sign in or create an account. Your prayers, streaks, and worship logs are backed up securely across devices.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                    setShowAuthPrompt(false);
                  } catch (e) {
                    console.warn(e);
                  }
                }}
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
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
