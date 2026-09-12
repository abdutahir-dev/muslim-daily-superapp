import React from "react";
import { BookOpen, Sparkles, Volume2, Info, ArrowRight } from "lucide-react";
import { QiraatDifferenceItem } from "../../types";

interface QiraatDifferenceModalProps {
  difference: QiraatDifferenceItem | null;
  onClose: () => void;
  onPlayAyahAudio?: () => void;
}

export const QiraatDifferenceModal: React.FC<QiraatDifferenceModalProps> = ({
  difference,
  onClose,
  onPlayAyahAudio,
}) => {
  if (!difference) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-[24px] shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-black/[0.06] flex items-center justify-between bg-[#007A78]/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#007A78]">
                  Qira'at Difference
                </span>
                <span className="text-xs text-[#8E8E93]">
                  (Surah {difference.surahNumber}, Ayah {difference.ayahNumber})
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#1C1C1E]">
                {difference.topic}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#767680]/10 text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center active:scale-95 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Hafs Card */}
            <div className="p-3.5 rounded-[16px] bg-[#F2F2F7] border border-black/[0.05]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#8E8E93]">Hafs 'an 'Asim</span>
                <span className="font-arabic text-xs text-[#8E8E93]">حفص عن عاصم</span>
              </div>
              <p className="font-arabic text-xl text-right text-[#1C1C1E] leading-loose dir-rtl select-text">
                {difference.hafsText}
              </p>
              <span className="inline-block mt-2 text-[10px] text-[#8E8E93] font-medium">
                Standard transmission
              </span>
            </div>

            {/* Variant Card */}
            <div className="p-3.5 rounded-[16px] bg-[#007A78]/8 border border-[#007A78]/25">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#007A78]">
                  {difference.styleNameEnglish}
                </span>
                <span className="font-arabic text-xs text-[#007A78]">
                  {difference.styleNameArabic}
                </span>
              </div>
              <p className="font-arabic text-xl text-right text-[#007A78] font-semibold leading-loose dir-rtl select-text">
                {difference.variantText}
              </p>
              <span className="inline-block mt-2 text-[10px] text-[#007A78] font-medium">
                Authentic Canonical Transmission
              </span>
            </div>
          </div>

          {/* Pronunciation & Tajweed Rules */}
          <div className="p-3.5 rounded-[16px] bg-amber-50/60 border border-amber-200/50">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Phonetics & Pronunciation Rules</span>
            </h4>
            <p className="text-xs text-amber-950 leading-relaxed">
              {difference.pronunciationNotes}
            </p>
          </div>

          {/* Meaning & Theological Harmony */}
          <div className="p-3.5 rounded-[16px] bg-[#007A78]/5 border border-[#007A78]/15">
            <h4 className="text-xs font-bold text-[#007A78] flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Spiritual & Linguistic Wisdom</span>
            </h4>
            <p className="text-xs text-[#1C1C1E] leading-relaxed">
              {difference.meaningInsight}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-black/[0.06] flex items-center justify-between bg-[#F2F2F7]">
          {onPlayAyahAudio ? (
            <button
              type="button"
              onClick={onPlayAyahAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#007A78] text-white text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Recitation</span>
            </button>
          ) : (
            <span className="text-[11px] text-[#8E8E93]">Seven Ahruf Tradition</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
