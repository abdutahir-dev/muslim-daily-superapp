import React, { useState, useEffect } from "react";
import { X, Search, BookMarked, Copy, Check, Sparkles, BookOpen } from "lucide-react";
import { apiClient, HadithBook, HadithItem } from "../services/apiClient";

interface HadithModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HadithModal: React.FC<HadithModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("all");
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadBooks = async () => {
      try {
        const bookList = await apiClient.hadith.getBooks();
        setBooks(bookList);
      } catch (e) {
        console.warn("Could not fetch Hadith books:", e);
      }
    };

    loadBooks();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const loadContent = async () => {
      setLoading(true);
      try {
        if (search.trim()) {
          const results = await apiClient.hadith.search(
            search.trim(),
            selectedBook === "all" ? undefined : selectedBook
          );
          setHadiths(results);
        } else if (selectedBook !== "all") {
          const chapterData = await apiClient.hadith.getChapter(selectedBook, 1);
          setHadiths(chapterData.hadiths || []);
        } else {
          const daily = await apiClient.hadith.getDaily();
          const sampleChapter = await apiClient.hadith.getChapter("bukhari", 1);
          const sampleNawawi = await apiClient.hadith.getChapter("nawawi40", 1);
          setHadiths([daily, ...sampleChapter.hadiths, ...sampleNawawi.hadiths]);
        }
      } catch (err) {
        console.warn("Error loading Hadith items:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadContent();
    }, 250);

    return () => clearTimeout(timer);
  }, [isOpen, search, selectedBook]);

  if (!isOpen) return null;

  const handleCopy = (item: HadithItem) => {
    navigator.clipboard.writeText(`${item.arabic}\n\n"${item.translationEnglish}"\n— ${item.narrator} (${item.bookSlug})`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Prophetic Hadith Explorer</h3>
              <p className="text-xs text-slate-500">Authentic Kutub al-Sittah & 40 Hadith collections</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Selector Pills */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedBook("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedBook === "all"
                  ? "bg-[#007A78] text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Collections
            </button>
            {books.map((b) => (
              <button
                key={b.slug}
                onClick={() => setSelectedBook(b.slug)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedBook === b.slug
                    ? "bg-[#007A78] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, narrator, English, or Arabic..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-gray-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-[#007A78] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading authentic Hadith...</span>
            </div>
          ) : hadiths.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching Hadith found for "{search}". Try searching for intention, prayer, charity, or fasting.
            </div>
          ) : (
            hadiths.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2.5 shadow-2xs hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold">
                    {item.bookSlug.toUpperCase()} #{item.hadithNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.grade && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                        {item.grade}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className="p-1 text-gray-400 hover:text-slate-700 rounded-md cursor-pointer"
                      title="Copy Hadith"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p dir="rtl" className="font-arabic text-base text-right text-slate-900 leading-relaxed pt-1">
                  {item.arabic}
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{item.translationEnglish}"
                </p>

                {item.translationAmharic && (
                  <p className="text-xs text-[#8E8E93] leading-relaxed">
                    {item.translationAmharic}
                  </p>
                )}

                <div className="text-[11px] text-slate-400 pt-1 border-t border-gray-100 flex items-center justify-between">
                  <span>Narrated by: <strong className="text-slate-700">{item.narrator}</strong></span>
                  <span className="text-[10px] text-slate-400">Chapter {item.chapterNumber}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
