import { describe, it, expect } from "vitest";
import { SURAH_LIST } from "../lib/quranData";
import { READING_STYLES_LIST } from "../lib/qiraatData";

describe("Holy Quran and Qira'at Data Models", () => {
  it("contains all 114 Surahs with valid metadata", () => {
    expect(SURAH_LIST).toHaveLength(114);

    const alFatihah = SURAH_LIST.find((s) => s.number === 1);
    expect(alFatihah).toBeDefined();
    expect(alFatihah?.nameArabic).toBe("الفاتحة");
    expect(alFatihah?.totalVerses).toBe(7);

    const anNas = SURAH_LIST.find((s) => s.number === 114);
    expect(anNas).toBeDefined();
    expect(anNas?.nameArabic).toBe("الناس");
    expect(anNas?.totalVerses).toBe(6);
  });

  it("lists all canonical Qira'at reading styles", () => {
    expect(READING_STYLES_LIST.length).toBeGreaterThanOrEqual(8);
    const hafs = READING_STYLES_LIST.find((r) => r.id === "hafs");
    expect(hafs).toBeDefined();
    expect(hafs?.nameArabic).toContain("حفص");
  });
});
