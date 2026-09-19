import React, { useState } from "react";
import {
  X,
  Compass,
  Clock,
  MapPin,
  Scroll,
  Layers,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Share2,
} from "lucide-react";
import { SurahMeta, SurahHistoricalDetail } from "../../types";
import { getSurahHistoricalDetails } from "../../lib/surahDetailsData";
import { SURAH_LIST } from "../../lib/quranData";

interface SurahHistoricalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  onSelectSurah?: (surahNumber: number) => void;
}

export const SurahHistoricalDetailsModal: React.FC<SurahHistoricalDetailsModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  onSelectSurah,
}) => {
  const [activeTab, setActiveTab] = useState<"context" | "themes" | "virtues">("context");
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(surahNumber);

  // Sync with prop when modal opens
  React.useEffect(() => {
    if (surahNumber > 0) {
      setCurrentSurahNumber(surahNumber);
    }
  }, [surahNumber]);

  if (!isOpen) return null;

  const surahMeta = SURAH_LIST.find((s) => s.number === currentSurahNumber) || SURAH_LIST[0];
  const history: SurahHistoricalDetail =
    surahMeta.historicalDetails ||
    getSurahHistoricalDetails(
      surahMeta.number,
      surahMeta.nameEnglish,
      surahMeta.nameArabic,
      surahMeta.revelationType,
      surahMeta.totalVerses
    );

  const isMeccan = surahMeta.revelationType === "Meccan";

  const handleNextSurah = () => {
    const next = currentSurahNumber >= 114 ? 1 : currentSurahNumber + 1;
    setCurrentSurahNumber(next);
  };

  const handlePrevSurah = () => {
    const prev = currentSurahNumber <= 1 ? 114 : currentSurahNumber - 1;
    setCurrentSurahNumber(prev);
  };

  return (
    <div
      id="surah-historical-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-emerald-950/95 border border-emerald-500/30 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-emerald-50">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border border-amber-500/30 text-amber-400">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-emerald-100">
                  Surah Historical Context & Details
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  أسباب النزول
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 font-sans">
                Revelation background, chronology, themes, and authenticated virtues
              </p>
            </div>
          </div>

          <button
            id="close-surah-history-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Surah Banner & Quick Navigation */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900/60 via-emerald-950/70 to-emerald-900/60 border-b border-emerald-500/20">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevSurah}
              className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-500/20 transition-all"
              title="Previous Surah"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Surah {surahMeta.number} of 114
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${
                    isMeccan
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-teal-500/20 text-teal-300 border-teal-500/30"
                  }`}
                >
                  {isMeccan ? "Meccan (መካ)" : "Medinan (መዲና)"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
                {surahMeta.nameEnglish} • <span className="font-arabic font-normal text-emerald-300">{surahMeta.nameArabic}</span>
              </h3>
              <p className="text-xs text-emerald-300/90 font-ethiopic mt-0.5">
                {surahMeta.translationEnglish} • {surahMeta.translationAmharic}
              </p>
            </div>

            <button
              onClick={handleNextSurah}
              className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-500/20 transition-all"
              title="Next Surah"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-center">
              <div className="text-emerald-400/80 text-[11px] mb-0.5">Verses (አንቀጾች)</div>
              <div className="text-sm font-bold text-emerald-100">{surahMeta.totalVerses} Ayahs</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-center">
              <div className="text-emerald-400/80 text-[11px] mb-0.5">Revelation Order</div>
              <div className="text-sm font-bold text-amber-300">#{history.revelationOrder} in Chronology</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-center">
              <div className="text-emerald-400/80 text-[11px] mb-0.5">Rukus (ሩኩዕ)</div>
              <div className="text-sm font-bold text-emerald-100">{history.rukusCount} Rukus</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-center">
              <div className="text-emerald-400/80 text-[11px] mb-0.5">Juz Placement</div>
              <div className="text-sm font-bold text-emerald-100">Juz {surahMeta.juzNumber}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2.5 bg-emerald-900/30 border-b border-emerald-500/20 flex gap-2 text-xs">
          <button
            onClick={() => setActiveTab("context")}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "context"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-emerald-300 hover:bg-emerald-800/40"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Place & Causes of Revelation</span>
          </button>

          <button
            onClick={() => setActiveTab("themes")}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "themes"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-emerald-300 hover:bg-emerald-800/40"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Main Themes</span>
          </button>

          <button
            onClick={() => setActiveTab("virtues")}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "virtues"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-emerald-300 hover:bg-emerald-800/40"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Virtues & Merits (فضائل)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm">
          {activeTab === "context" && (
            <div className="space-y-4 animate-fade-in">
              {/* Place & Time Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-900/30 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Place of Revelation (የወረደችበት ቦታ)</span>
                  </div>
                  <div className="font-bold text-emerald-100 text-sm">{history.revelationPlace}</div>
                  {history.revelationPlaceAmharic && (
                    <div className="text-xs text-amber-200/90 font-ethiopic mt-0.5">
                      {history.revelationPlaceAmharic}
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-900/30 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Historical Time Period (የወረደችበት ዘመን)</span>
                  </div>
                  <div className="font-bold text-emerald-100 text-sm">{history.revelationTimePeriod}</div>
                  {history.revelationTimePeriodAmharic && (
                    <div className="text-xs text-amber-200/90 font-ethiopic mt-0.5">
                      {history.revelationTimePeriodAmharic}
                    </div>
                  )}
                </div>
              </div>

              {/* Causes of Revelation (Asbab al-Nuzul) */}
              <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/25 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Cause of Revelation (أسباب النزول / የወረደችበት ምክንያት)</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                    Tafsir Ibn Kathir & Al-Wahidi
                  </span>
                </div>

                {/* English explanation */}
                <div>
                  <div className="text-xs font-semibold text-emerald-300 mb-1">English Context:</div>
                  <p className="text-emerald-100/90 leading-relaxed text-sm bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/15">
                    {history.causeOfRevelation}
                  </p>
                </div>

                {/* Amharic explanation */}
                <div>
                  <div className="text-xs font-semibold text-amber-300 mb-1 font-ethiopic">
                    በአማርኛ ማብራሪያ (Amharic):
                  </div>
                  <p className="text-amber-100/95 leading-relaxed font-ethiopic text-sm bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/15">
                    {history.causeOfRevelationAmharic}
                  </p>
                </div>

                {/* Arabic text if available */}
                {history.causeOfRevelationArabic && (
                  <div>
                    <div className="text-xs font-semibold text-emerald-300 mb-1">باللغة العربية:</div>
                    <p
                      dir="rtl"
                      className="text-emerald-200 font-arabic text-sm leading-relaxed bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/15 text-right"
                    >
                      {history.causeOfRevelationArabic}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "themes" && (
            <div className="space-y-3 animate-fade-in">
              <div className="text-xs text-emerald-300 font-medium mb-1">
                Major Theological, Legal, and Spiritual Objectives of Surah {surahMeta.nameEnglish}:
              </div>

              {history.mainThemes.map((theme, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-emerald-100 font-medium text-sm leading-snug">{theme}</p>
                    {history.mainThemesAmharic && history.mainThemesAmharic[i] && (
                      <p className="text-xs text-amber-200/90 font-ethiopic">
                        {history.mainThemesAmharic[i]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "virtues" && (
            <div className="space-y-3 animate-fade-in">
              <div className="text-xs text-amber-300 font-medium mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authentic Hadiths & Documented Merits (فضائل السورة):</span>
              </div>

              {history.virtues.map((virtue, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 border border-amber-500/25 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Virtue #{i + 1}</span>
                  </div>
                  <p className="text-emerald-100/95 leading-relaxed text-sm">{virtue}</p>
                  {history.virtuesAmharic && history.virtuesAmharic[i] && (
                    <p className="text-xs text-amber-100/90 font-ethiopic pt-1 border-t border-emerald-500/15">
                      {history.virtuesAmharic[i]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-emerald-900/40 border-t border-emerald-500/20 flex items-center justify-between text-xs">
          {onSelectSurah && (
            <button
              onClick={() => {
                onSelectSurah(currentSurahNumber);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium flex items-center gap-1.5 shadow-md transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Full Surah {surahMeta.nameEnglish}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-medium ml-auto transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
