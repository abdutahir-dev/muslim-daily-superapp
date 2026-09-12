import { QuranReadingStyle, QiraatDifferenceItem } from "../types";

export interface ReciterProfile {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  country: string;
  style: QuranReadingStyle;
  moshafType: "murattal" | "mujawwad";
  serverUrl: string; // Base URL where `${String(surah).padStart(3, '0')}.mp3` resides
  ayahAudioFormat?: "everyayah" | "mp3quran";
  everyAyahSubfolder?: string;
}

export interface ReadingStyleDetail {
  id: QuranReadingStyle;
  nameArabic: string;
  nameEnglish: string;
  rawiNameArabic: string;
  rawiNameEnglish: string;
  imamNameArabic: string;
  imamNameEnglish: string;
  centerCity: string;
  regions: string[];
  regionsAmharic: string;
  description: string;
  descriptionAmharic: string;
  keyUsulRules: {
    ruleArabic: string;
    ruleEnglish: string;
    description: string;
  }[];
  isHornOfAfricaHistoric?: boolean;
}

/**
 * The Ten Canonical Qira'at and their major transmissions.
 */
export const READING_STYLES_LIST: ReadingStyleDetail[] = [
  {
    id: "hafs",
    nameArabic: "رواية حفص عن عاصم",
    nameEnglish: "Hafs 'an 'Asim",
    rawiNameArabic: "حفص بن سليمان الكوفي (ت 180 هـ)",
    rawiNameEnglish: "Hafs ibn Sulayman Al-Kufi (d. 180 AH)",
    imamNameArabic: "عاصم بن أبي النَّجود الأسدي الكوفي (ت 127 هـ)",
    imamNameEnglish: "Imam 'Asim ibn Abi Al-Najud (d. 127 AH)",
    centerCity: "الكوفة (Kufa)",
    regions: ["العالم الإسلامي (Global Standard)", "Saudi Arabia", "Egypt", "East Asia", "Worldwide"],
    regionsAmharic: "ዓለም አቀፍ ደረጃውን የጠበቀ (የአብዛኛው ሙስሊም ንባብ)",
    description: "The most widely recited transmission across the globe today, characterized by clarity, preservation of hamzahs, and balanced elongation.",
    descriptionAmharic: "ዛሬ በዓለም አቀፍ ደረጃ በስፋት የሚቀራው የተስተካከለና ግልጽ ንባብ።",
    keyUsulRules: [
      {
        ruleArabic: "توسط المنفصل والمتصل",
        ruleEnglish: "Tawassut of Madd",
        description: "4-5 counts for connected and detached elongations (Tariq Ash-Shatibiyyah).",
      },
      {
        ruleArabic: "إثبات الهمزات",
        ruleEnglish: "Preservation of Hamzahs",
        description: "Pronouncing both consecutive hamzahs without softening, except in 'A-a'jamiyyun'.",
      },
      {
        ruleArabic: "الإمالة في موضع واحد",
        ruleEnglish: "Single Imalah",
        description: "Imalah occurs solely in Surah Hud 11:41 on 'Majrāhā' (مَجْرَاهَا).",
      },
    ],
  },
  {
    id: "duri",
    nameArabic: "رواية الدوري عن أبي عمرو",
    nameEnglish: "Ad-Duri 'an Abi 'Amr",
    rawiNameArabic: "حفص بن عمر الدوري (ت 246 هـ)",
    rawiNameEnglish: "Abu 'Amr Hafs ibn 'Umar Ad-Duri (d. 246 AH)",
    imamNameArabic: "أبو عمرو بن العلاء البصري (ت 154 هـ)",
    imamNameEnglish: "Imam Abu 'Amr ibn Al-'Ala Al-Basri (d. 154 AH)",
    centerCity: "البصرة (Basra)",
    regions: ["السودان (Sudan)", "الصومال (Somalia)", "إثيوبيا (Ethiopia & Horn of Africa)", "اليمن (Hadramawt)", "Chad"],
    regionsAmharic: "ሱዳን፣ ሶማሊያ፣ ኢትዮጵያና ምሥራቅ አፍሪካ",
    isHornOfAfricaHistoric: true,
    description: "The historically predominant and deeply beloved reading of Sudan, Somalia, and the Horn of Africa/Ethiopia, renowned for melodic flow, Imalah, and subtle assimilation.",
    descriptionAmharic: "በሱዳን፣ ሶማሊያ፣ ኢትዮጵያና ምሥራቅ አፍሪካ ታሪካዊና እጅግ የተወደደ፣ በልዩ ጣዕሙና ኢማላህ የሚታወቅ ንባብ።",
    keyUsulRules: [
      {
        ruleArabic: "قصر وتوسط المنفصل",
        ruleEnglish: "Qasr / Tawassut of Munfasil",
        description: "Recited with 2 or 4 vowel elongation on detached Madd.",
      },
      {
        ruleArabic: "الإمالة الكبرى والصغرى",
        ruleEnglish: "Imalah on Specific Nouns",
        description: "Imalah on words with broken plurals ending in Alif before Ra, like 'An-Nār' (النَّارِ) and 'Ad-Dīnār'.",
      },
      {
        ruleArabic: "إسقاط الهمزة وتسهيلها",
        ruleEnglish: "Tashil of Consecutive Hamzahs",
        description: "Softening or elision of the first of two consecutive hamzahs across separate words.",
      },
    ],
  },
  {
    id: "warsh",
    nameArabic: "رواية ورش عن نافع",
    nameEnglish: "Warsh 'an Nafi'",
    rawiNameArabic: "عثمان بن سعيد المصري الملقب بورش (ت 197 هـ)",
    rawiNameEnglish: "Uthman ibn Sa'id Al-Misri (Warsh) (d. 197 AH)",
    imamNameArabic: "نافع بن عبد الرحمن المدني (ت 169 هـ)",
    imamNameEnglish: "Imam Nafi' ibn Abd al-Rahman al-Madani (d. 169 AH)",
    centerCity: "المدينة المنورة (Madinah)",
    regions: ["المغرب (Morocco)", "الجزائر (Algeria)", "موريتانيا (Mauritania)", "السنغال (Senegal)", "Mali & West Africa"],
    regionsAmharic: "ሞሮኮ፣ አልጄሪያ፣ ሞሪታንያ፣ ሴኔጋልና ምዕራብ አፍሪካ",
    description: "The dominant reading of North and West Africa (Maghreb), celebrated for Taghlidh of Lam, Tarqiq of Ra, Naql (transfer of voweling), and flexibility in Badal elongation.",
    descriptionAmharic: "በሰሜንና ምዕራብ አፍሪካ (መግሪብ) በስፋት የሚቀራ፣ በላም መወፈርና በራዕ መሳሳት የሚታወቅ ንባብ።",
    keyUsulRules: [
      {
        ruleArabic: "نقل الهمزة",
        ruleEnglish: "Naql (Hamzah Transfer)",
        description: "Transferring the vowel of a beginning hamzah to the silent consonant before it ('Qad aflaha' becomes 'Qadaflaha').",
      },
      {
        ruleArabic: "تغليظ اللام",
        ruleEnglish: "Taghlidh of Lam",
        description: "Pronouncing the letter Lam with full mouth when preceded by Sad, Ta, or Dha with Sukun or Fathah ('Salāt', 'Dhalamū').",
      },
      {
        ruleArabic: "ترقيق الراء",
        ruleEnglish: "Tarqiq of Ra",
        description: "Lightening the letter Ra when preceded by a permanent Kasrah or silent Ya.",
      },
      {
        ruleArabic: "تثليث مد البدل",
        ruleEnglish: "Badal Elongation Flexibility",
        description: "Permissibility of reciting Badal elongation in 2, 4, or 6 counts ('Āmanū').",
      },
    ],
  },
  {
    id: "qalun",
    nameArabic: "رواية قالون عن نافع",
    nameEnglish: "Qalun 'an Nafi'",
    rawiNameArabic: "عيسى بن مينا المدني الملقب بقالون (ت 220 هـ)",
    rawiNameEnglish: "Isa ibn Mina Al-Madani (Qalun) (d. 220 AH)",
    imamNameArabic: "نافع بن عبد الرحمن المدني (ت 169 هـ)",
    imamNameEnglish: "Imam Nafi' ibn Abd al-Rahman al-Madani (d. 169 AH)",
    centerCity: "المدينة المنورة (Madinah)",
    regions: ["ليبيا (Libya)", "تونس (Tunisia)", "تشاد (Chad)"],
    regionsAmharic: "ሊቢያ፣ ቱኒዚያ እና ቻድ",
    description: "The revered Madani transmission widely recited across Libya and parts of Tunisia, distinguished by Silat Mim al-Jam' and harmonious vowel moderation.",
    descriptionAmharic: "በሊቢያና ቱኒዚያ የሚቀራ የመዲና ትውፊት፣ በሚም አል-ጀምዕ ትስስር የሚታወቅ።",
    keyUsulRules: [
      {
        ruleArabic: "صلة ميم الجمع",
        ruleEnglish: "Silat Mim Al-Jam'",
        description: "Optionally lengthening plural Mim with a Waw ('Alayhimu' / 'Alayhim').",
      },
      {
        ruleArabic: "قصر وتوسط المنفصل",
        ruleEnglish: "Short / Medium Munfasil",
        description: "Recited with 2 or 4 vowel movements.",
      },
      {
        ruleArabic: "تسهيل الهمزة الثانية",
        ruleEnglish: "Tashil of Second Hamzah",
        description: "Softening the second of two adjacent hamzahs in one word with an introduced Alif (Idkhal).",
      },
    ],
  },
  {
    id: "soussi",
    nameArabic: "رواية السوسي عن أبي عمرو",
    nameEnglish: "As-Soussi 'an Abi 'Amr",
    rawiNameArabic: "أبو شعيب صالح بن زياد السوسي (ت 261 هـ)",
    rawiNameEnglish: "Salih ibn Ziyad As-Soussi (d. 261 AH)",
    imamNameArabic: "أبو عمرو بن العلاء البصري (ت 154 هـ)",
    imamNameEnglish: "Imam Abu 'Amr ibn Al-'Ala Al-Basri (d. 154 AH)",
    centerCity: "البصرة (Basra)",
    regions: ["العالم الإسلامي (Scholarship & Tilawah)", "Central Asia", "Maghreb circles"],
    regionsAmharic: "በኡለሞችና በቁርኣን ሊቃውንት ዘንድ የሚታወቅ",
    description: "Famous throughout Quranic scholarship for Al-Idgham Al-Kabir (assimilating vowelled letters into matching consonants across words) and extensive Ibdal of Hamzah.",
    descriptionAmharic: "በኢድጋም አል-ከቢር (ቃላትን በማዋሃድ) እና በሀምዛህ ቅያሬ የሚታወቅ ልዩ ንባብ።",
    keyUsulRules: [
      {
        ruleArabic: "الإدغام الكبير",
        ruleEnglish: "Al-Idgham Al-Kabir",
        description: "Merging two adjacent vowelled letters into one doubled consonant ('Ar-Rahīmi Māliki' -> 'Ar-Rahīm-Māliki').",
      },
      {
        ruleArabic: "إبدال الهمز الساكن",
        ruleEnglish: "Ibdal of Silent Hamzah",
        description: "Replacing silent hamzahs with the vowel letter preceding it ('Yu'minūn' -> 'Yūminūn').",
      },
    ],
  },
  {
    id: "shubah",
    nameArabic: "رواية شعبة عن عاصم",
    nameEnglish: "Shu'bah 'an 'Asim",
    rawiNameArabic: "شعبة بن عياش الكوفي (ت 193 هـ)",
    rawiNameEnglish: "Shu'bah ibn 'Ayyash Al-Kufi (d. 193 AH)",
    imamNameArabic: "عاصم بن أبي النَّجود الكوفي (ت 127 هـ)",
    imamNameEnglish: "Imam 'Asim ibn Abi Al-Najud (d. 127 AH)",
    centerCity: "الكوفة (Kufa)",
    regions: ["حلقات الإجازات القرآنية (Qira'at Ijazah Circles)", "Iraq", "Levant"],
    regionsAmharic: "የኢማም ዓሲም ሁለተኛው ትውፊት (ከሀፍስ ጋር እኩል)",
    description: "The primary sister transmission to Hafs from Imam 'Asim; preserves distinct vocalization variations across key vocabulary words (Farsh).",
    descriptionAmharic: "ከሀፍስ ጋር የኢማም ዓሲም ጥምር ትውፊት የሆነው ታላቅ የኩፋ ንባብ።",
    keyUsulRules: [
      {
        ruleArabic: "فروقات الفرش",
        ruleEnglish: "Specific Farsh Pronunciations",
        description: "Differs from Hafs in vocalizing specific words (e.g. 'Rijzan' with Kasrah instead of Dammah, 'Yahsabuhum').",
      },
      {
        ruleArabic: "إمالة رءوس الآي",
        ruleEnglish: "Imalah on Specific Ayahs",
        description: "Minor Imalah on certain Alifs preceding feminine suffixes.",
      },
    ],
  },
  {
    id: "khalaf",
    nameArabic: "رواية خلف عن حمزة",
    nameEnglish: "Khalaf 'an Hamzah",
    rawiNameArabic: "خلف بن هشام البزار (ت 229 هـ)",
    rawiNameEnglish: "Khalaf ibn Hisham Al-Bazzar (d. 229 AH)",
    imamNameArabic: "حمزة بن حبيب الزيات الكوفي (ت 156 هـ)",
    imamNameEnglish: "Imam Hamzah ibn Habib Az-Zayyat (d. 156 AH)",
    centerCity: "الكوفة (Kufa)",
    regions: ["العراق والشام (Historical Kufa & Levant)", "Tilawah Masters"],
    regionsAmharic: "በሰክት (ዝምታ) እና በኢማላህ የሚታወቅ የኩፋ ንባብ",
    description: "Renowned for strict precision, Sakt (subtle breathless pause before hamzahs), extensive major Imalah, and Ishmam.",
    descriptionAmharic: "ከሀምዛህ በፊት ባለ ትንሽ ማቆም (ሰክት) እና ግልጽ ኢማላህ የሚታወቅ ንባብ።",
    keyUsulRules: [
      {
        ruleArabic: "السكت على الساكن المفصول",
        ruleEnglish: "Sakt (Breathless Pause)",
        description: "A brief pause without breaking breath on silent consonants before a hamzah ('Man • Āmana').",
      },
      {
        ruleArabic: "الإمالة الكبرى",
        ruleEnglish: "Major Imalah",
        description: "Strong vowel tilting towards Ya across numerous verb and noun roots.",
      },
    ],
  },
  {
    id: "al_duri_kisai",
    nameArabic: "رواية الدوري عن الكسائي",
    nameEnglish: "Ad-Duri 'an Al-Kisa'i",
    rawiNameArabic: "حفص بن عمر الدوري (ت 246 هـ)",
    rawiNameEnglish: "Abu 'Amr Hafs ibn 'Umar Ad-Duri (d. 246 AH)",
    imamNameArabic: "علي بن حمزة الكسائي النحوي (ت 189 هـ)",
    imamNameEnglish: "Imam Ali ibn Hamzah Al-Kisa'i (d. 189 AH)",
    centerCity: "الكوفة (Kufa)",
    regions: ["العراق ومجالس القراءات (Iraq & Islamic Scholarship)"],
    regionsAmharic: "በኢማም አል-ኪሳኢ ዘንድ የሚታወቅ ሌላው የዶውሪ ንባብ",
    description: "Imam Al-Kisa'i was the foremost grammarian of Kufa; Ad-Duri's transmission from him is celebrated for systematic Imalah on feminine endings (Ta' Marbutah) when pausing.",
    descriptionAmharic: "በመጨረሻ ቃላት ላይ በኢማላህ የሚታወቀው የኩፋ ታላቅ ንባብ።",
    keyUsulRules: [
      {
        ruleArabic: "إمالة هاء التأنيث عند الوقف",
        ruleEnglish: "Imalah on Feminine Endings",
        description: "Tilted pronunciation on feminine Ta' Marbutah when halting in recitation.",
      },
    ],
  },
];

/**
 * Authentic Reciters Catalog mapped to their reading styles and CDN servers.
 */
export const RECITERS_CATALOG: ReciterProfile[] = [
  // --- AD-DURI 'AN ABI 'AMR (Sudan & Horn of Africa) ---
  {
    id: "nourin_duri",
    nameArabic: "الشيخ نورين محمد صديق (السودان)",
    nameEnglish: "Noreen Mohammad Siddiq (Sudan)",
    country: "Sudan",
    style: "duri",
    moshafType: "murattal",
    serverUrl: "https://server16.mp3quran.net/nourin_siddig/Rewayat-Aldori-A-n-Abi-Amr/",
  },
  {
    id: "hussary_duri",
    nameArabic: "الشيخ محمود خليل الحصري (الدوري)",
    nameEnglish: "Mahmoud Khalil Al-Hussary (Ad-Duri)",
    country: "Egypt",
    style: "duri",
    moshafType: "murattal",
    serverUrl: "https://server13.mp3quran.net/husr/Rewayat-Aldori-A-n-Abi-Amr/",
  },
  {
    id: "fateh_duri",
    nameArabic: "الشيخ الفاتح محمد الزبير (السودان)",
    nameEnglish: "Alfateh Alzubair (Sudan)",
    country: "Sudan",
    style: "duri",
    moshafType: "murattal",
    serverUrl: "https://server6.mp3quran.net/fateh/",
  },
  {
    id: "saltany_duri",
    nameArabic: "الشيخ مفتاح السلطني (الدوري)",
    nameEnglish: "Muftah Alsaltany (Ad-Duri)",
    country: "Libya",
    style: "duri",
    moshafType: "murattal",
    serverUrl: "https://server14.mp3quran.net/muftah_sultany/Rewayat-Aldori-A-n-Abi-Amr/",
  },

  // --- WARSH 'AN NAFI' (North & West Africa) ---
  {
    id: "hussary_warsh",
    nameArabic: "الشيخ محمود خليل الحصري (ورش)",
    nameEnglish: "Mahmoud Khalil Al-Hussary (Warsh)",
    country: "Egypt",
    style: "warsh",
    moshafType: "murattal",
    serverUrl: "https://server13.mp3quran.net/husr/Rewayat-Warsh-A-n-Nafi/",
  },
  {
    id: "koshi_warsh",
    nameArabic: "الشيخ العيون الكوشي (المغرب)",
    nameEnglish: "Aloyoon Al-Koshi (Morocco)",
    country: "Morocco",
    style: "warsh",
    moshafType: "murattal",
    serverUrl: "https://server11.mp3quran.net/koshi/",
  },
  {
    id: "dosri_warsh",
    nameArabic: "الشيخ إبراهيم الدوسري (ورش)",
    nameEnglish: "Ibrahim Aldosari (Warsh)",
    country: "Saudi Arabia",
    style: "warsh",
    moshafType: "murattal",
    serverUrl: "https://server10.mp3quran.net/ibrahim_dosri/Rewayat-Warsh-A-n-Nafi/",
  },
  {
    id: "sayed_warsh",
    nameArabic: "الشيخ محمد سيد (ورش)",
    nameEnglish: "Mohammad Saayed (Warsh)",
    country: "Egypt",
    style: "warsh",
    moshafType: "murattal",
    serverUrl: "https://server16.mp3quran.net/m_sayed/Rewayat-Warsh-A-n-Nafi/",
  },

  // --- QALUN 'AN NAFI' (Libya & Tunisia) ---
  {
    id: "hussary_qalun",
    nameArabic: "الشيخ محمود خليل الحصري (قالون)",
    nameEnglish: "Mahmoud Khalil Al-Hussary (Qalun)",
    country: "Egypt",
    style: "qalun",
    moshafType: "murattal",
    serverUrl: "https://server13.mp3quran.net/husr/Rewayat-Qalon-A-n-Nafi/",
  },
  {
    id: "trabulsi_qalun",
    nameArabic: "الشيخ أحمد الطرابلسي (ليبيا)",
    nameEnglish: "Ahmed Al-trabulsi (Libya)",
    country: "Libya",
    style: "qalun",
    moshafType: "murattal",
    serverUrl: "https://server10.mp3quran.net/trablsi/",
  },
  {
    id: "huthifi_qalun",
    nameArabic: "الشيخ علي بن عبد الرحمن الحذيفي (قالون)",
    nameEnglish: "Ali Alhuthaifi (Qalun)",
    country: "Saudi Arabia",
    style: "qalun",
    moshafType: "murattal",
    serverUrl: "https://server9.mp3quran.net/huthifi_qalon/",
  },

  // --- AS-SOUSSI 'AN ABI 'AMR ---
  {
    id: "soufi_soussi",
    nameArabic: "الشيخ عبد الرشيد صوفي (السوسي)",
    nameEnglish: "Abdulrasheed Soufi (As-Soussi)",
    country: "Somalia / Qatar",
    style: "soussi",
    moshafType: "murattal",
    serverUrl: "https://server16.mp3quran.net/soufi/Rewayat-Assosi-A-n-Abi-Amr/",
  },
  {
    id: "deban_soussi",
    nameArabic: "الشيخ أحمد ديبان (السوسي)",
    nameEnglish: "Ahmad Deban (As-Soussi)",
    country: "Yemen",
    style: "soussi",
    moshafType: "murattal",
    serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Assosi-A-n-Abi-Amr/",
  },

  // --- SHU'BAH 'AN 'ASIM ---
  {
    id: "huthifi_shubah",
    nameArabic: "الشيخ علي الحذيفي (شعبة)",
    nameEnglish: "Ali Alhuthaifi (Shu'bah)",
    country: "Saudi Arabia",
    style: "shubah",
    moshafType: "murattal",
    serverUrl: "https://server9.mp3quran.net/hthfi/Rewayat-Sho-bah-A-n-Asim/",
  },
  {
    id: "saltany_shubah",
    nameArabic: "الشيخ مفتاح السلطني (شعبة)",
    nameEnglish: "Muftah Alsaltany (Shu'bah)",
    country: "Libya",
    style: "shubah",
    moshafType: "murattal",
    serverUrl: "https://server14.mp3quran.net/muftah_sultany/Rewayat_Sho-bah-A-n-Asim/",
  },

  // --- KHALAF 'AN HAMZAH ---
  {
    id: "soufi_khalaf",
    nameArabic: "الشيخ عبد الرشيد صوفي (خلف عن حمزة)",
    nameEnglish: "Abdulrasheed Soufi (Khalaf)",
    country: "Somalia / Qatar",
    style: "khalaf",
    moshafType: "murattal",
    serverUrl: "https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/",
  },
  {
    id: "deban_khalaf",
    nameArabic: "الشيخ أحمد ديبان (خلف عن حمزة)",
    nameEnglish: "Ahmad Deban (Khalaf)",
    country: "Yemen",
    style: "khalaf",
    moshafType: "murattal",
    serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Khalaf-A-n-Hamzah/",
  },

  // --- AD-DURI 'AN AL-KISA'I ---
  {
    id: "saltany_kisai",
    nameArabic: "الشيخ مفتاح السلطني (الدوري عن الكسائي)",
    nameEnglish: "Muftah Alsaltany (Al-Kisa'i)",
    country: "Libya",
    style: "al_duri_kisai",
    moshafType: "murattal",
    serverUrl: "https://server14.mp3quran.net/muftah_sultany/Rewayat-AlDorai-A-n-Al-Kisa-ai/",
  },

  // --- HAFS 'AN 'ASIM (Global) ---
  {
    id: "alafasy",
    nameArabic: "الشيخ مشاري راشد العفاسي",
    nameEnglish: "Mishary Rashid Alafasy",
    country: "Kuwait",
    style: "hafs",
    moshafType: "murattal",
    serverUrl: "https://server8.mp3quran.net/afs/",
    ayahAudioFormat: "everyayah",
    everyAyahSubfolder: "Alafasy_128kbps",
  },
  {
    id: "hussary_hafs",
    nameArabic: "الشيخ محمود خليل الحصري",
    nameEnglish: "Mahmoud Khalil Al-Hussary",
    country: "Egypt",
    style: "hafs",
    moshafType: "murattal",
    serverUrl: "https://server13.mp3quran.net/husr/",
    ayahAudioFormat: "everyayah",
    everyAyahSubfolder: "Husary_Muallim_128kbps",
  },
  {
    id: "minshawi_hafs",
    nameArabic: "الشيخ محمد صديق المنشاوي",
    nameEnglish: "Mohamed Siddiq Al-Minshawi",
    country: "Egypt",
    style: "hafs",
    moshafType: "murattal",
    serverUrl: "https://server10.mp3quran.net/minsh/",
    ayahAudioFormat: "everyayah",
    everyAyahSubfolder: "Minshawy_Murattal_128kbps",
  },
  {
    id: "basit_hafs",
    nameArabic: "الشيخ عبد الباسط عبد الصمد",
    nameEnglish: "Abdul Basit Abdul Samad",
    country: "Egypt",
    style: "hafs",
    moshafType: "murattal",
    serverUrl: "https://server7.mp3quran.net/basit/",
    ayahAudioFormat: "everyayah",
    everyAyahSubfolder: "Abdul_Basit_Murattal_192kbps",
  },
];

/**
 * Authentic Qira'at differences catalog (Farsh al-Huruf and Usul).
 * Each entry provides the exact variant between Hafs and other reading styles,
 * with phonetic pronunciation and spiritual/theological commentary.
 */
export const QIRAAT_DIFFERENCES_CATALOG: QiraatDifferenceItem[] = [
  // --- SURAH 1: AL-FATIHAH ---
  {
    surahNumber: 1,
    ayahNumber: 4,
    wordLocation: "آية 4",
    topic: "مَالِكِ vs مَلِكِ (Sovereignty & Ownership)",
    hafsText: "مَالِكِ يَوْمِ الدِّينِ",
    variantText: "مَلِكِ يَوْمِ الدِّينِ",
    style: "warsh",
    styleNameArabic: "ورش، قالون، الدوري عن أبي عمرو، السوسي",
    styleNameEnglish: "Warsh, Qalun, Ad-Duri, As-Soussi",
    pronunciationNotes: "Recited without Alif after Meem (مَلِكِ - Maliki) with a Kasrah on Lam.",
    meaningInsight: "In Hafs, 'Māliki' signifies Allah as the absolute Owner and Master of the Day of Judgment. In Warsh, Duri, and Qalun, 'Maliki' highlights Allah as the Supreme Sovereign King of that Day. Together, both readings reveal that Allah is simultaneously the King who commands and the Owner who possesses all creation.",
  },
  {
    surahNumber: 1,
    ayahNumber: 4,
    wordLocation: "آية 4",
    topic: "مَالِكِ vs مَلِكِ (Ad-Duri Transmission)",
    hafsText: "مَالِكِ يَوْمِ الدِّينِ",
    variantText: "مَلِكِ يَوْمِ الدِّينِ",
    style: "duri",
    styleNameArabic: "الدوري عن أبي عمرو",
    styleNameEnglish: "Ad-Duri 'an Abi 'Amr",
    pronunciationNotes: "Read as 'Maliki Yawm ad-Deen' (short vowel on Meem, no prolonged Alif).",
    meaningInsight: "Imam Abu 'Amr and his rawi Ad-Duri recited 'Malik' (King), expressing majesty and universal reign when all earthly rulers are brought low before their Creator.",
  },
  {
    surahNumber: 1,
    ayahNumber: 4,
    wordLocation: "آية 4",
    topic: "مَالِكِ vs مَلِكِ (Qalun Transmission)",
    hafsText: "مَالِكِ يَوْمِ الدِّينِ",
    variantText: "مَلِكِ يَوْمِ الدِّينِ",
    style: "qalun",
    styleNameArabic: "قالون عن نافع",
    styleNameEnglish: "Qalun 'an Nafi'",
    pronunciationNotes: "Read as 'Maliki Yawm ad-Deen' without Alif.",
    meaningInsight: "Reflects the authentic Madani tradition of Imam Nafi' transmitted through Qalun.",
  },

  // --- SURAH 2: AL-BAQARAH ---
  {
    surahNumber: 2,
    ayahNumber: 9,
    wordLocation: "آية 9",
    topic: "يَخْدَعُونَ vs يُخَادِعُونَ",
    hafsText: "وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ",
    variantText: "وَمَا يُخَادِعُونَ إِلَّا أَنفُسَهُمْ",
    style: "duri",
    styleNameArabic: "الدوري عن أبي عمرو، السوسي، حمزة، الكسائي",
    styleNameEnglish: "Ad-Duri, As-Soussi, Hamzah, Al-Kisa'i",
    pronunciationNotes: "Recited with Dammah on Ya and Alif after Kha ('Wa mā yukhādi'ūna').",
    meaningInsight: "In Hafs, 'yakhda'un' states the factual outcome: they deceive only themselves. In Ad-Duri and Abu 'Amr, 'yukhadi'un' emphasizes their repeated reciprocal intention: they actively strive to deceive, yet their deception rebounds strictly upon themselves.",
  },
  {
    surahNumber: 2,
    ayahNumber: 85,
    wordLocation: "آية 85",
    topic: "عَمَّا تَعْمَلُونَ vs عَمَّا يَعْمَلُونَ",
    hafsText: "وَمَا اللَّهُ بِغَافِلٍ عَمَّا تَعْمَلُونَ",
    variantText: "وَمَا اللَّهُ بِغَافِلٍ عَمَّا يَعْمَلُونَ",
    style: "warsh",
    styleNameArabic: "ورش، قالون، الدوري عن أبي عمرو",
    styleNameEnglish: "Warsh, Qalun, Ad-Duri",
    pronunciationNotes: "Recited with third-person Ya (يَعْمَلُونَ - Ya'malūn) instead of second-person Ta.",
    meaningInsight: "In Hafs, the direct address ('you do') confronts the immediate audience with awe. In Warsh and Ad-Duri, the third person ('they do') denotes the historical deeds of transgressors across generations.",
  },
  {
    surahNumber: 2,
    ayahNumber: 85,
    wordLocation: "آية 85",
    topic: "عَمَّا تَعْمَلُونَ vs عَمَّا يَعْمَلُونَ (Ad-Duri)",
    hafsText: "وَمَا اللَّهُ بِغَافِلٍ عَمَّا تَعْمَلُونَ",
    variantText: "وَمَا اللَّهُ بِغَافِلٍ عَمَّا يَعْمَلُونَ",
    style: "duri",
    styleNameArabic: "الدوري عن أبي عمرو",
    styleNameEnglish: "Ad-Duri 'an Abi 'Amr",
    pronunciationNotes: "Recited with Ya: 'Wa ma Allāhu bighāfilin 'ammā ya'malūn'.",
    meaningInsight: "Harmonizes with the surrounding third-person narrative of the Children of Israel.",
  },
  {
    surahNumber: 2,
    ayahNumber: 125,
    wordLocation: "آية 125",
    topic: "وَاتَّخِذُوا vs وَاتَّخَذُوا (Imperative vs Past)",
    hafsText: "وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى",
    variantText: "وَاتَّخَذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى",
    style: "warsh",
    styleNameArabic: "ورش، قالون، ابن عامر",
    styleNameEnglish: "Warsh, Qalun, Ibn 'Amir",
    pronunciationNotes: "Recited with Fathah on Kha (وَاتَّخَذُوا - Wattakhadhū) as a past narrative.",
    meaningInsight: "In Hafs, it is a direct divine command: 'And take [O believers] the station of Abraham as a place of prayer'. In Warsh and Qalun, it describes historical obedience: 'And they took the station of Abraham as a place of prayer'. The command and historical realization complete one another.",
  },
  {
    surahNumber: 2,
    ayahNumber: 125,
    wordLocation: "آية 125",
    topic: "وَاتَّخِذُوا vs وَاتَّخَذُوا (Qalun)",
    hafsText: "وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى",
    variantText: "وَاتَّخَذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى",
    style: "qalun",
    styleNameArabic: "قالون عن نافع",
    styleNameEnglish: "Qalun 'an Nafi'",
    pronunciationNotes: "Read with Fathah on Kha (Wattakhadhū).",
    meaningInsight: "Affirms that pious predecessors continuously revered the Station of Ibrahim.",
  },
  {
    surahNumber: 2,
    ayahNumber: 140,
    wordLocation: "آية 140",
    topic: "أَمْ تَقُولُونَ vs أَمْ يَقُولُونَ",
    hafsText: "أَمْ تَقُولُونَ إِنَّ إِبْرَاهِيمَ وَإِسْمَاعِيلَ...",
    variantText: "أَمْ يَقُولُونَ إِنَّ إِبْرَاهِيمَ وَإِسْمَاعِيلَ...",
    style: "duri",
    styleNameArabic: "الدوري عن أبي عمرو، ورش، قالون، حمزة، الكسائي",
    styleNameEnglish: "Ad-Duri, Warsh, Qalun, Hamzah, Al-Kisa'i",
    pronunciationNotes: "Recited with Ya: 'Am yaqūlūna'.",
    meaningInsight: "Transitions from challenging the disputants to reproaching their claims in the third person before the Prophet (pbuh).",
  },
  {
    surahNumber: 2,
    ayahNumber: 214,
    wordLocation: "آية 214",
    topic: "حَتَّىٰ يَقُولَ vs حَتَّىٰ يَقُولُ",
    hafsText: "حَتَّىٰ يَقُولَ الرَّسُولُ وَالَّذِينَ آمَنُوا مَعَهُ",
    variantText: "حَتَّىٰ يَقُولُ الرَّسُولُ وَالَّذِينَ آمَنُوا مَعَهُ",
    style: "warsh",
    styleNameArabic: "ورش، قالون، الدوري عن أبي عمرو",
    styleNameEnglish: "Warsh, Qalun, Ad-Duri",
    pronunciationNotes: "Recited with Dammah on Lam (يَقُولُ - Yaqūlu) indicative mood instead of subjunctive Fathah.",
    meaningInsight: "In Hafs, the Fathah expresses the purpose and culmination of hardship. In Warsh and Ad-Duri, the Dammah conveys the vivid reality and immediacy of the moment as if witnessed in the present.",
  },
  {
    surahNumber: 2,
    ayahNumber: 259,
    wordLocation: "آية 259",
    topic: "نُنشِزُهَا vs نُنشِرُهَا (Bone Reconstruction vs Resurrection)",
    hafsText: "وَانظُرْ إِلَى الْعِظَامِ كَيْفَ نُنشِزُهَا",
    variantText: "وَانظُرْ إِلَى الْعِظَامِ كَيْفَ نُنشِرُهَا",
    style: "warsh",
    styleNameArabic: "ورش، قالون، ابن كثير، أبو عمرو",
    styleNameEnglish: "Warsh, Qalun, Ibn Kathir, Abu 'Amr",
    pronunciationNotes: "Recited with Ra (نُنشِرُهَا - Nunshiruhā) instead of Zay.",
    meaningInsight: "Hafs: 'Nunshizuhā' means raising bones and fitting them together. Warsh & Abu 'Amr: 'Nunshiruhā' means reviving and resurrecting them with life after death. Both capture miraculous divine stages: structural assembly followed by living resurrection.",
  },

  // --- SURAH 3: ALI 'IMRAN ---
  {
    surahNumber: 3,
    ayahNumber: 133,
    wordLocation: "آية 133",
    topic: "وَسَارِعُوا vs سَارِعُوا (With or Without Waw)",
    hafsText: "وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ",
    variantText: "سَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ",
    style: "warsh",
    styleNameArabic: "ورش، قالون، ابن عامر",
    styleNameEnglish: "Warsh, Qalun, Ibn 'Amir",
    pronunciationNotes: "Recited starting directly with 'Sāri'ū' without the connecting conjunction Waw (و).",
    meaningInsight: "In Madani and Shami codices (Warsh, Qalun), beginning directly without 'Waw' creates an immediate, independent, and urgent call to hasten to divine forgiveness.",
  },

  // --- SURAH 19: MARYAM ---
  {
    surahNumber: 19,
    ayahNumber: 19,
    wordLocation: "آية 19",
    topic: "لِأَهَبَ vs لِيَهَبَ (Grammatical agency)",
    hafsText: "قَالَ إِنَّمَا أَنَا رَسُولُ رَبِّكِ لِأَهَبَ لَكِ غُلَامًا زَكِيًّا",
    variantText: "قَالَ إِنَّمَا أَنَا رَسُولُ رَبِّكِ لِيَهَبَ لَكِ غُلَامًا زَكِيًّا",
    style: "duri",
    styleNameArabic: "الدوري عن أبي عمرو، ورش من طريق الأصبهاني",
    styleNameEnglish: "Ad-Duri 'an Abi 'Amr, Warsh (Al-Asbahani)",
    pronunciationNotes: "Recited with Ya: 'Li-yahaba laki ghulāman zakiyyā' (referring to Allah).",
    meaningInsight: "In Hafs, Jibril speaks as the appointed agent executing the command: 'That I may give you a pure son'. In Ad-Duri, the verb refers directly to Allah as the true Bestower: 'That He [your Lord] may give you a pure son'. An exquisite linguistic harmonization between means and ultimate Source.",
  },

  // --- SURAH 23: AL-MU'MINUN ---
  {
    surahNumber: 23,
    ayahNumber: 112,
    wordLocation: "آية 112",
    topic: "قَالَ كَمْ vs قُل كَمْ",
    hafsText: "قَالَ كَمْ لَبِثْتُمْ فِي الْأَرْضِ عَدَدَ سِنِينَ",
    variantText: "قُل كَمْ لَبِثْتُمْ فِي الْأَرْضِ عَدَدَ سِنِينَ",
    style: "warsh",
    styleNameArabic: "ورش، حمزة، الكسائي",
    styleNameEnglish: "Warsh, Hamzah, Al-Kisa'i",
    pronunciationNotes: "Recited as a direct imperative command: 'Qul kam labithtum'.",
    meaningInsight: "Hafs reports the statement: 'He said: How long did you remain?'. Warsh gives the command: 'Say [O Prophet or angel]: How long did you remain?'.",
  },

  // --- SURAH 93: AD-DUHA ---
  {
    surahNumber: 93,
    ayahNumber: 1,
    wordLocation: "آيات 1-3",
    topic: "الإمالة والتقليل (Phonetic Tilting on Ayah Endings)",
    hafsText: "وَالضُّحَىٰ • وَاللَّيْلِ إِذَا سَجَىٰ • مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    variantText: "وَالضُّحֵى • وَاللَّيْلِ إِذَا سَجֵى • مَا وَدَّعَكَ رَبُّكَ وَمَا قَلֵى",
    style: "duri",
    styleNameArabic: "الدوري عن أبي عمرو، ورش (بالتقليل)، الكسائي",
    styleNameEnglish: "Ad-Duri, Warsh (Taqleel), Al-Kisa'i",
    pronunciationNotes: "In Warsh: Taqleel (minor Imalah between Fathah and Kasrah: Wad-Duhē). In Ad-Duri: Imalah Kubra giving an exceptionally melodic, tender acoustic cadency.",
    meaningInsight: "The phonetics of Imalah soften the sound, evoking deep comfort, reassurance, and intimacy for the Prophet (pbuh) after a period without revelation.",
  },

  // --- SURAH 112: AL-IKHLAS ---
  {
    surahNumber: 112,
    ayahNumber: 4,
    wordLocation: "آية 4",
    topic: "كُفُوًا vs كُفْؤًا",
    hafsText: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    variantText: "وَلَمْ يَكُن لَّهُ كُفْؤًا أَحَدٌ",
    style: "warsh",
    styleNameArabic: "ورش، قالون، حمزة، الدوري عن أبي عمرو",
    styleNameEnglish: "Warsh, Qalun, Hamzah, Ad-Duri",
    pronunciationNotes: "In Warsh, Qalun, and Duri: 'Kuf'an' with Sukun on Fa followed by Hamzah. In Hafs: 'Kufuwan' with Dammah on Fa and Waw.",
    meaningInsight: "Both are authentic Arabic dialects of Quraish and Tamim expressing peerlessness, equality, and absolute absence of equivalent unto Allah.",
  },
  {
    surahNumber: 112,
    ayahNumber: 4,
    wordLocation: "آية 4",
    topic: "كُفُوًا vs كُفْؤًا (Ad-Duri)",
    hafsText: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    variantText: "وَلَمْ يَكُن لَّهُ كُفْؤًا أَحَدٌ",
    style: "duri",
    styleNameArabic: "الدوري عن أبي عمرو",
    styleNameEnglish: "Ad-Duri 'an Abi 'Amr",
    pronunciationNotes: "Recited as 'Wa lam yakun lahu kuf'an ahad' with Sukun on Fa.",
    meaningInsight: "Standard Basran recitation affirming that none is comparable to Allah.",
  },
];

/**
 * Look up reading style detail by ID.
 */
export function getReadingStyleDetail(styleId: QuranReadingStyle): ReadingStyleDetail {
  const found = READING_STYLES_LIST.find((s) => s.id === styleId);
  return found || READING_STYLES_LIST[0];
}

/**
 * Filter reciters for a specific reading style.
 */
export function getRecitersForReadingStyle(styleId: QuranReadingStyle): ReciterProfile[] {
  const list = RECITERS_CATALOG.filter((r) => r.style === styleId);
  return list.length > 0 ? list : RECITERS_CATALOG.filter((r) => r.style === "hafs");
}

/**
 * Get the full-surah audio URL for a specific reciter and surah number.
 */
export function getSurahAudioUrl(reciter: ReciterProfile, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, "0");
  const base = reciter.serverUrl.endsWith("/") ? reciter.serverUrl : `${reciter.serverUrl}/`;
  return `${base}${padded}.mp3`;
}

/**
 * Retrieve all Qira'at differences for a specific Surah.
 */
export function getDifferencesForSurah(surahNumber: number): QiraatDifferenceItem[] {
  return QIRAAT_DIFFERENCES_CATALOG.filter((d) => d.surahNumber === surahNumber);
}

/**
 * Retrieve Qira'at differences for a specific Ayah, optionally filtered by style.
 */
export function getDifferencesForAyah(
  surahNumber: number,
  ayahNumber: number,
  style?: QuranReadingStyle
): QiraatDifferenceItem[] {
  return QIRAAT_DIFFERENCES_CATALOG.filter((d) => {
    if (d.surahNumber !== surahNumber || d.ayahNumber !== ayahNumber) return false;
    if (!style || style === "hafs") return true;
    return d.style === style || d.styleNameArabic.includes(style);
  });
}

/**
 * Get adjusted Arabic text for an ayah when a non-Hafs reading style is active.
 */
export function getVariantTextForAyah(
  surahNumber: number,
  ayahNumber: number,
  style: QuranReadingStyle,
  baseText: string
): { text: string; hasVariant: boolean; difference?: QiraatDifferenceItem } {
  if (style === "hafs") {
    const diff = QIRAAT_DIFFERENCES_CATALOG.find(
      (d) => d.surahNumber === surahNumber && d.ayahNumber === ayahNumber
    );
    return { text: baseText, hasVariant: !!diff, difference: diff };
  }

  // Check if there is a specific difference matching this style
  const diff = QIRAAT_DIFFERENCES_CATALOG.find(
    (d) =>
      d.surahNumber === surahNumber &&
      d.ayahNumber === ayahNumber &&
      (d.style === style ||
        (style === "warsh" && d.styleNameArabic.includes("ورش")) ||
        (style === "duri" && d.styleNameArabic.includes("الدوري")) ||
        (style === "qalun" && d.styleNameArabic.includes("قالون")) ||
        (style === "soussi" && d.styleNameArabic.includes("السوسي")) ||
        (style === "shubah" && d.styleNameArabic.includes("شعبة")) ||
        (style === "khalaf" && d.styleNameArabic.includes("خلف")) ||
        (style === "al_duri_kisai" && d.styleNameArabic.includes("الكسائي")))
  );

  if (diff) {
    return {
      text: diff.variantText,
      hasVariant: true,
      difference: diff,
    };
  }

  return { text: baseText, hasVariant: false };
}
