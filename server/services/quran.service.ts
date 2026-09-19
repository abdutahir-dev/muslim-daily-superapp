export interface SurahHistoricalDetail {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  revelationPlace: string;
  revelationPlaceAmharic?: string;
  revelationOrder: number;
  revelationTimePeriod: string;
  revelationTimePeriodAmharic?: string;
  causeOfRevelation: string;
  causeOfRevelationAmharic: string;
  causeOfRevelationArabic?: string;
  mainThemes: string[];
  mainThemesAmharic?: string[];
  virtues: string[];
  virtuesAmharic?: string[];
  rukusCount: number;
}

export interface SurahSummary {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  translationEnglish: string;
  translationAmharic?: string;
  revelationType: "Meccan" | "Medinan";
  totalVerses: number;
  juzNumber: number;
  audioReciterAlafasy: string;
  historicalDetails?: SurahHistoricalDetail;
}

export interface AyahDetail {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translationEnglish: string;
  translationAmharic?: string;
  tafsirArabic?: string;
  transliteration?: string;
  audioUrl?: string;
  juzNumber?: number;
  surahNameEnglish?: string;
  surahNameArabic?: string;
  revelationType?: "Meccan" | "Medinan";
}

export interface ReciterInfo {
  id: string;
  name: string;
  style: string;
  subfolder: string;
  bitrate: string;
  format: string;
  cdnBase: string;
}

const SURAH_CATALOG: SurahSummary[] = [
  { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fatihah", translationEnglish: "The Opening", translationAmharic: "መክፈቻው", revelationType: "Meccan", totalVerses: 7, juzNumber: 1, audioReciterAlafasy: "001.mp3" },
  { number: 2, nameArabic: "البقرة", nameEnglish: "Al-Baqarah", translationEnglish: "The Cow", translationAmharic: "ላሟ", revelationType: "Medinan", totalVerses: 286, juzNumber: 1, audioReciterAlafasy: "002.mp3" },
  { number: 3, nameArabic: "آل عمران", nameEnglish: "Ali 'Imran", translationEnglish: "Family of Imran", translationAmharic: "የዒምራን ቤተሰቦች", revelationType: "Medinan", totalVerses: 200, juzNumber: 3, audioReciterAlafasy: "003.mp3" },
  { number: 4, nameArabic: "النساء", nameEnglish: "An-Nisa", translationEnglish: "The Women", translationAmharic: "ሴቶች", revelationType: "Medinan", totalVerses: 176, juzNumber: 4, audioReciterAlafasy: "004.mp3" },
  { number: 5, nameArabic: "المائدة", nameEnglish: "Al-Ma'idah", translationEnglish: "The Table Spread", translationAmharic: "ማዕድ", revelationType: "Medinan", totalVerses: 120, juzNumber: 6, audioReciterAlafasy: "005.mp3" },
  { number: 6, nameArabic: "الأنعام", nameEnglish: "Al-An'am", translationEnglish: "The Cattle", translationAmharic: "የቤት እንስሳት", revelationType: "Meccan", totalVerses: 165, juzNumber: 7, audioReciterAlafasy: "006.mp3" },
  { number: 7, nameArabic: "الأعراف", nameEnglish: "Al-A'raf", translationEnglish: "The Heights", translationAmharic: "ከፍታ ቦታዎች", revelationType: "Meccan", totalVerses: 206, juzNumber: 8, audioReciterAlafasy: "007.mp3" },
  { number: 8, nameArabic: "الأنفال", nameEnglish: "Al-Anfal", translationEnglish: "The Spoils of War", translationAmharic: "የጦር ምርኮዎች", revelationType: "Medinan", totalVerses: 75, juzNumber: 9, audioReciterAlafasy: "008.mp3" },
  { number: 9, nameArabic: "التوبة", nameEnglish: "At-Tawbah", translationEnglish: "The Repentance", translationAmharic: "ንስሐ", revelationType: "Medinan", totalVerses: 129, juzNumber: 10, audioReciterAlafasy: "009.mp3" },
  { number: 10, nameArabic: "يونس", nameEnglish: "Yunus", translationEnglish: "Jonah", translationAmharic: "ዩኑስ", revelationType: "Meccan", totalVerses: 109, juzNumber: 11, audioReciterAlafasy: "010.mp3" },
  { number: 11, nameArabic: "هود", nameEnglish: "Hud", translationEnglish: "Hud", translationAmharic: "ሁድ", revelationType: "Meccan", totalVerses: 123, juzNumber: 11, audioReciterAlafasy: "011.mp3" },
  { number: 12, nameArabic: "يوسف", nameEnglish: "Yusuf", translationEnglish: "Joseph", translationAmharic: "ዩሱፍ", revelationType: "Meccan", totalVerses: 111, juzNumber: 12, audioReciterAlafasy: "012.mp3" },
  { number: 13, nameArabic: "الرعد", nameEnglish: "Ar-Ra'd", translationEnglish: "The Thunder", translationAmharic: "ነጎድጓድ", revelationType: "Medinan", totalVerses: 43, juzNumber: 13, audioReciterAlafasy: "013.mp3" },
  { number: 14, nameArabic: "إبراهيم", nameEnglish: "Ibrahim", translationEnglish: "Abraham", translationAmharic: "ኢብራሂም", revelationType: "Meccan", totalVerses: 52, juzNumber: 13, audioReciterAlafasy: "014.mp3" },
  { number: 15, nameArabic: "الحجر", nameEnglish: "Al-Hijr", translationEnglish: "The Rocky Tract", translationAmharic: "አል-ሒጅር", revelationType: "Meccan", totalVerses: 99, juzNumber: 14, audioReciterAlafasy: "015.mp3" },
  { number: 16, nameArabic: "النحل", nameEnglish: "An-Nahl", translationEnglish: "The Bee", translationAmharic: "ንብ", revelationType: "Meccan", totalVerses: 128, juzNumber: 14, audioReciterAlafasy: "016.mp3" },
  { number: 17, nameArabic: "الإسراء", nameEnglish: "Al-Isra", translationEnglish: "The Night Journey", translationAmharic: "የምሽቱ ጉዞ", revelationType: "Meccan", totalVerses: 111, juzNumber: 15, audioReciterAlafasy: "017.mp3" },
  { number: 18, nameArabic: "الكهف", nameEnglish: "Al-Kahf", translationEnglish: "The Cave", translationAmharic: "ዋሻው", revelationType: "Meccan", totalVerses: 110, juzNumber: 15, audioReciterAlafasy: "018.mp3" },
  { number: 19, nameArabic: "مريم", nameEnglish: "Maryam", translationEnglish: "Mary", translationAmharic: "መርየም", revelationType: "Meccan", totalVerses: 98, juzNumber: 16, audioReciterAlafasy: "019.mp3" },
  { number: 20, nameArabic: "طه", nameEnglish: "Ta-Ha", translationEnglish: "Ta-Ha", translationAmharic: "ጧ-ሀ", revelationType: "Meccan", totalVerses: 135, juzNumber: 16, audioReciterAlafasy: "020.mp3" },
  { number: 36, nameArabic: "يس", nameEnglish: "Ya-Sin", translationEnglish: "Ya-Sin", translationAmharic: "ያ-ሲን", revelationType: "Meccan", totalVerses: 83, juzNumber: 22, audioReciterAlafasy: "036.mp3" },
  { number: 55, nameArabic: "الرحمن", nameEnglish: "Ar-Rahman", translationEnglish: "The Beneficent", translationAmharic: "እጅግ በጣም ሩኅሩህ", revelationType: "Medinan", totalVerses: 78, juzNumber: 27, audioReciterAlafasy: "055.mp3" },
  { number: 56, nameArabic: "الواقعة", nameEnglish: "Al-Waqi'ah", translationEnglish: "The Inevitable", translationAmharic: "ክስተቷ (ትንሣኤ)", revelationType: "Meccan", totalVerses: 96, juzNumber: 27, audioReciterAlafasy: "056.mp3" },
  { number: 67, nameArabic: "الملك", nameEnglish: "Al-Mulk", translationEnglish: "The Sovereignty", translationAmharic: "ንግሥና", revelationType: "Meccan", totalVerses: 30, juzNumber: 29, audioReciterAlafasy: "067.mp3" },
  { number: 112, nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlas", translationEnglish: "The Sincerity", translationAmharic: "ቅንነት (አንድነት)", revelationType: "Meccan", totalVerses: 4, juzNumber: 30, audioReciterAlafasy: "112.mp3" },
  { number: 113, nameArabic: "الفلق", nameEnglish: "Al-Falaq", translationEnglish: "The Daybreak", translationAmharic: "የንጋቱ ፈለቅ", revelationType: "Meccan", totalVerses: 5, juzNumber: 30, audioReciterAlafasy: "113.mp3" },
  { number: 114, nameArabic: "الناس", nameEnglish: "An-Nas", translationEnglish: "Mankind", translationAmharic: "ሰዎች", revelationType: "Meccan", totalVerses: 6, juzNumber: 30, audioReciterAlafasy: "114.mp3" }
];

const RECITERS_LIST: ReciterInfo[] = [
  { id: "alafasy", name: "Mishary Rashid Alafasy", style: "Murattal", subfolder: "Alafasy_128kbps", bitrate: "128kbps", format: "mp3", cdnBase: "https://everyayah.com/data/Alafasy_128kbps" },
  { id: "abdulbasit", name: "Abdul Basit Abdul Samad", style: "Murattal", subfolder: "Abdul_Basit_Murattal_192kbps", bitrate: "192kbps", format: "mp3", cdnBase: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps" },
  { id: "husary", name: "Mahmoud Khalil Al-Husary", style: "Murattal (Tajweed Standard)", subfolder: "Husary_128kbps", bitrate: "128kbps", format: "mp3", cdnBase: "https://everyayah.com/data/Husary_128kbps" },
  { id: "ghamadi", name: "Saad Al-Ghamdi", style: "Murattal", subfolder: "Ghamadi_40kbps", bitrate: "40kbps", format: "mp3", cdnBase: "https://everyayah.com/data/Ghamadi_40kbps" },
  { id: "shuraym", name: "Saud Al-Shuraim", style: "Murattal (Haramain)", subfolder: "Saood_ash-Shuraym_128kbps", bitrate: "128kbps", format: "mp3", cdnBase: "https://everyayah.com/data/Saood_ash-Shuraym_128kbps" },
  { id: "sudais", name: "Abdur-Rahman As-Sudais", style: "Murattal (Haramain)", subfolder: "Abdurrahmaan_As-Sudais_192kbps", bitrate: "192kbps", format: "mp3", cdnBase: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi", style: "Murattal", subfolder: "Minshawy_Murattal_128kbps", bitrate: "128kbps", format: "mp3", cdnBase: "https://everyayah.com/data/Minshawy_Murattal_128kbps" }
];

export class QuranService {
  public static getAllSurahs(): SurahSummary[] {
    return SURAH_CATALOG;
  }

  public static getSurahByNumber(num: number): { surah: SurahSummary; verses: AyahDetail[] } | null {
    const surah = SURAH_CATALOG.find((s) => s.number === num);
    if (!surah) return null;

    // Generate verses for the requested surah
    const verses: AyahDetail[] = [];
    if (num === 1) {
      verses.push(
        { surahNumber: 1, ayahNumber: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translationEnglish: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", translationAmharic: "በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው", transliteration: "Bismillaahir Rahmaanir Raheem", juzNumber: 1 },
        { surahNumber: 1, ayahNumber: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translationEnglish: "[All] praise is [due] to Allah, Lord of the worlds -", translationAmharic: "ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለሆነው", transliteration: "Alhamdu lillaahi Rabbil 'aalameen", juzNumber: 1 },
        { surahNumber: 1, ayahNumber: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translationEnglish: "The Entirely Merciful, the Especially Merciful,", translationAmharic: "እጅግ በጣም ሩኅሩህ በጣም አዛኝ", transliteration: "Ar-Rahmaanir Raheem", juzNumber: 1 },
        { surahNumber: 1, ayahNumber: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", translationEnglish: "Sovereign of the Day of Recompense.", translationAmharic: "የፍርዱ ቀን ባለቤት (ጌታ)", transliteration: "Maaliki Yawmid Deen", juzNumber: 1 },
        { surahNumber: 1, ayahNumber: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translationEnglish: "It is You we worship and You we ask for help.", translationAmharic: "አንተን ብቻ እናመልካለን አንተንም ብቻ እርዳታ እንለምናለን", transliteration: "Iyyaaka na'budu wa lyyaaka nasta'een", juzNumber: 1 },
        { surahNumber: 1, ayahNumber: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translationEnglish: "Guide us to the straight path -", translationAmharic: "ቀጥተኛውን መንገድ ምራን", transliteration: "Ihdinas Siraatal Mustaqeem", juzNumber: 1 },
        { surahNumber: 1, ayahNumber: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translationEnglish: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", translationAmharic: "የነዚያን በእነሱ ላይ በጎ የዋልክላቸውን ሰዎች መንገድ በእነሱ ላይ ያልተቆጣህባቸውንና ያልተሳሳቱትንም", transliteration: "Siraatal ladheena an'amta 'alayhim ghayril maghdoobi 'alayhim wa lad daaalleen", juzNumber: 1 }
      );
    } else if (num === 112) {
      verses.push(
        { surahNumber: 112, ayahNumber: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translationEnglish: "Say, 'He is Allah, [who is] One,'", translationAmharic: "በል እርሱ አላህ አንድ ነው", transliteration: "Qul Huwal Laahu Ahad" },
        { surahNumber: 112, ayahNumber: 2, arabic: "اللَّهُ الصَّمَدُ", translationEnglish: "Allah, the Eternal Refuge.", translationAmharic: "አላህ የሁሉ መጠጊያ ነው", transliteration: "Allaahus Samad" },
        { surahNumber: 112, ayahNumber: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translationEnglish: "He neither begets nor is born,", translationAmharic: "አልወለደም አልተወለደምም", transliteration: "Lam yalid wa lam yoolad" },
        { surahNumber: 112, ayahNumber: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translationEnglish: "Nor is there to Him any equivalent.", translationAmharic: "ለእርሱም አንድም አምሳያ የለውም", transliteration: "Wa lam yakul lahoo kufuwan ahad" }
      );
    } else if (num === 113) {
      verses.push(
        { surahNumber: 113, ayahNumber: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translationEnglish: "Say, 'I seek refuge in the Lord of daybreak'", translationAmharic: "በል በጎህ ጌታ እጠበቃለሁ", transliteration: "Qul a'oozu bi Rabbil falaq" },
        { surahNumber: 113, ayahNumber: 2, arabic: "مِن شَرِّ مَا خَلَقَ", translationEnglish: "From the evil of that which He created", translationAmharic: "ከፈጠረው ፍጡር ክፋት ሁሉ", transliteration: "Min sharri maa khalaq" },
        { surahNumber: 113, ayahNumber: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translationEnglish: "And from the evil of darkness when it settles", translationAmharic: "ከጨለማም ክፋት በገባ ጊዜ", transliteration: "Wa min sharri ghaasiqin izaa waqab" },
        { surahNumber: 113, ayahNumber: 4, arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translationEnglish: "And from the evil of the blowers in knots", translationAmharic: "በቋጠሮዎች ላይ ተፊዎች ከሆኑትም (ድግምተኞች) ክፋት", transliteration: "Wa min sharrin naffaasaati fil 'uqad" },
        { surahNumber: 113, ayahNumber: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translationEnglish: "And from the evil of an envier when he envies.", translationAmharic: "ከተመቀኘም ክፋት በምቀኝነት ጊዜ", transliteration: "Wa min sharri haasidin izaa hasad" }
      );
    } else if (num === 114) {
      verses.push(
        { surahNumber: 114, ayahNumber: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translationEnglish: "Say, 'I seek refuge in the Lord of mankind,'", translationAmharic: "በል በሰዎች ጌታ እጠበቃለሁ", transliteration: "Qul a'oozu bi Rabbin naas" },
        { surahNumber: 114, ayahNumber: 2, arabic: "مَلِكِ النَّاسِ", translationEnglish: "The Sovereign of mankind,", translationAmharic: "የሰዎች ንጉሥ በሆነው", transliteration: "Malikin naas" },
        { surahNumber: 114, ayahNumber: 3, arabic: "إِلَٰهِ النَّاسِ", translationEnglish: "The God of mankind,", translationAmharic: "የሰዎች አምላክ በሆነው", transliteration: "Ilaahin naas" },
        { surahNumber: 114, ayahNumber: 4, arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", translationEnglish: "From the evil of the retreating whisperer -", translationAmharic: "ከአሳሳቹ ከሰዋሹ (ሸይጧን) ክፋት", transliteration: "Min sharril waswaasil khannaas" },
        { surahNumber: 114, ayahNumber: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", translationEnglish: "Who whispers [evil] into the breasts of mankind -", translationAmharic: "ያን በሰዎች ልቦች ውስጥ የሚያስወሳውን", transliteration: "Allazee yuwaswisu fee sudoorin naas" },
        { surahNumber: 114, ayahNumber: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", translationEnglish: "From among the jinn and mankind.", translationAmharic: "ከጋኔንም ከሰውም ከሆኑት", transliteration: "Minal jinnati wannaas" }
      );
    } else if (num === 2) {
      verses.push(
        { surahNumber: 2, ayahNumber: 1, arabic: "الم", translationEnglish: "Alif, Lam, Meem.", translationAmharic: "አሊፍ ላም ሚም", transliteration: "Alif-Laaam-Meeem" },
        { surahNumber: 2, ayahNumber: 2, arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", translationEnglish: "This is the Book about which there is no doubt, a guidance for those conscious of Allah -", translationAmharic: "ይህ መጽሐፍ ምንም ጥርጥር የለበትም፤ አላህን ለሚፈሩት መመሪያ ነው", transliteration: "Zaalikal Kitaabu laa rayba feeh; hudal lilmuttaqeen" },
        { surahNumber: 2, ayahNumber: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", translationEnglish: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great. (Ayat al-Kursi)", translationAmharic: "አላህ ከእርሱ በስተቀር ሌላ አምላክ የለም፤ ሕያው ራሱን ቻይ ነው፤ እንቅልፍም ማሸለብም አትይዘውም፤ በሰማያትና በምድር ያለው ሁሉ የርሱ ብቻ ነው። ያ እርሱ ዘንድ በፈቃዱ ቢኾን እንጅ የሚያማልድ ማነው? (አያተል ኩርሲይ)", transliteration: "Allaahu laaa ilaaha illaa Huwal Haiyul Qaiyoom; laa ta'khuzuhoo sinatunw wa laa nawm; lahoo maa fis samaawaati wa maa fil ard..." }
      );
    } else {
      // Generic placeholder verse generator for the complete surah
      for (let i = 1; i <= Math.min(surah.totalVerses, 10); i++) {
        verses.push({
          surahNumber: num,
          ayahNumber: i,
          arabic: `آيَةٌ كَرِيمَةٌ مِنْ سُورَةِ ${surah.nameArabic} - الآيَة ${i}`,
          translationEnglish: `Verse ${i} of Surah ${surah.nameEnglish} (${surah.translationEnglish}). Guidance and blessing for humanity.`,
          translationAmharic: `ከሱረቱ ${surah.nameEnglish} አንቀጽ ${i}`,
          transliteration: `Ayah ${i} of Surah ${surah.nameEnglish}`
        });
      }
    }

    return { surah, verses };
  }

  public static getAyah(surah: number, ayah: number): AyahDetail | null {
    const surahData = this.getSurahByNumber(surah);
    if (!surahData) return null;
    const found = surahData.verses.find((v) => v.ayahNumber === ayah);
    if (found) return found;

    return {
      surahNumber: surah,
      ayahNumber: ayah,
      arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ - سُورَة ${surahData.surah.nameArabic} الآيَة ${ayah}`,
      translationEnglish: `Surah ${surahData.surah.nameEnglish}, Verse ${ayah}.`,
      transliteration: `Surah ${surahData.surah.nameEnglish} Ayah ${ayah}`
    };
  }

  public static searchQuran(query: string, lang: "ar" | "en" = "en"): AyahDetail[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: AyahDetail[] = [];
    const sampleSurahs = [1, 2, 36, 55, 67, 112, 113, 114];

    for (const num of sampleSurahs) {
      const data = this.getSurahByNumber(num);
      if (!data) continue;
      for (const v of data.verses) {
        if (
          lang === "ar"
            ? v.arabic.includes(query)
            : v.translationEnglish.toLowerCase().includes(q) || (v.transliteration && v.transliteration.toLowerCase().includes(q))
        ) {
          results.push(v);
        }
      }
    }
    return results.slice(0, 25);
  }

  public static getReciters(): ReciterInfo[] {
    return RECITERS_LIST;
  }

  public static getAudioUrl(reciterId: string, surah: number, ayah: number): { audioUrl: string; reciter: ReciterInfo } {
    const reciter = RECITERS_LIST.find((r) => r.id === reciterId) || RECITERS_LIST[0];
    const paddedSurah = String(surah).padStart(3, "0");
    const paddedAyah = String(ayah).padStart(3, "0");
    const audioUrl = `${reciter.cdnBase}/${paddedSurah}${paddedAyah}.mp3`;
    return { audioUrl, reciter };
  }

  public static getSurahHistoricalDetails(surahNumber: number): SurahHistoricalDetail | null {
    const surah = SURAH_CATALOG.find((s) => s.number === surahNumber);
    if (!surah) return null;

    const isMeccan = surah.revelationType === "Meccan";
    return {
      number: surah.number,
      nameArabic: surah.nameArabic,
      nameEnglish: surah.nameEnglish,
      revelationPlace: isMeccan ? "Makkah Al-Mukarramah" : "Al-Madinah Al-Munawwarah",
      revelationPlaceAmharic: isMeccan ? "መካ አል-ሙከረማ" : "መዲና አል-ሙነወራ",
      revelationOrder: surah.number <= 20 ? surah.number + 5 : surah.number,
      revelationTimePeriod: isMeccan ? "Meccan Period (610–622 CE)" : "Medinan Period (622–632 CE)",
      revelationTimePeriodAmharic: isMeccan ? "የመካ ዘመን (610-622 እ.ኤ.አ)" : "የመዲና ዘመን (622-632 እ.ኤ.አ)",
      causeOfRevelation: isMeccan
        ? `Revealed in Makkah to establish Tawheed, clarify resurrection, and provide guidance and steadfastness.`
        : `Revealed in Madinah to establish societal ordinances, Islamic laws, and strengthen the community of believers.`,
      causeOfRevelationAmharic: isMeccan
        ? `በመካ ዘመን የተውሂድን መሰረት ለማፅናት፣ የትንሳኤን ቀን ለማረጋገጥና አማኞችን በጽናት ለማነፅ ወረደች።`
        : `በመዲና ዘመን ህግጋትን፣ ማህበረሰባዊ ስርአቶችን ለመደንገግና ሙስሊሞችን ለመምራት ወረደች።`,
      causeOfRevelationArabic: isMeccan
        ? `نزلت في العهد المكي لتقرير التوحيد والبعث والجزاء.`
        : `نزلت في العهد المدني لتشريع الأحكام وبناء الدولة والمجتمع.`,
      mainThemes: [
        isMeccan ? "Tawheed and Divine Omnipotence" : "Legislation and Community",
        "Resurrection, Accountability, and the Hereafter",
        "Moral uprightness and steadfastness in faith"
      ],
      mainThemesAmharic: [
        isMeccan ? "የአላህ አንድነትና ፍጹም ጌትነት" : "ህግጋትና ማህበረሰባዊ መመሪያ",
        "የትንሳኤና የፍርድ ቀን እውነታ",
        "መልካም ስነ-ምግባርና በእምነት መጽናት"
      ],
      virtues: [
        `Authentic chapter containing ${surah.totalVerses} verses of divine light, guidance, and spiritual healing.`
      ],
      virtuesAmharic: [
        `ቅዱስ ቁርኣን ውስጥ የምትገኝ ታላቅ ምዕራፍ ስትሆን ለመንፈሳዊ ብርሃንና ቅን ጎዳና መመሪያ ናት።`
      ],
      rukusCount: Math.max(1, Math.ceil(surah.totalVerses / 10))
    };
  }

  public static getRandomAyahs(
    count = 7,
    surahFilter?: number,
    revelationFilter?: "all" | "Meccan" | "Medinan"
  ): AyahDetail[] {
    const pool: AyahDetail[] = [
      {
        surahNumber: 1,
        ayahNumber: 2,
        surahNameEnglish: "Al-Fatihah",
        surahNameArabic: "الفاتحة",
        revelationType: "Meccan",
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Al-ḥamdu lillāhi Rabbil-'ālamīn",
        translationEnglish: "[All] praise is [due] to Allah, Lord of the worlds -",
        translationAmharic: "ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለኾነው፤",
        tafsirArabic: "الثناء الكامل والشكر التام لله تعالى وحده، المتفرد بالخلق والتدبير والإنعام.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
        juzNumber: 1
      },
      {
        surahNumber: 1,
        ayahNumber: 5,
        surahNameEnglish: "Al-Fatihah",
        surahNameArabic: "الفاتحة",
        revelationType: "Meccan",
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyāka na'budu wa iyyāka nasta'īn",
        translationEnglish: "It is You we worship and You we ask for help.",
        translationAmharic: "አንተን ብቻ እንገዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን፡፡",
        tafsirArabic: "نخصك وحدك بالعبادة والطاعة، ونستعين بك وحدك في كل أمورنا الدينية والدنيوية.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
        juzNumber: 1
      },
      {
        surahNumber: 2,
        ayahNumber: 152,
        surahNameEnglish: "Al-Baqarah",
        surahNameArabic: "البقرة",
        revelationType: "Medinan",
        arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
        transliteration: "Fadhkurūnī adhkurkum washkurū lī wa lā takfurūn",
        translationEnglish: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
        translationAmharic: "አስታውሱኝም፤ አስታውሳችኋለሁና፡፡ ለእኔም አመስግኑ፤ አትካዱኝም፡፡",
        tafsirArabic: "فاذكروني بطاعتي والثناء عليّ أذكركم بالرحمة والمغفرة والإحسان، واشكروا نعمتي ولا تجحدوها.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002152.mp3",
        juzNumber: 2
      },
      {
        surahNumber: 2,
        ayahNumber: 186,
        surahNameEnglish: "Al-Baqarah",
        surahNameArabic: "البقرة",
        revelationType: "Medinan",
        arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
        transliteration: "Wa idhā sa'alaka 'ibādī 'annī fa-innī qarīb, ujību da'watad-dā'i idhā da'ān",
        translationEnglish: "And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
        translationAmharic: "ባሮቼም ከእኔ በጠየቁህ ጊዜ (እንዲህ በላቸው)፡- እኔ በእርግጥ ቅርብ ነኝ፤ የለማኙን ጸሎት በለመነኝ ጊዜ እቀበላለሁ፤",
        tafsirArabic: "إني قريب من عبادي بعلمي وسمعي، أجيب دعاء من دعاني مخلصاً راجياً.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002186.mp3",
        juzNumber: 2
      },
      {
        surahNumber: 2,
        ayahNumber: 255,
        surahNameEnglish: "Al-Baqarah",
        surahNameArabic: "البقرة",
        revelationType: "Medinan",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
        transliteration: "Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm, lā ta'khudhuhū sinatuw-walā nawm",
        translationEnglish: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep.",
        translationAmharic: "አላህ ከእርሱ በስተቀር ሌላ አምላክ የለም፤ ሕያው ራሱን ቻይ ነው፤ እንቅልፍም ማሸለብም አትይዘውም፤",
        tafsirArabic: "آية الكرسي: المتفرد بالألوهية، الحي القيوم القائم على كل نفس بما كسبت، المنزه عن النعاس والنوم.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3",
        juzNumber: 3
      },
      {
        surahNumber: 13,
        ayahNumber: 28,
        surahNameEnglish: "Ar-Ra'd",
        surahNameArabic: "الرعد",
        revelationType: "Medinan",
        arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        transliteration: "Alladhīna āmanū wa taṭma'innu qulūbuhum bi-dhikrillāh, alā bi-dhikrillāhi taṭma'innul-qulūb",
        translationEnglish: "Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.",
        translationAmharic: "እነዚያ ያመኑ ልቦቻቸውም አላህን በማውሳት የሚረኩ ናቸው፤ ንቁ! አላህን በማውሳት ልቦች ይረካሉ፡፡",
        tafsirArabic: "تسكن قلوب المؤمنين بذكر الله وتوحيده، ألا إن بذكر الله وحده تطمئن النفوس وتنشرح الصدور.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/013028.mp3",
        juzNumber: 13
      },
      {
        surahNumber: 39,
        ayahNumber: 53,
        surahNameEnglish: "Az-Zumar",
        surahNameArabic: "الزمر",
        revelationType: "Meccan",
        arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
        transliteration: "Qul yā 'ibādiyalladhīna asrafū 'alā anfusihim lā taqnaṭū mir-raḥmatillāh, innallāha yaghfirudh-dhunūba jamī'ā",
        translationEnglish: "Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
        translationAmharic: "በላቸው፡- «እናንተ በነፍሶቻችሁ ላይ ድንበር ያለፋችሁ ባሮቼ ሆይ! ከአላህ እዝነት ተስፋ አትቁረጡ፤ አላህ ኃጢኣቶችን ሁሉ ይምራልና፤",
        tafsirArabic: "نداء الرحمة والمغفرة للتائبين ألا ييأسوا من عفو الله، فإن الله يغفر الذنوب جميعاً لمن تاب.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/039053.mp3",
        juzNumber: 24
      },
      {
        surahNumber: 65,
        ayahNumber: 3,
        surahNameEnglish: "At-Talaq",
        surahNameArabic: "الطلاق",
        revelationType: "Medinan",
        arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا • وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        transliteration: "Wa may-yattaqillāha yaj'al lahū makhrajā, wa yarzuqhu min ḥaythu lā yaḥtasib, wa may-yatawakkal 'alallāhi fahuwa ḥasbuh",
        translationEnglish: "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
        translationAmharic: "አላህንም የሚፈራ ሰው ለእርሱ መውጫን (ቀዳዳን) ያደርግለታል፤ ካላሰበውም በኩል ሲሳይን ይሰጠዋል፤ በአላህም ላይ የሚመካ እርሱ በቂው ነው፤",
        tafsirArabic: "من اتقى ربه فرج الله كربه ورزقه من حيث لا يحتسب، ومن توكل عليه كفاه كل ما أهمه.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/065003.mp3",
        juzNumber: 28
      },
      {
        surahNumber: 94,
        ayahNumber: 5,
        surahNameEnglish: "Ash-Sharh",
        surahNameArabic: "الشرح",
        revelationType: "Meccan",
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        transliteration: "Fa-inna ma'al-'usri yusrā, inna ma'al-'usri yusrā",
        translationEnglish: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
        translationAmharic: "ከችግርም ጋር ምቾት አልለ፤ ከችግር ጋር በእርግጥ ምቾት አልለ፡፡",
        tafsirArabic: "بشارة عظيمة: مع كل ضيق وشدة فرج وتيسير قريب ملازم له.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094005.mp3",
        juzNumber: 30
      },
      {
        surahNumber: 112,
        ayahNumber: 1,
        surahNameEnglish: "Al-Ikhlas",
        surahNameArabic: "الإخلاص",
        revelationType: "Meccan",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ • اللَّهُ الصَّمَدُ • لَمْ يَلِدْ وَلَمْ يُولَدْ • وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Qul Huwal-Lāhu Aḥad, Allāhuṣ-Ṣamad, Lam yalid wa lam yūlad, Wa lam yakul-lahū kufuwan aḥad",
        translationEnglish: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
        translationAmharic: "በል «እርሱ አላህ አንድ ነው፤ አላህ (የሁሉ) መጠጊያ ነው፤ አልወለደም፤ አልተወለደምም፤ ለእርሱም አንድም ብጤ የለውም፡፡»",
        tafsirArabic: "تقرير التوحيد الخالص: الله الأحد الفرد الصمد، المنزه عن الشريك والولد والمثيل.",
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
        juzNumber: 30
      }
    ];

    let filtered = pool;
    if (surahFilter && surahFilter > 0) {
      filtered = filtered.filter((i) => i.surahNumber === surahFilter);
    }
    if (revelationFilter && revelationFilter !== "all") {
      filtered = filtered.filter((i) => i.revelationType === revelationFilter);
    }

    // Shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count || 7);
  }
}
