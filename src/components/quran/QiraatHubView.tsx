import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Globe,
  Check,
  ChevronRight,
  Search,
  Volume2,
  Info,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { QuranReadingStyle } from "../../types";
import {
  READING_STYLES_LIST,
  ReadingStyleDetail,
  RECITERS_CATALOG,
  getRecitersForReadingStyle,
} from "../../lib/qiraatData";

interface QiraatHubViewProps {
  currentStyle: QuranReadingStyle;
  onSelectStyle: (style: QuranReadingStyle) => void;
  onOpenSurahWithStyle?: (surahNumber: number, style: QuranReadingStyle) => void;
}

export const QiraatHubView: React.FC<QiraatHubViewProps> = ({
  currentStyle,
  onSelectStyle,
  onOpenSurahWithStyle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyleDetail, setSelectedStyleDetail] = useState<ReadingStyleDetail | null>(null);

  const filteredStyles = READING_STYLES_LIST.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      s.regions.some((r) => r.toLowerCase().includes(q)) ||
      s.rawiNameEnglish.toLowerCase().includes(q) ||
      s.imamNameEnglish.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-8">
      {/* Hero Banner */}
      <div className="ios-card p-5 border border-black/[0.06] bg-gradient-to-br from-[#007A78]/10 via-[#007A78]/5 to-transparent relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#007A78] text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-[#007A78] uppercase tracking-wider">
                The Science of Recitations
              </span>
              <h2 className="text-xl font-bold text-[#1C1C1E]">
                The Canonical Qira'at (القراءات القرآنية)
              </h2>
            </div>
          </div>

          <p className="text-xs text-[#636366] leading-relaxed max-w-2xl mb-3">
            The Noble Quran was revealed upon seven ahruf (divinely sanctioned dialectical variations)
            and preserved through mutawatir (mass continuous transmission) lines of recitation. Explore
            the canonical readings—including <strong>Ad-Duri</strong> (Horn of Africa & Sudan),{" "}
            <strong>Warsh</strong> (North & West Africa), <strong>Qalun</strong>, and the global standard{" "}
            <strong>Hafs</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-[12px] bg-white/80 border border-black/[0.04]">
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Divine Origin</span>
              <p className="font-semibold text-[#1C1C1E] mt-0.5">Hadith of 7 Ahruf</p>
              <p className="text-[10px] text-[#8E8E93]">Narrated in Sahih Bukhari & Muslim</p>
            </div>
            <div className="p-2.5 rounded-[12px] bg-white/80 border border-black/[0.04]">
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase">10 Imams & 20 Ruwat</span>
              <p className="font-semibold text-[#1C1C1E] mt-0.5">Unbroken Transmission</p>
              <p className="text-[10px] text-[#8E8E93]">Isnad connected directly to the Prophet ﷺ</p>
            </div>
            <div className="p-2.5 rounded-[12px] bg-white/80 border border-black/[0.04]">
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase">East Africa Heritage</span>
              <p className="font-semibold text-[#007A78] mt-0.5">Ad-Duri 'an Abi 'Amr</p>
              <p className="text-[10px] text-[#8E8E93]">Historic reading of Sudan & Ethiopia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by reading style, reciter, region (e.g. Sudan, Warsh, Duri)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-[16px] bg-[#F2F2F7] border border-black/[0.06] text-xs text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#007A78]/30 transition-all"
        />
      </div>

      {/* Reading Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredStyles.map((style) => {
          const isCurrent = currentStyle === style.id;
          const reciters = getRecitersForReadingStyle(style.id);

          return (
            <div
              key={style.id}
              className={`ios-card p-4 border transition-all flex flex-col justify-between ${
                isCurrent
                  ? "border-[#007A78]/40 bg-[#007A78]/5 shadow-sm"
                  : "border-black/[0.06] hover:border-black/[0.12]"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-[#1C1C1E]">{style.nameEnglish}</h3>
                      {style.isHornOfAfricaHistoric && (
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          Horn of Africa
                        </span>
                      )}
                      {style.id === "hafs" && (
                        <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          Global Standard
                        </span>
                      )}
                    </div>
                    <p className="font-arabic text-sm text-[#007A78] mt-0.5">{style.nameArabic}</p>
                  </div>

                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#007A78] bg-[#007A78]/10 px-2 py-0.5 rounded-full shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectStyle(style.id)}
                      className="text-xs font-semibold text-[#007A78] hover:text-[#005c5a] px-2.5 py-1 rounded-full bg-black/[0.03] hover:bg-[#007A78]/10 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      Select
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[#636366] line-clamp-2 mb-3 leading-relaxed">
                  {style.description}
                </p>

                {/* Region & Transmission */}
                <div className="space-y-1 text-[11px] text-[#8E8E93] mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#007A78] shrink-0" />
                    <span className="truncate">
                      <strong>Regions:</strong> {style.regions.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#007A78] shrink-0" />
                    <span className="truncate">
                      <strong>Imam:</strong> {style.imamNameEnglish.split(" (")[0]}
                    </span>
                  </div>
                </div>

                {/* Reciters Preview */}
                <div className="pt-2 border-t border-black/[0.04] mb-3">
                  <span className="text-[10px] font-semibold text-[#8E8E93] uppercase block mb-1">
                    Authentic Reciters ({reciters.length})
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {reciters.slice(0, 3).map((r) => (
                      <span
                        key={r.id}
                        className="text-[10px] font-medium text-[#1C1C1E] bg-[#F2F2F7] px-2 py-0.5 rounded-md"
                      >
                        {r.nameEnglish.split(" (")[0]}
                      </span>
                    ))}
                    {reciters.length > 3 && (
                      <span className="text-[10px] text-[#8E8E93]">+{reciters.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => setSelectedStyleDetail(style)}
                  className="flex-1 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-[#1C1C1E] flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>Usul & Rules</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectStyle(style.id);
                    if (onOpenSurahWithStyle) {
                      onOpenSurahWithStyle(1, style.id); // Open Al-Fatihah with this style
                    }
                  }}
                  className="flex-1 py-1.5 rounded-full bg-[#007A78] hover:bg-[#005c5a] text-white text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  <span>Recite Al-Fatihah</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reading Style Details Modal */}
      {selectedStyleDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedStyleDetail(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-[24px] shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-black/[0.06] flex items-center justify-between bg-[#007A78]/5">
              <div>
                <span className="text-[10px] font-bold text-[#007A78] uppercase tracking-wider">
                  Reading Style & Tajweed Principles
                </span>
                <h3 className="text-base font-bold text-[#1C1C1E]">
                  {selectedStyleDetail.nameEnglish}
                </h3>
                <p className="font-arabic text-sm text-[#007A78]">
                  {selectedStyleDetail.nameArabic}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStyleDetail(null)}
                className="w-7 h-7 rounded-full bg-[#767680]/10 text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center active:scale-95 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="bg-[#007A78]/10 rounded-[14px] p-3 border border-[#007A78]/20">
                <p className="text-xs text-[#007A78] font-medium leading-relaxed">
                  {selectedStyleDetail.descriptionAmharic}
                </p>
                <p className="text-[10px] text-[#007A78]/80 mt-1">
                  <strong>ክልሎች፡</strong> {selectedStyleDetail.regionsAmharic}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#1C1C1E]">
                <div className="flex justify-between py-1 border-b border-black/[0.05]">
                  <span className="text-[#8E8E93]">Rawi (Transmitter):</span>
                  <span className="font-semibold text-right">
                    {selectedStyleDetail.rawiNameEnglish}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.05]">
                  <span className="text-[#8E8E93]">Imam (Qari):</span>
                  <span className="font-semibold text-right">
                    {selectedStyleDetail.imamNameEnglish}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.05]">
                  <span className="text-[#8E8E93]">Historic Center:</span>
                  <span className="font-semibold">{selectedStyleDetail.centerCity}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#1C1C1E] mb-2 uppercase tracking-wide">
                  Key Usul Rules (الأصول)
                </h4>
                <div className="space-y-2">
                  {selectedStyleDetail.keyUsulRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-[12px] bg-[#F2F2F7] border border-black/[0.04]"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-[#1C1C1E]">
                          {rule.ruleEnglish}
                        </span>
                        <span className="font-arabic text-xs text-[#007A78]">
                          {rule.ruleArabic}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#636366] leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-black/[0.06] flex items-center justify-between bg-white">
              <button
                type="button"
                onClick={() => setSelectedStyleDetail(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectStyle(selectedStyleDetail.id);
                  setSelectedStyleDetail(null);
                }}
                className="px-4 py-2 rounded-full bg-[#007A78] text-white text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                Activate This Reading Style
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
