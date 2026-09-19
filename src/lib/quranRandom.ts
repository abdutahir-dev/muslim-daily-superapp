import { AyahItem, QuranReadingStyle, RandomAyahsOptions } from "../types";
import { SURAH_LIST } from "./quranData";
import { getSurahHistoricalDetails } from "./surahDetailsData";

/**
 * Curated high-fidelity verses for instant hydration, offline resilience, and fast sampling
 */
export const CURATED_RANDOM_AYAH_POOL: AyahItem[] = [
  {
    surahNumber: 1,
    surahNameEnglish: "Al-Fatihah",
    surahNameArabic: "الفاتحة",
    revelationType: "Meccan",
    numberInSurah: 2,
    textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Al-ḥamdu lillāhi Rabbil-'ālamīn",
    translation: "[All] praise is [due] to Allah, Lord of the worlds -",
    translationAmharic: "ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለኾነው፤",
    tafsirArabic: "الثناء الكامل والشكر التام لله تعالى وحده، فهو المتفرد بالخلق والتدبير، المربي لجميع خلقه بالنعم الظاهرة والباطنة.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
    juz: 1,
  },
  {
    surahNumber: 1,
    surahNameEnglish: "Al-Fatihah",
    surahNameArabic: "الفاتحة",
    revelationType: "Meccan",
    numberInSurah: 5,
    textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyāka na'budu wa iyyāka nasta'īn",
    translation: "It is You we worship and You we ask for help.",
    translationAmharic: "አንተን ብቻ እንገዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን፡፡",
    tafsirArabic: "نخصك وحدك يا ربنا بالعبادة والطاعة، ونستعين بك وحدك في جميع أمورنا، فلا معبود بحق إلا أنت ولا ناصر سواك.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
    juz: 1,
  },
  {
    surahNumber: 2,
    surahNameEnglish: "Al-Baqarah",
    surahNameArabic: "البقرة",
    revelationType: "Medinan",
    numberInSurah: 152,
    textArabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    transliteration: "Fadhkurūnī adhkurkum washkurū lī wa lā takfurūn",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    translationAmharic: "አስታውሱኝም፤ አስታውሳችኋለሁና፡፡ ለእኔም አመስግኑ፤ አትካዱኝም፡፡",
    tafsirArabic: "فاذكروني بطاعتي والثناء عليّ أذكركم بالرحمة والمغفرة وحسن الجزاء، واشكروا لي على نعمي الجليلة ولا تجحدوها.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002152.mp3",
    juz: 2,
  },
  {
    surahNumber: 2,
    surahNameEnglish: "Al-Baqarah",
    surahNameArabic: "البقرة",
    revelationType: "Medinan",
    numberInSurah: 186,
    textArabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    transliteration: "Wa idhā sa'alaka 'ibādī 'annī fa-innī qarīb, ujību da'watad-dā'i idhā da'ān",
    translation: "And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    translationAmharic: "ባሮቼም ከእኔ በጠየቁህ ጊዜ (እንዲህ በላቸው)፡- እኔ በእርግጥ ቅርብ ነኝ፤ የለማኙን ጸሎት በለመነኝ ጊዜ እቀበላለሁ፤",
    tafsirArabic: "وإذا سألك عبادي عني هل أنا قريب فيناجوني أم بعيد فينادي، فإني قريب منهم بعلمي وإحاطتي وإجابتي، أجيب دعوة من دعاني بإخلاص ويقين.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002186.mp3",
    juz: 2,
  },
  {
    surahNumber: 2,
    surahNameEnglish: "Al-Baqarah",
    surahNameArabic: "البقرة",
    revelationType: "Medinan",
    numberInSurah: 255,
    textArabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    transliteration: "Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm, lā ta'khudhuhū sinatuw-walā nawm",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep.",
    translationAmharic: "አላህ ከእርሱ በስተቀር ሌላ አምላክ የለም፤ ሕያው ራሱን ቻይ ነው፤ እንቅልፍም ማሸለብም አትይዘውም፤ በሰማያትና በምድር ያለው ሁሉ የርሱ ብቻ ነው።",
    tafsirArabic: "آية الكرسي: الله الذي لا يستحق الألوهية والعبادة إلا هو، الحي بالحياة الكاملة الدائمة، القيوم القائم بنفسه والمقيم لكل شؤون خلقه، لا يلحقه نعاس ولا نوم.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3",
    juz: 3,
  },
  {
    surahNumber: 2,
    surahNameEnglish: "Al-Baqarah",
    surahNameArabic: "البقرة",
    revelationType: "Medinan",
    numberInSurah: 286,
    textArabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ",
    transliteration: "Lā yukallifullāhu nafsan illā wus'ahā, lahā mā kasabat wa 'alayhā maktasabat",
    translation: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.",
    translationAmharic: "አላህ ነፍስን ከችሎታዋ በላይ አያስገድዳትም፤ ለርሷ የሰራችው መልካም ስራ ምንዳ አላት፤ በሷም ላይ የሰራችው ክፋት ቅጣት አለበት፤",
    tafsirArabic: "من رحمة الله وعدله أنه لا يكلف نفساً فوق طاقتها، فلكل نفس ما عملت من خير ثوابه، وعليها وزر ما اكتسبت من إثم وعصيان.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002286.mp3",
    juz: 3,
  },
  {
    surahNumber: 3,
    surahNameEnglish: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    revelationType: "Medinan",
    numberInSurah: 139,
    textArabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    transliteration: "Wa lā tahinū wa lā taḥzanū wa antumul-a'lawna in kuntum mu'minīn",
    translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    translationAmharic: "አትስነፉም፤ አትዘኑምም፤ እናንተ አማኞች እንደ ኾናችሁ የበላዮች ናችሁና፡፡",
    tafsirArabic: "تثبيت للمؤمنين بعد ما أصابهم في غزوة أحد: لا تضعفوا في جهادكم ولا تحزنوا لما أصابكم من قرح، فالعاقبة والنصر والرفعة لكم إن صدقتم في إيمانكم.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/003139.mp3",
    juz: 4,
  },
  {
    surahNumber: 13,
    surahNameEnglish: "Ar-Ra'd",
    surahNameArabic: "الرعد",
    revelationType: "Medinan",
    numberInSurah: 28,
    textArabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    transliteration: "Alladhīna āmanū wa taṭma'innu qulūbuhum bi-dhikrillāh, alā bi-dhikrillāhi taṭma'innul-qulūb",
    translation: "Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.",
    translationAmharic: "እነዚያ ያመኑ ልቦቻቸውም አላህን በማውሳት የሚረኩ ናቸው፤ ንቁ! አላህን በማውሳት ልቦች ይረካሉ፡፡",
    tafsirArabic: "الذين صدقوا بالله ورسوله تسكن قلوبهم وتستأنس بذكر الله وتوحيده، ألا إن بذكر الله وحده يزول القلق والاضطراب وتنشرح الصدور.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/013028.mp3",
    juz: 13,
  },
  {
    surahNumber: 18,
    surahNameEnglish: "Al-Kahf",
    surahNameArabic: "الكهف",
    revelationType: "Meccan",
    numberInSurah: 10,
    textArabic: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    transliteration: "Idh awal-fityatu ilal-kahfi fa-qālū Rabbanā ātinā mil-ladunka raḥmataw-wa hayyi' lanā min amrinā rashadā",
    translation: "[Mention] when the youths retreated to the cave and said, 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.'",
    translationAmharic: "ጎበዞቹ ወደ ዋሻው በተጠጉና፡- «ጌታችን ሆይ! ከአንተ ዘንድ ችሮታን ስጠን፤ ለነገራችንም ቅንነትን አዘጋጅልን» ባሉ ጊዜ (አስታውስ)፡፡",
    tafsirArabic: "حين لجأ الفتية المؤمنون فراراً بدينهم إلى الغار، وتضرعوا إلى ربهم سائلين رحمته وحفظه والتوفيق للصواب والرشاد في موقفهم العظيم.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/018010.mp3",
    juz: 15,
  },
  {
    surahNumber: 21,
    surahNameEnglish: "Al-Anbiya",
    surahNameArabic: "الأنبياء",
    revelationType: "Meccan",
    numberInSurah: 87,
    textArabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    translationAmharic: "«ከአንተ በስተቀር ሌላ አምላክ የለም፤ ጥራት ይገባህ፤ እኔ በእርግጥ ከበዳዮቹ ነበርኩ» በማለት በጨለማዎች ውስጥ ተጣራ፡፡",
    tafsirArabic: "دعاء ذي النون (يونس عليه السلام) في بطن الحوت: إقرار خالص بالتوحيد وتنزيه الله تعالى عن كل نقص، واعتراف بالتقصير والذنب، وهو دعاء لا يدعو به مكروب إلا فرج الله عنه.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/021087.mp3",
    juz: 17,
  },
  {
    surahNumber: 29,
    surahNameEnglish: "Al-'Ankabut",
    surahNameArabic: "العنكبوت",
    revelationType: "Meccan",
    numberInSurah: 69,
    textArabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
    transliteration: "Walladhīna jāhadū fīnā lanahdiyannahum subulanā, wa innallāha lama'al-muḥsinīn",
    translation: "And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.",
    translationAmharic: "እነዚያም በእኛ መንገድ የታገሉትን መንገዳችንን በእርግጥ እንመራቸዋለን፤ አላህም በእርግጥ ከበጎ ሠሪዎች ጋር ነው፡፡",
    tafsirArabic: "الذين بذلوا جهدهم وطاقتهم في ابتغاء مرضاة الله ومجاهدة النفس والشيطان، سيهديهم الله إلى سبل الخير والصراط المستقيم، وهو معهم بنصره ورعايته.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/029069.mp3",
    juz: 21,
  },
  {
    surahNumber: 39,
    surahNameEnglish: "Az-Zumar",
    surahNameArabic: "الزمر",
    revelationType: "Meccan",
    numberInSurah: 53,
    textArabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    transliteration: "Qul yā 'ibādiyalladhīna asrafū 'alā anfusihim lā taqnaṭū mir-raḥmatillāh, innallāha yaghfirudh-dhunūba jamī'ā",
    translation: "Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
    translationAmharic: "በላቸው፡- «እናንተ በነፍሶቻችሁ ላይ ድንበር ያለፋችሁ ባሮቼ ሆይ! ከአላህ እዝነት ተስፋ አትቁረጡ፤ አላህ ኃጢኣቶችን ሁሉ ይምራልና፤ እርሱ መሓሪ አዛኝ ነውና።",
    tafsirArabic: "أرجى آية في كتاب الله: نداء تلطف ورجاء للعصاة المذنبين ألا ييأسوا من مغفرة الله وسعة رحمته، فالله يغفر الذنوب والكبائر كلها لمن تاب وأناب إليه.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/039053.mp3",
    juz: 24,
  },
  {
    surahNumber: 59,
    surahNameEnglish: "Al-Hashr",
    surahNameArabic: "الحشر",
    revelationType: "Medinan",
    numberInSurah: 22,
    textArabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
    transliteration: "Huwal-lāhulladhī lā ilāha illā Hū, 'Ālimul-ghaybi wash-shahādah, Huwar-Raḥmānur-Raḥīm",
    translation: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful.",
    translationAmharic: "እርሱ አላህ ነው፤ ያ ከርሱ በቀር ሌላ አምላክ የሌለ፣ ሩቁንም ቅርቡንም አዋቂ የኾነው ነው፤ እርሱ እጅግ በጣም ሩኅሩህ በጣም አዛኝ ነው፡፡",
    tafsirArabic: "هو الله المعبود الحق المتفرد، يعلم ما غاب عن حواس الخلق وما يشاهدونه، ذو الرحمة الواسعة التي وسعت كل شيء، والرحمة الخاصة بالمؤمنين.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/059022.mp3",
    juz: 28,
  },
  {
    surahNumber: 65,
    surahNameEnglish: "At-Talaq",
    surahNameArabic: "الطلاق",
    revelationType: "Medinan",
    numberInSurah: 3,
    textArabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا • وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    transliteration: "Wa may-yattaqillāha yaj'al lahū makhrajā, wa yarzuqhu min ḥaythu lā yaḥtasib, wa may-yatawakkal 'alallāhi fahuwa ḥasbuh",
    translation: "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
    translationAmharic: "አላህንም የሚፈራ ሰው ለእርሱ መውጫን (ቀዳዳን) ያደርግለታል፤ ካላሰበውም በኩል ሲሳይን ይሰጠዋል፤ በአላህም ላይ የሚመካ እርሱ በቂው ነው፤",
    tafsirArabic: "من اتقى الله بامتثال أوامره واجتناب نواهيه، جعل له فرجاً ومخرجاً من كل ضيق وكرب، ورزقه من وجوه لا تخطر له على بال، ومن فوض أمره إلى الله كفاه كل ما أهمه.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/065003.mp3",
    juz: 28,
  },
  {
    surahNumber: 67,
    surahNameEnglish: "Al-Mulk",
    surahNameArabic: "الملك",
    revelationType: "Meccan",
    numberInSurah: 1,
    textArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Tabārakalladhī biyadihil-mulku wa Huwa 'alā kulli shay'in qadīr",
    translation: "Blessed is He in whose hand is dominion, and He is over all things competent -",
    translationAmharic: "ያ ንግሥና በእጁ የሆነው አምላክ ክብርና ጥራት ተገባው፤ እርሱም በነገሩ ሁሉ ላይ ቻይ ነው፤",
    tafsirArabic: "تعاظم وثبت خير وبركة الله تعالى، الذي بيده مقاليد السماوات والأرض والخلق والتدبير، وله القدرة المطلقة التي لا يعجزها شيء.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067001.mp3",
    juz: 29,
  },
  {
    surahNumber: 94,
    surahNameEnglish: "Ash-Sharh",
    surahNameArabic: "الشرح",
    revelationType: "Meccan",
    numberInSurah: 5,
    textArabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Fa-inna ma'al-'usri yusrā, inna ma'al-'usri yusrā",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    translationAmharic: "ከችግርም ጋር ምቾት አልለ፤ ከችግር ጋር በእርግጥ ምቾት አልለ፡፡",
    tafsirArabic: "بشارة عظيمة مؤكدة: إن مع كل ضيق وشدة فرجاً وتيسيراً قريباً ملازماً له، ولن يغلب عسر واحد يسرين كريمين.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094005.mp3",
    juz: 30,
  },
  {
    surahNumber: 108,
    surahNameEnglish: "Al-Kawthar",
    surahNameArabic: "الكوثر",
    revelationType: "Meccan",
    numberInSurah: 1,
    textArabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ • فَصَلِّ لِرَبِّكَ وَانْحَرْ • إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    transliteration: "Innā a'ṭaynākal-Kawthar, fa-ṣalli li-Rabbika wanḥar, inna shāni'aka huwal-abtar",
    translation: "Indeed, We have granted you, [O Muhammad], al-Kawthar. So pray to your Lord and sacrifice [to Him alone]. Indeed, your enemy is the one cut off.",
    translationAmharic: "እኛ ብዙን በጎ ነገር (ከውሠርን) ሰጠንህ፤ ስለዚህ ለጌታህ ስገድ፤ (እርድንም) እረድ፤ ጠላህህ እርሱ ዘረ-ቆራጩ (ውርዱ) ነው፡፡",
    tafsirArabic: "بشارة إلهية بإعطاء النبي ﷺ نهر الكوثر والخير العظيم في الدنيا والآخرة، وأمره بإخلاص الصلاة والذبح لله، وأن مبغضه وشانئه هو المنقطع من كل خير وذكر طيب.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/108001.mp3",
    juz: 30,
  },
  {
    surahNumber: 112,
    surahNameEnglish: "Al-Ikhlas",
    surahNameArabic: "الإخلاص",
    revelationType: "Meccan",
    numberInSurah: 1,
    textArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ • اللَّهُ الصَّمَدُ • لَمْ يَلِدْ وَلَمْ يُولَدْ • وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    transliteration: "Qul Huwal-Lāhu Aḥad, Allāhuṣ-Ṣamad, Lam yalid wa lam yūlad, Wa lam yakul-lahū kufuwan aḥad",
    translation: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
    translationAmharic: "በል «እርሱ አላህ አንድ ነው፤ አላህ (የሁሉ) መጠጊያ ነው፤ አልወለደም፤ አልተወለደምም፤ ለእርሱም አንድም ብጤ የለውም፡፡»",
    tafsirArabic: "تقرير جامع لتوحيد الأسماء والصفات: الله هو الواحد الأحد الذي لا شريك له، الصمد المقصود في الحوائج، المنزه عن الولد والوالد ومماثلة المخلوقين.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
    juz: 30,
  },
  {
    surahNumber: 113,
    surahNameEnglish: "Al-Falaq",
    surahNameArabic: "الفلق",
    revelationType: "Meccan",
    numberInSurah: 1,
    textArabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • مِن شَرِّ مَا خَلَقَ • وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    transliteration: "Qul a'ūdhu bi-Rabbil-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab",
    translation: "Say, 'I seek refuge in the Lord of daybreak from the evil of that which He created and from the evil of darkness when it settles...'",
    translationAmharic: "በል «በተፈልቃቂው ጎህ ጌታ እጠበቃለሁ፤ ከፈጠረው ፍጡር ሁሉ ክፋት፤ ከሌሊትም ክፋት ባጨለመ ጊዜ፤»",
    tafsirArabic: "أمر بالاستعاذة برب الصبح وفالقه من شرور جميع المخلوقات، ومن شر الليل إذا أظلم ودخل لانتشار الشياطين والسباع وأهل الشر فيه.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113001.mp3",
    juz: 30,
  },
  {
    surahNumber: 114,
    surahNameEnglish: "An-Nas",
    surahNameArabic: "الناس",
    revelationType: "Meccan",
    numberInSurah: 1,
    textArabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ • مَلِكِ النَّاسِ • إِلَٰهِ النَّاسِ • مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    transliteration: "Qul a'ūdhu bi-Rabbin-nās, Malikin-nās, Ilāhin-nās, min sharril-waswāsil-khannās",
    translation: "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer...'",
    translationAmharic: "በል «በሰዎች ፈጣሪ እጠበቃለሁ፤ የሰዎች ሁሉ ንጉሥ በኾነው፤ የሰዎች አምላክ በኾነው፤ ብቅ እልም ባይ ከኾነው ጎትጓች (ሰይጣን) ክፋት፤»",
    tafsirArabic: "اعتصام بربوبية الله وملكه وإلهيته للبشر جميعاً، من كيد الشيطان الموسوس الذي يلقي الشبهات والشهوات في صدور الناس عند الغفلة، ويخنس عند ذكر الله.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
    juz: 30,
  },
];

/**
 * Generates a randomized list of Ayahs (default 7) with complete quad-lingual
 * texts: Arabic, Amharic translation, English translation, Arabic Tafsir, and Surah metadata.
 */
export async function generateRandomAyahs(
  options: RandomAyahsOptions = {}
): Promise<AyahItem[]> {
  const targetCount = options.count && options.count > 0 ? options.count : 7;
  const { surahFilter, revelationFilter } = options;

  let pool = [...CURATED_RANDOM_AYAH_POOL];

  if (surahFilter && surahFilter > 0) {
    pool = pool.filter((item) => item.surahNumber === surahFilter);
  }

  if (revelationFilter && revelationFilter !== "all") {
    pool = pool.filter((item) => item.revelationType === revelationFilter);
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // If we already have enough from curated pool matching the filter, return targetCount
  if (shuffled.length >= targetCount) {
    return shuffled.slice(0, targetCount).map((item) => {
      const meta = SURAH_LIST.find((s) => s.number === item.surahNumber);
      return {
        ...item,
        surahNameEnglish: meta?.nameEnglish || item.surahNameEnglish,
        surahNameArabic: meta?.nameArabic || item.surahNameArabic,
        revelationType: meta?.revelationType || item.revelationType,
      };
    });
  }

  // If we need more or need dynamic pick from arbitrary surahs, fetch dynamically from remote API
  try {
    const needed = targetCount - shuffled.length;
    const availableSurahs = SURAH_LIST.filter((s) => {
      if (surahFilter && s.number !== surahFilter) return false;
      if (revelationFilter && revelationFilter !== "all" && s.revelationType !== revelationFilter) return false;
      return true;
    });

    const dynamicallyFetched: AyahItem[] = [];
    for (let k = 0; k < needed; k++) {
      const randomSurah = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
      if (!randomSurah) break;

      const randomAyahNumber = Math.floor(Math.random() * randomSurah.totalVerses) + 1;
      const paddedSurah = String(randomSurah.number).padStart(3, "0");
      const paddedAyah = String(randomAyahNumber).padStart(3, "0");

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/${randomSurah.number}:${randomAyahNumber}/editions/quran-uthmani,en.sahih,am.sadiq,ar.muyassar`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const editions = data.data || [];
          const arabicData = editions[0];
          const englishData = editions[1];
          const amharicData = editions[2];
          const tafsirData = editions[3];

          dynamicallyFetched.push({
            surahNumber: randomSurah.number,
            surahNameEnglish: randomSurah.nameEnglish,
            surahNameArabic: randomSurah.nameArabic,
            revelationType: randomSurah.revelationType,
            numberInSurah: randomAyahNumber,
            textArabic: arabicData?.text || `آية من سورة ${randomSurah.nameArabic}`,
            transliteration: `Surah ${randomSurah.nameEnglish}, Ayah ${randomAyahNumber}`,
            translation: englishData?.text || `Ayah ${randomAyahNumber} of ${randomSurah.nameEnglish}`,
            translationAmharic: amharicData?.text || `የሱረቱ ${randomSurah.nameEnglish} አንቀጽ ${randomAyahNumber}`,
            tafsirArabic: tafsirData?.text || "التفسير الميسر لهذه الآية الكريمة من كتاب الله العزيز.",
            audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`,
            juz: arabicData?.juz || 1,
          });
        }
      } catch {
        // dynamic network error, skip and use fallback
      }
    }

    const combined = [...shuffled, ...dynamicallyFetched];
    if (combined.length >= targetCount) {
      return combined.slice(0, targetCount);
    }
  } catch (err) {
    console.warn("Could not dynamically fetch random ayahs, using curated fallback", err);
  }

  // Final fallback: cycle through shuffled pool up to targetCount
  const result: AyahItem[] = [];
  while (result.length < targetCount && shuffled.length > 0) {
    result.push(shuffled[result.length % shuffled.length]);
  }
  return result;
}
