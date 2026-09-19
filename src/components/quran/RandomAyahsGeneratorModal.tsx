import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Shuffle,
  Play,
  Pause,
  Copy,
  Check,
  BookOpen,
  Volume2,
  Sparkles,
  Filter,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Share2,
  Sliders,
  Flame,
  Globe,
  RotateCcw,
} from "lucide-react";
import { AyahItem, QuranReadingStyle, RandomAyahsOptions, SurahMeta } from "../../types";
import { generateRandomAyahs } from "../../lib/quranRandom";
import { SURAH_LIST } from "../../lib/quranData";

interface RandomAyahsGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurahAndAyah?: (surahNumber: number, ayahNumber: number) => void;
  onBookmarkAyah?: (surahNumber: number, surahName: string, ayahNumber: number) => void;
  isBookmarked?: (surahNumber: number, ayahNumber: number) => boolean;
}

export const RandomAyahsGeneratorModal: React.FC<RandomAyahsGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectSurahAndAyah,
  onBookmarkAyah,
  isBookmarked,
}) => {
  const [count, setCount] = useState<number>(7);
  const [surahFilter, setSurahFilter] = useState<number>(0);
  const [revelationFilter, setRevelationFilter] = useState<"all" | "Meccan" | "Medinan">("all");
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTafsirMap, setShowTafsirMap] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showAmharic, setShowAmharic] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchRandomAyahs = async () => {
    setIsLoading(true);
    if (audioRef.current) {
      audioRef.current.pause();
      setActivePlayingIndex(null);
    }
    try {
      const options: RandomAyahsOptions = {
        count,
        surahFilter: surahFilter > 0 ? surahFilter : undefined,
        revelationFilter,
      };
      const data = await generateRandomAyahs(options);
      setAyahs(data);
      // Auto-open tafsir for first ayah as a helpful preview
      setShowTafsirMap({ 0: false });
    } catch (err) {
      console.error("Failed to generate random ayahs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && ayahs.length === 0) {
      fetchRandomAyahs();
    }
  }, [isOpen]);

  // Clean up audio on modal close
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setActivePlayingIndex(null);
    }
  }, [isOpen]);

  const handlePlayAudio = (index: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (activePlayingIndex === index) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setActivePlayingIndex(null);
      } else if (audioRef.current) {
        audioRef.current.play();
        setActivePlayingIndex(index);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setActivePlayingIndex(index);
    setAudioProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      // Auto-advance to next ayah if available
      if (index + 1 < ayahs.length && ayahs[index + 1].audioUrl) {
        handlePlayAudio(index + 1, ayahs[index + 1].audioUrl);
      } else {
        setActivePlayingIndex(null);
        setAudioProgress(0);
      }
    };

    audio.play().catch((e) => {
      console.warn("Audio playback error:", e);
      setActivePlayingIndex(null);
    });
  };

  const handleCopyAyah = (ayah: AyahItem, index: number) => {
    const text = `﴿ ${ayah.textArabic} ﴾\n` +
      `[Surah ${ayah.surahNameEnglish || ""} ${ayah.surahNumber || ""}:${ayah.numberInSurah}]\n\n` +
      `English: ${ayah.translation}\n` +
      (ayah.translationAmharic ? `Amharic: ${ayah.translationAmharic}\n` : "") +
      (ayah.tafsirArabic ? `\nتفسير الميسر: ${ayah.tafsirArabic}\n` : "") +
      `\n— Muslim Daily SuperApp`;

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleShareAyah = async (ayah: AyahItem) => {
    const shareText = `﴿ ${ayah.textArabic} ﴾\n\n` +
      `Surah ${ayah.surahNameEnglish || ""} (${ayah.surahNumber || ""}:${ayah.numberInSurah})\n` +
      `English: ${ayah.translation}\n` +
      (ayah.translationAmharic ? `አማርኛ: ${ayah.translationAmharic}\n` : "");

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quran Verse: ${ayah.surahNameEnglish} ${ayah.numberInSurah}`,
          text: shareText,
        });
      } catch {
        // user dismissed share
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Verse copied to clipboard for sharing!");
    }
  };

  const toggleTafsir = (index: number) => {
    setShowTafsirMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      id="random-ayahs-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-emerald-950/95 border border-emerald-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-emerald-50">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-emerald-100">
                  Random Ayahs Generator
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  7 Ayahs Curated
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 font-sans">
                Quad-lingual: Arabic, Amharic (አማርኛ), English & Arabic Tafsir (التفسير الميسر)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                showFilters
                  ? "bg-emerald-500 text-white border-emerald-400 font-medium"
                  : "bg-emerald-900/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-800/50"
              }`}
              title="Filter and preferences"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button
              id="close-random-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options & Controls Bar */}
        <div className="px-4 py-3 bg-emerald-900/30 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="regenerate-ayahs-btn"
              onClick={fetchRandomAyahs}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-95 disabled:opacity-50"
            >
              <Shuffle className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Sampling..." : "Generate New Set"}</span>
            </button>

            <div className="flex items-center bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-1 text-xs">
              <span className="px-2 text-emerald-300 font-medium">Count:</span>
              {[3, 5, 7, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setCount(num);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    count === num
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-emerald-300 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setShowAmharic(!showAmharic)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                showAmharic
                  ? "bg-emerald-800/80 border-emerald-400/50 text-emerald-200 font-semibold"
                  : "bg-emerald-950/40 border-emerald-800/40 text-emerald-500"
              }`}
            >
              አማርኛ {showAmharic ? "✓" : "✗"}
            </button>
            <button
              onClick={() => setShowEnglish(!showEnglish)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                showEnglish
                  ? "bg-emerald-800/80 border-emerald-400/50 text-emerald-200 font-semibold"
                  : "bg-emerald-950/40 border-emerald-800/40 text-emerald-500"
              }`}
            >
              English {showEnglish ? "✓" : "✗"}
            </button>
            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                showTransliteration
                  ? "bg-emerald-800/80 border-emerald-400/50 text-emerald-200 font-semibold"
                  : "bg-emerald-950/40 border-emerald-800/40 text-emerald-500"
              }`}
            >
              Phonetic {showTransliteration ? "✓" : "✗"}
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-emerald-900/50 border-b border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in text-xs">
            <div>
              <label className="block text-emerald-300 font-medium mb-1">
                Filter by Revelation Period:
              </label>
              <div className="flex gap-2">
                {(["all", "Meccan", "Medinan"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setRevelationFilter(type)}
                    className={`flex-1 py-1.5 rounded-lg border font-medium capitalize transition-all ${
                      revelationFilter === type
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : "bg-emerald-950/50 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/60"
                    }`}
                  >
                    {type === "all" ? "All Periods" : type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">
                Specific Surah Filter:
              </label>
              <select
                value={surahFilter}
                onChange={(e) => setSurahFilter(Number(e.target.value))}
                className="w-full bg-emerald-950/80 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-emerald-200 focus:outline-none focus:border-emerald-400"
              >
                <option value={0}>All 114 Surahs (Full Quran)</option>
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.nameEnglish} - {s.nameArabic} ({s.revelationType})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Ayahs Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-emerald-300">
                Sampling inspiring Quranic verses...
              </p>
              <p className="text-xs text-emerald-400/60">
                Fetching Arabic Uthmani text, Amharic & English translations, and Arabic Tafsir
              </p>
            </div>
          ) : ayahs.length === 0 ? (
            <div className="text-center py-12 text-emerald-300/70">
              <p>No ayahs found matching your criteria. Try adjusting your filters.</p>
              <button
                onClick={fetchRandomAyahs}
                className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium"
              >
                Reset & Regenerate
              </button>
            </div>
          ) : (
            ayahs.map((ayah, idx) => {
              const surahMeta = SURAH_LIST.find((s) => s.number === ayah.surahNumber);
              const isPlaying = activePlayingIndex === idx;
              const hasTafsir = Boolean(ayah.tafsirArabic);
              const isTafsirOpen = Boolean(showTafsirMap[idx]);
              const bookmarked = isBookmarked && ayah.surahNumber
                ? isBookmarked(ayah.surahNumber, ayah.numberInSurah)
                : false;

              return (
                <div
                  key={`${ayah.surahNumber}-${ayah.numberInSurah}-${idx}`}
                  id={`random-ayah-card-${idx}`}
                  className="bg-emerald-900/30 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 transition-all shadow-md relative group"
                >
                  {/* Top Bar of Ayah Card */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <button
                          onClick={() => {
                            if (ayah.surahNumber && onSelectSurahAndAyah) {
                              onSelectSurahAndAyah(ayah.surahNumber, ayah.numberInSurah);
                              onClose();
                            }
                          }}
                          className="font-bold text-emerald-200 hover:text-emerald-400 hover:underline flex items-center gap-1 text-sm font-serif"
                        >
                          <span>Surah {ayah.surahNameEnglish || surahMeta?.nameEnglish || `Surah ${ayah.surahNumber}`}</span>
                          <span className="text-emerald-400/80 font-arabic">({ayah.surahNameArabic || surahMeta?.nameArabic})</span>
                        </button>
                        <div className="flex items-center gap-2 text-[11px] text-emerald-400/70">
                          <span>Ayah {ayah.numberInSurah}</span>
                          <span>•</span>
                          <span className="capitalize">{ayah.revelationType || surahMeta?.revelationType || "Meccan"}</span>
                          <span>•</span>
                          <span>Juz {ayah.juz || surahMeta?.juzNumber || 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {ayah.audioUrl && (
                        <button
                          id={`play-audio-btn-${idx}`}
                          onClick={() => handlePlayAudio(idx, ayah.audioUrl)}
                          className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                            isPlaying
                              ? "bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-950/30"
                              : "bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-800/60 hover:text-white"
                          }`}
                          title="Listen to recitation"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span className="text-[11px] hidden sm:inline">Recite</span>
                            </>
                          )}
                        </button>
                      )}

                      {onBookmarkAyah && ayah.surahNumber && (
                        <button
                          onClick={() =>
                            onBookmarkAyah(
                              ayah.surahNumber!,
                              ayah.surahNameEnglish || surahMeta?.nameEnglish || "Surah",
                              ayah.numberInSurah
                            )
                          }
                          className={`p-2 rounded-xl border transition-all ${
                            bookmarked
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-800/60 hover:text-white"
                          }`}
                          title={bookmarked ? "Bookmarked" : "Bookmark this verse"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-400" : ""}`} />
                        </button>
                      )}

                      <button
                        onClick={() => handleCopyAyah(ayah, idx)}
                        className="p-2 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-800/60 hover:text-white transition-all"
                        title="Copy verse and translations"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleShareAyah(ayah)}
                        className="p-2 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-800/60 hover:text-white transition-all"
                        title="Share verse"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Audio progress bar if playing */}
                  {isPlaying && (
                    <div className="w-full bg-emerald-950/80 rounded-full h-1.5 mb-3 overflow-hidden border border-emerald-500/20">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-200"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Arabic Text (Uthmani) */}
                  <div
                    dir="rtl"
                    className="font-arabic text-right text-2xl sm:text-3xl leading-[2.2] sm:leading-[2.4] text-emerald-100 font-semibold tracking-wide py-2 select-text"
                  >
                    {ayah.textArabic}
                    <span className="inline-flex items-center justify-center w-8 h-8 mr-2 text-xs font-serif font-bold text-emerald-400 border border-emerald-500/40 rounded-full bg-emerald-950/80 align-middle">
                      {ayah.numberInSurah}
                    </span>
                  </div>

                  {/* Phonetic Transliteration */}
                  {showTransliteration && ayah.transliteration && (
                    <div className="text-xs text-emerald-300/80 italic font-sans mt-2 pt-2 border-t border-emerald-500/10">
                      {ayah.transliteration}
                    </div>
                  )}

                  {/* Translations Container */}
                  <div className="mt-3 pt-3 border-t border-emerald-500/15 space-y-2.5 text-sm">
                    {/* English Translation */}
                    {showEnglish && (
                      <div className="flex items-start gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold shrink-0 mt-0.5">
                          EN
                        </span>
                        <p className="text-emerald-100/90 font-serif leading-relaxed">
                          {ayah.translation}
                        </p>
                      </div>
                    )}

                    {/* Amharic Translation */}
                    {showAmharic && ayah.translationAmharic && (
                      <div className="flex items-start gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold shrink-0 mt-0.5">
                          አማ
                        </span>
                        <p className="text-amber-100/95 font-ethiopic leading-relaxed text-sm">
                          {ayah.translationAmharic}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arabic Tafsir Accordion */}
                  {hasTafsir && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => toggleTafsir(idx)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-950/90 border border-emerald-500/20 text-xs text-emerald-300 hover:text-emerald-100 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-semibold">التفسير الميسر (Arabic Tafsir)</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-400/80">
                          <span>{isTafsirOpen ? "إخفاء التفسير" : "عرض التفسير"}</span>
                          {isTafsirOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </button>

                      {isTafsirOpen && (
                        <div
                          dir="rtl"
                          className="mt-2 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/25 text-emerald-200/90 font-arabic text-sm leading-relaxed text-right animate-fade-in"
                        >
                          <div className="text-xs text-emerald-400 font-bold mb-1 font-sans">
                            التفسير الميسر المعتمد:
                          </div>
                          {ayah.tafsirArabic}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-emerald-900/40 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300/80">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Translations: Sadiq & Sani (Amharic) • Sahih International (English)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
