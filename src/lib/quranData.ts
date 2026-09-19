import { AyahItem, SurahMeta, QuranReadingStyle } from "../types";
import { getVariantTextForAyah, getDifferencesForAyah } from "./qiraatData";
import { getSurahHistoricalDetails } from "./surahDetailsData";

const BASE_SURAH_LIST: SurahMeta[] = [
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
  { number: 21, nameArabic: "الأنبياء", nameEnglish: "Al-Anbiya", translationEnglish: "The Prophets", translationAmharic: "ነቢያት", revelationType: "Meccan", totalVerses: 112, juzNumber: 17, audioReciterAlafasy: "021.mp3" },
  { number: 22, nameArabic: "الحج", nameEnglish: "Al-Hajj", translationEnglish: "The Pilgrimage", translationAmharic: "ሐጅ", revelationType: "Medinan", totalVerses: 78, juzNumber: 17, audioReciterAlafasy: "022.mp3" },
  { number: 23, nameArabic: "المؤمنون", nameEnglish: "Al-Mu'minun", translationEnglish: "The Believers", translationAmharic: "አማኞች", revelationType: "Meccan", totalVerses: 118, juzNumber: 18, audioReciterAlafasy: "023.mp3" },
  { number: 24, nameArabic: "النور", nameEnglish: "An-Nur", translationEnglish: "The Light", translationAmharic: "ብርሃን", revelationType: "Medinan", totalVerses: 64, juzNumber: 18, audioReciterAlafasy: "024.mp3" },
  { number: 25, nameArabic: "الفرقان", nameEnglish: "Al-Furqan", translationEnglish: "The Criterion", translationAmharic: "መለያው", revelationType: "Meccan", totalVerses: 77, juzNumber: 18, audioReciterAlafasy: "025.mp3" },
  { number: 26, nameArabic: "الشعراء", nameEnglish: "Ash-Shu'ara", translationEnglish: "The Poets", translationAmharic: "ገጣሚዎች", revelationType: "Meccan", totalVerses: 227, juzNumber: 19, audioReciterAlafasy: "026.mp3" },
  { number: 27, nameArabic: "النمل", nameEnglish: "An-Naml", translationEnglish: "The Ant", translationAmharic: "ጉንዳን", revelationType: "Meccan", totalVerses: 93, juzNumber: 19, audioReciterAlafasy: "027.mp3" },
  { number: 28, nameArabic: "القصص", nameEnglish: "Al-Qasas", translationEnglish: "The Stories", translationAmharic: "ታሪኮች", revelationType: "Meccan", totalVerses: 88, juzNumber: 20, audioReciterAlafasy: "028.mp3" },
  { number: 29, nameArabic: "العنكبوت", nameEnglish: "Al-'Ankabut", translationEnglish: "The Spider", translationAmharic: "ሸረሪት", revelationType: "Meccan", totalVerses: 69, juzNumber: 20, audioReciterAlafasy: "029.mp3" },
  { number: 30, nameArabic: "الروم", nameEnglish: "Ar-Rum", translationEnglish: "The Romans", translationAmharic: "ሮማውያን", revelationType: "Meccan", totalVerses: 60, juzNumber: 21, audioReciterAlafasy: "030.mp3" },
  { number: 31, nameArabic: "لقمان", nameEnglish: "Luqman", translationEnglish: "Luqman", translationAmharic: "ሉቅማን", revelationType: "Meccan", totalVerses: 34, juzNumber: 21, audioReciterAlafasy: "031.mp3" },
  { number: 32, nameArabic: "السجدة", nameEnglish: "As-Sajdah", translationEnglish: "The Prostration", translationAmharic: "ስግደት", revelationType: "Meccan", totalVerses: 30, juzNumber: 21, audioReciterAlafasy: "032.mp3" },
  { number: 33, nameArabic: "الأحزاب", nameEnglish: "Al-Ahzab", translationEnglish: "The Combined Forces", translationAmharic: "ጥምር ኃይሎች (አህዛብ)", revelationType: "Medinan", totalVerses: 73, juzNumber: 21, audioReciterAlafasy: "033.mp3" },
  { number: 34, nameArabic: "سبإ", nameEnglish: "Saba", translationEnglish: "Sheba", translationAmharic: "ሰበዕ", revelationType: "Meccan", totalVerses: 54, juzNumber: 22, audioReciterAlafasy: "034.mp3" },
  { number: 35, nameArabic: "فاطر", nameEnglish: "Fatir", translationEnglish: "The Originator", translationAmharic: "ፈጣሪ", revelationType: "Meccan", totalVerses: 45, juzNumber: 22, audioReciterAlafasy: "035.mp3" },
  { number: 36, nameArabic: "يس", nameEnglish: "Ya-Sin", translationEnglish: "Ya-Sin", translationAmharic: "ያ-ሲን", revelationType: "Meccan", totalVerses: 83, juzNumber: 22, audioReciterAlafasy: "036.mp3" },
  { number: 37, nameArabic: "الصافات", nameEnglish: "As-Saffat", translationEnglish: "Those Ranks", translationAmharic: "ተሰላፊዎች", revelationType: "Meccan", totalVerses: 182, juzNumber: 23, audioReciterAlafasy: "037.mp3" },
  { number: 38, nameArabic: "ص", nameEnglish: "Sad", translationEnglish: "Sad", translationAmharic: "ሷድ", revelationType: "Meccan", totalVerses: 88, juzNumber: 23, audioReciterAlafasy: "038.mp3" },
  { number: 39, nameArabic: "الزمر", nameEnglish: "Az-Zumar", translationEnglish: "The Troops", translationAmharic: "ጭፍሮች", revelationType: "Meccan", totalVerses: 75, juzNumber: 23, audioReciterAlafasy: "039.mp3" },
  { number: 40, nameArabic: "غافر", nameEnglish: "Ghafir", translationEnglish: "The Forgiver", translationAmharic: "ይቅር ባይ", revelationType: "Meccan", totalVerses: 85, juzNumber: 24, audioReciterAlafasy: "040.mp3" },
  { number: 41, nameArabic: "فصلت", nameEnglish: "Fussilat", translationEnglish: "Explained in Detail", translationAmharic: "የተብራሩት", revelationType: "Meccan", totalVerses: 54, juzNumber: 24, audioReciterAlafasy: "041.mp3" },
  { number: 42, nameArabic: "الشورى", nameEnglish: "Ash-Shura", translationEnglish: "Consultation", translationAmharic: "ምክክር", revelationType: "Meccan", totalVerses: 53, juzNumber: 25, audioReciterAlafasy: "042.mp3" },
  { number: 43, nameArabic: "الزخرف", nameEnglish: "Az-Zukhruf", translationEnglish: "Ornaments of Gold", translationAmharic: "ጌጦች", revelationType: "Meccan", totalVerses: 89, juzNumber: 25, audioReciterAlafasy: "043.mp3" },
  { number: 44, nameArabic: "الدخان", nameEnglish: "Ad-Dukhan", translationEnglish: "The Smoke", translationAmharic: "ጢስ", revelationType: "Meccan", totalVerses: 59, juzNumber: 25, audioReciterAlafasy: "044.mp3" },
  { number: 45, nameArabic: "الجاثية", nameEnglish: "Al-Jathiyah", translationEnglish: "The Crouching", translationAmharic: "ተንበርካኪዋ", revelationType: "Meccan", totalVerses: 37, juzNumber: 25, audioReciterAlafasy: "045.mp3" },
  { number: 46, nameArabic: "الأحقاف", nameEnglish: "Al-Ahqaf", translationEnglish: "The Dunes", translationAmharic: "አሸዋማ ኮረብቶች", revelationType: "Meccan", totalVerses: 35, juzNumber: 26, audioReciterAlafasy: "046.mp3" },
  { number: 47, nameArabic: "محمد", nameEnglish: "Muhammad", translationEnglish: "Muhammad", translationAmharic: "ሙሐመድ", revelationType: "Medinan", totalVerses: 38, juzNumber: 26, audioReciterAlafasy: "047.mp3" },
  { number: 48, nameArabic: "الفتح", nameEnglish: "Al-Fath", translationEnglish: "The Victory", translationAmharic: "ድል", revelationType: "Medinan", totalVerses: 29, juzNumber: 26, audioReciterAlafasy: "048.mp3" },
  { number: 49, nameArabic: "الحجرات", nameEnglish: "Al-Hujurat", translationEnglish: "The Inner Rooms", translationAmharic: "ክፍሎች", revelationType: "Medinan", totalVerses: 18, juzNumber: 26, audioReciterAlafasy: "049.mp3" },
  { number: 50, nameArabic: "ق", nameEnglish: "Qaf", translationEnglish: "Qaf", translationAmharic: "ቃፍ", revelationType: "Meccan", totalVerses: 45, juzNumber: 26, audioReciterAlafasy: "050.mp3" },
  { number: 51, nameArabic: "الذاريات", nameEnglish: "Adh-Dhariyat", translationEnglish: "The Winnowing Winds", translationAmharic: "በታኞቹ", revelationType: "Meccan", totalVerses: 60, juzNumber: 26, audioReciterAlafasy: "051.mp3" },
  { number: 52, nameArabic: "الطور", nameEnglish: "At-Tur", translationEnglish: "The Mount", translationAmharic: "ጧሳ ተራራ", revelationType: "Meccan", totalVerses: 49, juzNumber: 27, audioReciterAlafasy: "052.mp3" },
  { number: 53, nameArabic: "النجم", nameEnglish: "An-Najm", translationEnglish: "The Star", translationAmharic: "ኮከብ", revelationType: "Meccan", totalVerses: 62, juzNumber: 27, audioReciterAlafasy: "053.mp3" },
  { number: 54, nameArabic: "القمر", nameEnglish: "Al-Qamar", translationEnglish: "The Moon", translationAmharic: "ጨረቃ", revelationType: "Meccan", totalVerses: 55, juzNumber: 27, audioReciterAlafasy: "054.mp3" },
  { number: 55, nameArabic: "الرحمن", nameEnglish: "Ar-Rahman", translationEnglish: "The Beneficent", translationAmharic: "እጅግ በጣም ሩኅሩህ", revelationType: "Medinan", totalVerses: 78, juzNumber: 27, audioReciterAlafasy: "055.mp3" },
  { number: 56, nameArabic: "الواقعة", nameEnglish: "Al-Waqi'ah", translationEnglish: "The Inevitable", translationAmharic: "ክስተቷ (ትንሣኤ)", revelationType: "Meccan", totalVerses: 96, juzNumber: 27, audioReciterAlafasy: "056.mp3" },
  { number: 57, nameArabic: "الحديد", nameEnglish: "Al-Hadid", translationEnglish: "The Iron", translationAmharic: "ብረት", revelationType: "Medinan", totalVerses: 29, juzNumber: 27, audioReciterAlafasy: "057.mp3" },
  { number: 58, nameArabic: "المجادلة", nameEnglish: "Al-Mujadila", translationEnglish: "The Pleading Woman", translationAmharic: "ተከራካሪዋ", revelationType: "Medinan", totalVerses: 22, juzNumber: 28, audioReciterAlafasy: "058.mp3" },
  { number: 59, nameArabic: "الحشر", nameEnglish: "Al-Hashr", translationEnglish: "The Exile", translationAmharic: "መሰብሰብ", revelationType: "Medinan", totalVerses: 24, juzNumber: 28, audioReciterAlafasy: "059.mp3" },
  { number: 60, nameArabic: "الممتحنة", nameEnglish: "Al-Mumtahanah", translationEnglish: "The Examined One", translationAmharic: "ተፈታኟ", revelationType: "Medinan", totalVerses: 13, juzNumber: 28, audioReciterAlafasy: "060.mp3" },
  { number: 61, nameArabic: "الصف", nameEnglish: "As-Saff", translationEnglish: "The Ranks", translationAmharic: "ሰልፍ", revelationType: "Medinan", totalVerses: 14, juzNumber: 28, audioReciterAlafasy: "061.mp3" },
  { number: 62, nameArabic: "الجمعة", nameEnglish: "Al-Jumu'ah", translationEnglish: "Friday", translationAmharic: "ጁምዓ", revelationType: "Medinan", totalVerses: 11, juzNumber: 28, audioReciterAlafasy: "062.mp3" },
  { number: 63, nameArabic: "المنافقون", nameEnglish: "Al-Munafiqun", translationEnglish: "The Hypocrites", translationAmharic: "መናፍቃን", revelationType: "Medinan", totalVerses: 11, juzNumber: 28, audioReciterAlafasy: "063.mp3" },
  { number: 64, nameArabic: "التغابن", nameEnglish: "At-Taghabun", translationEnglish: "Mutual Disillusion", translationAmharic: "መካሰርና መካስ", revelationType: "Medinan", totalVerses: 18, juzNumber: 28, audioReciterAlafasy: "064.mp3" },
  { number: 65, nameArabic: "الطلاق", nameEnglish: "At-Talaq", translationEnglish: "The Divorce", translationAmharic: "ፍቺ", revelationType: "Medinan", totalVerses: 12, juzNumber: 28, audioReciterAlafasy: "065.mp3" },
  { number: 66, nameArabic: "التحريم", nameEnglish: "At-Tahrim", translationEnglish: "The Prohibition", translationAmharic: "ክልከላ", revelationType: "Medinan", totalVerses: 12, juzNumber: 28, audioReciterAlafasy: "066.mp3" },
  { number: 67, nameArabic: "الملك", nameEnglish: "Al-Mulk", translationEnglish: "The Sovereignty", translationAmharic: "ንግሥና", revelationType: "Meccan", totalVerses: 30, juzNumber: 29, audioReciterAlafasy: "067.mp3" },
  { number: 68, nameArabic: "القلم", nameEnglish: "Al-Qalam", translationEnglish: "The Pen", translationAmharic: "ብዕር", revelationType: "Meccan", totalVerses: 52, juzNumber: 29, audioReciterAlafasy: "068.mp3" },
  { number: 69, nameArabic: "الحاقة", nameEnglish: "Al-Haqqah", translationEnglish: "The Sure Reality", translationAmharic: "አረጋጋጩ ክስተት", revelationType: "Meccan", totalVerses: 52, juzNumber: 29, audioReciterAlafasy: "069.mp3" },
  { number: 70, nameArabic: "المعارج", nameEnglish: "Al-Ma'arij", translationEnglish: "Ascending Stairways", translationAmharic: "የመወጣጫ መንገዶች", revelationType: "Meccan", totalVerses: 44, juzNumber: 29, audioReciterAlafasy: "070.mp3" },
  { number: 71, nameArabic: "نوح", nameEnglish: "Nuh", translationEnglish: "Noah", translationAmharic: "ኑሕ", revelationType: "Meccan", totalVerses: 28, juzNumber: 29, audioReciterAlafasy: "071.mp3" },
  { number: 72, nameArabic: "الجن", nameEnglish: "Al-Jinn", translationEnglish: "The Jinn", translationAmharic: "ጂን", revelationType: "Meccan", totalVerses: 28, juzNumber: 29, audioReciterAlafasy: "072.mp3" },
  { number: 73, nameArabic: "المزمل", nameEnglish: "Al-Muzzammil", translationEnglish: "The Enshrouded One", translationAmharic: "ተጠቅላዩ", revelationType: "Meccan", totalVerses: 20, juzNumber: 29, audioReciterAlafasy: "073.mp3" },
  { number: 74, nameArabic: "المدثر", nameEnglish: "Al-Muddaththir", translationEnglish: "The Cloaked One", translationAmharic: "ደራቢው", revelationType: "Meccan", totalVerses: 56, juzNumber: 29, audioReciterAlafasy: "074.mp3" },
  { number: 75, nameArabic: "القيامة", nameEnglish: "Al-Qiyamah", translationEnglish: "The Resurrection", translationAmharic: "ትንሣኤ", revelationType: "Meccan", totalVerses: 40, juzNumber: 29, audioReciterAlafasy: "075.mp3" },
  { number: 76, nameArabic: "الإنسان", nameEnglish: "Al-Insan", translationEnglish: "Man", translationAmharic: "የሰው ልጅ", revelationType: "Medinan", totalVerses: 31, juzNumber: 29, audioReciterAlafasy: "076.mp3" },
  { number: 77, nameArabic: "المرسلات", nameEnglish: "Al-Mursalat", translationEnglish: "The Emissaries", translationAmharic: "ተላላኪዎች", revelationType: "Meccan", totalVerses: 50, juzNumber: 29, audioReciterAlafasy: "077.mp3" },
  { number: 78, nameArabic: "النبأ", nameEnglish: "An-Naba", translationEnglish: "The Tidings", translationAmharic: "ታላቁ ዜና", revelationType: "Meccan", totalVerses: 40, juzNumber: 30, audioReciterAlafasy: "078.mp3" },
  { number: 79, nameArabic: "النازعات", nameEnglish: "An-Nazi'at", translationEnglish: "Those Who Drag Forth", translationAmharic: "ነቃዮቹ", revelationType: "Meccan", totalVerses: 46, juzNumber: 30, audioReciterAlafasy: "079.mp3" },
  { number: 80, nameArabic: "عبس", nameEnglish: "'Abasa", translationEnglish: "He Frowned", translationAmharic: "ፊቱን አጨፈገገ", revelationType: "Meccan", totalVerses: 42, juzNumber: 30, audioReciterAlafasy: "080.mp3" },
  { number: 81, nameArabic: "التكوير", nameEnglish: "At-Takwir", translationEnglish: "The Overthrowing", translationAmharic: "መጠቅለል", revelationType: "Meccan", totalVerses: 29, juzNumber: 30, audioReciterAlafasy: "081.mp3" },
  { number: 82, nameArabic: "الانفطار", nameEnglish: "Al-Infitar", translationEnglish: "The Cleaving", translationAmharic: "መሰንጠቅ", revelationType: "Meccan", totalVerses: 19, juzNumber: 30, audioReciterAlafasy: "082.mp3" },
  { number: 83, nameArabic: "المطففين", nameEnglish: "Al-Mutaffifin", translationEnglish: "Defrauding", translationAmharic: "አጉዳዮች", revelationType: "Meccan", totalVerses: 36, juzNumber: 30, audioReciterAlafasy: "083.mp3" },
  { number: 84, nameArabic: "الانشقاق", nameEnglish: "Al-Inshiqaq", translationEnglish: "The Splitting", translationAmharic: "መተርተር", revelationType: "Meccan", totalVerses: 25, juzNumber: 30, audioReciterAlafasy: "084.mp3" },
  { number: 85, nameArabic: "البروج", nameEnglish: "Al-Buruj", translationEnglish: "The Mansions of Stars", translationAmharic: "ህብረ-ከዋክብት", revelationType: "Meccan", totalVerses: 22, juzNumber: 30, audioReciterAlafasy: "085.mp3" },
  { number: 86, nameArabic: "الطارق", nameEnglish: "At-Tariq", translationEnglish: "The Night-Comer", translationAmharic: "የምሽቱ ኮከብ", revelationType: "Meccan", totalVerses: 17, juzNumber: 30, audioReciterAlafasy: "086.mp3" },
  { number: 87, nameArabic: "الأعلى", nameEnglish: "Al-A'la", translationEnglish: "The Most High", translationAmharic: "ከሁሉ በላይ የሆነው", revelationType: "Meccan", totalVerses: 19, juzNumber: 30, audioReciterAlafasy: "087.mp3" },
  { number: 88, nameArabic: "الغاشية", nameEnglish: "Al-Ghashiyah", translationEnglish: "The Overwhelming", translationAmharic: "ሸፋኟ ክስተት", revelationType: "Meccan", totalVerses: 26, juzNumber: 30, audioReciterAlafasy: "088.mp3" },
  { number: 89, nameArabic: "الفجر", nameEnglish: "Al-Fajr", translationEnglish: "The Dawn", translationAmharic: "ጎህ", revelationType: "Meccan", totalVerses: 30, juzNumber: 30, audioReciterAlafasy: "089.mp3" },
  { number: 90, nameArabic: "البلد", nameEnglish: "Al-Balad", translationEnglish: "The City", translationAmharic: "ሀገሪቱ", revelationType: "Meccan", totalVerses: 20, juzNumber: 30, audioReciterAlafasy: "090.mp3" },
  { number: 91, nameArabic: "الشمس", nameEnglish: "Ash-Shams", translationEnglish: "The Sun", translationAmharic: "ፀሐይ", revelationType: "Meccan", totalVerses: 15, juzNumber: 30, audioReciterAlafasy: "091.mp3" },
  { number: 92, nameArabic: "الليل", nameEnglish: "Al-Layl", translationEnglish: "The Night", translationAmharic: "ሌሊት", revelationType: "Meccan", totalVerses: 21, juzNumber: 30, audioReciterAlafasy: "092.mp3" },
  { number: 93, nameArabic: "الضحى", nameEnglish: "Ad-Duha", translationEnglish: "The Morning Hours", translationAmharic: "ረፋዱ", revelationType: "Meccan", totalVerses: 11, juzNumber: 30, audioReciterAlafasy: "093.mp3" },
  { number: 94, nameArabic: "الشرح", nameEnglish: "Ash-Sharh", translationEnglish: "The Relief", translationAmharic: "ማስፋፋት", revelationType: "Meccan", totalVerses: 8, juzNumber: 30, audioReciterAlafasy: "094.mp3" },
  { number: 95, nameArabic: "التين", nameEnglish: "At-Tin", translationEnglish: "The Fig", translationAmharic: "በለስ", revelationType: "Meccan", totalVerses: 8, juzNumber: 30, audioReciterAlafasy: "095.mp3" },
  { number: 96, nameArabic: "العلق", nameEnglish: "Al-'Alaq", translationEnglish: "The Clot", translationAmharic: "የረጋ ደም", revelationType: "Meccan", totalVerses: 19, juzNumber: 30, audioReciterAlafasy: "096.mp3" },
  { number: 97, nameArabic: "القدر", nameEnglish: "Al-Qadr", translationEnglish: "The Power", translationAmharic: "ወሰን (ክብር)", revelationType: "Meccan", totalVerses: 5, juzNumber: 30, audioReciterAlafasy: "097.mp3" },
  { number: 98, nameArabic: "البينة", nameEnglish: "Al-Bayyinah", translationEnglish: "The Clear Proof", translationAmharic: "ግልጽ ማስረጃ", revelationType: "Medinan", totalVerses: 8, juzNumber: 30, audioReciterAlafasy: "098.mp3" },
  { number: 99, nameArabic: "الزلزلة", nameEnglish: "Az-Zalzalah", translationEnglish: "The Earthquake", translationAmharic: "የመሬት መንቀጥቀጥ", revelationType: "Medinan", totalVerses: 8, juzNumber: 30, audioReciterAlafasy: "099.mp3" },
  { number: 100, nameArabic: "العاديات", nameEnglish: "Al-'Adiyat", translationEnglish: "The Courser", translationAmharic: "ፈጣን ፈረሶች", revelationType: "Meccan", totalVerses: 11, juzNumber: 30, audioReciterAlafasy: "100.mp3" },
  { number: 101, nameArabic: "القارعة", nameEnglish: "Al-Qari'ah", translationEnglish: "The Calamity", translationAmharic: "መዓት", revelationType: "Meccan", totalVerses: 11, juzNumber: 30, audioReciterAlafasy: "101.mp3" },
  { number: 102, nameArabic: "التكاثر", nameEnglish: "At-Takathur", translationEnglish: "The Rivalry in World Increase", translationAmharic: "መብዛት ፉክክር", revelationType: "Meccan", totalVerses: 8, juzNumber: 30, audioReciterAlafasy: "102.mp3" },
  { number: 103, nameArabic: "العصر", nameEnglish: "Al-'Asr", translationEnglish: "The Declining Day", translationAmharic: "ጊዜ", revelationType: "Meccan", totalVerses: 3, juzNumber: 30, audioReciterAlafasy: "103.mp3" },
  { number: 104, nameArabic: "الهمزة", nameEnglish: "Al-Humazah", translationEnglish: "The Traducer", translationAmharic: "ሐሜተኛ", revelationType: "Meccan", totalVerses: 9, juzNumber: 30, audioReciterAlafasy: "104.mp3" },
  { number: 105, nameArabic: "الفيل", nameEnglish: "Al-Fil", translationEnglish: "The Elephant", translationAmharic: "ዝሆን", revelationType: "Meccan", totalVerses: 5, juzNumber: 30, audioReciterAlafasy: "105.mp3" },
  { number: 106, nameArabic: "قريش", nameEnglish: "Quraysh", translationEnglish: "Quraysh", translationAmharic: "ቁረይሽ", revelationType: "Meccan", totalVerses: 4, juzNumber: 30, audioReciterAlafasy: "106.mp3" },
  { number: 107, nameArabic: "الماعون", nameEnglish: "Al-Ma'un", translationEnglish: "Small Kindnesses", translationAmharic: "ትናንሽ ረዳቶች", revelationType: "Meccan", totalVerses: 7, juzNumber: 30, audioReciterAlafasy: "107.mp3" },
  { number: 108, nameArabic: "الكوثر", nameEnglish: "Al-Kawthar", translationEnglish: "Abundance", translationAmharic: "ብዙ በጎ ነገር", revelationType: "Meccan", totalVerses: 3, juzNumber: 30, audioReciterAlafasy: "108.mp3" },
  { number: 109, nameArabic: "الكافرون", nameEnglish: "Al-Kafirun", translationEnglish: "The Disbelievers", translationAmharic: "ከሓዲዎች", revelationType: "Meccan", totalVerses: 6, juzNumber: 30, audioReciterAlafasy: "109.mp3" },
  { number: 110, nameArabic: "النصر", nameEnglish: "An-Nasr", translationEnglish: "Divine Support", translationAmharic: "እርዳታ", revelationType: "Medinan", totalVerses: 3, juzNumber: 30, audioReciterAlafasy: "110.mp3" },
  { number: 111, nameArabic: "المسد", nameEnglish: "Al-Masad", translationEnglish: "The Palm Fiber", translationAmharic: "የዘንባባ ገመድ", revelationType: "Meccan", totalVerses: 5, juzNumber: 30, audioReciterAlafasy: "111.mp3" },
  { number: 112, nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlas", translationEnglish: "The Sincerity", translationAmharic: "ማጥራት (ቅንነት)", revelationType: "Meccan", totalVerses: 4, juzNumber: 30, audioReciterAlafasy: "112.mp3" },
  { number: 113, nameArabic: "الفلق", nameEnglish: "Al-Falaq", translationEnglish: "The Daybreak", translationAmharic: "የማለዳው ብርሃን", revelationType: "Meccan", totalVerses: 5, juzNumber: 30, audioReciterAlafasy: "113.mp3" },
  { number: 114, nameArabic: "الناس", nameEnglish: "An-Nas", translationEnglish: "Mankind", translationAmharic: "የሰው ልጆች", revelationType: "Meccan", totalVerses: 6, juzNumber: 30, audioReciterAlafasy: "114.mp3" },
];

export const SURAH_LIST: SurahMeta[] = BASE_SURAH_LIST.map((s) => ({
  ...s,
  historicalDetails: getSurahHistoricalDetails(
    s.number,
    s.nameEnglish,
    s.nameArabic,
    s.revelationType,
    s.totalVerses
  ),
}));

export const CURATED_SURAHS: Record<number, AyahItem[]> = {
  // Surah 1: Al-Fatihah
  1: [
    {
      numberInSurah: 1,
      textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillāhir-Raḥmānir-Raḥīm",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      translationAmharic: "በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በኾነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      juz: 1,
    },
    {
      numberInSurah: 2,
      textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      transliteration: "Al-ḥamdu lillāhi Rabbil-'ālamīn",
      translation: "[All] praise is [due] to Allah, Lord of the worlds -",
      translationAmharic: "ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለኾነው፤",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
      juz: 1,
    },
    {
      numberInSurah: 3,
      textArabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Ar-Raḥmānir-Raḥīm",
      translation: "The Entirely Merciful, the Especially Merciful,",
      translationAmharic: "እጅግ በጣም ርኅሩህ በጣም አዛኝ",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
      juz: 1,
    },
    {
      numberInSurah: 4,
      textArabic: "مَالِكِ يَوْمِ الدِّينِ",
      transliteration: "Māliki Yawmid-Dīn",
      translation: "Sovereign of the Day of Recompense.",
      translationAmharic: "የፍርዱ ቀን ባለቤት ለኾነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001004.mp3",
      juz: 1,
    },
    {
      numberInSurah: 5,
      textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      transliteration: "Iyyāka na'budu wa iyyāka nasta'īn",
      translation: "It is You we worship and You we ask for help.",
      translationAmharic: "አንተን ብቻ እንግገዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
      juz: 1,
    },
    {
      numberInSurah: 6,
      textArabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      transliteration: "Ihdinaṣ-ṣirāṭal-mustaqīm",
      translation: "Guide us to the straight path -",
      translationAmharic: "ቀጥተኛውን መንገድ ምራን፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001006.mp3",
      juz: 1,
    },
    {
      numberInSurah: 7,
      textArabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      transliteration: "Ṣirāṭalladhīna an'amta 'alayhim ghayril-maghḍūbi 'alayhim walāḍ-ḍāllīn",
      translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
      translationAmharic: "የእነዚያን በነርሱ ላይ በጎ የዋልክላቸውን በነሱ ላይ ያልተቆጣህባቸውንና ያልተሳሳቱትንም ሰዎች መንገድ (ምራን፤ በሉ)፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001007.mp3",
      juz: 1,
    },
  ],

  // Surah 112: Al-Ikhlas
  112: [
    {
      numberInSurah: 1,
      textArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      transliteration: "Qul Huwal-Lāhu Aḥad",
      translation: "Say, 'He is Allah, [who is] One,",
      translationAmharic: "በል «እርሱ አላህ አንድ ነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      textArabic: "اللَّهُ الصَّمَدُ",
      transliteration: "Allāhuṣ-Ṣamad",
      translation: "Allah, the Eternal Refuge.",
      translationAmharic: "«አላህ (የሁሉ) መጠጊያ ነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      textArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      transliteration: "Lam yalid wa lam yūlad",
      translation: "He neither begets nor is born,",
      translationAmharic: "«አልወለደም፤ አልተወለደምም፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      textArabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
      transliteration: "Wa lam yakul-lahū kufuwan aḥad",
      translation: "Nor is there to Him any equivalent.'",
      translationAmharic: "«ለእርሱም አንድም ብጤ የለውም፡፡»",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112004.mp3",
      juz: 30,
    },
  ],

  // Surah 113: Al-Falaq
  113: [
    {
      numberInSurah: 1,
      textArabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      transliteration: "Qul a'ūdhu bi-Rabbil-falaq",
      translation: "Say, 'I seek refuge in the Lord of daybreak",
      translationAmharic: "በል «በተፈልቃቂው ጎህ ጌታ እጠበቃለሁ፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      textArabic: "مِن شَرِّ مَا خَلَقَ",
      transliteration: "Min sharri mā khalaq",
      translation: "From the evil of that which He created",
      translationAmharic: "«ከፈጠረው ፍጡር ሁሉ ክፋት፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      textArabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      transliteration: "Wa min sharri ghāsiqin idhā waqab",
      translation: "And from the evil of darkness when it settles",
      translationAmharic: "«ከሌሊትም ክፋት ባጨለመ ጊዜ፤",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      textArabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      transliteration: "Wa min sharrin-naffāthāti fil-'uqad",
      translation: "And from the evil of the blowers in knots",
      translationAmharic: "«በተቋጠሩ (ክሮች) ላይ ተፊዎች ከኾኑት (ደጋሚ) ሴቶችም ክፋት፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113004.mp3",
      juz: 30,
    },
    {
      numberInSurah: 5,
      textArabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      transliteration: "Wa min sharri ḥāsidin idhā ḥasad",
      translation: "And from the evil of an envier when he envies.'",
      translationAmharic: "«ከምቀኛም ክፋት በተመቀኘ ጊዜ፤ (እጠበቃለሁ በል)፡፡»",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113005.mp3",
      juz: 30,
    },
  ],

  // Surah 114: An-Nas
  114: [
    {
      numberInSurah: 1,
      textArabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      transliteration: "Qul a'ūdhu bi-Rabbin-nās",
      translation: "Say, 'I seek refuge in the Lord of mankind,",
      translationAmharic: "በል «በሰዎች ፈጣሪ እጠበቃለሁ፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      textArabic: "مَلِكِ النَّاسِ",
      transliteration: "Malikin-nās",
      translation: "The Sovereign of mankind,",
      translationAmharic: "«የሰዎች ሁሉ ንጉሥ በኾነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      textArabic: "إِلَٰهِ النَّاسِ",
      transliteration: "Ilāhin-nās",
      translation: "The God of mankind,",
      translationAmharic: "«የሰዎች አምላክ በኾነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      textArabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      transliteration: "Min sharril-waswāsil-khannās",
      translation: "From the evil of the retreating whisperer -",
      translationAmharic: "«ብቅ እልም ባይ ከኾነው ጎትጓች (ሰይጣን) ክፋት፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114004.mp3",
      juz: 30,
    },
    {
      numberInSurah: 5,
      textArabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      transliteration: "Alladhī yuwaswisu fī ṣudūrin-nās",
      translation: "Who whispers into the breasts of mankind -",
      translationAmharic: "«ከዚያ በሰዎች ልቦች ውስጥ የሚጎተጉት ከኾነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114005.mp3",
      juz: 30,
    },
    {
      numberInSurah: 6,
      textArabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
      transliteration: "Minal-jinnati wan-nās",
      translation: "From among the jinn and mankind.'",
      translationAmharic: "«ከጋኔኖችም ከሰዎችም (ሰይጣናት እጠበቃለሁ በል)፡፡»",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114006.mp3",
      juz: 30,
    },
  ],

  // Surah 67: Al-Mulk (First 5 ayahs)
  67: [
    {
      numberInSurah: 1,
      textArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "Tabārakalladhī biyadihil-mulku wa Huwa 'alā kulli shay'in Qadīr",
      translation: "Blessed is He in whose hand is dominion, and He is over all things competent -",
      translationAmharic: "ያ ንግሥና በእጁ የኾነው አምላክ ችሮታው በዛ፡፡ እርሱም በነገሩ ሁሉ ላይ ቻይ ነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067001.mp3",
      juz: 29,
    },
    {
      numberInSurah: 2,
      textArabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
      transliteration: "Alladhī khalaqal-mawta wal-ḥayāta liyabluwakum ayyukum aḥsanu 'amalā; wa Huwal-'Azīzul-Ghafūr",
      translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
      translationAmharic: "ያ የትኛችሁ ሥራው ይበልጥ ያማረ መኾኑን ሊሞክራችሁ ሞትንና ሕይወትን የፈጠረ ነው፡፡ እርሱም አሸናፊው መሓሪው ነው፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067002.mp3",
      juz: 29,
    },
    {
      numberInSurah: 3,
      textArabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
      transliteration: "Alladhī khalaqa sab'a samāwātin ṭibāqā; mā tarā fī khalqir-Raḥmāni min tafāwutin farji'il-baṣara hal tarā min fuṭūr",
      translation: "[And] who created seven heavens in layers. You see no flaw in the creation of the Most Merciful. So return [your] vision; do you see any breaks?",
      translationAmharic: "ያ ሰባትን ሰማያት የተነባበሩ ኾነው የፈጠረ ነው፡፡ በአልረሕማን አፈጣጠር ውስጥ ምንም መዛነፍን አታይም፡፡ ዓይንህንም መልስ፡፡ «ከስንጥቆች አንዳችን ታያለህን?»",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067003.mp3",
      juz: 29,
    },
  ],

  // Surah 93: Ad-Duha
  93: [
    {
      numberInSurah: 1,
      textArabic: "وَالضُّحَىٰ",
      transliteration: "Waḍ-ḍuḥā",
      translation: "By the morning sunlight,",
      translationAmharic: "በረፋዱ እምላለሁ፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/093001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      textArabic: "وَاللَّيْلِ إِذَا سَجَىٰ",
      transliteration: "Wal-layli idhā sajā",
      translation: "And by the night when it covers with darkness,",
      translationAmharic: "በሌሊቱም ጸጥ ባለ ጊዜ፤",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/093002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      textArabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
      transliteration: "Mā wadda'aka Rabbuka wa mā qalā",
      translation: "Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you].",
      translationAmharic: "ጌታህ አላሰናበተህም፤ አልጠላህምም፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/093003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      textArabic: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ",
      transliteration: "Wa lal-ākhiratu khayrul-laka minal-ūlā",
      translation: "And the Hereafter is better for you than the first [life].",
      translationAmharic: "መጨረሻይቱም (ዓለም) ከመጀመሪያይቱ ይልቅ ላንተ በላጭ ናት፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/093004.mp3",
      juz: 30,
    },
    {
      numberInSurah: 5,
      textArabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
      transliteration: "Wa lasawfa yu'ṭīka Rabbuka fatarḍā",
      translation: "And your Lord is going to give you, and you will be satisfied.",
      translationAmharic: "ጌታህም ወደ ፊት (ብዙን ስጦታ) በእርግጥ ይሰጥሃል፡፡ ትደሰታለህም፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/093005.mp3",
      juz: 30,
    },
  ],

  // Surah 94: Ash-Sharh
  94: [
    {
      numberInSurah: 1,
      textArabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
      transliteration: "Alam nashraḥ laka ṣadrak",
      translation: "Did We not expand for you, [O Muhammad], your breast?",
      translationAmharic: "ልብህን ለአንተ አላሰፋንልህምን? (አስፍተንልሃል)፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      textArabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ",
      transliteration: "Wa waḍa'nā 'anka wizrak",
      translation: "And We removed from you your burden",
      translationAmharic: "ሸክምህንም ካንተ አውርደንልሃል፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      textArabic: "الَّذِي أَنقَضَ ظَهْرَكَ",
      transliteration: "Alladhī anqaḍa ẓahrak",
      translation: "Which had weighed upon your back",
      translationAmharic: "ያንን ጀርባህን ያከበደውን (ሸክም)፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      textArabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ",
      transliteration: "Wa rafa'nā laka dhikrak",
      translation: "And raised high for you your repute.",
      translationAmharic: "መወሳትህንም ላንተ ከፍ አድርገንልሃል፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094004.mp3",
      juz: 30,
    },
    {
      numberInSurah: 5,
      textArabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      transliteration: "Fa inna ma'al-'usri yusrā",
      translation: "For indeed, with hardship [will be] ease.",
      translationAmharic: "ከችግርም ጋር ምቾት አልለ፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094005.mp3",
      juz: 30,
    },
    {
      numberInSurah: 6,
      textArabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      transliteration: "Inna ma'al-'usri yusrā",
      translation: "Indeed, with hardship [will be] ease.",
      translationAmharic: "ከችግር ጋር በእርግጥ ምቾት አልለ፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094006.mp3",
      juz: 30,
    },
    {
      numberInSurah: 7,
      textArabic: "فَإِذَا فَرَغْتَ فَانصَبْ",
      transliteration: "Fa idhā faraghta fanṣab",
      translation: "So when you have finished [your duties], then stand up [for worship].",
      translationAmharic: "በጨረስክም ጊዜ ልፋ፡፡ (ቀጥል)፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094007.mp3",
      juz: 30,
    },
    {
      numberInSurah: 8,
      textArabic: "وَإِلَىٰ رَبِّكَ فَارْغَب",
      transliteration: "Wa ilā Rabbika farghab",
      translation: "And to your Lord direct [your] longing.",
      translationAmharic: "ወደ ጌታህም ብቻ ከጅል፡፡",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094008.mp3",
      juz: 30,
    },
  ],
};

export const MUHAMMED_SANI_INFO = {
  titleAmharic: "የተከበረው ቁርኣን የአማርኛ ትርጉም",
  translatorsAmharic: "በታላቁ ዐሊም ሼክ ሙሐመድ ሳዲቅ እና ሐጂ ሙሐመድ ሳኒ ሐቢብ",
  translatorsEnglish: "Sheikh Muhammed Sadiq & Haji Muhammed Sani Habib",
  shortTitle: "ሙሐመድ ሳኒ ሐቢብ",
  descriptionAmharic:
    "ይህ የቅዱስ ቁርኣን ትርጉም በኢትዮጵያና በመላው ዓለም በሚገኙ አማርኛ ተናጋሪ ሙስሊሞች ዘንድ በታላቅ ተቀባይነትና አክብሮት የሚታወቅ ታሪካዊና ትክክለኛ የቁርኣን ትርጉም ነው። በአላህ ፈቃድ በሼክ ሙሐመድ ሳዲቅ ተጀምሮ በታላቁ ሊቅ በሐጂ ሙሐመድ ሳኒ ሐቢብ ተጠናቆ የቀረበ አስተማማኝ ሥራ ነው።",
  descriptionEnglish:
    "The celebrated and authoritative Amharic translation of the Holy Quran, translated by the eminent Ethiopian scholars Sheikh Muhammed Sadiq and Haji Muhammed Sani Habib. Renowned across Ethiopia and the diaspora for its clarity, grammatical precision, and fidelity to classical Quranic Tafsir.",
  sourceEdition: "Al-Quran Cloud / Tanzil (am.sadiq)",
};

const versesCache = new Map<string, AyahItem[]>();
const LOCAL_STORAGE_KEY_PREFIX = "quran_ayahs_v3_";

/**
 * Fetch verses dynamically from public Quran API (Uthmani text, English Sahih, Amharic by Muhammed Sani)
 * with reading style adaptations (Hafs, Ad-Duri, Warsh, Qalun, etc.), robust browser caching and offline fallback.
 */
export async function fetchSurahVerses(
  surahNumber: number,
  readingStyle: QuranReadingStyle = "hafs"
): Promise<AyahItem[]> {
  const cacheKey = `${surahNumber}_${readingStyle}`;

  // 1. Check in-memory cache
  if (versesCache.has(cacheKey)) {
    return versesCache.get(cacheKey)!;
  }

  // 2. Check localStorage persistence
  try {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          versesCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    }
  } catch {
    // localStorage disabled or quota exceeded, proceed to network
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const [arabicRes, englishRes, amharicRes, tafsirRes] = await Promise.allSettled([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`, {
        signal: controller.signal,
      }),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`, {
        signal: controller.signal,
      }),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/am.sadiq`, {
        signal: controller.signal,
      }),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.muyassar`, {
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeout);

    let arabicAyahs: any[] = [];
    let englishAyahs: any[] = [];
    let amharicAyahs: any[] = [];
    let tafsirAyahs: any[] = [];

    if (arabicRes.status === "fulfilled" && arabicRes.value.ok) {
      const arabicData = await arabicRes.value.json();
      arabicAyahs = arabicData.data?.ayahs || [];
    }

    if (englishRes.status === "fulfilled" && englishRes.value.ok) {
      const englishData = await englishRes.value.json();
      englishAyahs = englishData.data?.ayahs || [];
    }

    if (amharicRes.status === "fulfilled" && amharicRes.value.ok) {
      const amharicData = await amharicRes.value.json();
      amharicAyahs = amharicData.data?.ayahs || [];
    }

    if (tafsirRes.status === "fulfilled" && tafsirRes.value.ok) {
      const tafsirData = await tafsirRes.value.json();
      tafsirAyahs = tafsirData.data?.ayahs || [];
    }

    if (arabicAyahs.length > 0) {
      const results: AyahItem[] = arabicAyahs.map((item: any, idx: number) => {
        const paddedSurah = String(surahNumber).padStart(3, "0");
        const paddedAyah = String(item.numberInSurah).padStart(3, "0");

        const { text: resolvedArabic } = getVariantTextForAyah(
          surahNumber,
          item.numberInSurah,
          readingStyle,
          item.text
        );
        const ayahDiffs = getDifferencesForAyah(surahNumber, item.numberInSurah);

        return {
          numberInSurah: item.numberInSurah,
          textArabic: resolvedArabic,
          transliteration: `Ayah ${item.numberInSurah}`,
          translation: englishAyahs[idx]?.text || "",
          translationAmharic: amharicAyahs[idx]?.text || "",
          tafsirArabic: tafsirAyahs[idx]?.text || "",
          audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`,
          juz: item.juz || 1,
          readingStyle,
          qiraatDifferences: ayahDiffs.length > 0 ? ayahDiffs : undefined,
        };
      });

      versesCache.set(cacheKey, results);

      // Save to localStorage for instant subsequent loads
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${cacheKey}`, JSON.stringify(results));
        }
      } catch {
        // storage quota exceeded, non-critical
      }

      return results;
    }
  } catch (e) {
    console.warn("Could not fetch remote Quran data, returning fallback", e);
  }

  // 3. Fallback if network unavailable and not in local cache
  const fallbackList = CURATED_SURAHS[surahNumber] || CURATED_SURAHS[1];
  const processedFallback: AyahItem[] = fallbackList.map((item) => {
    const { text: resolvedArabic } = getVariantTextForAyah(
      surahNumber,
      item.numberInSurah,
      readingStyle,
      item.textArabic
    );
    const ayahDiffs = getDifferencesForAyah(surahNumber, item.numberInSurah);
    return {
      ...item,
      textArabic: resolvedArabic,
      readingStyle,
      qiraatDifferences: ayahDiffs.length > 0 ? ayahDiffs : undefined,
    };
  });

  return processedFallback;
}

export const DAILY_INSPIRATION_VERSES = [
  {
    surah: "Al-Baqarah (2:152)",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    translationAmharic: "አስታውሱኝም፤ አስታውሳችኋለሁና፡፡ ለእኔም አመስግኑ፤ አትካዱኝም፡፡",
    topic: "Remembrance & Gratitude",
  },
  {
    surah: "Ash-Sharh (94:5-6)",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    translationAmharic: "ከችግርም ጋር ምቾት አልለ፡፡ ከችግር ጋር በእርግጥ ምቾት አልለ፡፡",
    topic: "Hope & Patience",
  },
  {
    surah: "Al-Ankabut (29:69)",
    arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
    translation: "And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.",
    translationAmharic: "እነዚያም በእኛ መንገድ የታገሉትን መንገዳችንን በእርግጥ እንመራቸዋለን፡፡ አላህም በእርግጥ ከበጎ ሠሪዎች ጋር ነው፡፡",
    topic: "Striving & Guidance",
  },
  {
    surah: "Az-Zumar (39:53)",
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
    translationAmharic: "በላቸው፡- «እናንተ በነፍሶቻችሁ ላይ ድንበር ያለፋችሁ ባሮቼ ሆይ! ከአላህ እዝነት ተስፋ አትቁረጡ፡፡ አላህ ኃጢኣቶችን ሁሉ ይምራልና፡፡",
    topic: "Mercy & Forgiveness",
  },
  {
    surah: "Al-Imran (3:139)",
    arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    translationAmharic: "አትስነፉም፤ አትዘኑምም፤ እናንተ አማኞች እንደ ኾናችሁ የበላዮች ናችሁና፡፡",
    topic: "Courage & Faith",
  },
];
