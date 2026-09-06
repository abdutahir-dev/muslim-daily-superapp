import React, { useState } from "react";
import {
  Heart,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  Share2,
  Check,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ADHKAR_LIST } from "../lib/adhkarData";
import { AdhkarItem } from "../types";
import { playTasbihHapticSound } from "../lib/soundUtils";

export const AdhkarApp: React.FC = () => {
  const { todayHabit, toggleAdhkarHabit, preferences } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<
    "morning" | "evening" | "prayer" | "sleeping"
  >("morning");
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAdhkar = ADHKAR_LIST.filter((item) => item.category === selectedCategory);

  const handleTapAdhkar = (item: AdhkarItem) => {
    playTasbihHapticSound();
    const current = sessionCounts[item.id] || 0;
    if (current < item.targetCount) {
      setSessionCounts({
        ...sessionCounts,
        [item.id]: current + 1,
      });
    }
  };

  const handleCopyAdhkar = (item: AdhkarItem) => {
    navigator.clipboard.writeText(
      `"${item.arabic}"\n${item.transliteration}\n"${item.translation}"\n— [${item.reference}]`
    );
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="adhkar-mini-app" className="space-y-3.5 pb-20">
      {/* iOS Header & Category Switcher */}
      <div className="ios-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
              Daily Adhkar
            </h2>
            <p className="text-[11px] text-[#8E8E93]">Hisn al-Muslim (Fortress of the Muslim)</p>
          </div>

          {(selectedCategory === "morning" || selectedCategory === "evening") && (
            <button
              type="button"
              onClick={() => toggleAdhkarHabit(selectedCategory)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                (selectedCategory === "morning" ? todayHabit.adhkarMorning : todayHabit.adhkarEvening)
                  ? "bg-[#34C759] text-white shadow-xs"
                  : "bg-[#007A78]/10 text-[#007A78] hover:bg-[#007A78]/15"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {(selectedCategory === "morning" ? todayHabit.adhkarMorning : todayHabit.adhkarEvening)
                  ? "Done Today"
                  : "Mark Done"}
              </span>
            </button>
          )}
        </div>

        {/* iOS Segmented Control */}
        <div className="ios-segmented-control grid grid-cols-4 gap-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("morning")}
            className={`flex items-center justify-center gap-1 py-1.5 text-xs ios-segmented-button cursor-pointer ${
              selectedCategory === "morning" ? "ios-segmented-button-active" : "text-[#8E8E93]"
            }`}
          >
            <Sun className="w-3 h-3 text-[#FF9500]" />
            <span>Morning</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("evening")}
            className={`flex items-center justify-center gap-1 py-1.5 text-xs ios-segmented-button cursor-pointer ${
              selectedCategory === "evening" ? "ios-segmented-button-active" : "text-[#8E8E93]"
            }`}
          >
            <Moon className="w-3 h-3 text-[#5856D6]" />
            <span>Evening</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("prayer")}
            className={`flex items-center justify-center gap-1 py-1.5 text-xs ios-segmented-button cursor-pointer ${
              selectedCategory === "prayer" ? "ios-segmented-button-active" : "text-[#8E8E93]"
            }`}
          >
            <Clock className="w-3 h-3 text-[#007A78]" />
            <span>Prayer</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("sleeping")}
            className={`flex items-center justify-center gap-1 py-1.5 text-xs ios-segmented-button cursor-pointer ${
              selectedCategory === "sleeping" ? "ios-segmented-button-active" : "text-[#8E8E93]"
            }`}
          >
            <Moon className="w-3 h-3 text-[#AF52DE]" />
            <span>Sleep</span>
          </button>
        </div>
      </div>

      {/* Adhkar Cards List */}
      <div className="space-y-3">
        {filteredAdhkar.map((item) => {
          const currentTaps = sessionCounts[item.id] || 0;
          const isDone = currentTaps >= item.targetCount;

          return (
            <div
              key={item.id}
              className={`p-4 ios-card transition-all ${
                isDone ? "bg-[#34C759]/5 border-[#34C759]/30" : ""
              }`}
            >
              {/* Header: Title, Share, Tap Pill */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.06]">
                <h4 className="text-xs font-semibold text-[#1C1C1E]">{item.title}</h4>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyAdhkar(item)}
                    className="w-7 h-7 rounded-full bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center transition-colors cursor-pointer"
                    title="Copy Dua"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Interactive Count Tap Pill */}
                  <button
                    type="button"
                    onClick={() => handleTapAdhkar(item)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-mono active:scale-95 transition-all cursor-pointer ${
                      isDone
                        ? "bg-[#34C759] text-white shadow-xs"
                        : "bg-[#007A78]/10 text-[#007A78] hover:bg-[#007A78]/15"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Done ({item.targetCount}x)</span>
                      </>
                    ) : (
                      <span>
                        {currentTaps} / {item.targetCount}x
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <p
                dir="rtl"
                className="font-arabic text-xl sm:text-2xl text-[#1C1C1E] leading-relaxed text-right my-2.5 font-normal"
              >
                {item.arabic}
              </p>

              {/* Transliteration */}
              {preferences.showTransliteration && (
                <p className="text-[11px] text-[#007A78] font-medium italic mb-1.5 leading-relaxed">
                  {item.transliteration}
                </p>
              )}

              {/* English Translation */}
              <p className="text-xs sm:text-sm text-[#3A3A3C] leading-relaxed">
                "{item.translation}"
              </p>

              {/* Reference */}
              <div className="mt-2.5 pt-2 border-t border-black/[0.06] flex items-center gap-1.5 text-[10px] text-[#8E8E93] italic">
                <Info className="w-3 h-3 text-[#007A78] shrink-0" />
                <span>{item.reference}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
