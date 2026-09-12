export interface IslamicEvent {
  title: string;
  titleArabic: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  description: string;
  recommendedActions: string[];
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    title: "Islamic New Year (1st Muharram)",
    titleArabic: "رأس السنة الهجرية",
    hijriDay: 1,
    hijriMonth: 1,
    hijriMonthName: "Muharram",
    description: "Beginning of the Islamic Hijri calendar commemorating the Hijrah of the Prophet (pbuh).",
    recommendedActions: ["Fasting in Muharram", "Duas for blessings and peace in the new year", "Spiritual reflection"]
  },
  {
    title: "Day of Ashura (10th Muharram)",
    titleArabic: "يوم عاشوراء",
    hijriDay: 10,
    hijriMonth: 1,
    hijriMonthName: "Muharram",
    description: "The day Allah saved Prophet Musa (Moses) and the Children of Israel from Pharaoh.",
    recommendedActions: ["Fasting on the 9th and 10th of Muharram (or 10th and 11th)", "Generosity to family", "Istighfar"]
  },
  {
    title: "Mawlid an-Nabi (12th Rabi' al-Awwal)",
    titleArabic: "المولد النبوي الشريف",
    hijriDay: 12,
    hijriMonth: 3,
    hijriMonthName: "Rabi' al-Awwal",
    description: "The birth of the Prophet Muhammad (peace and blessings be upon him).",
    recommendedActions: ["Sending abundant Salawat upon the Prophet", "Studying the Seerah", "Charity and community gathering"]
  },
  {
    title: "Isra' and Mi'raj (27th Rajab)",
    titleArabic: "الإسراء والمعراج",
    hijriDay: 27,
    hijriMonth: 7,
    hijriMonthName: "Rajab",
    description: "The miraculous Night Journey and Heavenly Ascension wherein the 5 daily prayers were ordained.",
    recommendedActions: ["Voluntary night prayer (Qiyam)", "Dua for Jerusalem & Ummah", "Reflecting upon the gift of Salah"]
  },
  {
    title: "Laylat al-Bara'at / Mid-Sha'ban (15th Sha'ban)",
    titleArabic: "ليلة النصف من شعبان",
    hijriDay: 15,
    hijriMonth: 8,
    hijriMonthName: "Sha'ban",
    description: "The Blessed Night of forgiveness and decree in preparation for Ramadan.",
    recommendedActions: ["Fasting the White Days of Sha'ban", "Istighfar and reconciliation", "Night prayers"]
  },
  {
    title: "First Day of Blessed Ramadan",
    titleArabic: "أول أيام شهر رمضان المبارك",
    hijriDay: 1,
    hijriMonth: 9,
    hijriMonthName: "Ramadan",
    description: "The holy month of fasting, revelation of the Quran, and spiritual rejuvenation.",
    recommendedActions: ["Fasting (Sawm)", "Quran recitation (Khatmah)", "Taraweeh prayers", "Generous Sadaqah"]
  },
  {
    title: "Laylat al-Qadr (Night of Decree)",
    titleArabic: "ليلة القدر",
    hijriDay: 27,
    hijriMonth: 9,
    hijriMonthName: "Ramadan",
    description: "The Night better than a thousand months (odd nights in the last ten days of Ramadan).",
    recommendedActions: ["I'tikaf", "Continuous Dua: 'Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni'", "Extended Qiyam al-Layl"]
  },
  {
    title: "Eid al-Fitr (1st Shawwal)",
    titleArabic: "عيد الفطر المبارك",
    hijriDay: 1,
    hijriMonth: 10,
    hijriMonthName: "Shawwal",
    description: "Celebration marking the conclusion of Ramadan fasting.",
    recommendedActions: ["Zakat al-Fitr (before prayer)", "Eid prayer in congregation", "Takbeerat", "Visiting family and joy"]
  },
  {
    title: "Day of Arafah (9th Dhul Hijjah)",
    titleArabic: "يوم عرفة",
    hijriDay: 9,
    hijriMonth: 12,
    hijriMonthName: "Dhul Hijjah",
    description: "The pinnacle of the Hajj pilgrimage. Fasting expiates sins of previous and upcoming year.",
    recommendedActions: ["Fasting for non-pilgrims", "Tahlil, Takbeer, and abundant Dua", "Charity"]
  },
  {
    title: "Eid al-Adha (10th Dhul Hijjah)",
    titleArabic: "عيد الأضحى المبارك",
    hijriDay: 10,
    hijriMonth: 12,
    hijriMonthName: "Dhul Hijjah",
    description: "The Festival of Sacrifice commemorating Ibrahim's obedience to Allah.",
    recommendedActions: ["Eid Prayer", "Udhiyah/Qurbani sacrifice", "Sharing meat with poor and relatives", "Days of Tashreeq Takbeer"]
  }
];

export class CalendarService {
  public static getHijriToday() {
    // Current date calculation
    const now = new Date();
    // Using Intl for standard Hijri representation
    const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long"
    });

    const parts = formatter.formatToParts(now);
    const day = parts.find((p) => p.type === "day")?.value || "1";
    const month = parts.find((p) => p.type === "month")?.value || "Rabi' al-Awwal";
    const year = parts.find((p) => p.type === "year")?.value || "1448";
    const weekday = parts.find((p) => p.type === "weekday")?.value || "Saturday";

    return {
      hijri: {
        day: parseInt(day, 10),
        monthName: month,
        year: parseInt(year.replace(/[^\d]/g, ""), 10) || 1448,
        formatted: `${day} ${month} ${year} AH`,
        formattedArabic: `${day} ${month} هـ`,
        weekday,
      },
      gregorian: {
        date: now.toISOString().split("T")[0],
        formatted: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      }
    };
  }

  public static getEvents(hijriYear = 1448) {
    return {
      hijriYear,
      eventsCount: ISLAMIC_EVENTS.length,
      events: ISLAMIC_EVENTS,
    };
  }
}
