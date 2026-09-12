import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { MiniAppId } from "../types";
import { Navbar } from "../components/Navbar";
import { TabBar } from "../components/TabBar";
import { HomeDashboard } from "../components/HomeDashboard";
import { PrayerTimesApp } from "../miniapps/prayer-times";
import { QuranApp } from "../miniapps/quran";
import { QiblaApp } from "../miniapps/qibla";
import { TasbihApp } from "../miniapps/tasbih";
import { AdhkarApp } from "../miniapps/adhkar";
import { HabitTrackerApp } from "../miniapps/habit-tracker";
import { ZakatApp } from "../miniapps/zakat";
import { PlacesApp } from "../miniapps/places";
import { AiAssistantApp } from "../miniapps/ai-assistant";
import { QuotesApp } from "../miniapps/quotes";
import { SettingsModal } from "../components/SettingsModal";
import { AuthModal } from "../components/AuthModal";
import { MoreAppsSheet } from "../components/MoreAppsSheet";
import { OnboardingWizard } from "../components/OnboardingWizard";

/**
 * SuperApp Shell Container
 * Orchestrates Mini-Application lifecycle, viewport container, modal dialogs, and dock navigation.
 */
export const SuperAppShell: React.FC = () => {
  const { preferences } = useAuth();
  const [currentTab, setCurrentTab] = useState<MiniAppId>("home");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMoreAppsOpen, setIsMoreAppsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Automatically trigger onboarding wizard on first visit if not completed
    if (preferences && preferences.onboardingCompleted === false) {
      const skipped = localStorage.getItem("muslim_daily_onboarding_skipped");
      if (!skipped) {
        setIsOnboardingOpen(true);
      }
    }
  }, [preferences?.onboardingCompleted]);

  /**
   * Router / Renderer for currently active Mini-Application
   */
  const renderActiveMiniApp = () => {
    switch (currentTab) {
      case "prayer":
        return (
          <PrayerTimesApp
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        );
      case "quran":
        return <QuranApp />;
      case "qibla":
        return <QiblaApp />;
      case "tasbih":
        return <TasbihApp />;
      case "adhkar":
        return <AdhkarApp />;
      case "habits":
        return <HabitTrackerApp onOpenAuth={() => setIsAuthOpen(true)} />;
      case "zakat":
        return <ZakatApp />;
      case "places":
        return <PlacesApp />;
      case "quotes":
        return <QuotesApp />;
      case "ai":
      case "assistant":
        return <AiAssistantApp />;
      case "home":
      default:
        return (
          <HomeDashboard
            onSelectApp={(tab) => setCurrentTab(tab)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1C1C1E] font-sans selection:bg-[#00B074] selection:text-white flex flex-col antialiased">
      {/* Top Navigation Bar for sub-apps */}
      {currentTab !== "home" && (
        <Navbar
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {/* Main Content Viewport for Active Mini-App */}
      <main
        className={`flex-1 w-full max-w-xl mx-auto px-3.5 pb-24 sm:px-4 ${
          currentTab === "home" ? "pt-2" : "pt-3"
        }`}
      >
        {renderActiveMiniApp()}
      </main>

      {/* iOS-Style Bottom Dock / Tab Navigation */}
      <TabBar
        activeTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenMoreMenu={() => setIsMoreAppsOpen(true)}
      />

      {/* Global Shared Modals & Sheets */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <MoreAppsSheet
        isOpen={isMoreAppsOpen}
        onClose={() => setIsMoreAppsOpen(false)}
        activeTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
};
