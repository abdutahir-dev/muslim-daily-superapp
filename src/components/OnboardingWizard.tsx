import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Clock,
  BookOpen,
  Volume2,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CalculationMethod, JuristicSchool } from "../types";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const {
    preferences,
    updatePreferences,
    requestGeolocation,
    user,
    isAnonymous,
  } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [selectedMethod, setSelectedMethod] = useState<CalculationMethod>(
    preferences.calculationMethod
  );
  const [selectedSchool, setSelectedSchool] = useState<JuristicSchool>(
    preferences.juristicSchool
  );
  const [selectedVoice, setSelectedVoice] = useState<"makkah" | "madinah" | "alafasy">(
    preferences.adhanVoice
  );
  const [quranGoal, setQuranGoal] = useState<number>(
    preferences.dailyGoalQuranPages || 4
  );
  const [tasbihGoal, setTasbihGoal] = useState<number>(
    preferences.dailyGoalTasbihCount || 100
  );
  const [transliteration, setTransliteration] = useState<boolean>(
    preferences.showTransliteration
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  if (!isOpen) return null;

  const handleLocationDetect = async () => {
    setIsDetectingLocation(true);
    await requestGeolocation();
    setTimeout(() => setIsDetectingLocation(false), 1200);
  };

  const handleFinishOnboarding = async () => {
    await updatePreferences({
      calculationMethod: selectedMethod,
      juristicSchool: selectedSchool,
      adhanVoice: selectedVoice,
      dailyGoalQuranPages: quranGoal,
      dailyGoalTasbihCount: tasbihGoal,
      showTransliteration: transliteration,
      onboardingCompleted: true,
    });
    onClose();
  };

  const totalSteps = 4;

  return (
    <div
      id="onboarding-wizard-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300"
    >
      <div className="w-full max-w-lg bg-[#F2F2F7] rounded-t-[32px] sm:rounded-[32px] border border-black/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top iOS Progress Indicator */}
        <div className="pt-3 pb-2 px-5 bg-white/95 border-b border-black/[0.08] sticky top-0 z-10 shrink-0">
          <div className="w-10 h-1 bg-[#8E8E93]/40 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step === idx + 1
                      ? "w-7 bg-[#007A78]"
                      : step > idx + 1
                      ? "w-3 bg-[#007A78]/60"
                      : "w-3 bg-black/10"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Wizard Step Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* STEP 1: Welcome & Overview */}
          {step === 1 && (
            <div className="space-y-4 text-center py-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-[#007A78] to-[#20B2AA] text-white flex items-center justify-center mx-auto shadow-md">
                <Compass className="w-8 h-8 stroke-[2.2px]" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#007A78] font-bold">
                  Bismillah
                </span>
                <h2 className="text-xl font-bold tracking-tight text-[#1C1C1E]">
                  Welcome to Muslim Daily
                </h2>
                <p className="text-xs text-[#8E8E93] max-w-sm mx-auto leading-relaxed">
                  Your serene companion for prayer times, Holy Quran recitation, daily adhkar, and spiritual habit tracking.
                </p>
              </div>

              <div className="ios-card text-left p-3.5 divide-y divide-black/[0.06]">
                <div className="flex items-start gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1E] text-xs">Accurate Adhans & Times</h4>
                    <p className="text-[11px] text-[#8E8E93]">
                      Precise calculations adjusted to your location with audio adhan previews.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1E] text-xs">Holy Quran & Adhkar</h4>
                    <p className="text-[11px] text-[#8E8E93]">
                      Uthmani script, verse translations, Mishary Alafasy audio, and bookmarks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1E] text-xs">Firebase Cloud Sync</h4>
                    <p className="text-[11px] text-[#8E8E93]">
                      Safely backup and synchronize your habits and progress across devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Calculation Method */}
          {step === 2 && (
            <div className="space-y-4 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-[#1C1C1E]">Location & Prayer Calculation</h3>
                <p className="text-xs text-[#8E8E93]">
                  Select your calculation convention and local prayer standards.
                </p>
              </div>

              {/* Location Card */}
              <div className="ios-card p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1C1E] block">
                      {preferences.city}, {preferences.country}
                    </span>
                    <span className="text-[10px] text-[#8E8E93] font-mono">
                      {preferences.latitude.toFixed(2)}°N, {preferences.longitude.toFixed(2)}°E
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLocationDetect}
                  disabled={isDetectingLocation}
                  className="px-3 py-1.5 rounded-full bg-[#007A78] text-white font-semibold text-[11px] active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  {isDetectingLocation ? "Detecting..." : "Detect GPS"}
                </button>
              </div>

              {/* Calculation Method */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#8E8E93] uppercase px-1">
                  Calculation Standard
                </label>
                <div className="ios-card divide-y divide-black/[0.06] overflow-hidden">
                  {[
                    { id: "MWL" as CalculationMethod, name: "Muslim World League", sub: "Europe, Americas, Far East (18°, 17°)" },
                    { id: "ISNA" as CalculationMethod, name: "ISNA (North America)", sub: "United States & Canada (15°, 15°)" },
                    { id: "Egypt" as CalculationMethod, name: "Egyptian General Authority", sub: "Africa, Arab Levant (19.5°, 17.5°)" },
                    { id: "Makkah" as CalculationMethod, name: "Umm Al-Qura University", sub: "Makkah & Arabian Peninsula" },
                    { id: "Karachi" as CalculationMethod, name: "Univ. of Islamic Sciences", sub: "Pakistan, India, Bangladesh (18°, 18°)" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id)}
                      className="w-full p-3 text-left flex items-center justify-between active:bg-black/[0.02] cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-xs text-[#1C1C1E]">{m.name}</div>
                        <div className="text-[10px] text-[#8E8E93]">{m.sub}</div>
                      </div>
                      {selectedMethod === m.id && <Check className="w-4 h-4 text-[#007A78] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asr Juristic School */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#8E8E93] uppercase px-1">
                  Asr Calculation School
                </label>
                <div className="ios-segmented-control grid grid-cols-2 gap-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSchool("standard")}
                    className={`py-2 text-xs font-semibold ios-segmented-button cursor-pointer ${
                      selectedSchool === "standard" ? "ios-segmented-button-active" : "text-[#8E8E93]"
                    }`}
                  >
                    Standard (Shafi'i/Maliki/Hanbali)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSchool("hanafi")}
                    className={`py-2 text-xs font-semibold ios-segmented-button cursor-pointer ${
                      selectedSchool === "hanafi" ? "ios-segmented-button-active" : "text-[#8E8E93]"
                    }`}
                  >
                    Hanafi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Goals & Reading Habits */}
          {step === 3 && (
            <div className="space-y-4 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-[#1C1C1E]">Spiritual Goals & Audio</h3>
                <p className="text-xs text-[#8E8E93]">
                  Customize your daily targets and recitation preferences.
                </p>
              </div>

              {/* Adhan Voice */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#8E8E93] uppercase px-1">
                  Adhan Sound
                </label>
                <div className="ios-segmented-control grid grid-cols-3 gap-0.5">
                  {(["makkah", "madinah", "alafasy"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVoice(v)}
                      className={`py-2 text-xs font-semibold capitalize ios-segmented-button cursor-pointer ${
                        selectedVoice === v ? "ios-segmented-button-active" : "text-[#8E8E93]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quran Daily Goal */}
              <div className="ios-card p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1C1C1E]">Daily Quran Reading Goal</span>
                  <span className="font-bold text-[#007A78] text-xs">{quranGoal} Pages</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[2, 4, 10, 20].map((pages) => (
                    <button
                      key={pages}
                      type="button"
                      onClick={() => setQuranGoal(pages)}
                      className={`py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                        quranGoal === pages
                          ? "bg-[#007A78] text-white shadow-xs"
                          : "bg-black/[0.04] text-[#1C1C1E] hover:bg-black/[0.08]"
                      }`}
                    >
                      {pages} pgs
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasbih Daily Goal */}
              <div className="ios-card p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1C1C1E]">Daily Dhikr / Tasbih Goal</span>
                  <span className="font-bold text-[#007A78] text-xs">{tasbihGoal} Counts</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[33, 100, 300, 500].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setTasbihGoal(count)}
                      className={`py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                        tasbihGoal === count
                          ? "bg-[#007A78] text-white shadow-xs"
                          : "bg-black/[0.04] text-[#1C1C1E] hover:bg-black/[0.08]"
                      }`}
                    >
                      {count}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Transliteration Toggle */}
              <div className="ios-card p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[#1C1C1E] block">
                    Show English Transliteration
                  </span>
                  <span className="text-[10px] text-[#8E8E93]">
                    Phonetic Latin guides beneath Arabic verses & adhkar
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTransliteration(!transliteration)}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                    transliteration ? "bg-[#34C759]" : "bg-[#E5E5EA]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      transliteration ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Firebase Account & Cloud Sync */}
          {step === 4 && (
            <div className="space-y-4 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1C1C1E]">Cloud Sync & Account</h3>
                <p className="text-xs text-[#8E8E93]">
                  Synchronize your spiritual journey securely with Firebase Authentication.
                </p>
              </div>

              {user && !isAnonymous ? (
                <div className="ios-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[#34C759] font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Already Signed In</span>
                  </div>
                  <p className="text-xs text-[#3A3A3C]">
                    Linked as <span className="font-semibold">{user.email || user.displayName}</span>. Your preferences and habits will automatically sync.
                  </p>
                </div>
              ) : (
                <div className="ios-card p-4 space-y-3">
                  <p className="text-xs text-[#3A3A3C] leading-relaxed">
                    You can connect your Google or Email account now to save your Quran bookmarks and habit streak, or proceed in guest mode.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 rounded-[14px] bg-[#007A78] text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In or Link Account</span>
                  </button>
                </div>
              )}

              <div className="p-3 rounded-[16px] bg-black/[0.03] border border-black/[0.04] text-[11px] text-[#8E8E93] text-center">
                All settings can be customized anytime from the Settings menu.
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation Controls */}
        <div className="p-4 bg-white/95 border-t border-black/[0.08] flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-[14px] bg-black/[0.05] text-[#1C1C1E] font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-[14px] bg-[#007A78] text-white font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer ml-auto"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="px-6 py-2 rounded-[14px] bg-[#007A78] text-white font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer ml-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bismillah • Get Started</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
