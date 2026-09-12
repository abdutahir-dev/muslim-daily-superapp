export interface HadithBook {
  slug: string;
  name: string;
  nameArabic: string;
  author: string;
  totalHadith: number;
  totalChapters: number;
  description: string;
}

export interface HadithChapter {
  bookSlug: string;
  chapterNumber: number;
  title: string;
  titleArabic: string;
  hadiths: HadithEntry[];
}

export interface HadithEntry {
  id: string;
  hadithNumber: number;
  arabic: string;
  translationEnglish: string;
  translationAmharic?: string;
  narrator: string;
  grade?: string;
  bookSlug: string;
  chapterNumber: number;
}

const HADITH_BOOKS: HadithBook[] = [
  {
    slug: "bukhari",
    name: "Sahih al-Bukhari",
    nameArabic: "صحيح البخاري",
    author: "Imam Muhammad al-Bukhari (rahimahullah)",
    totalHadith: 7563,
    totalChapters: 97,
    description: "The most authentic book of prophetic traditions, comprising rigorous chains of narration.",
  },
  {
    slug: "muslim",
    name: "Sahih Muslim",
    nameArabic: "صحيح مسلم",
    author: "Imam Muslim ibn al-Hajjaj (rahimahullah)",
    totalHadith: 7500,
    totalChapters: 56,
    description: "Celebrated for its meticulous thematic ordering and preservation of textual variations.",
  },
  {
    slug: "nawawi40",
    name: "An-Nawawi's 40 Hadith",
    nameArabic: "الأربعون النووية",
    author: "Imam Yahya ibn Sharaf an-Nawawi",
    totalHadith: 42,
    totalChapters: 1,
    description: "Foundational collection encompassing the core tenets and ethics of Islamic creed and practice.",
  },
  {
    slug: "riyad",
    name: "Riyad as-Salihin",
    nameArabic: "رياض الصالحين",
    author: "Imam an-Nawawi",
    totalHadith: 1896,
    totalChapters: 372,
    description: "The Gardens of the Righteous — a timeless guide to spiritual ethics, etiquette, and daily devotion.",
  },
  {
    slug: "tirmidhi",
    name: "Jami' at-Tirmidhi",
    nameArabic: "جامع الترمذي",
    author: "Imam Abu 'Isa at-Tirmidhi",
    totalHadith: 3956,
    totalChapters: 50,
    description: "Renowned for its critical classification of Hadith gradings (Sahih, Hasan, Da'if) and comparative Fiqh.",
  },
  {
    slug: "abudawud",
    name: "Sunan Abi Dawud",
    nameArabic: "سنن أبي داود",
    author: "Imam Abu Dawud as-Sijistani",
    totalHadith: 5274,
    totalChapters: 43,
    description: "One of the six canonical Kutub al-Sittah focusing predominantly on legal rulings (Ahkam).",
  }
];

const SAMPLE_HADITHS: HadithEntry[] = [
  {
    id: "bukhari-1",
    hadithNumber: 1,
    bookSlug: "bukhari",
    chapterNumber: 1,
    narrator: "'Umar bin Al-Khattab (may Allah be pleased with him)",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
    translationEnglish: "Actions are but by intention and every man shall have but that which he intended. Thus he whose migration was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was to achieve some worldly benefit or to take some woman in marriage, his migration was for that which he migrated.",
    translationAmharic: "ሥራዎች የሚመዘኑት በኒያ (በሐሳብ) ብቻ ነው። እያንዳንዱ ሰው ያሰበው ብቻ አለው።",
    grade: "Sahih (Agreed Upon)"
  },
  {
    id: "muslim-1",
    hadithNumber: 1,
    bookSlug: "muslim",
    chapterNumber: 1,
    narrator: "Umar ibn al-Khattab (Hadith Jibreel)",
    arabic: "قَالَ: فَأَخْبِرْنِي عَنِ الإِسْلاَمِ. فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ وَتُقِيمَ الصَّلاَةَ وَتُؤْتِيَ الزَّكَاةَ وَتَصُومَ رَمَضَانَ وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً",
    translationEnglish: "He (Jibreel) said: 'Inform me about Islam.' The Messenger of Allah (pbuh) replied: 'Islam is that you testify there is no god but Allah and Muhammad is His messenger, establish prayer, pay zakah, fast Ramadan, and make pilgrimage to the House if you are able.'",
    translationAmharic: "እስልምና ማለት፡- ከአላህ በስተቀር በእውነት የሚመለክ አምላክ እንደሌለና ሙሐመድም የአላህ መልዕክተኛ መሆናቸውን መመስከር፣ ሶላትን ማቋቋም፣ ዘካን መስጠት፣ ረመዳንን መጾም፣ ወደ ቤቱ መጓዝ ለቻለ ሐጅ ማድረግ ነው።",
    grade: "Sahih Muslim"
  },
  {
    id: "nawawi-13",
    hadithNumber: 13,
    bookSlug: "nawawi40",
    chapterNumber: 1,
    narrator: "Anas ibn Malik (may Allah be pleased with him)",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translationEnglish: "None of you truly believes until he loves for his brother what he loves for himself.",
    translationAmharic: "አንዳችሁም ለራሱ የሚወደውን ለወንድሙ እስካልወደደ ድረስ አላመነም (ሙሉ አማኝ አይሆንም)።",
    grade: "Sahih Bukhari & Muslim"
  },
  {
    id: "tirmidhi-1987",
    hadithNumber: 1987,
    bookSlug: "tirmidhi",
    chapterNumber: 1,
    narrator: "Abu Hurairah (may Allah be pleased with him)",
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    translationEnglish: "Your smiling in the face of your brother is an act of charity (Sadaqah) for you.",
    translationAmharic: "በወንድምህ ፊት ፈገግ ማለትህ ላንተ ሰደቃ ነው።",
    grade: "Hasan Sahih (Tirmidhi)"
  },
  {
    id: "bukhari-6011",
    hadithNumber: 6011,
    bookSlug: "bukhari",
    chapterNumber: 2,
    narrator: "Abu Hurairah",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translationEnglish: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    translationAmharic: "በአላህና በመጨረሻው ቀን ያመነ መልካምን ይናገር ወይም ዝም ይበል።",
    grade: "Sahih Bukhari"
  }
];

export class HadithService {
  public static getBooks(): HadithBook[] {
    return HADITH_BOOKS;
  }

  public static getChapterHadiths(bookSlug: string, chapterNumber: number): HadithChapter {
    const book = HADITH_BOOKS.find((b) => b.slug === bookSlug) || HADITH_BOOKS[0];
    const filtered = SAMPLE_HADITHS.filter((h) => h.bookSlug === bookSlug && h.chapterNumber === chapterNumber);

    const hadiths = filtered.length > 0 ? filtered : SAMPLE_HADITHS.filter((h) => h.bookSlug === bookSlug);

    return {
      bookSlug,
      chapterNumber,
      title: `Chapter ${chapterNumber} of ${book.name}`,
      titleArabic: `الباب ${chapterNumber} من ${book.nameArabic}`,
      hadiths: hadiths.length > 0 ? hadiths : SAMPLE_HADITHS.slice(0, 3),
    };
  }

  public static getDailyHadith(): HadithEntry {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return SAMPLE_HADITHS[dayOfYear % SAMPLE_HADITHS.length];
  }

  public static searchHadiths(query: string, bookSlug?: string): HadithEntry[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return SAMPLE_HADITHS.filter((h) => {
      const matchBook = !bookSlug || h.bookSlug === bookSlug;
      const matchText =
        h.translationEnglish.toLowerCase().includes(q) ||
        h.arabic.includes(query) ||
        h.narrator.toLowerCase().includes(q) ||
        (h.translationAmharic && h.translationAmharic.toLowerCase().includes(q));
      return matchBook && matchText;
    });
  }
}
