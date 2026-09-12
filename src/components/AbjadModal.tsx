import React, { useState } from "react";
import { X, BookOpen, Calculator, Sparkles, Copy, Check } from "lucide-react";

interface AbjadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Abjad mapping
const ABJAD_VALUES: Record<string, number> = {
  ا: 1, أ: 1, إ: 1, آ: 1, ء: 1, ى: 10,
  ب: 2,
  ج: 3,
  د: 4,
  ه: 5, ة: 5,
  و: 6, ؤ: 6,
  ز: 7,
  ح: 8,
  ط: 9,
  ي: 10, ئ: 10,
  ك: 20,
  ل: 30,
  م: 40,
  ن: 50,
  س: 60,
  ع: 70,
  ف: 80,
  ص: 90,
  ق: 100,
  ر: 200,
  ش: 300,
  ت: 400,
  ث: 500,
  خ: 600,
  ذ: 700,
  ض: 800,
  ظ: 900,
  غ: 1000,
};

const PRESET_PHRASES = [
  { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", label: "Basmalah (786)" },
  { text: "اللَّه", label: "Allah (66)" },
  { text: "مُحَمَّد", label: "Muhammad (92)" },
  { text: "عَلِيّ", label: "Ali (110)" },
  { text: "سَلَام", label: "Salam (131)" },
  { text: "نُور", label: "Nur (256)" },
];

export const AbjadModal: React.FC<AbjadModalProps> = ({ isOpen, onClose }) => {
  const [inputText, setInputText] = useState("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Clean diacritics / tashkeel and compute total
  const computeAbjad = (text: string) => {
    let sum = 0;
    const breakdown: { char: string; val: number }[] = [];

    // Strip tashkeel
    const cleanChars = text.replace(/[\u064B-\u065F\u0670]/g, "").split("");

    for (const char of cleanChars) {
      if (ABJAD_VALUES[char]) {
        sum += ABJAD_VALUES[char];
        breakdown.push({ char, val: ABJAD_VALUES[char] });
      }
    }
    return { sum, breakdown };
  };

  const { sum, breakdown } = computeAbjad(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${inputText} = ${sum}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Abjad Calculator (حساب الجُمَّل)</h3>
              <p className="text-xs text-slate-500">Traditional Arabic numerical values & gematria</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Result Card */}
          <div className="bg-gradient-to-br from-orange-50 via-amber-50/40 to-white rounded-2xl p-5 border border-orange-100 text-center space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-700">
              Total Abjad Value
            </span>
            <div className="text-4xl font-extrabold text-[#0F172A] font-mono py-1">{sum}</div>
            <p className="text-xs text-slate-500 font-arabic text-center">
              {inputText || "اكتب نصاً بالعربية..."}
            </p>
          </div>

          {/* Input Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Type Arabic Text:</label>
            <div className="relative">
              <input
                dir="rtl"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="أدخل نصاً هنا..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-arabic text-slate-900 focus:outline-none focus:border-orange-500 transition-colors text-right"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 p-1 rounded-md transition-colors"
                title="Copy result"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {PRESET_PHRASES.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setInputText(p.text)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 hover:bg-orange-100 hover:text-orange-900 text-slate-700 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Letter Breakdown */}
          {breakdown.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Letter-by-Letter Breakdown
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-36 overflow-y-auto">
                {breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-center"
                  >
                    <span className="font-arabic font-bold text-base text-slate-800">{item.char}</span>
                    <span className="text-[10px] font-mono font-semibold text-orange-600 mt-0.5">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
