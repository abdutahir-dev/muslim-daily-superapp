import React from "react";
import {
  Compass,
  Home,
  BookOpen,
  Clock,
  CircleDot,
  Layers,
} from "lucide-react";
import { MiniAppId } from "../types";

interface TabBarProps {
  activeTab: MiniAppId;
  onSelectTab: (tab: MiniAppId) => void;
  onOpenMoreMenu: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenMoreMenu,
}) => {
  const isMoreActive = ["qibla", "adhkar", "habits", "zakat", "places", "ai"].includes(activeTab);

  const tabs: { id: MiniAppId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "home", label: "Today", icon: Home },
    { id: "prayer", label: "Prayer", icon: Clock },
    { id: "quran", label: "Quran", icon: BookOpen },
    { id: "tasbih", label: "Tasbih", icon: CircleDot },
  ];

  return (
    <nav
      id="bottom-dock-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 ios-blur border-t border-black/[0.08] pb-[max(env(safe-area-inset-bottom),6px)] pt-1"
    >
      <div className="max-w-md mx-auto px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 cursor-pointer ${
                isActive ? "text-[#007A78]" : "text-[#8E8E93] hover:text-[#636366]"
              }`}
            >
              <div className="relative p-0.5">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "stroke-[2.2px]" : "stroke-[1.8px]"}`} />
              </div>
              <span className={`text-[10px] tracking-tight leading-none mt-1 ${isActive ? "font-semibold text-[#007A78]" : "font-medium text-[#8E8E93]"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Apps Button */}
        <button
          id="tab-button-more"
          type="button"
          onClick={onOpenMoreMenu}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 cursor-pointer ${
            isMoreActive ? "text-[#007A78]" : "text-[#8E8E93] hover:text-[#636366]"
          }`}
        >
          <div className="relative p-0.5">
            <Layers className={`w-5 h-5 transition-transform ${isMoreActive ? "stroke-[2.2px]" : "stroke-[1.8px]"}`} />
          </div>
          <span className={`text-[10px] tracking-tight leading-none mt-1 ${isMoreActive ? "font-semibold text-[#007A78]" : "font-medium text-[#8E8E93]"}`}>
            Apps
          </span>
        </button>
      </div>
    </nav>
  );
};
