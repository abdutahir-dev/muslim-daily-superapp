import React from "react";
import {
  Clock,
  BookOpen,
  Compass,
  CircleDot,
  Heart,
  Flame,
  Coins,
  Store,
  BotMessageSquare,
  Home,
  X,
} from "lucide-react";
import { MiniAppId } from "../types";

interface MoreAppsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: MiniAppId;
  onSelectTab: (tab: MiniAppId) => void;
}

export const MoreAppsSheet: React.FC<MoreAppsSheetProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  const allApps: {
    id: MiniAppId;
    title: string;
    subtitle: string;
    arabic: string;
    icon: React.FC<{ className?: string }>;
    bgColor: string;
    iconColor: string;
  }[] = [
    {
      id: "home",
      title: "Today",
      subtitle: "Overview & next prayer",
      arabic: "اليوم",
      icon: Home,
      bgColor: "bg-[#007A78]",
      iconColor: "text-white",
    },
    {
      id: "prayer",
      title: "Prayer Times",
      subtitle: "Adhan & timetable",
      arabic: "مواقيت الصلاة",
      icon: Clock,
      bgColor: "bg-[#5856D6]",
      iconColor: "text-white",
    },
    {
      id: "quran",
      title: "Holy Quran",
      subtitle: "Surahs & recitations",
      arabic: "القرآن الكريم",
      icon: BookOpen,
      bgColor: "bg-[#34C759]",
      iconColor: "text-white",
    },
    {
      id: "qibla",
      title: "Qibla Compass",
      subtitle: "Direction to Kaaba",
      arabic: "اتجاه القبلة",
      icon: Compass,
      bgColor: "bg-[#FF9500]",
      iconColor: "text-white",
    },
    {
      id: "tasbih",
      title: "Smart Tasbih",
      subtitle: "Haptic Dhikr counter",
      arabic: "المسبحة",
      icon: CircleDot,
      bgColor: "bg-[#007A78]",
      iconColor: "text-white",
    },
    {
      id: "adhkar",
      title: "Daily Adhkar",
      subtitle: "Morning & evening duas",
      arabic: "أذكار المسلم",
      icon: Heart,
      bgColor: "bg-[#FF2D55]",
      iconColor: "text-white",
    },
    {
      id: "habits",
      title: "Muhasabah",
      subtitle: "Prayer & fast tracker",
      arabic: "محاسبة",
      icon: Flame,
      bgColor: "bg-[#FF9500]",
      iconColor: "text-white",
    },
    {
      id: "zakat",
      title: "Zakat",
      subtitle: "Nisab & wealth 2.5%",
      arabic: "حساب الزكاة",
      icon: Coins,
      bgColor: "bg-[#30B0C7]",
      iconColor: "text-white",
    },
    {
      id: "places",
      title: "Halal & Mosques",
      subtitle: "Nearby masajid & food",
      arabic: "المساجد",
      icon: Store,
      bgColor: "bg-[#32ADE6]",
      iconColor: "text-white",
    },
    {
      id: "ai",
      title: "Ask Ilm AI",
      subtitle: "Gemini Islamic assistant",
      arabic: "المساعد",
      icon: BotMessageSquare,
      bgColor: "bg-[#5856D6]",
      iconColor: "text-white",
    },
  ];

  return (
    <div
      id="more-apps-sheet-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#F2F2F7] rounded-t-[28px] sm:rounded-[28px] border border-black/10 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Grabber & Navigation Header */}
        <div className="pt-2.5 pb-2 px-4 bg-white/95 border-b border-black/[0.08] sticky top-0 z-10">
          <div className="w-9 h-1 bg-[#8E8E93]/40 rounded-full mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#1C1C1E]">All Mini-Apps</h3>
              <p className="text-[10px] text-[#8E8E93]">10 integrated Islamic daily utilities</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#007A78] hover:text-[#006260] active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

        {/* iOS App Library Style Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-2 gap-2.5">
          {allApps.map((app) => {
            const Icon = app.icon;
            const isCurrent = activeTab === app.id;

            return (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  onSelectTab(app.id);
                  onClose();
                }}
                className={`p-3 rounded-[20px] text-left flex flex-col justify-between transition-all active:scale-[0.97] cursor-pointer ${
                  isCurrent
                    ? "bg-white ring-2 ring-[#007A78] shadow-sm"
                    : "bg-white/80 hover:bg-white shadow-xs border border-black/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  {/* Apple squircle app icon */}
                  <div
                    className={`w-10 h-10 rounded-[14px] flex items-center justify-center shadow-xs ${app.bgColor} ${app.iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-arabic text-[11px] text-[#8E8E93]">{app.arabic}</span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#1C1C1E] leading-tight">{app.title}</h4>
                  <p className="text-[10px] text-[#8E8E93] mt-0.5 line-clamp-1">{app.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
