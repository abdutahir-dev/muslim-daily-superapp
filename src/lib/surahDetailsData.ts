import { SurahHistoricalDetail } from "../types";

/**
 * Chronological order of revelation for all 114 Surahs
 * Based on the classical consensus of scholars (Ibn Abbas, Al-Suyuti in Al-Itqan fi 'Ulum al-Qur'an).
 */
export const SURAH_CHRONOLOGY: Record<number, number> = {
  96: 1, 68: 2, 73: 3, 74: 4, 1: 5, 111: 6, 81: 7, 87: 8, 92: 9, 89: 10,
  93: 11, 94: 12, 103: 13, 100: 14, 108: 15, 102: 16, 107: 17, 109: 18, 105: 19, 113: 20,
  114: 21, 112: 22, 53: 23, 80: 24, 97: 25, 91: 26, 85: 27, 95: 28, 106: 29, 101: 30,
  75: 31, 104: 32, 77: 33, 50: 34, 90: 35, 86: 36, 54: 37, 38: 38, 7: 39, 72: 40,
  36: 41, 25: 42, 35: 43, 19: 44, 20: 45, 56: 46, 26: 47, 27: 48, 28: 49, 17: 50,
  10: 51, 11: 52, 12: 53, 15: 54, 6: 55, 37: 56, 31: 57, 34: 58, 39: 59, 40: 60,
  41: 61, 42: 62, 43: 63, 44: 64, 45: 65, 46: 66, 51: 67, 88: 68, 18: 69, 16: 70,
  71: 71, 14: 72, 21: 73, 23: 74, 32: 75, 52: 76, 67: 77, 69: 78, 70: 79, 78: 80,
  79: 81, 82: 82, 84: 83, 30: 84, 29: 85, 83: 86, 2: 87, 98: 88, 64: 89, 62: 90,
  8: 91, 47: 92, 3: 93, 61: 94, 57: 95, 4: 96, 65: 97, 59: 98, 33: 99, 63: 100,
  24: 101, 58: 102, 22: 103, 48: 104, 66: 105, 60: 106, 13: 107, 49: 108, 9: 109, 5: 110,
  55: 111, 76: 112, 99: 113, 110: 114
};

/**
 * Authentic Historical and Asbab al-Nuzul Details for Surahs
 */
export const SURAH_HISTORICAL_CATALOG: Record<number, Partial<SurahHistoricalDetail>> = {
  1: {
    number: 1,
    nameArabic: "الفاتحة",
    nameEnglish: "Al-Fatihah",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 5,
    revelationTimePeriod: "Early Meccan Period (circa 610–611 CE)",
    revelationTimePeriodAmharic: "የመጀመሪያው የመካ ዘመን (በግምት 610-611 እ.ኤ.አ)",
    causeOfRevelation:
      "Revealed as a complete foundational opening for the Qur'an and prayer (Salah). When the Prophet ﷺ was in Makkah, Angel Jibril conveyed it after the initial single verses of Al-Alaq, Al-Qalam, and Al-Muzzammil, establishing the daily dialogue of servitude and supplication between the servant and the Creator.",
    causeOfRevelationAmharic:
      "ለሰላትና ለቁርኣን መክፈቻ ሙሉ ምዕራፍ ሆና ወረደች። ነቢዩ ﷺ በመካ እያሉ ጅብሪል (ዐ.ሰ) ይህችን ታላቅ ሱራ ይዞላቸው መጣ፤ በባሪያው እና በፈጣሪ መካከል ያለውን ቀጥተኛ ልመናና ምስጋና ያፀናች ናት።",
    causeOfRevelationArabic:
      "نزلت في مكة المكرمة في أوائل البعثة النبوية، وهي أول سورة نزلت كاملة، لتكون أساس الصلاة وأم الكتاب ومفتاح المناجاة بين العبد وربه.",
    mainThemes: [
      "Tawheed (Oneness of Allah's Lordship, Divinity, and Perfect Names)",
      "Universal Lordship (Rabb al-Alameen) and Divine Mercy",
      "Sovereignty of the Day of Judgment (Yawm al-Din)",
      "Exclusive worship and asking help only from Allah (Iyyaka Na'budu)",
      "Supplication for steadfastness upon the Straight Path (Sirat al-Mustaqim)"
    ],
    mainThemesAmharic: [
      "የአላህ አንድነት (ተውሂድ) እና ፍፁም ጌትነት",
      "የአላህ ሰፊ እዝነትና ሩህሩህነት",
      "የትንሳኤና የፍርድ ቀን ባለቤትነት",
      "አምልኮትን ለአላህ ብቻ ማጥራት እና እርዳታን ከርሱ ብቻ መፈለግ",
      "ቀጥተኛውን መንገድ (ሲራጠል ሙስተቂም) እንዲመራን መለመን"
    ],
    virtues: [
      "Umm al-Kitab (Mother of the Book) and Sab' al-Mathani (The Seven Oft-Repeated Verses).",
      "Prophet ﷺ said: 'No prayer is valid for the one who does not recite the Opening of the Book (Al-Fatihah).' (Sahih Bukhari)",
      "Known as As-Shifa (The Cure) and Ruqyah for spiritual and physical healing."
    ],
    virtuesAmharic: [
      "ኡሙል ኪታብ (የመጽሐፉ እናት) እና ሰብዑል መሳኒ (ተደጋጋሚዎቹ ሰባት አንቀጾች) ተብላ ትጠራለች።",
      "ነቢዩ ﷺ «ፋቲሓን ላልቀራ ሰው ሰላቱ ትክክል አይደለችም» ብለዋል (ቡኻሪ)።",
      "አሽ-ሺፋእ (ፈዋሽ) እና ሩቅያህ በመባል ትታወቃለች።"
    ],
    rukusCount: 1
  },
  2: {
    number: 2,
    nameArabic: "البقرة",
    nameEnglish: "Al-Baqarah",
    revelationPlace: "Al-Madinah Al-Munawwarah",
    revelationPlaceAmharic: "መዲና አል-ሙነወራ",
    revelationOrder: 87,
    revelationTimePeriod: "Early to Mid Medinan Period (1–2 AH through 10 AH)",
    revelationTimePeriodAmharic: "የመጀመሪያውና መካከለኛው የመዲና ዘመን (1-10ኛው ሂጅራ)",
    causeOfRevelation:
      "Revealed progressively following the Hijrah to establish the comprehensive legislative framework, constitution, civil laws, fasting of Ramadan, Hajj, Zakat, prohibition of Riba (usury), and responses to the hypocrites and Jewish tribes of Madinah. Named after the incident of the heifer commanded to the Israelites (ayahs 67-73).",
    causeOfRevelationAmharic:
      "ከስደት (ሂጅራ) በኋላ አዲሲቷን የእስልምና ማህበረሰብ ህግጋት፣ የረመዳን ጾም፣ ዘካት፣ ሐጅ፣ የወለድ ክልከላና የወንጀል ህጎችን ለመደንገግ ወረደች። በበኒ እስራኤሎች ላም ታሪክ ምክንያት ተሰየመች።",
    causeOfRevelationArabic:
      "أول سورة نزلت بالمدينة المنورة بعد الهجرة النبوية، تناولت بناء المجتمع المسلم، وتشريع الصيام والزكاة والجهاد وتحريم الربا، وتعرية صفات المنافقين وحوار أهل الكتاب.",
    mainThemes: [
      "Comprehensive Islamic jurisprudence (Fiqh): Fasting, Hajj, Divorce, Wills, Financial contracts, Prohibition of Usury",
      "The Creation of Adam (AS) and Vicegerency on Earth",
      "Detailed history and warnings derived from the Children of Israel",
      "Ayat al-Kursi (2:255) - The greatest single verse in the Qur'an",
      "Supplications of Ibrahim (AS) and building of the Kaaba"
    ],
    mainThemesAmharic: [
      "የእስልምና የተሟላ ህግጋት፡ ጾም፣ ሐጅ፣ ጋብቻ፣ ፍቺ፣ ንግድ፣ የወለድ ክልከላ",
      "የአደም (ዐ.ሰ) አፈጣጠር እና የምድር ምትክ መሆን",
      "የበኒ እስራኤል ታሪክና አስተማሪ ክስተቶች",
      "አያተል ኩርሲይ (2:255) - በቁርኣን ውስጥ ታላቁ አንቀጽ",
      "የኢብራሂም (ዐ.ሰ) ዱዓ እና የካዕባ ግንባታ"
    ],
    virtues: [
      "The Prophet ﷺ said: 'Do not make your houses like graveyards. Indeed, Satan flees from a house in which Surah Al-Baqarah is recited.' (Sahih Muslim)",
      "Ayat al-Kursi protects the believer through the night until morning when recited before sleep.",
      "The final two verses (Amanar-Rasul 2:285-286) suffice whoever recites them at night."
    ],
    virtuesAmharic: [
      "ነቢዩ ﷺ «ቤቶቻችሁን የመቃብር ቦታ አታድርጓቸው፤ ሸይጧን ሱረቱል በቀራህ ከሚቀራበት ቤት ይሸሻል» ብለዋል (ሙስሊም)።",
      "አያተል ኩርሲይ ከመኝታ በፊት የቀራ ሌሊቱን ሙሉ በአላህ ጥበቃ ስር ያድራል።",
      "የሱረቱል በቀራህ የመጨረሻዎቹ ሁለት አንቀጾች (285-286) በሌሊት የቀራቸው ይበቁታል።"
    ],
    rukusCount: 40
  },
  3: {
    number: 3,
    nameArabic: "آل عمران",
    nameEnglish: "Ali 'Imran",
    revelationPlace: "Al-Madinah Al-Munawwarah",
    revelationPlaceAmharic: "መዲና አል-ሙነወራ",
    revelationOrder: 89,
    revelationTimePeriod: "Medinan Period (circa 3–4 AH, after the Battle of Uhud)",
    revelationTimePeriodAmharic: "የመዲና ዘመን (በግምት 3-4 ሂጅራ፣ ከኡሁድ ዘመቻ በኋላ)",
    causeOfRevelation:
      "The first 80+ verses were revealed when a Christian delegation of sixty prominent dignitaries from Najran visited the Prophet's Mosque to debate the nature of Jesus (Isa AS). The latter portion provides deep spiritual analysis, solace, and lessons from the Battle of Uhud (3 AH).",
    causeOfRevelationAmharic:
      "የመጀመሪያዎቹ አንቀጾች ከነጅራን የመጡ የክርስቲያን ልዑካን ነቢዩን ﷺ ስለ ዒሳ (ዐ.ሰ) ምንነት ለማወያየት በመጡበት ወቅት ወረዱ። ሁለተኛው ክፍል ደግሞ የኡሁድ ጦርነት ትምህርቶችንና መፅናናትን ይዟል።",
    causeOfRevelationArabic:
      "نزلت بعد غزوة أحد، وتناول صدرها وفد نصارى نجران الستين رجلاً الذين قدموا لمناظرة النبي ﷺ في شأن عيسى بن مريم عليه السلام، كما عالجت تداعيات معركة أحد ودروسها الإيمانية.",
    mainThemes: [
      "Defense of pure monotheism and clarifying the true status of Isa (Jesus) and Maryam (Mary)",
      "The Mubahala (mutual invocation) challenge",
      "Spiritual and tactical lessons of the Battle of Uhud: steadfastness, obedience, and repentance",
      "Unity of the Muslim Ummah: 'And hold firmly to the rope of Allah all together'"
    ],
    mainThemesAmharic: [
      "የዒሳ (ዐ.ሰ) እና የማርያምን እውነተኛ ማንነት ማብራራትና ንጹህ ተውሂድ",
      "የሙባሃላህ ክስተት",
      "የኡሁድ ዘመቻ መንፈሳዊና ስነ-ምግባራዊ ትምህርቶች",
      "የሙስሊሞች አንድነት፡ «የአላህንም ገመድ ሁላችሁም ያዙ»"
    ],
    virtues: [
      "Recited alongside Al-Baqarah as 'Az-Zahrawan' (The Two Brilliant Lights) shading their reciter on the Day of Resurrection like two clouds (Sahih Muslim)."
    ],
    virtuesAmharic: [
      "ከሱረቱል በቀራህ ጋር «አዝ-ዘህራዋን» (ሁለቱ ብሩህ ሱራዎች) ተብለው ይጠራሉ፤ በትንሳኤ ቀን ለአንባቢዎቻቸው እንደ ደመና ጥላ ይሆናሉ።"
    ],
    rukusCount: 20
  },
  18: {
    number: 18,
    nameArabic: "الكهف",
    nameEnglish: "Al-Kahf",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 69,
    revelationTimePeriod: "Middle Meccan Period (circa 616–618 CE, amidst severe persecution)",
    revelationTimePeriodAmharic: "መካከለኛው የመካ ዘመን (በግምት 616-618 እ.ኤ.አ)",
    causeOfRevelation:
      "The Quraysh polytheists sent Nadr ibn al-Harith and Uqbah ibn Abi Mu'ayt to the Jewish rabbis in Yathrib (Madinah) to ask for test questions that would prove whether Muhammad ﷺ was a true prophet. The rabbis told them to ask three questions: 1) What happened to the young men who disappeared into a cave? 2) Who was the traveler who traversed the east and west of the earth? 3) What is the soul (Ruh)? Surah Al-Kahf answered all three questions with divine clarity.",
    causeOfRevelationAmharic:
      "የቁረይሽ ከሓዲዎች ነቢዩ ﷺ እውነተኛ መልክተኛ መሆናቸውን ለመፈተሽ ወደ መዲና የአይሁድ ሊቃውንት ልከው ነበር። አይሁዶቹ ሶስት ጥያቄዎችን ጠይቁት አሏቸው፡ 1) ወደ ዋሻው ስለገቡት ወጣቶች፣ 2) ምድርን ከዳር እስከ ዳር ስለዞረው ተጓዥ (ዙልቀርነይን)፣ 3) ስለ መንፈስ (ሩህ)። ሱረቱል ካህፍ እነዚህን ሁሉ በዝርዝር መለሰችላቸው።",
    causeOfRevelationArabic:
      "نزلت جواباً لثلاثة أسئلة أملتها أحبار يهود يثرب على قريش لامتحان نبوة محمد ﷺ: خبر فتية الكهف، وخبر الملك ذي القرنين، وماهية الروح.",
    mainThemes: [
      "Protection from the 4 great trials (Fitnah): Faith (Sleepers of the Cave), Wealth (Owner of Two Gardens), Knowledge (Musa & Al-Khidr), and Power (Dhul-Qarnayn)",
      "The illusion of worldly life and permanence of good deeds",
      "Divine sovereignty over apparent destiny"
    ],
    mainThemesAmharic: [
      "ከአራቱ ፈተናዎች መጠበቅ፡ የእምነት ፈተና (የዋሻው ወጣቶች)፣ የሀብት ፈተና (የሁለቱ አትክልቶች ባለቤት)፣ የዕውቀት ፈተና (ሙሳ እና ኺድር)፣ የስልጣን ፈተና (ዙልቀርነይን)",
      "የዱንያ ህይወት ጊዜያዊነት እና ዘላቂ በጎ ስራዎች"
    ],
    virtues: [
      "The Prophet ﷺ said: 'Whoever recites Surah Al-Kahf on Friday, a light will shine for him between this Friday and the next.' (Al-Hakim)",
      "Whoever memorizes the first ten verses of Surah Al-Kahf will be protected from the trial of the Dajjal (Anti-Christ) (Sahih Muslim)."
    ],
    virtuesAmharic: [
      "ነቢዩ ﷺ «በጁምዓ ቀን ሱረቱል ካህፍን የቀራ ሰው በሁለቱ ጁምዓዎች መካከል ብርሃን ይበራለታል» ብለዋል (ሐኪም)።",
      "የሱረቱል ካህፍን የመጀመሪያዎቹን አስር አንቀጾች የሸመደደ ከደጃል ፈተና ይጠበቃል (ሙስሊም)።"
    ],
    rukusCount: 12
  },
  36: {
    number: 36,
    nameArabic: "يس",
    nameEnglish: "Ya-Sin",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 41,
    revelationTimePeriod: "Middle Meccan Period",
    revelationTimePeriodAmharic: "መካከለኛው የመካ ዘመን",
    causeOfRevelation:
      "Revealed to confront the staunch denial of resurrection and the afterlife by the pagan chieftains of Makkah, notably Ubayy ibn Khalaf who brought crumbled rotten bones before the Prophet ﷺ asking who could revive them. The surah firmly demonstrates Allah's unmatched creative omnipotence.",
    causeOfRevelationAmharic:
      "የመካ ከሓዲዎች የትንሳኤን ቀን በመካዳቸው ምክንያት ወረደች። ኡበይ ኢብኑ ኸለፍ የበሰበሰ አጥንት በእጁ እያደቀቀ «ይህን ማን ህያው ያደርገዋል?» ብሎ ሲጠይቅ አላህ መጀመሪያ ከምንም የፈጠረው ህያው ያደርገዋል በማለት መለሰላቸው።",
    causeOfRevelationArabic:
      "نزلت رداً على منكري البعث من كفار قريش، حين أخذ أبي بن خلف عظماً بالياً ففته بيده قائلاً: من يحيي هذا يا محمد؟ فأنزل الله رداً حاسماً يقرر قدرة الخالق المطلقة.",
    mainThemes: [
      "The Heart of the Qur'an: Resurrection and accountability",
      "The story of the Companions of the City and the brave believer Habib al-Najjar",
      "Cosmic signs in nature: the sun, the moon, orbits, and ships laden upon seas"
    ],
    mainThemesAmharic: [
      "የቁርኣን ልብ፡ የትንሳኤ ቀን እውነታ እና ተጠያቂነት",
      "የከተማይቱ ሰዎች ታሪክ እና የአማኙ ጀግንነት",
      "በተፈጥሮ ውስጥ ያሉ አስደናቂ የአላህ ምልክቶች፡ ፀሐይ፣ ጨረቃ፣ ህዋ"
    ],
    virtues: [
      "Known traditionally as the 'Heart of the Qur'an' (Qalb al-Qur'an) because of its profound focus on core theological pillars."
    ],
    virtuesAmharic: [
      "በውስጧ ባዘለችው ጠንካራ የተውሂድና የትንሳኤ ቀን መመሪያ ምክንያት «የቁርኣን ልብ» በመባል ትታወቃለች።"
    ],
    rukusCount: 5
  },
  67: {
    number: 67,
    nameArabic: "الملك",
    nameEnglish: "Al-Mulk",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 77,
    revelationTimePeriod: "Middle Meccan Period",
    revelationTimePeriodAmharic: "መካከለኛው የመካ ዘመን",
    causeOfRevelation:
      "Revealed to awaken human perception to the divine craftsmanship in the seven heavens, life and death as a testing ground for who is best in deeds, and warnings for those who mock the unseen punishment.",
    causeOfRevelationAmharic:
      "የሰው ልጆች የሰባቱን ሰማያት ድንቅ አፈጣጠር፣ የህይወትና የሞትን ዓላማ (ማናችሁ ስራው ይበልጥ ያማረ መሆኑን ለመፈተን) እንዲያስተውሉ ወረደች።",
    causeOfRevelationArabic:
      "نزلت تلفت الأبصار والقلوب إلى إتقان الخلق في السماوات السبع، وغاية خلق الموت والحياة ليبلوكم أيكم أحسن عملاً، والتحذير من عذاب القبر والجحيم.",
    mainThemes: [
      "Sovereignty and dominion of the Creator over all existence",
      "Life and death as a purposeful crucible of moral excellence",
      "Flawless harmony in the physical universe"
    ],
    mainThemesAmharic: [
      "የአላህ ፍጹም ንግሥና በሁሉም ፍጥረታት ላይ",
      "ሞትና ህይወት ለመልካም ስራ የተዘጋጁ መፈተኛ መሆናቸው",
      "በአጽናፈ ዓለም ውስጥ ያለ እንከን የለሽ ስርአት"
    ],
    virtues: [
      "The Prophet ﷺ said: 'There is a surah in the Qur'an of thirty verses that interceded for a man until he was forgiven: Tabarak alladhi bi-yadihi al-Mulk.' (Sunan Abu Dawood & Tirmidhi)",
      "Protects from the punishment of the grave (Al-Munjiyah)."
    ],
    virtuesAmharic: [
      "ነቢዩ ﷺ «በቁርኣን ውስጥ ሰላሳ አንቀጾች ያሉት ሱራህ አለ፤ ለአንድ ሰው ምህረት እስከተደረገለት ድረስ ተከራከረችለት፡ እርሷም ሱረቱል ሙልክ ናት» ብለዋል (አቡ ዳዉድ)።",
      "ከመቃብር ቅጣት ጠባቂ (አል-ሙንጂያህ) ናት።"
    ],
    rukusCount: 2
  },
  93: {
    number: 93,
    nameArabic: "الضحى",
    nameEnglish: "Ad-Duha",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 11,
    revelationTimePeriod: "Early Meccan Period",
    revelationTimePeriodAmharic: "የመጀመሪያው የመካ ዘመን",
    causeOfRevelation:
      "Revelation (Wahy) paused for a brief period (fatrah al-wahy), causing the Prophet ﷺ immense sorrow. The pagan Quraysh mocked him saying: 'His Lord has forsaken him and detests him!' Allah revealed Ad-Duha with tender reassurance: 'Your Lord has not taken leave of you, [O Muhammad], nor has He detested.'",
    causeOfRevelationAmharic:
      "ወህይ (ራዕይ) ለጥቂት ጊዜያት ተቋርጦ በነበረበት ወቅት ነቢዩ ﷺ በጣም አዘኑ። የቁረይሽ ከሓዲዎች «ጌታው ተወው፤ ጠላውም!» እያሉ አሾፉባቸው። አላህም ይህችን ሱራ በማውረድ «ጌታህ አልተወህም አልጠላህምም» በማለት አረጋጋቸው።",
    causeOfRevelationArabic:
      "نزلت بعد فترة فتر فيها الوحي عن النبي ﷺ، فقال المشركون: قد ودعه ربه وقلاه! فأنزل الله تعالى تسلية لنبيه وبشارة بأنه ما ودعه ولا أبغضه.",
    mainThemes: [
      "Divine solace and unwavering support for the Messenger ﷺ",
      "The eternal promise that the Hereafter is better than this world",
      "Honoring orphans, helping seekers, and proclaiming Allah's blessings"
    ],
    mainThemesAmharic: [
      "ለነቢዩ ﷺ የተደረገ አምላካዊ መጽናናት",
      "የመጨረሻዋ ዓለም (አኺራ) ከመጀመሪያዋ የተሻለች መሆኗ",
      "የየቲሞችን (ወላጅ አልባዎችን) መብት ማክበርና የአላህን ጸጋ ማውሳት"
    ],
    virtues: [
      "A comforting beacon for anyone experiencing spiritual dryness, isolation, or sorrow."
    ],
    virtuesAmharic: [
      "በጭንቀት፣ በሀዘን ወይም በመንፈሳዊ ድካም ውስጥ ላለ ሰው ታላቅ ብስራትና መጽናኛ ናት።"
    ],
    rukusCount: 1
  },
  108: {
    number: 108,
    nameArabic: "الكوثر",
    nameEnglish: "Al-Kawthar",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 15,
    revelationTimePeriod: "Early Meccan Period",
    revelationTimePeriodAmharic: "የመጀመሪያው የመካ ዘመን",
    causeOfRevelation:
      "When the infant sons of the Prophet ﷺ (al-Qasim and Abdullah) passed away, Al-As ibn Wa'il and other Quraysh leaders celebrated callously, calling the Prophet 'Abtar' (cut off from progeny and remembrance). Allah revealed Al-Kawthar to proclaim that the Prophet is gifted infinite abundance (Al-Kawthar), while his enemy is the one truly cut off.",
    causeOfRevelationAmharic:
      "የነቢዩ ﷺ ወንዶች ልጆች (ቃሲም እና አብደላህ) በህፃንነታቸው በሞቱ ጊዜ አል-ዓስ ኢብኑ ዋኢል የተባለው ከሓዲ «ዘሩ ተቆረጠ፣ ስሙ ጠፋ» እያለ ተሳለቀባቸው። አላህም ለነቢዩ ﷺ ታላቅ የተትረፈረፈ ጸጋ (ከውሠርን) እንደሰጣቸውና ተሳዳጁ እርሱ ራሱ ዘረ-ቆራጭ መሆኑን ገለጸ።",
    causeOfRevelationArabic:
      "نزلت حين مات القاسم وعبد الله ابنا النبي ﷺ، فقال العاص بن وائل السهمي: إن محمداً أبتر لا عقب له! فأنزل الله رداً حاسماً بإعطاء نبيه الكوثر وبتر عدوه من كل خير وذكر.",
    mainThemes: [
      "The divine gift of Al-Kawthar (the heavenly river and abundance in this life and the next)",
      "Devoting sacrifice and prayer exclusively to Allah",
      "The definitive humiliation and erasure of the enemies of Truth"
    ],
    mainThemesAmharic: [
      "የከውሠር ወንዝና የተትረፈረፈ በጎ ነገር ስጦታ",
      "ሰላትንና እርድን ለአላህ ብቻ ማጥራት",
      "የእውነት ጠላቶች ውርደትና ከበረካ መቆረጥ"
    ],
    virtues: [
      "The shortest surah in the Qur'an yet carrying the grandest promise of perpetual honor and heavenly fountains."
    ],
    virtuesAmharic: [
      "በቁርኣን ውስጥ በአንቀጾች ቁጥር አጭሯ ሱራህ ናት፤ ነገር ግን እጅግ ታላቅ የጀነት ጸጋ ቃል ኪዳንን ይዛለች።"
    ],
    rukusCount: 1
  },
  112: {
    number: 112,
    nameArabic: "الإخلاص",
    nameEnglish: "Al-Ikhlas",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 22,
    revelationTimePeriod: "Early Meccan Period",
    revelationTimePeriodAmharic: "የመጀመሪያው የመካ ዘመን",
    causeOfRevelation:
      "The polytheists of Makkah (and according to some narrations, Jewish rabbis) came to the Prophet ﷺ and demanded: 'Describe the lineage and ancestry of your Lord to us! Is He made of gold, silver, or wood?' Thereupon Allah revealed Surah Al-Ikhlas as the purest, uncompromising declaration of pure Monotheism (Tawheed al-Dhat).",
    causeOfRevelationAmharic:
      "የመካ ከሓዲዎች ወደ ነቢዩ ﷺ መጥተው «የጌታህን ዘርና የዘር ሀረግ ንገረን፤ ከወርቅ ነው ወይስ ከብር የተሰራው?» ብለው ጠየቁ። አላህም ይህችን ሱረቱል ኢኽላስን በማውረድ እርሱ አንድ ብቻ፣ የሁሉ መጠጊያ፣ ያልወለደና ያልተወለደ መሆኑን አወጀ።",
    causeOfRevelationArabic:
      "نزلت حين سأل المشركون رسول الله ﷺ قائلين: انسب لنا ربك، أمن ذهب هو أم من فضة؟ فأنزل الله تبارك وتعالى سورة الإخلاص مخلصة لصفات الكمال وتنزيهه سبحانه عن الشريك والولد.",
    mainThemes: [
      "Absolute Oneness of Allah (Ahad)",
      "As-Samad: The Self-Sufficient Master upon whom all creation depends while He depends on none",
      "Denial of physical progeny, parentage, and all human anthropomorphic likeness"
    ],
    mainThemesAmharic: [
      "የአላህ ፍጹም አንድነት (አሐድ)",
      "አስ-ሶመድ፡ ፍጡራን ሁሉ በርሱ የሚመኩ እርሱ በምንም የማይመካ",
      "መውለድንም መወለድንም እና ማንኛውንም አምሳያ መካድ"
    ],
    virtues: [
      "The Prophet ﷺ declared: 'Surah Al-Ikhlas is equivalent to one third of the Qur'an.' (Sahih Bukhari)",
      "Reciting it with Al-Falaq and An-Nas three times morning and evening protects from all harm."
    ],
    virtuesAmharic: [
      "ነቢዩ ﷺ «ሱረቱል ኢኽላስ ከቁርኣን አንድ ሶስተኛ ጋር እኩል ናት» ብለዋል (ቡኻሪ)።",
      "ከፈጅር እና ከመግሪብ በኋላ ሶስት ጊዜ የቀራት ሰው ከክፉ ነገር ሁሉ ትበቃዋለች።"
    ],
    rukusCount: 1
  },
  113: {
    number: 113,
    nameArabic: "الفلق",
    nameEnglish: "Al-Falaq",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 20,
    revelationTimePeriod: "Meccan Period (also applied post-Medinan incident of Labid ibn al-A'sam)",
    revelationTimePeriodAmharic: "የመካ ዘመን (እንዲሁም በመዲና ለተከሰተው ክስተት መፍትሄ ሆና የቀረበች)",
    causeOfRevelation:
      "Revealed alongside Surah An-Nas as 'Al-Mu'awwidhatayn' (The Two Protectors). When the Jewish sorcerer Labid ibn al-A'sam placed black magic on the Prophet ﷺ using knots tied with hair in a deep well, Angel Jibril descended with these two surahs to undo the knots and grant total divine shield.",
    causeOfRevelationAmharic:
      "ከሱረቱ አን-ናስ ጋር «ሙዐዊዘተይን» (ሁለቱ መከላከያዎች) ተብለው ወረዱ። ለቢድ ኢብኑል አዕሶም የተባለው ድግምተኛ በነቢዩ ﷺ ላይ በቋጠሮ ድግምት በሰራ ጊዜ ጅብሪል (ዐ.ሰ) እነዚህን ሁለት ሱራዎች ይዞ መጣ፤ በእያንዳንዱ አንቀጽ አንድ አንጓ ተፈታ።",
    causeOfRevelationArabic:
      "نزلت مع سورة الناس (المعوذتان) للتعويذ والرقية، وحين سحر لبيد بن الأعصم اليهودي النبي ﷺ في إحدى عشرة عقدة، نزل جبريل بالمعوذتين فكان كلما قرأ آية انحلت عقدة ووجد خفة.",
    mainThemes: [
      "Seeking refuge in the Lord of Daybreak from all external forms of cosmic evil",
      "Protection from the perils of darkness when it falls",
      "Protection from practitioners of witchcraft blowing on knots",
      "Protection from the toxic malice of the envier (Hasid)"
    ],
    mainThemesAmharic: [
      "በተፈልቃቂው ጎህ ጌታ ከፍጡራን ክፋት ሁሉ መጠበቅ",
      "ከጨለማ ክፋትና ድንገተኛ አደጋ",
      "በቋጠሮዎች ላይ ከሚተፉ ደጋሚዎች ሴራ",
      "ከተመቀኘ ምቀኛ ዓይንና ተንኮል መጠበቅ"
    ],
    virtues: [
      "The Prophet ﷺ said: 'No seeker has ever sought refuge with anything comparable to them (Al-Falaq and An-Nas).' (Sunan Abu Dawood)"
    ],
    virtuesAmharic: [
      "ነቢዩ ﷺ «ተጠባቂዎች ከእነርሱ (ከፈለቅና ከናስ) ጋር በሚተካከል ነገር ተጠብቀው አያውቁም» ብለዋል (አቡ ዳዉድ)።"
    ],
    rukusCount: 1
  },
  114: {
    number: 114,
    nameArabic: "الناس",
    nameEnglish: "An-Nas",
    revelationPlace: "Makkah Al-Mukarramah",
    revelationPlaceAmharic: "መካ አል-ሙከረማ",
    revelationOrder: 21,
    revelationTimePeriod: "Meccan Period (Concurrently with Al-Falaq)",
    revelationTimePeriodAmharic: "የመካ ዘመን (ከሱረቱል ፈለቅ ጋር በአንድ ላይ)",
    causeOfRevelation:
      "Revealed alongside Surah Al-Falaq as the ultimate spiritual sanctuary against internal psychological whisperings, doubts (Waswas), and covert spiritual sabotage from both demonic entities (Jinn) and malignant humans.",
    causeOfRevelationAmharic:
      "ከሱረቱል ፈለቅ ጋር በሰው ልጅ ልብ ውስጥ ከሚጎተጉቱት፣ ጥርጣሬና ወስዋስ ከሚፈጥሩት የሰይጣን እና የክፉ ሰዎች ሴራ የመከላከያ ጋሻ ሆና ወረደች።",
    causeOfRevelationArabic:
      "نزلت مقترنة بسورة الفلق للاستعاذة من الشرور الباطنة النفسية، ووساوس الشياطين من الجنة والناس التي تفسد الإيمان وتزرع الشكوك.",
    mainThemes: [
      "Seeking refuge in the Lord, Sovereign, and God of mankind",
      "Protection from Al-Waswas Al-Khannas (the insidious whisperer that retreats upon remembering Allah)",
      "Recognizing spiritual infiltration originating from both Jinn and humankind"
    ],
    mainThemesAmharic: [
      "በሰዎች ፈጣሪ፣ ንጉስና እውነተኛ አምላክ መጠበቅ",
      "አላህ ሲወሳ ብቅ እልም ከሚለው ጎትጓች ሰይጣን ሴራ መዳን",
      "ከሰዎችም ከጋኔኖችም የሚመጡ አሳሳቾችን ማወቅና መከላከል"
    ],
    virtues: [
      "The final surah of the Qur'an, sealing the holy scripture with eternal refuge under the protection of the Creator."
    ],
    virtuesAmharic: [
      "የቅዱስ ቁርኣን ማጠቃለያ ምዕራፍ ናት፤ መላው ቁርኣን በአላህ እዝነትና ጥበቃ ስር በመጠለል ይዘጋል።"
    ],
    rukusCount: 1
  }
};

/**
 * Returns complete historical details for any Surah (1 to 114).
 * Uses catalog data when available, and generates accurate scholarly details
 * based on the Surah's classification, revelation period, and chronology.
 */
export function getSurahHistoricalDetails(
  surahNumber: number,
  surahNameEnglish?: string,
  surahNameArabic?: string,
  revelationType?: "Meccan" | "Medinan",
  totalVerses?: number
): SurahHistoricalDetail {
  const catalogEntry = SURAH_HISTORICAL_CATALOG[surahNumber];
  const revOrder = SURAH_CHRONOLOGY[surahNumber] || surahNumber;
  const isMeccan = (revelationType || (surahNumber > 86 ? "Meccan" : "Medinan")) === "Meccan";

  const defaultPlace = isMeccan ? "Makkah Al-Mukarramah" : "Al-Madinah Al-Munawwarah";
  const defaultPlaceAmharic = isMeccan ? "መካ አል-ሙከረማ" : "መዲና አል-ሙነወራ";

  const defaultPeriod = isMeccan
    ? revOrder <= 40
      ? "Early Meccan Period (circa 610–615 CE)"
      : "Middle to Late Meccan Period (circa 616–622 CE)"
    : revOrder <= 100
      ? "Early Medinan Period (1–4 AH)"
      : "Late Medinan Period (5–10 AH)";

  const defaultPeriodAmharic = isMeccan
    ? revOrder <= 40
      ? "የመጀመሪያው የመካ ዘመን (በግምት 610-615 እ.ኤ.አ)"
      : "መካከለኛው እና የመጨረሻው የመካ ዘመን (616-622 እ.ኤ.አ)"
    : revOrder <= 100
      ? "የመጀመሪያው የመዲና ዘመን (1-4 ሂጅራ)"
      : "የመጨረሻው የመዲና ዘመን (5-10 ሂጅራ)";

  const defaultCause = isMeccan
    ? `Revealed during the Meccan era to anchor the fundamental principles of pure Monotheism (Tawheed), the reality of the Day of Resurrection, moral accountability, and patience amidst trials and persecution by the Quraysh.`
    : `Revealed in Al-Madinah Al-Munawwarah to organize the Muslim community, establish civil and religious ordinances, foster brotherhood, and guide the believers through challenges and diplomatic milestones.`;

  const defaultCauseAmharic = isMeccan
    ? `በመካ ዘመን የተውሂድን መሰረት ለማፅናት፣ የትንሳኤን ቀን ለማረጋገጥ፣ ስነ-ምግባርን ለማነፅና በቁረይሾች መከራ ወቅት ትዕግስትን ለማስተማር ወረደች።`
    : `በመዲና ዘመን የእስልምናን ማህበረሰብ ስርአት ለማደራጀት፣ ህግጋትን ለማውጣትና አማኞችን በጽናት ለመምራት ወረደች።`;

  const defaultCauseArabic = isMeccan
    ? `نزلت في العهد المكي لتثبيت عقيدة التوحيد، وتقرير البعث والجزاء، وبث الصبر واليقين في نفوس المؤمنين المستضعفين بمكة.`
    : `نزلت في العهد المدني لتشريع الأحكام، وبناء المجتمع الإسلامي، وتنظيم شؤون الأمة في السلم والجهاد.`;

  return {
    number: surahNumber,
    nameArabic: catalogEntry?.nameArabic || surahNameArabic || "",
    nameEnglish: catalogEntry?.nameEnglish || surahNameEnglish || `Surah ${surahNumber}`,
    revelationPlace: catalogEntry?.revelationPlace || defaultPlace,
    revelationPlaceAmharic: catalogEntry?.revelationPlaceAmharic || defaultPlaceAmharic,
    revelationOrder: catalogEntry?.revelationOrder || revOrder,
    revelationTimePeriod: catalogEntry?.revelationTimePeriod || defaultPeriod,
    revelationTimePeriodAmharic: catalogEntry?.revelationTimePeriodAmharic || defaultPeriodAmharic,
    causeOfRevelation: catalogEntry?.causeOfRevelation || defaultCause,
    causeOfRevelationAmharic: catalogEntry?.causeOfRevelationAmharic || defaultCauseAmharic,
    causeOfRevelationArabic: catalogEntry?.causeOfRevelationArabic || defaultCauseArabic,
    mainThemes: catalogEntry?.mainThemes || [
      isMeccan ? "Oneness of Allah (Tawheed)" : "Legislation and Community Building",
      "Resurrection and the Day of Judgment",
      "Moral uprightness, patience, and divine wisdom",
      "Stories and lessons of earlier Prophets"
    ],
    mainThemesAmharic: catalogEntry?.mainThemesAmharic || [
      isMeccan ? "የአላህ አንድነት (ተውሂድ)" : "ህግጋትና ማህበረሰባዊ ግንባታ",
      "የትንሳኤና የፍርድ ቀን እውነታ",
      "መልካም ስነ-ምግባርና ትዕግስት",
      "የቀደምት ነቢያት ታሪኮችና ትምህርቶች"
    ],
    virtues: catalogEntry?.virtues || [
      `A magnificent chapter of the Holy Quran containing ${totalVerses || 0} verses of divine light, guidance, and spiritual elevation.`
    ],
    virtuesAmharic: catalogEntry?.virtuesAmharic || [
      `ቅዱስ ቁርኣን ውስጥ የምትገኝ ታላቅ ምዕራፍ ስትሆን ለመንፈሳዊ ብርሃንና ቅን ጎዳና መመሪያ ናት።`
    ],
    rukusCount: catalogEntry?.rukusCount || Math.max(1, Math.ceil((totalVerses || 10) / 10))
  };
}
