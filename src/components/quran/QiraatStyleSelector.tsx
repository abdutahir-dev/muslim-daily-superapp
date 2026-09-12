import React, { useState } from "react";
import { Sparkles, Info, Check, Globe, ChevronDown } from "lucide-react";
import { QuranReadingStyle } from "../../types";
import {
  READING_STYLES_LIST,
  ReadingStyleDetail,
  getReadingStyleDetail,
} from "../../lib/qiraatData";

interface QiraatStyleSelectorProps {
  currentStyle: QuranReadingStyle;
  onSelectStyle: (style: QuranReadingStyle) => void;
  compact?: boolean;
}

export const QiraatStyleSelector: React.FC<QiraatStyleSelectorProps> = ({
  currentStyle,
  onSelectStyle,
  compact = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ReadingStyleDetail | null>(null);

  const activeStyleDetail = getReadingStyleDetail(currentStyle);

  const handleOpenDetail = (style: ReadingStyleDetail, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDetail(style);
  };

  return (
    <>
      {/* Selector Trigger */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#007A78]/10 text-[#007A78] hover:bg-[#007A78]/15 active:scale-95 transition-all text-xs font-semibold cursor-pointer border border-[#007A78]/20"
          title="Change Quran Reading Style (Riwayah)"
        >
          <span className="font-arabic font-normal text-[13px]">{activeStyleDetail.nameArabic.split(" ")[1] || "حفص"}</span>
          <span className="text-[10px] font-medium hidden xs:inline">({activeStyleDetail.nameEnglish.split(" ")[0]})</span>
          <ChevronDown className="w-3 h-3 text-[#007A78]" />
        </button>
      ) : (
        <div className="ios-card p-3 border border-black/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#007A78]/10 text-[#007A78] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-[#1C1C1E]">Reading Style:</span>
                <span className="text-xs font-bold text-[#007A78]">
                  {activeStyleDetail.nameEnglish}
                </span>
                {activeStyleDetail.isHornOfAfricaHistoric && (
                  <span className="text-[9px] font-bold text-[#FF9500] bg-[#FF9500]/10 px-1.5 py-0.5 rounded-full">
                    Horn of Africa & Sudan
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#8E8E93] truncate">
                {activeStyleDetail.nameArabic} • {activeStyleDetail.regions[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedDetail(activeStyleDetail)}
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#8E8E93] hover:text-[#1C1C1E] active:scale-95 cursor-pointer"
              title="Reading Style Rules & Usul"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#007A78] text-white text-xs font-semibold active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>Change</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Reading Style Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-[24px] shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-black/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1C1C1E] flex items-center gap-2">
                  <span>Quran Reading Styles</span>
                  <span className="font-arabic text-sm text-[#007A78]">(القراءات والروايات)</span>
                </h3>
                <p className="text-xs text-[#8E8E93] mt-0.5">
                  Select authentic Riwayah for text vocalization and recitations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#767680]/10 text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center active:scale-95 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List of Styles */}
            <div className="p-3 overflow-y-auto space-y-2 divide-y divide-black/[0.04]">
              {READING_STYLES_LIST.map((style) => {
                const isSelected = currentStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => {
                      onSelectStyle(style.id);
                      setIsModalOpen(false);
                    }}
                    className={`pt-2 first:pt-0 p-3 rounded-[16px] transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#007A78]/8 border border-[#007A78]/30"
                        : "hover:bg-[#767680]/5"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-semibold text-[#1C1C1E]">
                          {style.nameEnglish}
                        </span>
                        <span className="font-arabic text-xs text-[#007A78] font-normal">
                          {style.nameArabic}
                        </span>
                        {style.isHornOfAfricaHistoric && (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            Horn of Africa & Sudan
                          </span>
                        )}
                        {style.id === "hafs" && (
                          <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            Global Standard
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#8E8E93] line-clamp-1 mb-1">
                        {style.description}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-[#8E8E93]">
                        <span>
                          <strong>Rawi:</strong> {style.rawiNameEnglish.split(" (")[0]}
                        </span>
                        <span>
                          <strong>Imam:</strong> {style.imamNameEnglish.split(" (")[0]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleOpenDetail(style, e)}
                        className="p-1.5 rounded-full text-[#8E8E93] hover:text-[#007A78] hover:bg-[#007A78]/10 cursor-pointer transition-colors"
                        title="View Tajweed & Usul Rules"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? "bg-[#007A78] text-white" : "border border-black/20"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer Note */}
            <div className="p-3 bg-[#F2F2F7] border-t border-black/[0.06] text-center">
              <p className="text-[11px] text-[#8E8E93] flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#007A78]" />
                <span>
                  All ten readings are mutawatir (continuous mass transmission) from Prophet Muhammad ﷺ.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reading Style Details / Usul Modal */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-[24px] shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Details Header */}
            <div className="p-4 border-b border-black/[0.06] flex items-center justify-between bg-[#007A78]/5">
              <div>
                <span className="text-[10px] font-bold text-[#007A78] uppercase tracking-wider">
                  Reading Style & Usul
                </span>
                <h3 className="text-base font-bold text-[#1C1C1E]">
                  {selectedDetail.nameEnglish}
                </h3>
                <p className="font-arabic text-sm text-[#007A78]">{selectedDetail.nameArabic}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="w-7 h-7 rounded-full bg-[#767680]/10 text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center active:scale-95 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Details Content */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Amharic Summary */}
              <div className="bg-[#007A78]/10 rounded-[14px] p-3 border border-[#007A78]/20">
                <p className="text-xs text-[#007A78] font-medium leading-relaxed">
                  {selectedDetail.descriptionAmharic}
                </p>
                <p className="text-[10px] text-[#007A78]/80 mt-1">
                  <strong>ክልሎች፡</strong> {selectedDetail.regionsAmharic}
                </p>
              </div>

              {/* Bio & Origins */}
              <div className="space-y-1.5 text-xs text-[#1C1C1E]">
                <div className="flex justify-between py-1 border-b border-black/[0.05]">
                  <span className="text-[#8E8E93]">Primary Rawi:</span>
                  <span className="font-semibold text-right">{selectedDetail.rawiNameEnglish}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.05]">
                  <span className="text-[#8E8E93]">Imam of Reading:</span>
                  <span className="font-semibold text-right">{selectedDetail.imamNameEnglish}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.05]">
                  <span className="text-[#8E8E93]">Historic Center:</span>
                  <span className="font-semibold">{selectedDetail.centerCity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.05]">
                  <span className="text-[#8E8E93]">Geographic Spread:</span>
                  <span className="font-semibold text-right">{selectedDetail.regions.join(", ")}</span>
                </div>
              </div>

              {/* Usul Rules */}
              <div>
                <h4 className="text-xs font-bold text-[#1C1C1E] mb-2 uppercase tracking-wide">
                  Key Tajweed Rules & Usul (الأصول)
                </h4>
                <div className="space-y-2">
                  {selectedDetail.keyUsulRules.map((rule, idx) => (
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

            {/* Details Footer */}
            <div className="p-3 border-t border-black/[0.06] flex items-center justify-between bg-white">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectStyle(selectedDetail.id);
                  setSelectedDetail(null);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 rounded-full bg-[#007A78] text-white text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                Apply This Reading Style
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
