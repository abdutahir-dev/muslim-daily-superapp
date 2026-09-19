export type QamusMode = "dictionary" | "grammar" | "translation" | "quranic" | "all";

export interface QamusLookupRequest {
  query: string;
  mode?: QamusMode;
  targetLanguage?: "English" | "Amharic" | "Both";
  context?: string;
}

export interface QamusRootInfo {
  root: string; // e.g. "ك-ت-ب"
  rootArabic: string; // "كتب"
  transliteration: string; // "k-t-b"
  generalMeaning: string; // "writing, recording, decreeing"
  occurrencesInQuran: number;
}

export interface QamusMorphologyForm {
  formNumber: string; // e.g. "Form I (فَعَلَ)", "Form II (فَعَّلَ)"
  past: string; // e.g. "كَتَبَ"
  present: string; // e.g. "يَكْتُبُ"
  verbalNoun: string; // e.g. "كِتَابَةٌ"
  activeParticiple: string; // e.g. "كَاتِبٌ"
  passiveParticiple?: string; // e.g. "مَكْتُوبٌ"
  meaning: string; // e.g. "to write, to author"
}

export interface QamusIrabElement {
  word: string; // e.g. "كَتَبَ"
  transliteration: string;
  partOfSpeech: "فعل" | "اسم" | "حرف";
  role: string; // e.g. "فعل ماض مبني على الفتح"
  caseOrState: string; // e.g. "مبني على الفتح", "مرفوع بالضمة"
  explanationEnglish: string;
}

export interface QamusQuranicOccurrence {
  surahNumber: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahArabic: string;
  ayahTranslation: string;
  highlightedWord: string;
}

export interface QamusEntry {
  query: string;
  normalizedQuery: string;
  wordType: "noun" | "verb" | "particle" | "root" | "phrase";
  tashkeel: string; // Full voweling e.g. "كِتَابٌ"
  transliteration: string; // "kitāb"
  phoneticSpelling?: string;
  rootInfo?: QamusRootInfo;
  meanings: {
    primaryEnglish: string;
    primaryAmharic?: string;
    secondaryEnglish?: string[];
    classicalArabicDefinition?: string; // Lisan al-Arab / Qamus al-Muhit
    hansWehrEquivalent?: string;
  };
  grammar: {
    partOfSpeechArabic: string; // اسم / فعل / حرف
    partOfSpeechEnglish: string;
    grammaticalGender?: "masculine" | "feminine";
    number?: "singular" | "dual" | "plural";
    pluralForm?: string; // e.g. "كُتُبٌ"
    patterns?: string; // Wazn e.g. "فِعَالٌ"
    irabAnalysis?: QamusIrabElement[];
    morphologicalForms?: QamusMorphologyForm[];
  };
  synonyms: Array<{ arabic: string; english: string }>;
  antonyms: Array<{ arabic: string; english: string }>;
  examples: Array<{
    arabic: string;
    english: string;
    amharic?: string;
  }>;
  quranicInsights?: {
    totalOccurrences: number;
    surahsWithHighFrequency: string[];
    spiritualLesson: string;
    keyVerses: QamusQuranicOccurrence[];
  };
  source: "gemini-ai" | "lexicon-db";
  timestamp: number;
}

export interface QamusLookupResponse {
  status: "success" | "error";
  entry?: QamusEntry;
  suggestedRoots?: QamusRootInfo[];
  error?: string;
  details?: string;
}

export interface QamusGrammarRule {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  category: "sarf" | "nahw" | "harf" | "i'rab";
  summary: string;
  examples: Array<{ arabic: string; translation: string; note: string }>;
  chart?: Array<{ label: string; formula: string; example: string }>;
}
