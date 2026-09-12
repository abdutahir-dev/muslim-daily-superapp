import React, { useState } from "react";
import { X, Search, BookMarked, Copy, Check, Share2, Sparkles } from "lucide-react";

interface HadithModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HadithItem {
  id: string;
  narrator: string;
  source: string;
  bookNumber: string;
  arabic: string;
  translation: string;
  topic: string;
}

const HADITH_COLLECTION: HadithItem[] = [
  {
    id: "hadith-wudu-prayer",
    narrator: "‘Uqbah ibn ‘Amir al-Juhani",
    source: "Sunan Abi Dawud & Sahih Muslim",
    bookNumber: "Hadith 906",
    topic: "Wudu & Prayer",
    arabic: "حدثنا عثمان بن أبي شيبة، حدثنا زيد بن الحباب، حدثنا معاوية بن صالح، عن ربيعة بن يزيد، عن أبي إدريس الخولاني، عن جبير بن نفير الحضرمي، عن عقبة بن عامر الجهني، أن رسول الله صلى الله عليه وسلم قال: «مَا مِنْ أَحَدٍ يَتَوَضَّأُ فَيُحْسِنُ الْوُضُوءَ وَيُصَلِّي رَكْعَتَيْنِ يُقْبِلُ بِقَلْبِهِ وَوَجْهِهِ عَلَيْهِمَا إِلَّا وَجَبَتْ لَهُ الْجَنَّةُ»",
    translation: "The Messenger of Allah ﷺ said: 'There is no one who performs ablution (Wudu) and does it thoroughly, then prays two Rak'ahs turning to them with his heart and face, except that Paradise is guaranteed for him.'",
  },
  {
    id: "hadith-intentions",
    narrator: "‘Umar ibn al-Khattab (RA)",
    source: "Sahih al-Bukhari & Muslim",
    bookNumber: "Hadith 1",
    topic: "Intentions (Niyyah)",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ",
    translation: "Actions are but by intentions, and every person will have only that which he intended. So whoever emigrated for Allah and His Messenger, his emigration is for Allah and His Messenger.",
  },
  {
    id: "hadith-kindness",
    narrator: "‘Abdullah ibn ‘Amr (RA)",
    source: "Jami‘ at-Tirmidhi",
    bookNumber: "Hadith 1924",
    topic: "Mercy & Compassion",
    arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
    translation: "The merciful will be shown mercy by the Most Merciful. Be merciful to those on the earth, and the One in the heavens will show mercy to you.",
  },
  {
    id: "hadith-ease",
    narrator: "Abu Hurairah (RA)",
    source: "Sahih al-Bukhari",
    bookNumber: "Hadith 39",
    topic: "Ease of Religion",
    arabic: "إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا",
    translation: "Indeed, the religion is ease, and no one overburdens himself in religion but that it overcomes him. So adhere to the middle course, strive to come close, and receive good tidings.",
  },
  {
    id: "hadith-duas",
    narrator: "An-Nu‘man ibn Bashir (RA)",
    source: "Sunan Abi Dawud & Tirmidhi",
    bookNumber: "Hadith 1479",
    topic: "Supplication (Dua)",
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    translation: "Supplication (Dua) is worship itself.",
  },
];

export const HadithModal: React.FC<HadithModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: HadithItem) => {
    navigator.clipboard.writeText(`${item.arabic}\n\n"${item.translation}"\n— ${item.source}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = HADITH_COLLECTION.filter((h) => {
    const q = search.toLowerCase();
    return (
      h.topic.toLowerCase().includes(q) ||
      h.translation.toLowerCase().includes(q) ||
      h.arabic.includes(search) ||
      h.narrator.toLowerCase().includes(q) ||
      h.source.toLowerCase().includes(q)
    );
  });

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
              <p className="text-xs text-slate-500">Authentic traditions and teachings of Prophet Muhammad ﷺ</p>
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

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hadith by topic, narrator, or keyword..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2.5 shadow-2xs hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold">
                  {item.topic}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{item.source}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="p-1 text-gray-400 hover:text-slate-700 rounded-md"
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

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "{item.translation}"
              </p>

              <div className="text-[11px] text-slate-400 pt-1 border-t border-gray-100">
                Narrated by: <span className="text-slate-700 font-medium">{item.narrator}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
