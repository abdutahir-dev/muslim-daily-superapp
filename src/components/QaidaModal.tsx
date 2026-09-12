import React, { useState } from "react";
import { X, Volume2, BookOpen, Check, Sparkles } from "lucide-react";

interface QaidaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LetterInfo {
  letter: string;
  name: string;
  transliteration: string;
  makhraj: string; // Point of articulation
  forms: { isolated: string; initial: string; medial: string; final: string };
}

const ARABIC_LETTERS: LetterInfo[] = [
  { letter: "ا", name: "Alif", transliteration: "ā", makhraj: "Empty space in the mouth and throat (Jawf)", forms: { isolated: "ا", initial: "ا", medial: "ـا", final: "ـا" } },
  { letter: "ب", name: "Bā’", transliteration: "b", makhraj: "Moist inner lips meeting together", forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" } },
  { letter: "ت", name: "Tā’", transliteration: "t", makhraj: "Tip of the tongue against roots of upper incisors", forms: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" } },
  { letter: "ث", name: "Thā’", transliteration: "th", makhraj: "Tip of the tongue between upper & lower incisors", forms: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" } },
  { letter: "ج", name: "Jīm", transliteration: "j", makhraj: "Middle of tongue against hard palate", forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" } },
  { letter: "ح", name: "Ḥā’", transliteration: "ḥ", makhraj: "Middle of the throat (Wasat al-Halq)", forms: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" } },
  { letter: "خ", name: "Khā’", transliteration: "kh", makhraj: "Upper throat closest to the mouth", forms: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" } },
  { letter: "د", name: "Dāl", transliteration: "d", makhraj: "Tip of the tongue touching roots of upper teeth", forms: { isolated: "د", initial: "د", medial: "ـد", final: "ـد" } },
  { letter: "ذ", name: "Dhāl", transliteration: "dh", makhraj: "Tip of the tongue slightly touching upper incisors", forms: { isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" } },
  { letter: "ر", name: "Rā’", transliteration: "r", makhraj: "Tip of the tongue slightly behind the incisors", forms: { isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" } },
  { letter: "ز", name: "Zāy", transliteration: "z", makhraj: "Tip of tongue hovering behind lower front teeth", forms: { isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" } },
  { letter: "س", name: "Sīn", transliteration: "s", makhraj: "Tip of tongue behind lower teeth (whistling letter)", forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" } },
  { letter: "ش", name: "Shīn", transliteration: "sh", makhraj: "Middle of tongue with spreading breath (Tafash-shi)", forms: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" } },
  { letter: "ص", name: "Ṣād", transliteration: "ṣ", makhraj: "Emphatic heavy S from tip of tongue behind teeth", forms: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" } },
  { letter: "ض", name: "Ḍād", transliteration: "ḍ", makhraj: "Sides of tongue pressed against upper molars", forms: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" } },
  { letter: "ط", name: "Ṭā’", transliteration: "ṭ", makhraj: "Heavy emphatic T with back tongue raised", forms: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" } },
  { letter: "ظ", name: "Ẓā’", transliteration: "ẓ", makhraj: "Heavy emphatic Dh with tip of tongue", forms: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" } },
  { letter: "ع", name: "‘Ayn", transliteration: "‘", makhraj: "Middle of throat with deep contraction", forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" } },
  { letter: "غ", name: "Ghayn", transliteration: "gh", makhraj: "Top of throat with gargling sound", forms: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" } },
  { letter: "ف", name: "Fā’", transliteration: "f", makhraj: "Edge of upper incisors on wet part of lower lip", forms: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" } },
  { letter: "ق", name: "Qāf", transliteration: "q", makhraj: "Deep back of tongue against soft palate (Uvula)", forms: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" } },
  { letter: "ك", name: "Kāf", transliteration: "k", makhraj: "Back of tongue slightly forward of Qaf", forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" } },
  { letter: "ل", name: "Lām", transliteration: "l", makhraj: "Front edges of the tongue touching the gums", forms: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" } },
  { letter: "م", name: "Mīm", transliteration: "m", makhraj: "Dry outer surfaces of both lips closing together", forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" } },
  { letter: "ن", name: "Nūn", transliteration: "n", makhraj: "Tip of tongue touching gums with nasal humming", forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" } },
  { letter: "هـ", name: "Hā’", transliteration: "h", makhraj: "Deepest base of throat (Aqsa al-Halq)", forms: { isolated: "هـ", initial: "هـ", medial: "ـهـ", final: "ـه" } },
  { letter: "و", name: "Wāw", transliteration: "w / ū", makhraj: "Rounding and protruding both lips", forms: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" } },
  { letter: "ي", name: "Yā’", transliteration: "y / ī", makhraj: "Middle of the tongue against the palate", forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" } },
];

export const QaidaModal: React.FC<QaidaModalProps> = ({ isOpen, onClose }) => {
  const [selectedLetter, setSelectedLetter] = useState<LetterInfo>(ARABIC_LETTERS[0]);
  const [activeTab, setActiveTab] = useState<"letters" | "harakat" | "rules">("letters");

  if (!isOpen) return null;

  const playPronunciation = (letterName: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(letterName);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#00B074]/10 text-[#00B074] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Noorani Qaida & Makharij</h3>
              <p className="text-xs text-slate-500">Master Arabic pronunciation & Tajweed basics</p>
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

        {/* Tab Switcher */}
        <div className="px-4 pt-3 flex gap-2 border-b border-gray-100 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("letters")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "letters" ? "bg-[#00B074] text-white" : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
          >
            28 Alphabet Letters
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("harakat")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "harakat" ? "bg-[#00B074] text-white" : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
          >
            Harakat (Vowels)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rules")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "rules" ? "bg-[#00B074] text-white" : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
          >
            Tajweed Essentials
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {activeTab === "letters" && (
            <>
              {/* Selected Letter Spotlight Card */}
              <div className="bg-gradient-to-br from-[#00B074]/10 via-[#00B074]/5 to-white rounded-2xl p-4 border border-[#00B074]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">{selectedLetter.name}</span>
                    <span className="text-xs bg-[#00B074] text-white px-2 py-0.5 rounded-md font-semibold">
                      /{selectedLetter.transliteration}/
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs">
                    <span className="font-semibold text-[#00B074]">Makhraj:</span> {selectedLetter.makhraj}
                  </p>
                  {/* Forms */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 font-arabic">
                    <span>Isolated: <b className="text-base text-slate-900">{selectedLetter.forms.isolated}</b></span>
                    <span>Initial: <b className="text-base text-slate-900">{selectedLetter.forms.initial}</b></span>
                    <span>Medial: <b className="text-base text-slate-900">{selectedLetter.forms.medial}</b></span>
                    <span>Final: <b className="text-base text-slate-900">{selectedLetter.forms.final}</b></span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-5xl font-arabic font-bold text-[#00B074]">{selectedLetter.letter}</div>
                  <button
                    type="button"
                    onClick={() => playPronunciation(selectedLetter.name)}
                    className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#00B074] bg-white px-2.5 py-1 rounded-full border border-[#00B074]/30 shadow-2xs hover:bg-[#00B074] hover:text-white transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                </div>
              </div>

              {/* Grid of 28 Letters */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Tap any letter to inspect point of articulation
                </p>
                <div className="grid grid-cols-7 gap-2">
                  {ARABIC_LETTERS.map((item) => (
                    <button
                      key={item.letter}
                      type="button"
                      onClick={() => {
                        setSelectedLetter(item);
                        playPronunciation(item.name);
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer ${
                        selectedLetter.letter === item.letter
                          ? "bg-[#00B074] border-[#00B074] text-white shadow-sm"
                          : "bg-gray-50/80 border-gray-200 text-slate-800 hover:bg-gray-100"
                      }`}
                    >
                      <span className="font-arabic text-2xl font-bold leading-none">{item.letter}</span>
                      <span className={`text-[10px] mt-1 font-medium ${selectedLetter.letter === item.letter ? "text-white" : "text-slate-400"}`}>
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "harakat" && (
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Fatḥah (ـَ)</h4>
                  <p className="text-xs text-slate-600">Produces short 'a' sound (e.g. بَ = Ba)</p>
                </div>
                <span className="text-3xl font-arabic font-bold text-[#00B074]">بَ</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Kasrah (ـِ)</h4>
                  <p className="text-xs text-slate-600">Produces short 'i' sound (e.g. بِ = Bi)</p>
                </div>
                <span className="text-3xl font-arabic font-bold text-[#00B074]">بِ</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Ḍammah (ـُ)</h4>
                  <p className="text-xs text-slate-600">Produces short 'u' sound (e.g. بُ = Bu)</p>
                </div>
                <span className="text-3xl font-arabic font-bold text-[#00B074]">بُ</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Sukūn (ـْ)</h4>
                  <p className="text-xs text-slate-600">Represents the absence of a vowel; a resting stop (e.g. أَبْ = Ab)</p>
                </div>
                <span className="text-3xl font-arabic font-bold text-[#00B074]">أَبْ</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Shaddah (ـّ)</h4>
                  <p className="text-xs text-slate-600">Doubles and stresses the consonant (e.g. رَبِّ = Rabbi)</p>
                </div>
                <span className="text-3xl font-arabic font-bold text-[#00B074]">رَبِّ</span>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                <h4 className="font-bold text-[#007A78] text-sm">Qalqalah (Echoing / Bouncing)</h4>
                <p className="mt-1">
                  When stopping on one of the five letters <b className="text-teal-900 font-arabic text-sm">ق، ط، ب، ج، د</b> (قطب جد), a rhythmic echoing bounce is pronounced.
                </p>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-800 text-sm">Ghunnah (Nasalization)</h4>
                <p className="mt-1">
                  A beautiful humming sound from the nasal cavity held for 2 counts on doubled Noon (نّ) and doubled Meem (مّ).
                </p>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 text-sm">Madd (Elongation)</h4>
                <p className="mt-1">
                  Natural prolongation of long vowels (Alif preceded by Fathah, Waw preceded by Dammah, Ya preceded by Kasrah) for 2 to 6 harakat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
