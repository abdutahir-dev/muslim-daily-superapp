import React, { useState } from "react";
import {
  Heart,
  Star,
  Share2,
  Check,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";

export interface QuoteItem {
  id: string;
  category: string;
  categoryArabic: string;
  arabic: string;
  translation: string;
  source: string;
  sourceArabic: string;
  likes: number;
}

export const ISLAMIC_QUOTES: QuoteItem[] = [
  {
    id: "quote-justice",
    category: "Justice",
    categoryArabic: "مدح العدل",
    arabic: "إِنَّ اللَّهَ سُبْحَانَهُ أَمَرَ بِالْعَدْلِ وَالإِحْسَانِ، وَنَهَى عَنِ الفَحْشَاءِ وَالظُّلْمِ",
    translation: "Verily Allah, the Glorified, has enjoined justice and benevolence and has forbidden indecency and injustice.",
    source: "Ghurar al-Hikam wa Durar al-Kalim",
    sourceArabic: "غرر الحكم ودرر الكلم --",
    likes: 342,
  },
  {
    id: "quote-knowledge",
    category: "Knowledge",
    categoryArabic: "فضل العلم",
    arabic: "قِيمَةُ كُلِّ امْرِئٍ مَا يُحْسِنُهُ",
    translation: "The value of every individual is according to that which they excel at.",
    source: "Nahj al-Balaghah",
    sourceArabic: "نهج البلاغة --",
    likes: 289,
  },
  {
    id: "quote-patience",
    category: "Patience",
    categoryArabic: "الصبر",
    arabic: "الصَّبْرُ مِنَ الإِيمَانِ كَالرَّأْسِ مِنَ الْجَسَدِ",
    translation: "Patience in relation to faith is like the head in relation to the body; when the head is lost, the body is lost.",
    source: "Nahj al-Balaghah",
    sourceArabic: "نهج البلاغة --",
    likes: 412,
  },
  {
    id: "quote-kindness",
    category: "Good Character",
    categoryArabic: "حسن الخلق",
    arabic: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ",
    translation: "I was sent only to complete the nobility of good character.",
    source: "Musnad Ahmad",
    sourceArabic: "مسند أحمد --",
    likes: 520,
  },
  {
    id: "quote-humility",
    category: "Humility",
    categoryArabic: "التواضع",
    arabic: "مَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    translation: "No one humbles themselves for the sake of Allah except that Allah elevates them.",
    source: "Sahih Muslim",
    sourceArabic: "صحيح مسلم --",
    likes: 387,
  },
  {
    id: "quote-speech",
    category: "Wisdom",
    categoryArabic: "حفظ اللسان",
    arabic: "إِذَا تَمَّ الْعَقْلُ نَقَصَ الْكَلَامُ",
    translation: "When intellect reaches completion, speech becomes concise and measured.",
    source: "Ghurar al-Hikam",
    sourceArabic: "غرر الحكم --",
    likes: 276,
  },
  {
    id: "quote-gratitude",
    category: "Gratitude",
    categoryArabic: "الشكر",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: "If you are grateful, I will surely increase you [in favor].",
    source: "Quran (14:7)",
    sourceArabic: "سورة إبراهيم --",
    likes: 645,
  },
];

export const QuotesApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("muslim_daily_saved_quotes");
      return saved ? JSON.parse(saved) : { "quote-justice": true };
    } catch {
      return { "quote-justice": true };
    }
  });
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ISLAMIC_QUOTES.forEach((q) => {
      initial[q.id] = q.likes;
    });
    return initial;
  });
  const [likedList, setLikedList] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Justice", "Good Character", "Knowledge", "Patience", "Wisdom", "Gratitude"];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("muslim_daily_saved_quotes", JSON.stringify(next));
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLikedList((prev) => {
      const isLiked = !prev[id];
      setLikes((cur) => ({
        ...cur,
        [id]: (cur[id] || 0) + (isLiked ? 1 : -1),
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleCopy = (quote: QuoteItem) => {
    const text = `"${quote.arabic}"\n${quote.translation}\n— ${quote.source}`;
    navigator.clipboard.writeText(text);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuotes = ISLAMIC_QUOTES.filter((q) => {
    const matchesCategory = activeCategory === "All" || q.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      q.arabic.includes(searchQuery) ||
      q.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="quotes-view" className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Islamic Wisdom & Quotes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Timeless pearls from the Quran, Sunnah, and noble sages
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#00B074]/10 text-[#00B074] flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl border border-gray-200/80 px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search wisdom, virtues, justice, patience..."
          className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-gray-400 hover:text-gray-600 px-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
              activeCategory === cat
                ? "bg-[#00B074] text-white shadow-xs"
                : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quote Cards */}
      <div className="space-y-3">
        {filteredQuotes.map((quote) => {
          const isFav = !!favorites[quote.id];
          const isLiked = !!likedList[quote.id];
          const isCopied = copiedId === quote.id;

          return (
            <div
              key={quote.id}
              className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-xs space-y-3 transition-all hover:border-gray-200"
            >
              {/* Card Top Row: Badge + Actions */}
              <div className="flex items-center justify-between">
                <span className="border border-[#00B074] text-[#00B074] px-3 py-0.5 rounded-full text-xs font-medium">
                  {quote.categoryArabic}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(quote.id)}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      isFav
                        ? "text-amber-500 bg-amber-50"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}
                    title={isFav ? "Saved to Favorites" : "Save Quote"}
                  >
                    <Star className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLike(quote.id)}
                    className={`p-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                      isLiked
                        ? "text-rose-500 bg-rose-50"
                        : "text-gray-400 hover:text-rose-500 hover:bg-gray-50"
                    }`}
                    title="Like Quote"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-[10px] font-medium text-slate-500">
                      {likes[quote.id]}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(quote)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    title="Copy Quote"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-[#00B074]" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Verse / Quote */}
              <p
                dir="rtl"
                className="font-arabic text-xl sm:text-2xl text-right text-[#0F172A] leading-loose pt-1"
              >
                {quote.arabic}
              </p>

              {/* English Translation */}
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                "{quote.translation}"
              </p>

              {/* Source attribution */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                <span className="text-slate-400">{quote.source}</span>
                <span className="text-[#009688] font-arabic font-medium">
                  {quote.sourceArabic}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
