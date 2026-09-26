import React from "react";
import {
  Compass,
  MapPin,
  Moon,
  Settings,
  User as UserIcon,
  RefreshCw,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getHijriDate } from "../lib/prayerTimes";
import { MiniAppId } from "../types";

interface NavbarProps {
  currentTab?: MiniAppId;
  onNavigateBackToApps?: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigateBackToApps,
  onOpenSettings,
  onOpenAuth,
}) => {
  const { user, isGuest, preferences, isSyncing, requestGeolocation } = useAuth();
  const hijri = getHijriDate(new Date(), preferences.hijriAdjustmentDays);

  const isSubApp = [
    "qibla",
    "tasbih",
    "adhkar",
    "habits",
    "zakat",
    "places",
    "ai",
    "assistant",
    "qamus",
  ].includes(currentTab || "");

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full ios-blur border-b border-black/[0.06] transition-all"
    >
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Either Back to Apps or Brand Identity */}
        {isSubApp && onNavigateBackToApps ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateBackToApps}
              className="flex items-center gap-0.5 text-xs font-semibold text-[#007A78] hover:text-[#005D5B] active:scale-95 transition-all py-1 px-2 rounded-xl bg-[#007A78]/10 hover:bg-[#007A78]/15 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.4px]" />
              <span>Apps Hub</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-800 capitalize">
              {currentTab === "ai" ? "AI Assistant" : currentTab}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-gradient-to-b from-[#00897B] to-[#00695C] text-white flex items-center justify-center shadow-xs shadow-teal-900/20">
              <Moon className="w-4 h-4 text-teal-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-semibold tracking-tight text-[#1C1C1E] leading-none">
                  Muslim Daily
                </h1>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-[#007A78]/10 text-[#007A78]">
                  SuperApp
                </span>
              </div>
              <p className="text-[11px] text-[#8E8E93] font-normal leading-tight mt-0.5 flex items-center gap-1">
                <span>{hijri.formatted}</span>
                <span className="text-[#C7C7CC]">•</span>
                <span className="text-[#007A78] font-arabic font-medium">{hijri.monthNameArabic}</span>
              </p>
            </div>
          </div>
        )}

        {/* Right: Location chip, Settings, Profile Avatar */}
        <div className="flex items-center gap-1.5">
          {/* Location Chip */}
          <button
            id="location-picker-btn"
            type="button"
            onClick={requestGeolocation}
            title="Detect GPS location"
            className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-[#1C1C1E] transition-all cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#007A78]" />
            <span className="max-w-[80px] truncate">{preferences.city}</span>
          </button>

          {/* Sync indicator */}
          {isSyncing && (
            <div className="p-1.5 text-amber-500 animate-spin">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Settings iOS circular button */}
          <button
            id="open-settings-btn"
            type="button"
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-[#1C1C1E] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <button
            id="open-auth-btn"
            type="button"
            onClick={onOpenAuth}
            className="h-8 pl-1 pr-2.5 rounded-full bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-[#1C1C1E] flex items-center gap-1.5 transition-all cursor-pointer"
            title={user ? (isGuest ? "Guest (Tap to sign in)" : user.email || "Account") : "Sign In"}
          >
            <div className="w-6 h-6 rounded-full bg-[#007A78] text-white flex items-center justify-center text-[11px] font-bold">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
            </div>
            <span className="text-[11px] font-medium max-w-[70px] truncate">
              {isGuest ? "Guest" : (user?.displayName || "Profile")}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
