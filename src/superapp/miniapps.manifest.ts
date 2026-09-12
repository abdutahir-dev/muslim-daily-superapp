import { MiniAppId } from "../types";

export interface MiniAppMetadata {
  id: MiniAppId;
  title: string;
  subtitle: string;
  category: "worship" | "quran" | "lifestyle" | "knowledge" | "utilities";
  iconName: string;
  badge?: string;
  isPrimaryTab: boolean;
  order: number;
}

/**
 * SuperApp Mini-Applications Registry Manifest
 * Defines metadata, categorization, badges, and dock layout for all installed mini-apps.
 */
export const MINI_APPS_MANIFEST: MiniAppMetadata[] = [
  {
    id: "home",
    title: "Dashboard",
    subtitle: "Daily overview, next prayer & quick actions",
    category: "utilities",
    iconName: "Home",
    isPrimaryTab: true,
    order: 1,
  },
  {
    id: "prayer",
    title: "Prayer Times",
    subtitle: "Astronomical calculations, Adhan & Qiyam",
    category: "worship",
    iconName: "Clock",
    badge: "5 Daily",
    isPrimaryTab: true,
    order: 2,
  },
  {
    id: "quran",
    title: "Holy Quran",
    subtitle: "10 Canonical Qira'at, Amharic/English & Audio",
    category: "quran",
    iconName: "BookOpen",
    badge: "10 Qira'at",
    isPrimaryTab: true,
    order: 3,
  },
  {
    id: "qibla",
    title: "Qibla Compass",
    subtitle: "Magnetic sensor pointing to the Kaaba",
    category: "worship",
    iconName: "Compass",
    isPrimaryTab: true,
    order: 4,
  },
  {
    id: "tasbih",
    title: "Smart Tasbih",
    subtitle: "Tactile haptic counter & Dhikr presets",
    category: "worship",
    iconName: "CircleDot",
    isPrimaryTab: false,
    order: 5,
  },
  {
    id: "adhkar",
    title: "Daily Adhkar",
    subtitle: "Hisn al-Muslim Sabah, Masaa & Sleep",
    category: "worship",
    iconName: "Sparkles",
    badge: "Hisn",
    isPrimaryTab: false,
    order: 6,
  },
  {
    id: "habits",
    title: "Habit Tracker",
    subtitle: "Daily Muhasabah, Sunnah & Fasting logs",
    category: "lifestyle",
    iconName: "CheckSquare",
    isPrimaryTab: false,
    order: 7,
  },
  {
    id: "zakat",
    title: "Zakat Calculator",
    subtitle: "Gold/Silver Nisab asset valuation",
    category: "worship",
    iconName: "Calculator",
    isPrimaryTab: false,
    order: 8,
  },
  {
    id: "places",
    title: "Halal & Mosques",
    subtitle: "Verified Masajid & Halal food dining",
    category: "lifestyle",
    iconName: "MapPin",
    isPrimaryTab: false,
    order: 9,
  },
  {
    id: "quotes",
    title: "Wisdom & Duas",
    subtitle: "Quranic reflections & daily pearls",
    category: "knowledge",
    iconName: "Quote",
    isPrimaryTab: false,
    order: 10,
  },
  {
    id: "ai",
    title: "Ask Ilm AI",
    subtitle: "Gemini-powered Islamic scholarly assistant",
    category: "knowledge",
    iconName: "Sparkles",
    badge: "AI 2.5",
    isPrimaryTab: false,
    order: 11,
  },
];
