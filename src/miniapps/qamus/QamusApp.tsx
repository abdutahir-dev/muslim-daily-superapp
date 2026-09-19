import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCw,
  Copy,
  Check,
  Info,
  ExternalLink,
  ChevronRight,
  BookMarked,
  Languages,
  X,
  Shuffle,
  ChevronDown,
} from "lucide-react";
import { apiClient } from "../../services/apiClient";
import {
  QamusEntry,
  QamusGrammarRule,
  QamusRootInfo,
  SavedQamusWord,
} from "../../types";
import { useAuth, OperationType, handleFirestoreError } from "../../context/AuthContext";
import { db, doc, setDoc, deleteDoc, collection, getDocs } from "../../lib/firebase";

const TASHKEEL_KEYS = [
  { char: "َ", label: "Fatha (َ)" },
  { char: "ُ", label: "Damma (ُ)" },
  { char: "ِ", label: "Kasra (ِ)" },
  { char: "ّ", label: "Shaddah (ّ)" },
  { char: "ْ", label: "Sukun (ْ)" },
  { char: "ً", label: "Tanween Fath (ً)" },
  { char: "ٌ", label: "Tanween Damm (ٌ)" },
  { char: "ٍ", label: "Tanween Kasr (ٍ)" },
  { char: "ـٰ", label: "Alif Khanjariyyah" },
];

export const QamusApp: React.FC = () => {
  const { user } = useAuth();

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"lexicon" | "grammar" | "translation" | "quranic" | "saved" | "rules">("lexicon");
  const [targetLanguage, setTargetLanguage] = useState<"Both" | "English" | "Amharic">("Both");
  const [showTashkeelBar, setShowTashkeelBar] = useState(false);

  // Data States
  const [currentEntry, setCurrentEntry] = useState<QamusEntry | null>(null);
  const [popularRoots, setPopularRoots] = useState<QamusRootInfo[]>([]);
  const [grammarRules, setGrammarRules] = useState<QamusGrammarRule[]>([]);
  const [savedWords, setSavedWords] = useState<SavedQamusWord[]>(() => {
    try {
      const stored = localStorage.getItem("muslim_daily_qamus_saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Loading & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);

  // 1. Initialize popular roots and load default entry "كتب"
  useEffect(() => {
    let isMounted = true;

    async function initializeCatalog() {
      try {
        const [rootsRes, rulesRes] = await Promise.all([
          apiClient.qamus.getRoots(),
          apiClient.qamus.getGrammarRules(),
        ]);
        if (isMounted && rootsRes?.roots) {
          setPopularRoots(rootsRes.roots);
        }
        if (isMounted && rulesRes?.rules) {
          setGrammarRules(rulesRes.rules);
        }
      } catch (err) {
        console.warn("Could not load initial roots catalog:", err);
      }
    }

    initializeCatalog();
    handleSearch("كتب");

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Sync saved words with Firestore when authenticated
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function loadUserVocabulary() {
      try {
        const vocabRef = collection(db, "users", user.uid, "vocabulary");
        const snap = await getDocs(vocabRef);
        if (!snap.empty && isMounted) {
          const remoteList: SavedQamusWord[] = [];
          snap.forEach((d) => remoteList.push(d.data() as SavedQamusWord));
          // Merge local and remote
          setSavedWords((prev) => {
            const map = new Map<string, SavedQamusWord>();
            [...remoteList, ...prev].forEach((item) => map.set(item.id, item));
            const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
            localStorage.setItem("muslim_daily_qamus_saved", JSON.stringify(merged));
            return merged;
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/vocabulary`);
      }
    }

    loadUserVocabulary();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle Search Submission
  const handleSearch = async (termToSearch?: string) => {
    const q = (termToSearch || searchQuery).trim();
    if (!q) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.qamus.lookup({
        query: q,
        targetLanguage,
        mode: "all",
      });

      if (response.status === "success" && response.entry) {
        setCurrentEntry(response.entry);
        setSearchQuery(q);
      } else {
        setErrorMessage(response.error || "No entry found for this word.");
      }
    } catch (err: any) {
      console.error("Qamus lookup failed:", err);
      setErrorMessage(err?.message || "Failed to connect to Qamus dictionary service.");
    } finally {
      setIsLoading(false);
    }
  };

  // Insert Tashkeel character at the end of search input
  const insertTashkeel = (char: string) => {
    setSearchQuery((prev) => prev + char);
  };

  // Audio Pronunciation using Speech Synthesis
  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Audio synthesis is not supported in this browser.");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85; // Slightly slower for clear classical diction
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  };

  // Bookmark / Save Word
  const isCurrentWordSaved = useMemo(() => {
    if (!currentEntry) return false;
    return savedWords.some((w) => w.word === currentEntry.query || w.tashkeel === currentEntry.tashkeel);
  }, [currentEntry, savedWords]);

  const handleToggleSaveWord = async () => {
    if (!currentEntry) return;

    const wordId = `word_${encodeURIComponent(currentEntry.query)}_${Date.now()}`;
    const isAlreadySaved = isCurrentWordSaved;

    let updated: SavedQamusWord[];

    if (isAlreadySaved) {
      updated = savedWords.filter((w) => w.word !== currentEntry.query && w.tashkeel !== currentEntry.tashkeel);
      setSavedWords(updated);
      localStorage.setItem("muslim_daily_qamus_saved", JSON.stringify(updated));

      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "vocabulary", currentEntry.query);
          await deleteDoc(docRef);
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/vocabulary/${currentEntry.query}`);
        }
      }
    } else {
      const newWord: SavedQamusWord = {
        id: wordId,
        word: currentEntry.query,
        tashkeel: currentEntry.tashkeel || currentEntry.query,
        meaningEnglish: currentEntry.meanings.primaryEnglish,
        meaningAmharic: currentEntry.meanings.primaryAmharic,
        root: currentEntry.rootInfo?.root || currentEntry.rootInfo?.rootArabic,
        timestamp: Date.now(),
      };

      updated = [newWord, ...savedWords];
      setSavedWords(updated);
      localStorage.setItem("muslim_daily_qamus_saved", JSON.stringify(updated));

      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "vocabulary", currentEntry.query);
          await setDoc(docRef, newWord);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/vocabulary/${currentEntry.query}`);
        }
      }
    }
  };

  // Copy Word Study Card
  const handleCopyStudyCard = () => {
    if (!currentEntry) return;

    const lines = [
      `📖 Qamus Arabic Dictionary Entry:`,
      `الكلمة: ${currentEntry.tashkeel || currentEntry.query} (${currentEntry.transliteration || ""})`,
      `الجذر: ${currentEntry.rootInfo?.root || "—"} (${currentEntry.rootInfo?.generalMeaning || ""})`,
      `النوع: ${currentEntry.grammar.partOfSpeechArabic} (${currentEntry.grammar.partOfSpeechEnglish})`,
      `English: ${currentEntry.meanings.primaryEnglish}`,
      currentEntry.meanings.primaryAmharic ? `Amharic: ${currentEntry.meanings.primaryAmharic}` : null,
      currentEntry.meanings.classicalArabicDefinition
        ? `المعجم الوسيط: ${currentEntry.meanings.classicalArabicDefinition}`
        : null,
      currentEntry.examples?.[0]
        ? `مثال: "${currentEntry.examples[0].arabic}" — "${currentEntry.examples[0].english}"`
        : null,
      `\nShared via Muslim Daily SuperApp (Qamus Engine)`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(lines);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Random word trigger
  const handleRandomWord = () => {
    if (popularRoots.length === 0) return;
    const randomIndex = Math.floor(Math.random() * popularRoots.length);
    const chosen = popularRoots[randomIndex];
    handleSearch(chosen.rootArabic);
  };

  return (
    <div id="qamus-mini-app" className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Card (iOS Acrylic Blur Design) */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] text-white rounded-[24px] p-5 shadow-sm relative overflow-hidden">
        {/* Subtle geometric background motif */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <BookOpen className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                    الْقَامُوس
                  </h1>
                  <span className="text-[10px] bg-emerald-400/25 text-emerald-100 font-semibold px-2 py-0.5 rounded-full border border-emerald-300/30 uppercase tracking-wider">
                    Qamus
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80">
                  Classical Arabic Lexicon, Morphology (Sarf) & I'rab
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRandomWord}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/10 text-xs flex items-center gap-1 cursor-pointer"
                title="Explore Random Arabic Root"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline text-xs font-medium">Random</span>
              </button>

              <a
                href="/docs"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/10 text-xs flex items-center gap-1"
                title="View Swagger API Documentation"
              >
                <span className="text-[11px] font-mono text-emerald-200">API Docs</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            </div>
          </div>

          {/* Unified Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search word or root (e.g. كَتَبَ، رَحِمَ، عَلِمَ، صبر)..."
              dir="auto"
              className="w-full bg-white/95 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-arabic font-medium pl-10 pr-24 py-3.5 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

            <div className="absolute right-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowTashkeelBar(!showTashkeelBar)}
                className={`text-[11px] px-2 py-1 rounded-lg border font-arabic transition-colors cursor-pointer ${
                  showTashkeelBar
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                }`}
                title="Toggle Tashkeel Keyboard"
              >
                تَشْكِيل
              </button>

              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="bg-[#00B074] hover:bg-[#009663] text-white p-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Tashkeel diacritics keyboard palette */}
          {showTashkeelBar && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/15 flex flex-wrap items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1">
              <span className="text-[11px] text-emerald-200 font-medium mr-1">Tashkeel:</span>
              {TASHKEEL_KEYS.map((k) => (
                <button
                  key={k.char}
                  type="button"
                  onClick={() => insertTashkeel(k.char)}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 active:scale-90 transition-transform text-white font-arabic text-lg flex items-center justify-center cursor-pointer border border-white/10"
                  title={k.label}
                >
                  {k.char}
                </button>
              ))}
            </div>
          )}

          {/* Quick Root Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] text-emerald-200/80 font-medium whitespace-nowrap">
              Roots:
            </span>
            {popularRoots.map((r) => (
              <button
                key={r.root}
                type="button"
                onClick={() => handleSearch(r.rootArabic)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all font-arabic whitespace-nowrap cursor-pointer ${
                  currentEntry?.rootInfo?.rootArabic === r.rootArabic
                    ? "bg-white text-[#065F46] font-bold shadow-xs scale-105"
                    : "bg-white/15 hover:bg-white/25 text-white border border-white/10"
                }`}
              >
                {r.root}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Error or Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-xs space-y-3">
          <RotateCw className="w-8 h-8 text-[#00B074] animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-700">
            Consulting classical lexicon & analyzing morphology...
          </p>
          <p className="text-xs text-slate-400">
            Parsing triliteral root, syntactic case (I'rab) and Quranic occurrences
          </p>
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSearch("كتب")}
            className="text-rose-700 underline font-semibold cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* 3. Main Word Card & Interactive Tabs */}
      {currentEntry && !isLoading && (
        <div className="space-y-3">
          {/* Top Hero Word Overview */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2
                    dir="rtl"
                    className="text-3xl sm:text-4xl font-arabic font-bold text-slate-900 tracking-wide"
                  >
                    {currentEntry.tashkeel || currentEntry.query}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleSpeak(currentEntry.tashkeel || currentEntry.query)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isSpeaking
                        ? "bg-emerald-100 text-[#00B074] animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                    title="Listen to Arabic Pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-xs font-semibold text-slate-600 italic">
                    /{currentEntry.transliteration || currentEntry.query}/
                  </span>
                  {currentEntry.grammar.patterns && (
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 font-arabic px-2 py-0.5 rounded-md font-medium">
                      الوزن: {currentEntry.grammar.patterns}
                    </span>
                  )}
                  {currentEntry.rootInfo && (
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 font-arabic px-2 py-0.5 rounded-md font-medium">
                      الجذر: {currentEntry.rootInfo.root}
                    </span>
                  )}
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                    {currentEntry.grammar.partOfSpeechEnglish}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleSaveWord}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isCurrentWordSaved
                      ? "bg-emerald-50 text-[#00B074] border border-emerald-200"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/60"
                  }`}
                  title={isCurrentWordSaved ? "Saved in My Vocabulary" : "Bookmark Word"}
                >
                  {isCurrentWordSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyStudyCard}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/60 transition-all cursor-pointer"
                  title="Copy Study Flashcard"
                >
                  {copiedText ? (
                    <Check className="w-4 h-4 text-[#00B074]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Definition Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  English Meaning
                </span>
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {currentEntry.meanings.primaryEnglish}
                </p>
              </div>

              {currentEntry.meanings.primaryAmharic && (
                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/60 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600">
                    ትርጉም (Amharic)
                  </span>
                  <p className="text-sm font-semibold text-emerald-950 leading-snug font-sans">
                    {currentEntry.meanings.primaryAmharic}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Segmented iOS Mode Switcher */}
          <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("lexicon")}
              className={`flex-1 min-w-[70px] text-xs font-semibold py-2 px-2.5 rounded-xl transition-all text-center whitespace-nowrap cursor-pointer ${
                activeTab === "lexicon"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📖 Lexicon
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("grammar")}
              className={`flex-1 min-w-[70px] text-xs font-semibold py-2 px-2.5 rounded-xl transition-all text-center whitespace-nowrap cursor-pointer ${
                activeTab === "grammar"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📐 Grammar & I'rab
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("translation")}
              className={`flex-1 min-w-[70px] text-xs font-semibold py-2 px-2.5 rounded-xl transition-all text-center whitespace-nowrap cursor-pointer ${
                activeTab === "translation"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌐 Nuances
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("quranic")}
              className={`flex-1 min-w-[70px] text-xs font-semibold py-2 px-2.5 rounded-xl transition-all text-center whitespace-nowrap cursor-pointer ${
                activeTab === "quranic"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📜 Quranic ({currentEntry.quranicInsights?.totalOccurrences || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`flex-1 min-w-[70px] text-xs font-semibold py-2 px-2.5 rounded-xl transition-all text-center whitespace-nowrap cursor-pointer ${
                activeTab === "saved"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📇 Saved ({savedWords.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rules")}
              className={`flex-1 min-w-[70px] text-xs font-semibold py-2 px-2.5 rounded-xl transition-all text-center whitespace-nowrap cursor-pointer ${
                activeTab === "rules"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📚 Guide
            </button>
          </div>

          {/* TAB 1: LEXICON & CLASSICAL DICTIONARY */}
          {activeTab === "lexicon" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Classical Arabic Lexicon (Lisan al-Arab / Hans Wehr) */}
              {currentEntry.meanings.classicalArabicDefinition && (
                <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      معجم لسان العرب والقاموس المحيط
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      Classical Lexicon
                    </span>
                  </div>
                  <p
                    dir="rtl"
                    className="font-arabic text-base sm:text-lg text-slate-800 leading-loose bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/60"
                  >
                    {currentEntry.meanings.classicalArabicDefinition}
                  </p>
                </div>
              )}

              {/* Secondary Meanings */}
              {currentEntry.meanings.secondaryEnglish && currentEntry.meanings.secondaryEnglish.length > 0 && (
                <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Extended Contextual Definitions
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    {currentEntry.meanings.secondaryEnglish.map((sec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00B074] mt-2 shrink-0" />
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Synonyms & Antonyms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Synonyms (مرادفات) */}
                <div className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span>المُرَادِفَاتُ</span>
                    <span className="text-[10px] text-emerald-600 font-normal">(Synonyms)</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentEntry.synonyms?.map((syn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSearch(syn.arabic)}
                        className="text-xs bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 font-arabic px-2.5 py-1 rounded-lg border border-emerald-100 cursor-pointer transition-colors"
                      >
                        {syn.arabic} <span className="text-[10px] text-slate-500 font-sans">({syn.english})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Antonyms (أضداد) */}
                <div className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <span>الأَضْدَادُ</span>
                    <span className="text-[10px] text-rose-600 font-normal">(Antonyms)</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentEntry.antonyms?.length ? (
                      currentEntry.antonyms.map((ant, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSearch(ant.arabic)}
                          className="text-xs bg-rose-50/70 hover:bg-rose-100 text-rose-900 font-arabic px-2.5 py-1 rounded-lg border border-rose-100 cursor-pointer transition-colors"
                        >
                          {ant.arabic} <span className="text-[10px] text-slate-500 font-sans">({ant.english})</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No direct antonym specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Eloquent Example Sentences */}
              {currentEntry.examples && currentEntry.examples.length > 0 && (
                <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Classical Usage Examples
                  </h3>
                  <div className="space-y-2.5">
                    {currentEntry.examples.map((ex, idx) => (
                      <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p dir="rtl" className="text-base sm:text-lg font-arabic font-semibold text-slate-900">
                            {ex.arabic}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleSpeak(ex.arabic)}
                            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="Pronounce"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 italic">"{ex.english}"</p>
                        {ex.amharic && (
                          <p className="text-xs text-emerald-800 font-sans">«{ex.amharic}»</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GRAMMAR & I'RAB (الإعراب والصرف) */}
          {activeTab === "grammar" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* I'rab Detailed Syntactic Breakdown */}
              <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    الإِعْرَابُ التَّفْصِيلِيُّ (Grammatical Case Parsing)
                  </h3>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                    Syntax & Nahw
                  </span>
                </div>

                {currentEntry.grammar.irabAnalysis && currentEntry.grammar.irabAnalysis.length > 0 ? (
                  <div className="space-y-2">
                    {currentEntry.grammar.irabAnalysis.map((irab, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              dir="rtl"
                              className="font-arabic font-bold text-lg text-indigo-900"
                            >
                              {irab.word}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                irab.partOfSpeech === "فعل"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : irab.partOfSpeech === "اسم"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {irab.partOfSpeech}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {irab.explanationEnglish}
                          </p>
                        </div>

                        <div className="text-right sm:max-w-xs">
                          <p dir="rtl" className="font-arabic text-sm font-semibold text-slate-800">
                            {irab.role}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {irab.caseOrState}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Word analysis ready. Use this term as part of a sentence for full contextual syntax tree.
                  </p>
                )}
              </div>

              {/* 10 Verb Forms Morphological Chart (الأوزان الصرفية) */}
              {currentEntry.grammar.morphologicalForms && currentEntry.grammar.morphologicalForms.length > 0 && (
                <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      تَصْرِيفُ الأَفْعَالِ وَالأَوْزَانِ (Morphological Conjugation Table)
                    </h3>
                    <span className="text-[10px] bg-emerald-50 text-[#00B074] font-semibold px-2 py-0.5 rounded-full">
                      Sarf Engine
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px]">
                          <th className="py-2.5 px-3">Form</th>
                          <th className="py-2.5 px-3 text-right">Past (مَاضٍ)</th>
                          <th className="py-2.5 px-3 text-right">Present (مُضَارِع)</th>
                          <th className="py-2.5 px-3 text-right">Masdar (مَصْدَر)</th>
                          <th className="py-2.5 px-3 text-right">Participle (فَاعِل)</th>
                          <th className="py-2.5 px-3">Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentEntry.grammar.morphologicalForms.map((form, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                              {form.formNumber}
                            </td>
                            <td dir="rtl" className="py-2.5 px-3 font-arabic text-sm text-emerald-800 font-semibold text-right">
                              {form.past}
                            </td>
                            <td dir="rtl" className="py-2.5 px-3 font-arabic text-sm text-slate-800 text-right">
                              {form.present}
                            </td>
                            <td dir="rtl" className="py-2.5 px-3 font-arabic text-sm text-slate-800 text-right">
                              {form.verbalNoun}
                            </td>
                            <td dir="rtl" className="py-2.5 px-3 font-arabic text-sm text-indigo-800 text-right">
                              {form.activeParticiple}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 max-w-xs">
                              {form.meaning}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRANSLATION & NUANCES */}
          {activeTab === "translation" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Dual Translation & Linguistic Nuances
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setTargetLanguage("Both")}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        targetLanguage === "Both" ? "bg-white font-bold shadow-2xs" : "text-slate-500"
                      }`}
                    >
                      Both
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetLanguage("English")}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        targetLanguage === "English" ? "bg-white font-bold shadow-2xs" : "text-slate-500"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetLanguage("Amharic")}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        targetLanguage === "Amharic" ? "bg-white font-bold shadow-2xs" : "text-slate-500"
                      }`}
                    >
                      አማ
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* English Translation */}
                  {(targetLanguage === "Both" || targetLanguage === "English") && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        English Translation & Context
                      </span>
                      <p className="text-sm text-slate-800 font-medium">
                        {currentEntry.meanings.primaryEnglish}
                      </p>
                      {currentEntry.meanings.hansWehrEquivalent && (
                        <p className="text-xs text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                          Lexicon: {currentEntry.meanings.hansWehrEquivalent}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Amharic Translation */}
                  {(targetLanguage === "Both" || targetLanguage === "Amharic") && (
                    <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-600">
                        የአማርኛ ትርጉምና ማብራሪያ (Amharic Translation)
                      </span>
                      <p className="text-sm text-emerald-950 font-medium font-sans">
                        {currentEntry.meanings.primaryAmharic || "ትርጉም በመጫን ላይ ነው..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QURANIC OCCURRENCES */}
          {activeTab === "quranic" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      الاسْتِعْمَالُ القُرْآنِيُّ (Quranic Frequency & Context)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Occurs approximately{" "}
                      <span className="font-bold text-[#00B074]">
                        {currentEntry.quranicInsights?.totalOccurrences || 0} times
                      </span>{" "}
                      across the Holy Quran
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    {currentEntry.rootInfo?.root || "جذر"}
                  </span>
                </div>

                {/* Spiritual Reflection */}
                {currentEntry.quranicInsights?.spiritualLesson && (
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed space-y-1">
                    <span className="font-bold block text-emerald-800">
                      💡 Spiritual & Theological Reflection:
                    </span>
                    <p>{currentEntry.quranicInsights.spiritualLesson}</p>
                  </div>
                )}

                {/* Key Quranic Verses */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Prominent Quranic Ayahs
                  </span>
                  {currentEntry.quranicInsights?.keyVerses && currentEntry.quranicInsights.keyVerses.length > 0 ? (
                    currentEntry.quranicInsights.keyVerses.map((verse, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">
                            Surah {verse.surahNameEnglish} [{verse.surahNumber}:{verse.ayahNumber}]
                          </span>
                          <span className="font-arabic text-slate-500">
                            سورة {verse.surahNameArabic}
                          </span>
                        </div>
                        <p
                          dir="rtl"
                          className="font-arabic text-lg sm:text-xl text-right text-slate-900 leading-loose"
                        >
                          {verse.ayahArabic}
                        </p>
                        <p className="text-xs text-slate-700 italic">
                          "{verse.ayahTranslation}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      This root appears throughout multiple Surahs. Explore the Quran module to view comprehensive concordances.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAVED VOCABULARY & FLASHCARDS */}
          {activeTab === "saved" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      My Vocabulary & Flashcards ({savedWords.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Saved words synchronize across your devices with Firestore
                    </p>
                  </div>

                  {savedWords.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                      className="text-xs font-semibold bg-emerald-50 text-[#00B074] hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {flashcardFlipped ? "Show Arabic" : "Flip Flashcard"}
                    </button>
                  )}
                </div>

                {savedWords.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <BookMarked className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-medium text-slate-600">No saved words yet</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Tap the bookmark icon on any dictionary entry to build your personalized Arabic study list.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Active Flashcard Viewer */}
                    {savedWords[activeFlashcardIndex] && (
                      <div
                        onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                        className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm text-center space-y-3 cursor-pointer hover:shadow-md transition-shadow select-none min-h-[160px] flex flex-col items-center justify-center"
                      >
                        <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono">
                          Flashcard {activeFlashcardIndex + 1} of {savedWords.length} (Tap to Flip)
                        </span>

                        {!flashcardFlipped ? (
                          <p dir="rtl" className="text-3xl font-arabic font-bold text-white">
                            {savedWords[activeFlashcardIndex].tashkeel}
                          </p>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-emerald-300">
                              {savedWords[activeFlashcardIndex].meaningEnglish}
                            </p>
                            {savedWords[activeFlashcardIndex].meaningAmharic && (
                              <p className="text-sm text-slate-300">
                                {savedWords[activeFlashcardIndex].meaningAmharic}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Word Carousel / Next / Prev */}
                    {savedWords.length > 1 && (
                      <div className="flex items-center justify-between px-2 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveFlashcardIndex((prev) =>
                              prev > 0 ? prev - 1 : savedWords.length - 1
                            );
                            setFlashcardFlipped(false);
                          }}
                          className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                        >
                          ← Previous
                        </button>
                        <span className="text-slate-400 font-mono">
                          {activeFlashcardIndex + 1} / {savedWords.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveFlashcardIndex((prev) =>
                              prev < savedWords.length - 1 ? prev + 1 : 0
                            );
                            setFlashcardFlipped(false);
                          }}
                          className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    )}

                    {/* List of Saved Words */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {savedWords.map((w, idx) => (
                        <div
                          key={w.id || idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              handleSearch(w.word);
                              setActiveTab("lexicon");
                            }}
                            className="text-left flex items-center gap-3 cursor-pointer"
                          >
                            <span dir="rtl" className="font-arabic font-bold text-lg text-slate-900">
                              {w.tashkeel || w.word}
                            </span>
                            <span className="text-xs text-slate-600">
                              {w.meaningEnglish}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const filtered = savedWords.filter((item) => item.word !== w.word);
                              setSavedWords(filtered);
                              localStorage.setItem("muslim_daily_qamus_saved", JSON.stringify(filtered));
                              if (user) {
                                deleteDoc(doc(db, "users", user.uid, "vocabulary", w.word)).catch((e) =>
                                  handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/vocabulary/${w.word}`)
                                );
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded-md cursor-pointer"
                            title="Remove from saved"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: GRAMMAR REFERENCE RULES */}
          {activeTab === "rules" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Essential Classical Arabic Grammar Handbook (الْمُقَدِّمَةُ النَّحْوِيَّةُ)
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                    Nahw & Sarf
                  </span>
                </div>

                <div className="space-y-4">
                  {grammarRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span dir="rtl" className="font-arabic font-bold text-lg text-emerald-900">
                          {rule.titleArabic}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {rule.titleEnglish}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rule.summary}
                      </p>

                      {rule.chart && rule.chart.length > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-slate-200/50 space-y-1.5 text-xs">
                          {rule.chart.map((c, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-100 last:border-0"
                            >
                              <span className="font-semibold text-slate-800 font-arabic">
                                {c.label}
                              </span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                {c.formula}
                              </span>
                              <span dir="rtl" className="font-arabic text-emerald-800 font-bold">
                                {c.example}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QamusApp;
