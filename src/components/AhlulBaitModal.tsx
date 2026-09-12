import React, { useState } from "react";
import { X, Users, Heart, Star, Sparkles, BookOpen } from "lucide-react";

interface AhlulBaitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Personality {
  name: string;
  nameArabic: string;
  title: string;
  relation: string;
  era: string;
  bio: string;
  virtue: string;
}

const PERSONALITIES: Personality[] = [
  {
    name: "Prophet Muhammad ﷺ",
    nameArabic: "مُحَمَّدٌ رَسُولُ اللَّهِ ﷺ",
    title: "Khatam al-Anbiya (Seal of the Prophets), Habibullah",
    relation: "The Final Messenger of Allah to all mankind",
    era: "570 – 632 CE",
    bio: "The beloved Prophet through whom the Holy Quran was revealed as a mercy to all creation.",
    virtue: "“Indeed, Allah desires only to remove impurity from you, O people of the household, and purify you thoroughly.” (Quran 33:33)",
  },
  {
    name: "Imam Ali ibn Abi Talib (AS)",
    nameArabic: "عَلِيُّ بْنُ أَبِي طَالِبٍ (ع)",
    title: "Amir al-Mu'minin, Asadullah (Lion of Allah)",
    relation: "Cousin and son-in-law of the Prophet ﷺ",
    era: "600 – 661 CE",
    bio: "First male convert to Islam, champion of faith at Badr, Khaybar, and Khandaq, legendary for boundless wisdom, justice, and courage.",
    virtue: "The Prophet ﷺ said: “I am the city of knowledge and Ali is its gate.” (Tirmidhi 3723)",
  },
  {
    name: "Sayyida Fatimah az-Zahra (SA)",
    nameArabic: "فَاطِمَةُ الزَّهْرَاءُ (ع)",
    title: "Sayyidatu Nisa’ al-Alamin (Leader of the Women of the Worlds)",
    relation: "Beloved daughter of Prophet Muhammad ﷺ and Khadijah",
    era: "605 – 632 CE",
    bio: "Epitome of piety, patience, modesty, and mother of the Prophet's continuing lineage through Hasan and Husayn.",
    virtue: "The Prophet ﷺ said: “Fatimah is part of me; whoever pleases her pleases me, and whoever angers her angers me.” (Bukhari)",
  },
  {
    name: "Imam Hasan ibn Ali (AS)",
    nameArabic: "الحَسَنُ بْنُ عَلِيٍّ (ع)",
    title: "Al-Mujtaba (The Chosen), Master of Peace",
    relation: "Elder grandson of the Prophet ﷺ",
    era: "624 – 670 CE",
    bio: "Renowned for supreme generosity, profound spiritual devotion, and making the historic peace treaty to safeguard Muslim lives.",
    virtue: "The Prophet ﷺ said: “Al-Hasan and al-Husayn are the masters of the youth of Paradise.” (Tirmidhi 3768)",
  },
  {
    name: "Imam Husayn ibn Ali (AS)",
    nameArabic: "الحُسَيْنُ بْنُ عَلِيٍّ (ع)",
    title: "Sayyid ash-Shuhada (Master of Martyrs)",
    relation: "Younger grandson of the Prophet ﷺ",
    era: "626 – 680 CE",
    bio: "Epitome of principled standing against injustice at the tragic plain of Karbala, keeping the moral torch of Islam alive for all eternity.",
    virtue: "The Prophet ﷺ said: “Husayn is from me and I am from Husayn; Allah loves whoever loves Husayn.” (Tirmidhi)",
  },
  {
    name: "Sayyida Khadijah bint Khuwaylid (RA)",
    nameArabic: "خَدِيجَةُ بِنْتُ خُوَيْلِدٍ (رض)",
    title: "Umm al-Mu'minin, At-Tahirah (The Pure)",
    relation: "First and most devoted wife of the Prophet ﷺ",
    era: "555 – 619 CE",
    bio: "First believer in Islam, sacrificed all her immense wealth to sustain the early Muslim community during the persecution in Makkah.",
    virtue: "Jibril conveyed greetings of peace directly from Allah to Khadijah with the glad tidings of a palace in Paradise. (Bukhari)",
  },
];

export const AhlulBaitModal: React.FC<AhlulBaitModalProps> = ({ isOpen, onClose }) => {
  const [selected, setSelected] = useState<Personality>(PERSONALITIES[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Ahlul Bait (The Household)</h3>
              <p className="text-xs text-slate-500">Noble family of Prophet Muhammad ﷺ</p>
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

        {/* List & Details */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Selected Detail View */}
          <div className="bg-gradient-to-br from-blue-50/70 via-blue-50/30 to-white rounded-2xl p-4 border border-blue-100 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selected.name}</h4>
                <p className="text-xs font-semibold text-blue-600">{selected.title}</p>
                <p className="text-[11px] text-slate-500">{selected.relation} • {selected.era}</p>
              </div>
              <span className="font-arabic text-xl text-slate-800 text-right leading-tight">
                {selected.nameArabic}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {selected.bio}
            </p>

            <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs italic text-blue-900">
              {selected.virtue}
            </div>
          </div>

          {/* Quick Selection Cards */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Personality
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERSONALITIES.map((p) => {
                const isSelected = selected.name === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelected(p)}
                    className={`p-3 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : "bg-gray-50 border-gray-200 text-slate-800 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{p.name}</span>
                      <span className={`text-[10px] font-arabic ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                        {p.nameArabic}
                      </span>
                    </div>
                    <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                      {p.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
