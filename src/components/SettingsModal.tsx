import React, { useState, useRef } from "react";
import {
  X,
  Sliders,
  MapPin,
  Calendar,
  Volume2,
  VolumeX,
  Type,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  BookOpen,
  Vibrate,
  Play,
  Square,
  Compass,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CalculationMethod, JuristicSchool, QuranReadingStyle } from "../types";
import { READING_STYLES_LIST, RECITERS_CATALOG, getRecitersForReadingStyle } from "../lib/qiraatData";
import { QiraatStyleSelector } from "./quran/QiraatStyleSelector";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnboarding?: () => void;
  onOpenAuth?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenOnboarding,
  onOpenAuth,
}) => {
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    requestGeolocation,
    user,
    isAnonymous,
    lastSyncedAt,
  } = useAuth();

  const [cityInput, setCityInput] = useState(preferences.city);
  const [countryInput, setCountryInput] = useState(preferences.country);
  const [latInput, setLatInput] = useState(String(preferences.latitude));
  const [lngInput, setLngInput] = useState(String(preferences.longitude));
  const [locationSaved, setLocationSaved] = useState(false);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handleSaveLocation = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      updatePreferences({
        city: cityInput,
        country: countryInput,
        latitude: lat,
        longitude: lng,
      });
      setLocationSaved(true);
      setTimeout(() => setLocationSaved(false), 2000);
    }
  };

  const handleToggleAdhanPreview = () => {
    if (isPlayingAdhan) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingAdhan(false);
    } else {
      // Audio snippet for Adhan preview
      const adhanUrls: Record<string, string> = {
        makkah: "https://cdn.aladhan.com/audio/adhans/makkah.mp3",
        madinah: "https://cdn.aladhan.com/audio/adhans/madinah.mp3",
        alafasy: "https://cdn.aladhan.com/audio/adhans/alafasy.mp3",
      };
      const url = adhanUrls[preferences.adhanVoice] || adhanUrls.makkah;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch((e) => console.warn("Audio play prevented:", e));
      setIsPlayingAdhan(true);
      audio.onended = () => setIsPlayingAdhan(false);
    }
  };

  const methods: { id: CalculationMethod; label: string; desc: string }[] = [
    { id: "MWL", label: "Muslim World League", desc: "Europe, Far East, USA (18°, 17°)" },
    { id: "ISNA", label: "ISNA (North America)", desc: "United States & Canada (15°, 15°)" },
    { id: "Egypt", label: "Egyptian General Authority", desc: "Africa, Levant, Iraq (19.5°, 17.5°)" },
    { id: "Makkah", label: "Umm Al-Qura, Makkah", desc: "Arabian Peninsula (18.5°, 90 min)" },
    { id: "Karachi", label: "Univ. of Islamic Sciences", desc: "Pakistan, India, Bangladesh (18°, 18°)" },
    { id: "Gulf", label: "Gulf Region", desc: "UAE, Kuwait, Qatar, Oman (19.5°, 90 min)" },
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-[#F2F2F7] rounded-t-[28px] sm:rounded-[28px] border border-black/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* iOS Grabber & Navigation Header */}
        <div className="pt-2.5 pb-2 px-4 bg-white/95 border-b border-black/[0.08] sticky top-0 z-10 shrink-0">
          <div className="w-9 h-1 bg-[#8E8E93]/40 rounded-full mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1C1C1E]">Settings & Preferences</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#007A78] hover:text-[#006260] active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Cloud Sync & User Profile Banner */}
          <div className="ios-card p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#1C1C1E] block">
                  {user && !isAnonymous ? user.displayName || user.email : "Guest Account"}
                </span>
                <span className="text-[10px] text-[#8E8E93]">
                  {lastSyncedAt
                    ? `Last synced ${lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : "Firebase Cloud Storage Ready"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth?.();
              }}
              className="px-3 py-1.5 rounded-full bg-[#007A78]/10 text-[#007A78] hover:bg-[#007A78]/20 font-semibold text-[11px] active:scale-95 transition-all cursor-pointer"
            >
              {user && !isAnonymous ? "Manage" : "Sign In"}
            </button>
          </div>

          {/* Section: Calculation Method */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] px-2 block font-medium">
              Prayer Calculation Method
            </span>
            <div className="ios-card divide-y divide-black/[0.06] overflow-hidden">
              {methods.map((m) => {
                const isSelected = preferences.calculationMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updatePreferences({ calculationMethod: m.id })}
                    className="w-full p-3 text-left flex items-center justify-between active:bg-black/[0.03] transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#1C1C1E] block">{m.label}</span>
                      <span className="text-[10px] text-[#8E8E93]">{m.desc}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#007A78] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Asr Juristic School */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] px-2 block font-medium">
              Asr Calculation School
            </span>
            <div className="ios-segmented-control grid grid-cols-2 gap-0.5">
              <button
                type="button"
                onClick={() => updatePreferences({ juristicSchool: "standard" })}
                className={`py-2 text-xs font-semibold ios-segmented-button cursor-pointer ${
                  preferences.juristicSchool === "standard" ? "ios-segmented-button-active" : "text-[#8E8E93]"
                }`}
              >
                Standard (Shafi'i, Maliki, Hanbali)
              </button>
              <button
                type="button"
                onClick={() => updatePreferences({ juristicSchool: "hanafi" })}
                className={`py-2 text-xs font-semibold ios-segmented-button cursor-pointer ${
                  preferences.juristicSchool === "hanafi" ? "ios-segmented-button-active" : "text-[#8E8E93]"
                }`}
              >
                Hanafi
              </button>
            </div>
          </div>

          {/* Section: Hijri Date Adjustment */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] font-medium">
                Hijri Moon Adjustment
              </span>
              <span className="font-mono text-xs font-semibold text-[#007A78]">
                {preferences.hijriAdjustmentDays > 0 ? `+${preferences.hijriAdjustmentDays}` : preferences.hijriAdjustmentDays} days
              </span>
            </div>
            <div className="ios-segmented-control grid grid-cols-5 gap-0.5">
              {[-2, -1, 0, 1, 2].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => updatePreferences({ hijriAdjustmentDays: days })}
                  className={`py-1.5 text-xs font-mono font-semibold ios-segmented-button cursor-pointer ${
                    preferences.hijriAdjustmentDays === days ? "ios-segmented-button-active" : "text-[#8E8E93]"
                  }`}
                >
                  {days > 0 ? `+${days}` : days}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Geographic Location */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] font-medium">
                Location Settings
              </span>
              <button
                type="button"
                onClick={requestGeolocation}
                className="text-[#007A78] font-semibold text-xs hover:underline cursor-pointer flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Detect via GPS</span>
              </button>
            </div>

            <div className="ios-card p-3 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#8E8E93] block mb-0.5">City</span>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[10px] bg-[#767680]/10 border-0 text-xs text-[#1C1C1E] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] block mb-0.5">Country</span>
                  <input
                    type="text"
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[10px] bg-[#767680]/10 border-0 text-xs text-[#1C1C1E] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] block mb-0.5">Latitude</span>
                  <input
                    type="text"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[10px] bg-[#767680]/10 border-0 font-mono text-xs text-[#1C1C1E] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] block mb-0.5">Longitude</span>
                  <input
                    type="text"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[10px] bg-[#767680]/10 border-0 font-mono text-xs text-[#1C1C1E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveLocation}
                  className="flex-1 py-1.5 bg-[#007A78] active:scale-95 text-white rounded-[10px] text-xs font-semibold cursor-pointer transition-transform shadow-xs"
                >
                  {locationSaved ? "Saved ✓" : "Save Coordinates"}
                </button>
              </div>
            </div>
          </div>

          {/* Section: Quran Display & Reading */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] px-2 block font-medium">
              Quran Reading & Script
            </span>

            <div className="ios-card divide-y divide-black/[0.06] overflow-hidden">
              {/* Qira'at Reading Style Selector */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-semibold text-[#1C1C1E] flex items-center gap-1.5">
                      <span>Canonical Reading Style (Qira'ah)</span>
                      <span className="text-[10px] text-[#007A78] font-bold bg-[#007A78]/10 px-1.5 py-0.2 rounded">
                        10 Riwayahs
                      </span>
                    </span>
                    <span className="text-[10px] text-[#8E8E93]">
                      Choose authentic recitation style (Hafs, Ad-Duri, Warsh, Qalun...)
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <QiraatStyleSelector
                    currentStyle={preferences.quranReadingStyle || "hafs"}
                    onSelectStyle={(styleId) => updatePreferences({ quranReadingStyle: styleId })}
                  />
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C1C1E] block">English Transliteration</span>
                  <span className="text-[10px] text-[#8E8E93]">Show phonetics under Quran verses</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updatePreferences({ showTransliteration: !preferences.showTransliteration })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                    preferences.showTransliteration ? "bg-[#34C759]" : "bg-[#E5E5EA]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      preferences.showTransliteration ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-semibold text-[#1C1C1E] block">Translation Edition</span>
                    <span className="text-[10px] text-[#8E8E93]">አማርኛ (ሙሐመድ ሳኒ) or English (Sahih)</span>
                  </div>
                  <div className="ios-segmented-control flex items-center">
                    {[
                      { id: "amharic", label: "አማርኛ" },
                      { id: "english", label: "English" },
                      { id: "both", label: "Both" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => updatePreferences({ quranTranslation: item.id as any })}
                        className={`px-2.5 py-1 text-xs font-semibold ios-segmented-button cursor-pointer ${
                          (preferences.quranTranslation || "amharic") === item.id
                            ? "ios-segmented-button-active"
                            : "text-[#8E8E93]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                {(preferences.quranTranslation === "amharic" || preferences.quranTranslation === "both") && (
                  <div className="text-[10px] text-[#007A78] bg-[#007A78]/8 rounded-lg p-2 border border-[#007A78]/15 mt-2 flex items-start gap-1.5">
                    <span className="font-bold text-[#007A78] shrink-0">✓</span>
                    <span>
                      የቁርኣን የአማርኛ ትርጉም በታላቁ ሊቅ <strong>ሼክ ሙሐመድ ሳዲቅ እና ሐጂ ሙሐመድ ሳኒ ሐቢብ</strong> (ሳዲቅ & ሳኒ)።
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1C1E]">Arabic Script Style</span>
                <div className="ios-segmented-control flex items-center">
                  {(["uthmani", "indopak"] as const).map((script) => (
                    <button
                      key={script}
                      type="button"
                      onClick={() => updatePreferences({ arabicScript: script })}
                      className={`px-3 py-1 text-xs capitalize font-semibold ios-segmented-button cursor-pointer ${
                        preferences.arabicScript === script ? "ios-segmented-button-active" : "text-[#8E8E93]"
                      }`}
                    >
                      {script}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1C1E]">Arabic Font Size</span>
                <div className="ios-segmented-control flex items-center">
                  {(["md", "lg", "xl"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updatePreferences({ arabicFontSize: size })}
                      className={`px-3 py-1 text-xs uppercase font-semibold ios-segmented-button cursor-pointer ${
                        preferences.arabicFontSize === size ? "ios-segmented-button-active" : "text-[#8E8E93]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Spiritual Goals */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] px-2 block font-medium">
              Daily Spiritual Goals
            </span>
            <div className="ios-card divide-y divide-black/[0.06] overflow-hidden">
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1C1E]">Daily Quran Reading Goal</span>
                <div className="ios-segmented-control flex items-center">
                  {[2, 4, 8, 20].map((pages) => (
                    <button
                      key={pages}
                      type="button"
                      onClick={() => updatePreferences({ dailyGoalQuranPages: pages })}
                      className={`px-2.5 py-1 text-xs font-semibold ios-segmented-button cursor-pointer ${
                        preferences.dailyGoalQuranPages === pages ? "ios-segmented-button-active" : "text-[#8E8E93]"
                      }`}
                    >
                      {pages}p
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C1C1E]">Daily Tasbih Goal</span>
                <div className="ios-segmented-control flex items-center">
                  {[33, 100, 300, 1000].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updatePreferences({ dailyGoalTasbihCount: count })}
                      className={`px-2 py-1 text-xs font-semibold ios-segmented-button cursor-pointer ${
                        preferences.dailyGoalTasbihCount === count ? "ios-segmented-button-active" : "text-[#8E8E93]"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Adhan Reciter & Sound Preview */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] font-medium">
                Adhan Sound & Voice
              </span>
              <button
                type="button"
                onClick={handleToggleAdhanPreview}
                className="text-[#007A78] font-semibold text-xs flex items-center gap-1 hover:underline cursor-pointer"
              >
                {isPlayingAdhan ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-[#007A78]" />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-[#007A78]" />
                    <span>Listen Sample</span>
                  </>
                )}
              </button>
            </div>
            <div className="ios-segmented-control grid grid-cols-3 gap-0.5">
              {(["makkah", "madinah", "alafasy"] as const).map((voice) => (
                <button
                  key={voice}
                  type="button"
                  onClick={() => updatePreferences({ adhanVoice: voice })}
                  className={`py-2 text-xs font-semibold capitalize ios-segmented-button cursor-pointer ${
                    preferences.adhanVoice === voice ? "ios-segmented-button-active" : "text-[#8E8E93]"
                  }`}
                >
                  {voice}
                </button>
              ))}
            </div>
          </div>

          {/* Section: App Preferences */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8E8E93] px-2 block font-medium">
              Clock & System Controls
            </span>
            <div className="ios-card divide-y divide-black/[0.06] overflow-hidden">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C1C1E] block">24-Hour Time Format</span>
                  <span className="text-[10px] text-[#8E8E93]">Toggle between 12h (AM/PM) and 24h</span>
                </div>
                <button
                  type="button"
                  onClick={() => updatePreferences({ timeFormat24h: !preferences.timeFormat24h })}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                    preferences.timeFormat24h ? "bg-[#34C759]" : "bg-[#E5E5EA]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      preferences.timeFormat24h ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C1C1E] block">Haptic Vibration</span>
                  <span className="text-[10px] text-[#8E8E93]">Tactile pulse on Tasbih count clicks</span>
                </div>
                <button
                  type="button"
                  onClick={() => updatePreferences({ hapticFeedback: !preferences.hapticFeedback })}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                    preferences.hapticFeedback ? "bg-[#34C759]" : "bg-[#E5E5EA]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      preferences.hapticFeedback ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Setup Wizard & Reset Options */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOnboarding?.();
              }}
              className="w-full py-2.5 rounded-[14px] bg-white border border-black/10 text-xs font-semibold text-[#1C1C1E] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs cursor-pointer hover:bg-black/[0.02]"
            >
              <Sparkles className="w-4 h-4 text-[#007A78]" />
              <span>Re-run First-Time Setup Wizard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset all settings to default values?")) {
                  resetPreferences();
                }
              }}
              className="w-full py-2.5 rounded-[14px] bg-white border border-[#FF3B30]/30 text-xs font-semibold text-[#FF3B30] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs cursor-pointer hover:bg-[#FF3B30]/5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Settings to Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
