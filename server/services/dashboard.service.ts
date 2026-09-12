import {
  NextPrayerInfo,
  RandomAyahItem,
  RandomHadithItem,
  RandomQuoteItem,
  DailyDashboardResponse,
} from "../types";

// Standard solar coordinate calculation math
const d2r = (deg: number) => (deg * Math.PI) / 180.0;
const r2d = (rad: number) => (rad * 180.0) / Math.PI;

interface MethodParams {
  fajrAngle: number;
  ishaAngle: number;
  ishaMinutes?: number;
}

const METHOD_CONFIGS: Record<string, MethodParams> = {
  MWL: { fajrAngle: 18.0, ishaAngle: 17.0 },
  ISNA: { fajrAngle: 15.0, ishaAngle: 15.0 },
  Egypt: { fajrAngle: 19.5, ishaAngle: 17.5 },
  Makkah: { fajrAngle: 18.5, ishaAngle: 0, ishaMinutes: 90 },
  Karachi: { fajrAngle: 18.0, ishaAngle: 18.0 },
  Gulf: { fajrAngle: 19.5, ishaAngle: 0, ishaMinutes: 90 },
};

function getSunPosition(julianDate: number) {
  const d = julianDate - 2451545.0;
  const g = 357.529 + 0.98560028 * d;
  const q = 280.459 + 0.98564736 * d;
  const l = q + 1.915 * Math.sin(d2r(g)) + 0.02 * Math.sin(d2r(2 * g));

  const e = 23.439 - 0.00000036 * d;
  const declination = r2d(Math.asin(Math.sin(d2r(e)) * Math.sin(d2r(l))));

  let ra = r2d(Math.atan2(Math.cos(d2r(e)) * Math.sin(d2r(l)), Math.cos(d2r(l)))) / 15.0;
  ra = (ra + 24.0) % 24.0;

  const equationOfTime = (q / 15.0 - ra) * 60.0;
  return { declination, equationOfTime };
}

function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524.5
  );
}

function formatHoursToTimeString(hours: number): string {
  let h = Math.floor(hours);
  let m = Math.floor((hours - h) * 60);
  h = (h + 24) % 24;
  if (m < 0) m = 0;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

const CURATED_AYAHS: RandomAyahItem[] = [
  {
    id: "ayah-1",
    badge: "Maryam [ 78 - 84 ]",
    surahNumber: 19,
    surahNameArabic: "مريم",
    surahNameEnglish: "Maryam",
    arabic: "أَطَّلَعَ الْغَيْبَ أَمِ اتَّخَذَ عِندَ الرَّحْمَٰنِ عَهْدًا",
    translation: "Has he looked into the unseen, or has he taken from the Most Merciful a covenant?",
    translationAmharic: "ሩቁን ምሥጢር ዐወቀን? ወይስ ከአልረሕማን ዘንድ ቃል ኪዳንን ያዘ?",
    buttonLabel: "Read Ayahs [ 78 - 84 ]",
  },
  {
    id: "ayah-2",
    badge: "Al-Baqarah [ 152 ]",
    surahNumber: 2,
    surahNameArabic: "البقرة",
    surahNameEnglish: "Al-Baqarah",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    translationAmharic: "አስታውሱኝም፤ አስታውሳችኋለሁና፡፡ ለእኔም አመስግኑ፤ አትካዱኝም፡፡",
    buttonLabel: "Read Ayah [ 152 ]",
  },
  {
    id: "ayah-3",
    badge: "Ash-Sharh [ 5 - 6 ]",
    surahNumber: 94,
    surahNameArabic: "الشرح",
    surahNameEnglish: "Ash-Sharh",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
    translationAmharic: "ከችግርም ጋር ምቾት አልለ፡፡ ከችግር ጋር በእርግጥ ምቾት አልለ፡፡",
    buttonLabel: "Read Ayahs [ 5 - 6 ]",
  },
  {
    id: "ayah-4",
    badge: "Ar-Rahman [ 13 ]",
    surahNumber: 55,
    surahNameArabic: "الرحمن",
    surahNameEnglish: "Ar-Rahman",
    arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation: "So which of the favors of your Lord would you deny?",
    translationAmharic: "ከጌታችሁም ጸጋዎች በየትኛው ታበልጻላችሁ?",
    buttonLabel: "Read Ayah [ 13 ]",
  },
  {
    id: "ayah-5",
    badge: "Al-Anbiya [ 87 ]",
    surahNumber: 21,
    surahNameArabic: "الأنبياء",
    surahNameEnglish: "Al-Anbiya",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    translationAmharic: "ካንተ ሌላ አምላክ የለም፤ ጥራት ይገባህ፤ እኔ በእርግጥ የበደለኞች ነበርኩ።",
    buttonLabel: "Read Ayah [ 87 ]",
  },
  {
    id: "ayah-6",
    badge: "Al-Imran [ 139 ]",
    surahNumber: 3,
    surahNameArabic: "آل عمران",
    surahNameEnglish: "Ali 'Imran",
    arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    translationAmharic: "አትደክሙም አትዘኑም፤ ምእመናን እንደሆናችሁ እናንተ የበላይ ናችሁ።",
    buttonLabel: "Read Ayah [ 139 ]",
  },
];

const CURATED_HADITHS: RandomHadithItem[] = [
  {
    id: "hadith-1",
    title: "VIRTUE OF WUDU & PRAYER",
    arabic: "ما من أحد يتوضأ فيحسن الوضوء ويصلي ركعتين يقبل بقلبه ووجهه عليهما إلا وجبت له الجنة",
    translation: "Whenever a Muslim performs ablution properly, then stands and offers two raka'ahs with undivided heart and face, Paradise becomes guaranteed for him.",
    translationAmharic: "ማንኛውም ሙስሊም ውዱእን አሳምሮ አድርጎ፣ ከዚያም በልቡና በፊቱ ተቅጣጭቶ ሁለት ረከዓ ቢሰግድ ጀነት በእርግጥ ትረጋገጥለታለች።",
    source: "Sahih Muslim & Sunan Abi Dawud",
    book: "Sahih Muslim (Book of Purification)",
    category: "Purification & Prayer",
  },
  {
    id: "hadith-2",
    title: "ACTIONS ARE BY INTENTION",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translation: "Actions are judged by intentions, and every person will get what was intended.",
    translationAmharic: "ሥራዎች የሚመዘኑት በነyyህ (በሐሳብ) ብቻ ነው፤ ለሰውም ሁሉ ያሰበው ብቻ አለው።",
    source: "Sahih al-Bukhari & Sahih Muslim",
    book: "Forty Hadith An-Nawawi (Hadith 1)",
    category: "Intention & Sincerity",
  },
  {
    id: "hadith-3",
    title: "LOVE FOR YOUR BROTHER",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translation: "None of you truly believes until he loves for his brother what he loves for himself.",
    translationAmharic: "ከእናንተ አንዳችሁም ለራሱ የሚወደውን ለወንድሙ እስከማይወድ ድረስ እውነተኛ አማኝ አይሆንም።",
    source: "Sahih al-Bukhari & Sahih Muslim",
    book: "Forty Hadith An-Nawawi (Hadith 13)",
    category: "Brotherhood & Character",
  },
  {
    id: "hadith-4",
    title: "SPEECH & NEIGHBORLY GOODNESS",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    translationAmharic: "በአላህና በመጨረሻው ቀን የሚያምን ሰው መልካም ይናገር ወይም ዝም ይበል።",
    source: "Sahih al-Bukhari & Sahih Muslim",
    book: "Forty Hadith An-Nawawi (Hadith 15)",
    category: "Speech & Morality",
  },
  {
    id: "hadith-5",
    title: "SUPPLICATION IS WORSHIP",
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    translation: "Supplication (Dua) is the essence of worship.",
    translationAmharic: "ዱዓእ (ጸሎት) እሱ ራሱ አምልኮት ነው።",
    source: "Sunan At-Tirmidhi & Sunan Abi Dawud",
    book: "Riyad as-Salihin",
    category: "Dua & Worship",
  },
];

const CURATED_QUOTES: RandomQuoteItem[] = [
  {
    id: "quote-1",
    category: "مدح العدل (Praise of Justice)",
    arabic: "إِنَّ اللَّهَ سُبْحَانَهُ أَمَرَ بِالْعَدْلِ وَالإِحْسَانِ، وَنَهَى عَنِ الفَحْشَاءِ وَالظُّلْمِ",
    translation: "Verily Allah, the Glorified, has enjoined justice and benevolence and has forbidden indecency and injustice.",
    translationAmharic: "አላህ ጥራት ይገባውና ፍትሕንና በጎ ሥራን አዞአል፤ መጥፎ ነገርንና ግፍን ከልክሏል።",
    source: "Ghurar al-Hikam wa Durar al-Kalim",
    author: "Sharif al-Razi",
  },
  {
    id: "quote-2",
    category: "حقيقة الصبر (Essence of Patience)",
    arabic: "الصَّبْرُ كَفِيلٌ بِالنَّصْرِ، وَالْعَجَلَةُ تُوجِبُ العِثَارَ",
    translation: "Patience guarantees victory, while haste invites stumbling.",
    translationAmharic: "ትዕግሥት ድልን ያረጋግጣል፤ ቸኮል ደግሞ ውድቀትን ያመጣል።",
    source: "Wisdom of the Predecessors",
    author: "Ali ibn Abi Talib",
  },
  {
    id: "quote-3",
    category: "صفاء القلب (Purity of Heart)",
    arabic: "إِذَا صَلَحَ القَلْبُ صَلَحَ سَائِرُ الجَسَدِ، وَإِذَا فَسَدَ فَسَدَ السَّائِرُ",
    translation: "When the heart is sound, the entire body is sound; and when it is corrupted, all of it is corrupted.",
    translationAmharic: "ልብ ሲስተካከል ሙሉ አካል ይስተካከላል፤ እሱ ሲበላሽ ግን አካል ሁሉ ይበላሻል።",
    source: "Ihya Ulum al-Din",
    author: "Imam Al-Ghazali",
  },
  {
    id: "quote-4",
    category: "علو الهمة (High Aspiration)",
    arabic: "قِيمَةُ كُلِّ امْرِئٍ مَا يُحْسِنُهُ",
    translation: "The true worth of every person is found in the goodness they excel at.",
    translationAmharic: "የእያንዳንዱ ሰው እውነተኛ ዋጋ በሚያሳምረውና በሚያውቀው በጎ ሥራ ልክ ነው።",
    source: "Nahj al-Balagha",
    author: "Wisdom of Salaf",
  },
  {
    id: "quote-5",
    category: "شرف العلم (Nobility of Knowledge)",
    arabic: "العِلْمُ حَيَاةُ القُلُوبِ وَنُورُ الأَبْصَارِ مِنَ الظُّلَمِ",
    translation: "Knowledge is the life of hearts and the light of eyes against darkness.",
    translationAmharic: "ዕውቀት የልቦች ሕይወትና የዓይኖች ብርሃን ነው ከጨለማዎች።",
    source: "Miftah Dar al-Sa'adah",
    author: "Ibn al-Qayyim",
  },
];

export class DashboardService {
  /**
   * Calculates next prayer and current schedule based on location and calculation settings
   */
  public static calculateNextPrayer(options: {
    lat?: number;
    lng?: number;
    method?: string;
    school?: string;
    locationName?: string;
    date?: Date;
  }): NextPrayerInfo {
    const lat = options.lat ?? 51.5074; // London default
    const lng = options.lng ?? -0.1278;
    const methodKey = options.method || "MWL";
    const method = METHOD_CONFIGS[methodKey] || METHOD_CONFIGS.MWL;
    const isHanafi = options.school === "hanafi";

    const date = options.date || new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const jd = getJulianDate(year, month, day);
    const { declination, equationOfTime } = getSunPosition(jd);
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60.0;

    const noonSolar = 12.0 + timezoneOffsetHours - lng / 15.0 - equationOfTime / 60.0;

    const hourAngle = (angle: number): number => {
      const val =
        (-Math.sin(d2r(angle)) - Math.sin(d2r(lat)) * Math.sin(d2r(declination))) /
        (Math.cos(d2r(lat)) * Math.cos(d2r(declination)));
      if (val > 1.0) return 0;
      if (val < -1.0) return 180;
      return r2d(Math.acos(val));
    };

    const fajrHours = noonSolar - hourAngle(method.fajrAngle) / 15.0;
    const sunriseHours = noonSolar - hourAngle(0.833) / 15.0;
    const dhuhrHours = noonSolar + 2 / 60.0; // 2 minutes post solar noon

    // Asr calculation
    const shadowFactor = isHanafi ? 2 : 1;
    const asrAngleRad = Math.atan(
      1.0 / (shadowFactor + Math.tan(d2r(Math.abs(lat - declination))))
    );
    const asrAngleDeg = r2d(asrAngleRad);
    const asrHours = noonSolar + r2d(Math.acos(
      (Math.sin(d2r(asrAngleDeg)) - Math.sin(d2r(lat)) * Math.sin(d2r(declination))) /
      (Math.cos(d2r(lat)) * Math.cos(d2r(declination)))
    )) / 15.0;

    const maghribHours = noonSolar + hourAngle(0.833) / 15.0;
    const ishaHours = method.ishaMinutes
      ? maghribHours + method.ishaMinutes / 60.0
      : noonSolar + hourAngle(method.ishaAngle) / 15.0;

    const allPrayers = {
      fajr: formatHoursToTimeString(fajrHours),
      sunrise: formatHoursToTimeString(sunriseHours),
      dhuhr: formatHoursToTimeString(dhuhrHours),
      asr: formatHoursToTimeString(asrHours),
      maghrib: formatHoursToTimeString(maghribHours),
      isha: formatHoursToTimeString(ishaHours),
    };

    // Determine next prayer relative to current local time
    const nowHours = date.getHours() + date.getMinutes() / 60.0 + date.getSeconds() / 3600.0;
    let nextName = "Fajr";
    let nextTimeHours = fajrHours + 24.0; // Tomorrow Fajr default

    if (nowHours < fajrHours) {
      nextName = "Fajr";
      nextTimeHours = fajrHours;
    } else if (nowHours < sunriseHours) {
      nextName = "Sunrise";
      nextTimeHours = sunriseHours;
    } else if (nowHours < dhuhrHours) {
      nextName = "Dhuhr";
      nextTimeHours = dhuhrHours;
    } else if (nowHours < asrHours) {
      nextName = "Asr";
      nextTimeHours = asrHours;
    } else if (nowHours < maghribHours) {
      nextName = "Maghrib";
      nextTimeHours = maghribHours;
    } else if (nowHours < ishaHours) {
      nextName = "Isha";
      nextTimeHours = ishaHours;
    }

    const diffMinutes = Math.max(0, Math.floor((nextTimeHours - nowHours) * 60.0));
    const hRem = Math.floor(diffMinutes / 60);
    const mRem = diffMinutes % 60;
    const timeRemaining = hRem > 0 ? `${hRem}h ${mRem}m` : `${mRem}m`;

    return {
      name: nextName,
      time: formatHoursToTimeString(nextTimeHours % 24),
      timeRemaining,
      allPrayers,
      location: options.locationName || "London, UK",
      calculationMethod: methodKey,
    };
  }

  /**
   * Returns a random Ayah item
   */
  public static getRandomAyah(): RandomAyahItem {
    const index = Math.floor(Math.random() * CURATED_AYAHS.length);
    return CURATED_AYAHS[index];
  }

  /**
   * Returns a random Hadith item
   */
  public static getRandomHadith(): RandomHadithItem {
    const index = Math.floor(Math.random() * CURATED_HADITHS.length);
    return CURATED_HADITHS[index];
  }

  /**
   * Returns a random Quote item
   */
  public static getRandomQuote(): RandomQuoteItem {
    const index = Math.floor(Math.random() * CURATED_QUOTES.length);
    return CURATED_QUOTES[index];
  }

  /**
   * Returns complete dynamic landing page data payload
   */
  public static getDailyDashboard(options: {
    lat?: number;
    lng?: number;
    method?: string;
    school?: string;
    locationName?: string;
  }): DailyDashboardResponse {
    return {
      timestamp: new Date().toISOString(),
      nextPrayer: this.calculateNextPrayer(options),
      randomAyah: this.getRandomAyah(),
      randomHadith: this.getRandomHadith(),
      randomQuote: this.getRandomQuote(),
    };
  }
}
