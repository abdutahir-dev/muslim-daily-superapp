import React, { useState } from "react";
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  Check,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_DHIKR_PRESETS } from "../lib/adhkarData";
import { DhikrPreset } from "../types";
import { playCompletionChime, playTasbihHapticSound } from "../lib/soundUtils";

export const TasbihApp: React.FC = () => {
  const { preferences, lifetimeDhikrCount, incrementDhikrLifetime } = useAuth();

  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DEFAULT_DHIKR_PRESETS[0]);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number>(selectedDhikr.targetCount);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showPresetPicker, setShowPresetPicker] = useState<boolean>(false);
  const [showCompletedNotice, setShowCompletedNotice] = useState<boolean>(false);

  const handleSelectDhikr = (preset: DhikrPreset) => {
    setSelectedDhikr(preset);
    setTargetCount(preset.targetCount);
    setCurrentCount(0);
    setShowPresetPicker(false);
  };

  const handleCountTap = () => {
    if (soundEnabled) {
      playTasbihHapticSound();
    }

    const next = currentCount + 1;
    incrementDhikrLifetime(1);

    if (next >= targetCount) {
      setCurrentCount(0);
      setCyclesCompleted((prev) => prev + 1);
      playCompletionChime();
      setShowCompletedNotice(true);
      setTimeout(() => setShowCompletedNotice(false), 2500);
    } else {
      setCurrentCount(next);
    }
  };

  const handleReset = () => {
    setCurrentCount(0);
  };

  const progress = Math.min(100, Math.round((currentCount / targetCount) * 100));
  const strokeDashoffset = 440 - (440 * progress) / 100;

  return (
    <div id="tasbih-mini-app" className="space-y-3.5 pb-20 max-w-lg mx-auto">
      {/* iOS Header & Controls */}
      <div className="ios-card p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
            Smart Tasbih
          </h2>
          <p className="text-[11px] text-[#8E8E93]">Haptic counter with authentic Hadith presets</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
              soundEnabled
                ? "bg-[#007A78]/10 text-[#007A78]"
                : "bg-[#767680]/10 text-[#8E8E93]"
            }`}
            title={soundEnabled ? "Audio On" : "Audio Muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center transition-all cursor-pointer"
            title="Reset count"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Dhikr Selector Card */}
      <div className="ios-card p-4 relative">
        <button
          type="button"
          onClick={() => setShowPresetPicker(!showPresetPicker)}
          className="w-full flex items-center justify-between text-left active:scale-[0.98] transition-all cursor-pointer"
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#007A78] block">
              Current Dhikr
            </span>
            <h3 className="text-sm font-semibold text-[#1C1C1E] mt-0.5">
              {selectedDhikr.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#1C1C1E] bg-[#767680]/10 px-2.5 py-1 rounded-full">
            <span>Goal: {targetCount}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
          </div>
        </button>

        {/* Arabic Display */}
        <div className="text-center my-3 py-3 px-4 bg-[#F2F2F7] rounded-[16px]">
          <p className="font-arabic text-2xl sm:text-3xl text-[#1C1C1E] leading-relaxed">
            {selectedDhikr.arabic}
          </p>
          <p className="text-xs text-[#007A78] font-medium italic mt-1">
            {selectedDhikr.transliteration}
          </p>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">
            "{selectedDhikr.translation}"
          </p>
        </div>

        {/* iOS Action Sheet for Preset Picker */}
        {showPresetPicker && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 ios-card shadow-xl p-2 max-h-72 overflow-y-auto divide-y divide-black/[0.06]">
            {DEFAULT_DHIKR_PRESETS.map((preset) => {
              const isSelected = selectedDhikr.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectDhikr(preset)}
                  className={`w-full p-2.5 rounded-[12px] flex items-center justify-between text-left transition-colors cursor-pointer ${
                    isSelected ? "bg-[#007A78]/10 text-[#007A78] font-semibold" : "hover:bg-black/[0.03]"
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-[#1C1C1E]">{preset.title}</span>
                    <p className="font-arabic text-sm text-[#007A78]">{preset.arabic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#8E8E93]">Target: {preset.targetCount}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#007A78]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Apple Health / Activity Ring Tactile Tap Area */}
      <div className="ios-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Completion Alert banner */}
        {showCompletedNotice && (
          <div className="absolute top-4 inset-x-4 z-20 p-2.5 rounded-[14px] bg-[#34C759] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>Target of {targetCount} completed!</span>
          </div>
        )}

        {/* Circular Progress & Button */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-3">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Track */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              className="text-[#E5E5EA]"
            />
            {/* Indicator */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#007A78"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
          </svg>

          {/* iOS Spring Press Button */}
          <button
            id="tasbih-tap-button"
            type="button"
            onClick={handleCountTap}
            className="absolute inset-4 rounded-full bg-gradient-to-b from-[#00897B] to-[#005A54] active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-teal-950/20 transition-transform duration-100 cursor-pointer select-none"
            aria-label="Tap to count Dhikr"
          >
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight">
              {currentCount}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-teal-200 font-semibold mt-1">
              Tap to count
            </span>
            <span className="text-[10px] text-teal-200/80 font-mono mt-0.5">
              Goal: {targetCount}
            </span>
          </button>
        </div>

        {/* iOS Grouped Stats widgets */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs mt-1 pt-3 border-t border-black/[0.06] text-center">
          <div className="p-2.5 rounded-[14px] bg-[#F2F2F7]">
            <span className="text-[10px] text-[#8E8E93] font-medium block">Cycles Completed</span>
            <span className="text-base font-bold font-mono text-[#1C1C1E]">{cyclesCompleted}</span>
          </div>
          <div className="p-2.5 rounded-[14px] bg-[#007A78]/10">
            <span className="text-[10px] text-[#007A78] font-medium block">Lifetime Dhikr</span>
            <span className="text-base font-bold font-mono text-[#007A78]">{lifetimeDhikrCount}</span>
          </div>
        </div>
      </div>

      {/* Virtue Card */}
      <div className="ios-card p-3.5 flex items-start gap-2.5 text-xs bg-[#FF9500]/5 border-[#FF9500]/20">
        <Award className="w-4 h-4 text-[#FF9500] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-[#1C1C1E]">Virtue of this Dhikr</h4>
          <p className="text-[11px] text-[#8E8E93] leading-relaxed mt-0.5">{selectedDhikr.virtue}</p>
        </div>
      </div>
    </div>
  );
};
