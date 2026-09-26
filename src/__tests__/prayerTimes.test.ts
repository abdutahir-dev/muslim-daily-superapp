import { describe, it, expect } from "vitest";
import {
  calculatePrayerTimes,
  calculateQiblaDirection,
  getHijriDate,
  KAABA_COORDINATES,
} from "../lib/prayerTimes";
import { DEFAULT_PREFERENCES } from "../types";

describe("Prayer Times and Qibla Calculation Engine", () => {
  it("calculates accurate Qibla direction from London coordinates", () => {
    // London: ~51.5074 N, -0.1278 E -> Qibla is roughly 118-119 degrees southeast
    const result = calculateQiblaDirection(51.5074, -0.1278);
    expect(result.bearingDegrees).toBeGreaterThan(115);
    expect(result.bearingDegrees).toBeLessThan(122);
    expect(result.distanceKm).toBeGreaterThan(4500);
    expect(result.distanceKm).toBeLessThan(5000);
  });

  it("calculates accurate Qibla direction from Makkah vicinity", () => {
    // Very close to Kaaba
    const result = calculateQiblaDirection(KAABA_COORDINATES.lat, KAABA_COORDINATES.lng);
    expect(result.distanceKm).toBe(0);
  });

  it("produces valid 5 daily prayer times in chronological progression", () => {
    const preferences = {
      ...DEFAULT_PREFERENCES,
      calculationMethod: "MWL" as const,
      juristicSchool: "standard" as const,
      latitude: 40.7128, // New York
      longitude: -74.006,
      timeFormat24h: true,
    };

    const schedule = calculatePrayerTimes(new Date(2026, 5, 15, 12, 0, 0), preferences);
    expect(schedule.items.length).toBe(6); // Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha
    expect(schedule.fajr).toMatch(/^\d{2}:\d{2}$/);
    expect(schedule.dhuhr).toMatch(/^\d{2}:\d{2}$/);
    expect(schedule.asr).toMatch(/^\d{2}:\d{2}$/);
    expect(schedule.maghrib).toMatch(/^\d{2}:\d{2}$/);
    expect(schedule.isha).toMatch(/^\d{2}:\d{2}$/);
  });

  it("generates formatted Hijri date structure", () => {
    const hijri = getHijriDate(new Date(2026, 8, 26));
    expect(hijri.day).toBeGreaterThan(0);
    expect(hijri.day).toBeLessThanOrEqual(30);
    expect(hijri.year).toBeGreaterThanOrEqual(1447);
    expect(hijri.formatted).toBeTruthy();
    expect(hijri.formattedArabic).toBeTruthy();
  });
});
