export interface DuaCategory {
  id: string;
  name: string;
  nameArabic: string;
  icon: string;
  count: number;
  description: string;
}

export interface DuaItem {
  id: string;
  categoryId: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  translationAmharic?: string;
  repeatCount: number;
  virtue?: string;
  reference: string;
  audioUrl?: string;
}

const DUA_CATEGORIES: DuaCategory[] = [
  { id: "morning", name: "Morning Adhkar", nameArabic: "أذكار الصباح", icon: "Sun", count: 12, description: "Authentic supplications upon awakening and at dawn" },
  { id: "evening", name: "Evening Adhkar", nameArabic: "أذكار المساء", icon: "Moon", count: 12, description: "Protective invocations recited before and after sunset" },
  { id: "prayer", name: "After Salah", nameArabic: "أذكار ما بعد الصلاة", icon: "Compass", count: 8, description: "Tasbih, Ayat al-Kursi, and prophetic Dhikr after obligatory prayers" },
  { id: "sleep", name: "Before Sleep", nameArabic: "أذكار النوم", icon: "Bed", count: 7, description: "Invocations for peaceful sleep and protection throughout the night" },
  { id: "distress", name: "Anxiety & Distress", nameArabic: "دعاء الكرب والهم", icon: "Shield", count: 6, description: "Supplications for relief from grief, debt, and hardship" },
  { id: "travel", name: "Travel & Journey", nameArabic: "دعاء السفر", icon: "Navigation", count: 4, description: "Invocations when embarking on a journey or mounting transport" },
  { id: "quranic", name: "Quranic Rabbana Duas", nameArabic: "الأدعية القرآنية (ربنا)", icon: "BookOpen", count: 10, description: "The 40 profound Rabbana supplications from the Holy Quran" }
];

const DUAS_DATABASE: DuaItem[] = [
  {
    id: "dua-morning-1",
    categoryId: "morning",
    title: "Sayyid al-Istighfar (The Master of Forgiveness)",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alay, wa abu'u laka bidhanbi faghfir li, fa innahu la yaghfirudh-dhunuba illa Ant.",
    translation: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessings upon me, and I admit my sin, so forgive me, for none forgives sins except You.",
    translationAmharic: "አላህ ሆይ! አንተ ጌታዬ ነህ፤ ከአንተ በስተቀር ሌላ አምላክ የለም፤ ፈጠርከኝ እኔ ባሪያህ ነኝ፤ በቃል ኪዳንህና በተስፋህ ላይ የቻልኩትን ያህል እገኛለሁ፤ ከሠራሁት ክፉ ነገር ሁሉ በአንተ እጠበቃለሁ...",
    repeatCount: 1,
    virtue: "Whoever says this in the morning with conviction and dies that day will enter Paradise (Sahih al-Bukhari).",
    reference: "Sahih al-Bukhari 6306",
    audioUrl: "https://everyayah.com/data/audio/adhkar/sayyid_istighfar.mp3"
  },
  {
    id: "dua-morning-2",
    categoryId: "morning",
    title: "Protection Against All Harm",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    translation: "In the Name of Allah, with Whose Name nothing on the earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
    translationAmharic: "በዚያ ስሙ ከተወሳ በምድርም በሰማይም ውስጥ ምንም ነገር በማይጎዳው በአላህ ስም፤ እርሱም ሰሚው አዋቂው ነው።",
    repeatCount: 3,
    virtue: "Whoever recites it three times in the morning and evening will not be harmed by anything (Sunan Abi Dawud).",
    reference: "Abu Dawud 5088, At-Tirmidhi 3388",
    audioUrl: "https://everyayah.com/data/audio/adhkar/bismillah_allazi.mp3"
  },
  {
    id: "dua-evening-1",
    categoryId: "evening",
    title: "Evening Declaration of Tawheed & Kingdom",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadeer.",
    translation: "We have reached the evening and the kingdom belongs to Allah, and praise is to Allah. None has the right to be worshipped except Allah alone, without partner. To Him belongs the dominion and to Him is praise, and He is over all things omnipotent.",
    translationAmharic: "መሸን፤ ንግሥናም ለአላህ ተገባደደ፤ ምስጋና ለአላህ ነው። ከአላህ በስተቀር በእውነት የሚመለክ አምላክ የለም...",
    repeatCount: 1,
    reference: "Sahih Muslim 2723",
    audioUrl: "https://everyayah.com/data/audio/adhkar/amsayna.mp3"
  },
  {
    id: "dua-distress-1",
    categoryId: "distress",
    title: "Dua of Prophet Yunus (Dhun-Nun)",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta subhanaka inni kuntu minadh-dhalimeen.",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    translationAmharic: "ከአንተ በስተቀር ሌላ አምላክ የለም፤ ጥራት ይገባህ፤ እኔ በእርግጥ ከበደለኞቹ ነበርኩ።",
    repeatCount: 1,
    virtue: "No Muslim suppliant ever prays with this verse regarding any distress except that Allah relieves him (Jami' at-Tirmidhi).",
    reference: "Surah Al-Anbiya 21:87, Tirmidhi 3505"
  },
  {
    id: "dua-travel-1",
    categoryId: "travel",
    title: "Dua for Journey & Transport",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
    transliteration: "Subhanalladhi sakh-khara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina lamunqaliboon.",
    translation: "Glory be to Him Who has subjected this to us, whereas we could not have otherwise subdued it by ourselves. And indeed, to our Lord we will return.",
    translationAmharic: "ይህን ለእኛ ላገራልን ጌታ ጥራት ይገባው፤ እኛ ለእርሱ አቅም የነበረን አልነበርንም። እኛም ወደ ጌታችን በእርግጥ ተመላሾች ነን።",
    repeatCount: 1,
    reference: "Surah Az-Zukhruf 43:13-14, Muslim 1342"
  },
  {
    id: "dua-quranic-1",
    categoryId: "quranic",
    title: "Goodness in this Life and the Hereafter",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    translationAmharic: "ጌታችን ሆይ! በቅርቢቱ (ዓለም) በጎን፣ በመጨረሻይቱም (ዓለም) በጎን ስጠን፤ የእሳትንም ቅጣት ጠብቀን።",
    repeatCount: 3,
    virtue: "The most frequent supplication made by the Prophet Muhammad (peace and blessings be upon him).",
    reference: "Surah Al-Baqarah 2:201, Sahih Bukhari 6389"
  }
];

export class DuasService {
  public static getCategories(): DuaCategory[] {
    return DUA_CATEGORIES;
  }

  public static getByCategory(categoryId: string): DuaItem[] {
    const list = DUAS_DATABASE.filter((d) => d.categoryId === categoryId);
    return list.length > 0 ? list : DUAS_DATABASE.slice(0, 3);
  }

  public static getDailyDua(): DuaItem {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DUAS_DATABASE[dayOfYear % DUAS_DATABASE.length];
  }

  public static getAudio(duaId: string): { id: string; audioUrl: string } {
    const dua = DUAS_DATABASE.find((d) => d.id === duaId);
    const audioUrl = dua?.audioUrl || "https://everyayah.com/data/audio/adhkar/sayyid_istighfar.mp3";
    return { id: duaId, audioUrl };
  }
}
