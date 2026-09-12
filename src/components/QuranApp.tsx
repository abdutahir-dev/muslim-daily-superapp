import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowLeft,
  Share2,
  Type,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Compass,
  Sliders,
  Globe,
  Radio,
  Layers,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AyahItem, QuranBookmark, QuranReadingStyle, QiraatDifferenceItem, SurahMeta } from "../types";
import { SURAH_LIST, fetchSurahVerses } from "../lib/quranData";
import {
  READING_STYLES_LIST,
  getReadingStyleDetail,
  getRecitersForReadingStyle,
  getDifferencesForAyah,
} from "../lib/qiraatData";
import { QiraatStyleSelector } from "./quran/QiraatStyleSelector";
import { QiraatDifferenceModal } from "./quran/QiraatDifferenceModal";
import { QiraatHubView } from "./quran/QiraatHubView";
import { QuranAudioPlayer } from "./quran/QuranAudioPlayer";

export const QuranApp: React.FC = () => {
  const { bookmarks, addBookmark, removeBookmark, preferences, updatePreferences } = useAuth();

  const [activeView, setActiveView] = useState<"surahs" | "qiraat" | "bookmarks">("surahs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [verses, setVerses] = useState<AyahItem[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  // Active reading style from user preferences or default to Hafs
  const currentStyleId: QuranReadingStyle = preferences.quranReadingStyle || "hafs";
  const activeStyleDetail = getReadingStyleDetail(currentStyleId);

  // Modal for inspecting Qira'at canonical differences
  const [inspectingDifference, setInspectingDifference] = useState<{
    difference: QiraatDifferenceItem;
    surahName: string;
    ayahNumber: number;
    arabicText: string;
  } | null>(null);

  // Audio recitation state for Ayah-by-Ayah
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load verses when Surah or readingStyle changes
  useEffect(() => {
    if (!selectedSurah) {
      setVerses([]);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      setPlayingAyahIndex(null);
      return;
    }

    setLoadingVerses(true);
    fetchSurahVerses(selectedSurah.number, currentStyleId)
      .then((loadedVerses) => {
        setVerses(loadedVerses);
        setLoadingVerses(false);
      })
      .catch((err) => {
        console.warn("Could not fetch remote verses, using fallback:", err);
        setLoadingVerses(false);
      });
  }, [selectedSurah, currentStyleId]);

  const handlePlayAyah = (index: number) => {
    const ayah = verses[index];
    if (!ayah?.audioUrl) return;

    if (playingAyahIndex === index && isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(ayah.audioUrl);
    audioRef.current = audio;
    setPlayingAyahIndex(index);
    setIsPlayingAudio(true);

    audio.onended = () => {
      if (index + 1 < verses.length) {
        handlePlayAyah(index + 1);
      } else {
        setIsPlayingAudio(false);
        setPlayingAyahIndex(null);
      }
    };

    audio.onerror = () => {
      setIsPlayingAudio(false);
      setPlayingAyahIndex(null);
    };

    audio.play().catch(() => {
      setIsPlayingAudio(false);
    });
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingAudio(false);
    setPlayingAyahIndex(null);
  };

  const isAyahBookmarked = (surahNum: number, ayahNum: number) => {
    return bookmarks.some((b) => b.surahNumber === surahNum && b.ayahNumber === ayahNum);
  };

  const handleToggleBookmark = (surahNum: number, surahName: string, ayahNum: number) => {
    const existing = bookmarks.find((b) => b.surahNumber === surahNum && b.ayahNumber === ayahNum);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark({
        surahNumber: surahNum,
        surahName,
        ayahNumber: ayahNum,
      });
    }
  };

  const handleSelectReadingStyle = (styleId: QuranReadingStyle) => {
    updatePreferences({ quranReadingStyle: styleId });
  };

  const filteredSurahs = SURAH_LIST.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      s.nameEnglish.toLowerCase().includes(q) ||
      s.translationEnglish.toLowerCase().includes(q) ||
      (s.translationAmharic && s.translationAmharic.toLowerCase().includes(q)) ||
      s.nameArabic.includes(q) ||
      String(s.number) === q
    );
  });

  const getFontSizeClass = () => {
    switch (preferences.arabicFontSize) {
      case "xl":
        return "text-3xl sm:text-4xl leading-[2.5]";
      case "md":
        return "text-xl sm:text-2xl leading-[2.2]";
      case "lg":
      default:
        return "text-2xl sm:text-3xl leading-[2.4]";
    }
  };

  const currentTranslationMode = preferences.quranTranslation || "amharic";

  // --- VIEW: SURAH READER ---
  if (selectedSurah) {
    return (
      <div id="quran-reader-view" className="space-y-4 pb-28">
        {/* iOS Reader Top Bar */}
        <div className="sticky top-14 z-30 ios-blur rounded-[20px] p-2.5 border border-black/[0.08] shadow-xs flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              handleStopAudio();
              setSelectedSurah(null);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#007A78] hover:bg-black/[0.04] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Surahs</span>
          </button>

          <div className="text-center min-w-0">
            <h3 className="text-xs font-semibold text-[#1C1C1E] leading-tight truncate">
              {selectedSurah.number}. {selectedSurah.nameEnglish}{" "}
              {selectedSurah.translationAmharic ? `(${selectedSurah.translationAmharic})` : ""}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8E8E93]">
              <span>{selectedSurah.revelationType} • {selectedSurah.totalVerses} Ayahs</span>
              <span className="text-[#007A78] font-medium">• {activeStyleDetail.nameEnglish}</span>
            </div>
          </div>

          {/* Quick Controls: Reading Style, Translation Mode, Font Size */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Qira'at Riwayah Switcher */}
            <QiraatStyleSelector
              currentStyle={currentStyleId}
              onSelectStyle={handleSelectReadingStyle}
              compact
            />

            {/* Translation Mode Pill Switcher */}
            <div className="flex items-center bg-[#767680]/12 p-0.5 rounded-full text-[10px] font-medium">
              <button
                type="button"
                onClick={() => updatePreferences({ quranTranslation: "amharic" })}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  currentTranslationMode === "amharic"
                    ? "bg-white text-[#007A78] font-bold shadow-xs"
                    : "text-[#8E8E93] hover:text-[#1C1C1E]"
                }`}
                title="የአማርኛ ትርጉም (ሙሐመድ ሳኒ ሐቢብ)"
              >
                አማርኛ
              </button>
              <button
                type="button"
                onClick={() => updatePreferences({ quranTranslation: "english" })}
                className={`px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  currentTranslationMode === "english"
                    ? "bg-white text-[#007A78] font-bold shadow-xs"
                    : "text-[#8E8E93] hover:text-[#1C1C1E]"
                }`}
                title="English (Sahih International)"
              >
                En
              </button>
              <button
                type="button"
                onClick={() => updatePreferences({ quranTranslation: "both" })}
                className={`px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  currentTranslationMode === "both"
                    ? "bg-white text-[#007A78] font-bold shadow-xs"
                    : "text-[#8E8E93] hover:text-[#1C1C1E]"
                }`}
                title="ሁለቱንም አሳይ (Dual Translation)"
              >
                Both
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const sizes: ("md" | "lg" | "xl")[] = ["md", "lg", "xl"];
                const nextIdx = (sizes.indexOf(preferences.arabicFontSize) + 1) % sizes.length;
                updatePreferences({ arabicFontSize: sizes[nextIdx] });
              }}
              className="w-7 h-7 rounded-full bg-[#767680]/10 text-[#1C1C1E] flex items-center justify-center text-xs font-bold active:scale-95 transition-all cursor-pointer"
              title="Toggle Font Size"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reading Style Info Banner */}
        <div className="bg-linear-to-r from-[#007A78]/10 via-[#007A78]/5 to-transparent border border-[#007A78]/20 rounded-[16px] p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A78]/15 text-[#007A78] flex items-center justify-center font-arabic text-sm font-bold shrink-0">
              {activeStyleDetail.nameArabic.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1C1C1E]">
                  Riwayah {activeStyleDetail.nameEnglish}
                </span>
                <span className="text-[10px] text-[#007A78] font-arabic font-medium">
                  {activeStyleDetail.nameArabic}
                </span>
              </div>
              <p className="text-[10px] text-[#8E8E93] line-clamp-1">
                {activeStyleDetail.regions[0]} • Imam {activeStyleDetail.imamNameEnglish}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveView("qiraat")}
            className="text-[11px] text-[#007A78] font-semibold hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
          >
            <span>Learn Qira'at</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Translation Banner Attribution */}
        {(currentTranslationMode === "amharic" || currentTranslationMode === "both") && (
          <div className="bg-[#007A78]/10 border border-[#007A78]/20 rounded-[14px] px-3.5 py-2 flex items-center justify-between text-xs text-[#007A78]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium text-[11px]">
                የቁርኣን የአማርኛ ትርጉም በታላቁ ዐሊም <strong>ሙሐመድ ሳኒ ሐቢብ</strong> (ሳዲቅ & ሳኒ)
              </span>
            </div>
            <span className="text-[10px] opacity-75 hidden sm:inline">የተፈተሸ እና ትክክለኛ</span>
          </div>
        )}

        {/* Surah Audio Player with Reciters for Active Riwayah */}
        <QuranAudioPlayer
          surahNumber={selectedSurah.number}
          surahNameEnglish={selectedSurah.nameEnglish}
          readingStyle={currentStyleId}
          onReadingStyleChange={handleSelectReadingStyle}
        />

        {/* Bismillah Header */}
        {selectedSurah.number !== 9 && (
          <div className="text-center py-4 ios-card">
            <p className="font-arabic text-2xl text-[#1C1C1E] tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            {currentTranslationMode === "amharic" ? (
              <p className="text-[11px] text-[#8E8E93] mt-1 font-medium">
                በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በኾነው፡፡
              </p>
            ) : currentTranslationMode === "both" ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-[11px] text-[#007A78] font-medium">
                  በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በኾነው፡፡
                </p>
                <p className="text-[10px] text-[#8E8E93] italic">
                  In the name of Allah, the Entirely Merciful, the Especially Merciful
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-[#8E8E93] mt-1 italic">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            )}
          </div>
        )}

        {/* Verses List */}
        {loadingVerses ? (
          <div className="p-8 text-center ios-card">
            <div className="w-6 h-6 border-2 border-[#007A78] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#8E8E93]">
              Loading verses in {activeStyleDetail.nameEnglish}...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {verses.map((ayah, index) => {
              const isBookmarked = isAyahBookmarked(selectedSurah.number, ayah.numberInSurah);
              const isCurrentPlaying = playingAyahIndex === index && isPlayingAudio;
              const differences = getDifferencesForAyah(selectedSurah.number, ayah.numberInSurah);

              return (
                <div
                  key={ayah.numberInSurah}
                  id={`ayah-${ayah.numberInSurah}`}
                  className={`p-4 ios-card transition-all ${
                    isCurrentPlaying ? "border-[#007A78] bg-[#007A78]/5 ring-1 ring-[#007A78]/30" : ""
                  }`}
                >
                  {/* Ayah Meta row */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#767680]/12 text-[#1C1C1E] font-bold text-[11px] flex items-center justify-center font-mono">
                        {ayah.numberInSurah}
                      </div>
                      <span className="text-[10px] text-[#8E8E93]">
                        Juz {ayah.juz}
                      </span>

                      {/* Qira'at Difference Badge if canonical variant exists */}
                      {differences.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setInspectingDifference({
                              difference: differences[0],
                              surahName: selectedSurah.nameEnglish,
                              ayahNumber: ayah.numberInSurah,
                              arabicText: ayah.textArabic,
                            })
                          }
                          className="flex items-center gap-1 text-[10px] font-semibold text-[#8E44AD] bg-[#8E44AD]/10 px-2 py-0.5 rounded-full hover:bg-[#8E44AD]/20 active:scale-95 transition-all cursor-pointer"
                          title="View authentic Qira'at variants across 10 readers"
                        >
                          <Layers className="w-3 h-3" />
                          <span>Qira'at Variants ({differences.length})</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Play Ayah */}
                      <button
                        type="button"
                        onClick={() => handlePlayAyah(index)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer ${
                          isCurrentPlaying
                            ? "bg-[#007A78] text-white"
                            : "text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-[#767680]/10"
                        }`}
                        title={isCurrentPlaying ? "Pause Ayah" : "Play Ayah Audio"}
                      >
                        {isCurrentPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      {/* Bookmark Ayah */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleBookmark(
                            selectedSurah.number,
                            selectedSurah.nameEnglish,
                            ayah.numberInSurah
                          )
                        }
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer ${
                          isBookmarked
                            ? "text-[#007A78] bg-[#007A78]/10"
                            : "text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-[#767680]/10"
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Ayah Text in the Selected Riwayah */}
                  <p
                    dir="rtl"
                    className={`font-arabic text-right text-[#1C1C1E] font-normal ${getFontSizeClass()} mb-2.5`}
                  >
                    {ayah.textArabic}
                  </p>

                  {/* Transliteration */}
                  {preferences.showTransliteration && (
                    <p className="text-[11px] text-[#007A78] font-medium mb-2 italic">
                      {ayah.transliteration}
                    </p>
                  )}

                  {/* Translations Display based on preferences */}
                  <div className="space-y-2 mt-1">
                    {/* Amharic Translation by Muhammed Sani */}
                    {(currentTranslationMode === "amharic" || currentTranslationMode === "both") && (
                      <div className="text-xs sm:text-sm text-[#1C1C1E] leading-relaxed">
                        {currentTranslationMode === "both" && (
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-bold text-[#007A78] bg-[#007A78]/10 px-1.5 py-0.5 rounded">
                              አማርኛ (ሙሐመድ ሳኒ)
                            </span>
                          </div>
                        )}
                        <p className="font-normal text-[#1C1C1E]">
                          {ayah.translationAmharic || ayah.translation}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    {(currentTranslationMode === "english" || currentTranslationMode === "both") && (
                      <div className="text-xs sm:text-sm text-[#3A3A3C] leading-relaxed">
                        {currentTranslationMode === "both" && (
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-bold text-[#8E8E93] bg-[#767680]/12 px-1.5 py-0.5 rounded">
                              English (Sahih)
                            </span>
                          </div>
                        )}
                        <p>{ayah.translation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Difference inspection */}
        {inspectingDifference && (
          <QiraatDifferenceModal
            isOpen={true}
            onClose={() => setInspectingDifference(null)}
            difference={inspectingDifference.difference}
            surahName={inspectingDifference.surahName}
            ayahNumber={inspectingDifference.ayahNumber}
            currentArabicText={inspectingDifference.arabicText}
          />
        )}
      </div>
    );
  }

  // --- VIEW: SURAH CATALOG / QIRAAT HUB / BOOKMARKS ---
  return (
    <div id="quran-catalog-view" className="space-y-3.5 pb-24">
      {/* iOS Segmented Header with Tabs */}
      <div className="ios-card p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
              Holy Quran & Qira'at
            </h2>
            <p className="text-[11px] text-[#8E8E93]">
              10 Authentic Canonical Readings (Hafs, Ad-Duri, Warsh, Qalun...)
            </p>
          </div>

          <div className="ios-segmented-control flex items-center">
            <button
              type="button"
              onClick={() => setActiveView("surahs")}
              className={`px-3 py-1 text-xs ios-segmented-button cursor-pointer ${
                activeView === "surahs" ? "ios-segmented-button-active" : "text-[#8E8E93]"
              }`}
            >
              Surahs
            </button>
            <button
              type="button"
              onClick={() => setActiveView("qiraat")}
              className={`px-3 py-1 text-xs ios-segmented-button cursor-pointer flex items-center gap-1 ${
                activeView === "qiraat" ? "ios-segmented-button-active" : "text-[#8E8E93]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>10 Qira'at</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("bookmarks")}
              className={`px-3 py-1 text-xs ios-segmented-button cursor-pointer flex items-center gap-1 ${
                activeView === "bookmarks" ? "ios-segmented-button-active" : "text-[#8E8E93]"
              }`}
            >
              <span>Saved</span>
              {bookmarks.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#007A78] text-white text-[9px] flex items-center justify-center font-mono">
                  {bookmarks.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Reading Style Chip in Surahs View */}
        {activeView === "surahs" && (
          <div className="flex items-center justify-between pt-1 border-t border-black/[0.06] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8E8E93]">Active Reading:</span>
              <span className="text-xs font-semibold text-[#007A78] bg-[#007A78]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>{activeStyleDetail.nameEnglish}</span>
                <span className="font-arabic text-[10px]">({activeStyleDetail.nameArabic})</span>
              </span>
            </div>
            <QiraatStyleSelector
              currentStyle={currentStyleId}
              onSelectStyle={handleSelectReadingStyle}
              compact
            />
          </div>
        )}

        {/* Search Bar */}
        {activeView === "surahs" && (
          <div className="relative">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Surah by name or number (e.g. Al-Fatihah, Kahf, 18)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#767680]/10 rounded-[12px] border-0 focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 text-[#1C1C1E] placeholder:text-[#8E8E93] transition-all"
            />
          </div>
        )}
      </div>

      {/* VIEW: 10 QIRA'AT HUB */}
      {activeView === "qiraat" && (
        <QiraatHubView
          activeStyle={currentStyleId}
          onSelectStyle={handleSelectReadingStyle}
          onOpenSurah={(surahNum) => {
            const surah = SURAH_LIST.find((s) => s.number === surahNum);
            if (surah) {
              setSelectedSurah(surah);
              setActiveView("surahs");
            }
          }}
        />
      )}

      {/* VIEW: BOOKMARKS */}
      {activeView === "bookmarks" && (
        <div className="space-y-2">
          {bookmarks.length === 0 ? (
            <div className="p-8 text-center ios-card">
              <Bookmark className="w-8 h-8 text-[#C7C7CC] mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-[#1C1C1E]">No Bookmarks Saved</h4>
              <p className="text-xs text-[#8E8E93] mt-1 max-w-xs mx-auto">
                Tap the bookmark icon on any ayah while reading to access it here anytime.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bookmarks.map((bm) => {
                const surah = SURAH_LIST.find((s) => s.number === bm.surahNumber);
                return (
                  <div
                    key={bm.id}
                    className="ios-card p-3 flex items-center justify-between active:scale-[0.98] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (surah) setSelectedSurah(surah);
                      }}
                      className="flex items-center gap-2.5 text-left cursor-pointer flex-1"
                    >
                      <div className="w-8 h-8 rounded-[10px] bg-[#007A78]/10 text-[#007A78] font-bold text-xs flex items-center justify-center font-mono">
                        {bm.ayahNumber}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#1C1C1E]">
                          {bm.surahName} : {bm.ayahNumber}
                        </span>
                        <p className="text-[10px] text-[#8E8E93]">
                          Saved {new Date(bm.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBookmark(bm.id)}
                      className="p-1.5 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-full cursor-pointer transition-colors"
                      title="Delete bookmark"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: SURAHS CATALOG LIST */}
      {activeView === "surahs" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              type="button"
              onClick={() => setSelectedSurah(surah)}
              className="ios-card p-3 flex items-center justify-between active:scale-[0.98] transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#767680]/10 text-[#1C1C1E] font-bold text-xs flex items-center justify-center font-mono group-hover:bg-[#007A78]/10 group-hover:text-[#007A78] transition-colors">
                  {surah.number}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-[#1C1C1E] group-hover:text-[#007A78] transition-colors">
                      {surah.nameEnglish}
                    </span>
                    {surah.translationAmharic && (
                      <span className="text-[10px] text-[#007A78] font-medium bg-[#007A78]/10 px-1.5 py-0.5 rounded-md">
                        {surah.translationAmharic}
                      </span>
                    )}
                    <span className="text-[9px] text-[#8E8E93] uppercase font-medium">
                      {surah.revelationType === "Meccan" ? "Makkah" : "Madinah"}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8E8E93] line-clamp-1">
                    {surah.translationEnglish} • {surah.totalVerses}v
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-arabic text-base text-[#1C1C1E] group-hover:text-[#007A78] transition-colors">
                  {surah.nameArabic}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

