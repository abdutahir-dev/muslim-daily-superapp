import React from "react";
import {
  Home,
  BookOpen,
  LayoutGrid,
  Quote,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { MiniAppId } from "../types";

export type NavTabId = "home" | "quran" | "apps" | "quotes" | "prayer";

export interface TabBarProps {
  activeTab: MiniAppId;
  isMoreMenuOpen?: boolean;
  onSelectTab: (tab: MiniAppId) => void;
  onOpenMoreMenu?: () => void;
}

interface NavItem {
  id: NavTabId;
  label: string;
  icon: LucideIcon;
  appTarget?: MiniAppId;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  isMoreMenuOpen = false,
  onSelectTab,
  onOpenMoreMenu,
}) => {
  // Five icons in exact required order: Home, Quran, Apps, Quotes, Prayers
  const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: Home, appTarget: "home" },
    { id: "quran", label: "Quran", icon: BookOpen, appTarget: "quran" },
    { id: "apps", label: "Apps", icon: LayoutGrid, appTarget: "apps" },
    { id: "quotes", label: "Quotes", icon: Quote, appTarget: "quotes" },
    { id: "prayer", label: "Prayers", icon: Clock, appTarget: "prayer" },
  ];

  // Apps tab is considered active if activeTab is "apps" OR one of the sub-apps
  const isSubAppActive = [
    "apps",
    "qibla",
    "tasbih",
    "adhkar",
    "habits",
    "zakat",
    "places",
    "ai",
    "assistant",
    "qamus",
  ].includes(activeTab);

  const isAppsActive = isMoreMenuOpen || isSubAppActive;

  const handleTabClick = (item: NavItem) => {
    // Subtle tactile haptic pulse on mobile if supported
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // Safe fallback
      }
    }

    if (item.appTarget) {
      onSelectTab(item.appTarget);
    } else if (item.id === "apps") {
      onSelectTab("apps");
    }
  };

  return (
    <nav
      id="bottom-dock-navigation"
      role="tablist"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1"
    >
      <div className="max-w-md mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-5 items-end justify-items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected =
              item.id === "apps"
                ? isAppsActive
                : activeTab === item.appTarget && !isMoreMenuOpen;

            return (
              <button
                key={item.id}
                id={`tab-button-${item.id}`}
                role="tab"
                aria-selected={isSelected}
                aria-label={item.label}
                type="button"
                onClick={() => handleTabClick(item)}
                className="group relative flex flex-col items-center justify-end w-full h-full pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A78] focus-visible:ring-offset-2 rounded-2xl cursor-pointer select-none"
              >
                {isSelected ? (
                  /* Active State: Elevated, bigger, and circular icon with smooth pop animation */
                  <div className="flex flex-col items-center animate-nav-pop z-10">
                    <div className="relative">
                      {/* Ambient breathing aura behind the circular pod */}
                      <div className="absolute inset-0 rounded-full bg-[#007A78]/35 blur-md -z-10 animate-nav-glow" />

                      {/* Bigger circular button */}
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#00695C] via-[#007A78] to-[#00A896] text-white flex items-center justify-center ring-[3.5px] ring-[#F4F5F7] dark:ring-[#1C1C1E] shadow-[0_10px_22px_-3px_rgba(0,122,120,0.5),0_3px_8px_rgba(0,0,0,0.08)] transform transition-transform duration-200 active:scale-90">
                        <Icon className="w-6.5 h-6.5 stroke-[2.3px] drop-shadow-sm" />
                      </div>
                    </div>

                    {/* Active Label & Micro Dot */}
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#007A78] tracking-tight mt-1 transition-colors duration-200">
                      {item.label}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007A78] shadow-[0_0_6px_rgba(0,122,120,0.8)] mt-0.5" />
                  </div>
                ) : (
                  /* Inactive State: Balanced, sleek icon with subtle text */
                  <div className="flex flex-col items-center justify-center w-full py-1 transition-all duration-200 active:scale-95">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100/70 transition-colors duration-200">
                      <Icon className="w-5 h-5 stroke-[1.85px] transition-transform duration-200 group-hover:scale-110" />
                    </div>
                    <span className="text-[10.5px] font-medium text-slate-500 group-hover:text-slate-700 tracking-tight mt-0.5 transition-colors duration-200">
                      {item.label}
                    </span>
                    {/* Placeholder spacer to preserve vertical rhythm with active dot */}
                    <span className="w-1.5 h-1.5 mt-0.5 opacity-0" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
