import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MiniAppId } from "./types";
import { Navbar } from "./components/Navbar";
import { TabBar } from "./components/TabBar";
import { HomeDashboard } from "./components/HomeDashboard";
import { PrayerTimesApp } from "./components/PrayerTimesApp";
import { QuranApp } from "./components/QuranApp";
import { QiblaApp } from "./components/QiblaApp";
import { TasbihApp } from "./components/TasbihApp";
import { AdhkarApp } from "./components/AdhkarApp";
import { HabitTrackerApp } from "./components/HabitTrackerApp";
import { ZakatApp } from "./components/ZakatApp";
import { PlacesApp } from "./components/PlacesApp";
import { AiAssistantApp } from "./components/AiAssistantApp";
import { SettingsModal } from "./components/SettingsModal";
import { AuthModal } from "./components/AuthModal";
import { MoreAppsSheet } from "./components/MoreAppsSheet";
import { OnboardingWizard } from "./components/OnboardingWizard";

const SuperAppContent: React.FC = () => {
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

  const renderActiveMiniApp = () => {
    switch (currentTab) {
      case "prayer":
        return <PrayerTimesApp />;
      case "quran":
        return <QuranApp />;
      case "qibla":
        return <QiblaApp />;
      case "tasbih":
        return <TasbihApp />;
      case "adhkar":
        return <AdhkarApp />;
      case "habits":
        return <HabitTrackerApp />;
      case "zakat":
        return <ZakatApp />;
      case "places":
        return <PlacesApp />;
      case "ai":
      case "assistant":
        return <AiAssistantApp />;
      case "home":
      default:
        return <HomeDashboard onSelectApp={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans selection:bg-[#007A78] selection:text-white flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3.5 pt-3 pb-24 sm:px-4">
        {renderActiveMiniApp()}
      </main>

      {/* Bottom Floating/Docked Tab Navigation Bar */}
      <TabBar
        activeTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenMoreMenu={() => setIsMoreAppsOpen(true)}
      />

      {/* Modals & Sheets */}
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

export default function App() {
  return (
    <AuthProvider>
      <SuperAppContent />
    </AuthProvider>
  );
}
