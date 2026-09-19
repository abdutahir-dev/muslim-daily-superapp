export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Muslim Daily SuperApp REST API & Services",
    version: "2.5.0",
    description: `Enterprise-grade Islamic utility and scholarly backend services for Muslim Daily SuperApp.
Includes astronomical prayer calculations, 10 Canonical Quran Qira'at, Hadith library, Hisn al-Muslim supplications, places directory, DeenBot AI assistant, and the Qamus Arabic Dictionary & Grammar engine.`,
    contact: {
      name: "Muslim Daily SuperApp Engineering",
      email: "abdutahir.dev@gmail.com",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Default API Gateway (Port 3000)",
    },
    {
      url: "/",
      description: "Direct Root Server (Aliases)",
    },
  ],
  tags: [
    { name: "Qamus", description: "Arabic Classical Dictionary, Grammar (Nahw/Sarf), I'rab, and Quranic Lexicon" },
    { name: "Quran", description: "Holy Quran surahs, verses, 10 canonical Qira'at, search, and reciter audio" },
    { name: "Prayers & Calendar", description: "Astronomical solar prayer calculations, Qibla azimuth, and Hijri calendar" },
    { name: "Hadith", description: "Canonical Hadith collections (Bukhari, Muslim, etc.)" },
    { name: "Duas", description: "Fortress of the Muslim (Hisn al-Muslim) supplications and audio" },
    { name: "Places", description: "Verified Halal restaurants, cafes, and Masajid directory" },
    { name: "AI & DeenBot", description: "Scholarly Islamic AI reasoning with Google Gemini 3.8 Flash" },
    { name: "Dashboard", description: "Aggregated landing page payloads, daily ayahs, hadiths, and quotes" },
    { name: "Firebase Sync", description: "BaaS synchronization endpoints for user state" },
    { name: "Health", description: "System status and uptime diagnostics" },
  ],
  paths: {
    "/qamus/lookup": {
      post: {
        tags: ["Qamus"],
        summary: "Comprehensive Arabic dictionary lookup and grammar analysis",
        description:
          "Accepts an Arabic word, root (جذر), or phrase. Returns full voweling (Tashkeel), morphological patterns (Wazn), I'rab analysis, English and Amharic translations, classical definitions, and Quranic occurrence statistics.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["query"],
                properties: {
                  query: {
                    type: "string",
                    example: "كَتَبَ",
                    description: "Arabic word, root, or sentence to analyze",
                  },
                  mode: {
                    type: "string",
                    enum: ["all", "dictionary", "grammar", "translation", "quranic"],
                    default: "all",
                  },
                  targetLanguage: {
                    type: "string",
                    enum: ["English", "Amharic", "Both"],
                    default: "Both",
                  },
                  context: {
                    type: "string",
                    example: "Quranic recitation",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Detailed Arabic lexical and grammatical analysis",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QamusLookupResponse",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Qamus"],
        summary: "Dictionary lookup via GET query parameter",
        parameters: [
          {
            name: "query",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Arabic word to analyze",
          },
          {
            name: "lang",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["English", "Amharic", "Both"] },
          },
        ],
        responses: {
          "200": {
            description: "Analysis or roots overview if query is omitted",
          },
        },
      },
    },
    "/qamus/roots": {
      get: {
        tags: ["Qamus"],
        summary: "Get pre-indexed classical & Quranic Arabic roots",
        description: "Returns high-frequency trilateral roots with occurrences in the Quran and general semantic meaning.",
        responses: {
          "200": {
            description: "List of roots",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    count: { type: "number", example: 10 },
                    roots: {
                      type: "array",
                      items: { $ref: "#/components/schemas/QamusRootInfo" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/qamus/grammar-rules": {
      get: {
        tags: ["Qamus"],
        summary: "Get classical Arabic grammar cheat-sheets (Nahw & Sarf)",
        description: "Returns structured guides for the 10 Verb Forms (Awzan), Parts of Speech, and Case Endings (I'rab).",
        responses: {
          "200": {
            description: "List of grammar rules and formulas",
          },
        },
      },
    },
    "/quran/random": {
      get: {
        tags: ["Quran"],
        summary: "Generate random Ayahs with translations, Tafsir, and audio",
        description:
          "Generates a customizable random set of Ayahs (default: 7) featuring full Arabic text, English translation (Sahih International), Amharic translation (Sadiq & Sani), Arabic Tafsir (Al-Tafsir Al-Muyassar), audio URLs, and Surah metadata. Supports filtering by Surah number or Revelation type (Meccan/Medinan).",
        parameters: [
          {
            name: "count",
            in: "query",
            schema: { type: "integer", default: 7, minimum: 1, maximum: 50 },
            description: "Number of randomized ayahs to return (default is 7)",
          },
          {
            name: "surah",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 114 },
            description: "Filter random selection to a specific Surah",
          },
          {
            name: "revelation",
            in: "query",
            schema: { type: "string", enum: ["all", "Meccan", "Medinan"], default: "all" },
            description: "Filter by Meccan or Medinan revelation period",
          },
        ],
        responses: {
          "200": {
            description: "Randomized list of Ayahs with quad-lingual fields and metadata",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    count: { type: "integer", example: 7 },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AyahDetail" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/quran/surahs": {
      get: {
        tags: ["Quran"],
        summary: "List all 114 Surahs of the Holy Quran",
        responses: {
          "200": { description: "Array of Surah metadata" },
        },
      },
    },
    "/quran/surahs/{number}/historical": {
      get: {
        tags: ["Quran"],
        summary: "Get comprehensive historical details for a Surah",
        description:
          "Returns historical context, place of revelation (Makkah/Madinah in English & Amharic), chronological revelation order, time period, causes of revelation (Asbab al-Nuzul in English, Amharic & Arabic), core theological themes, and documented virtues.",
        parameters: [
          { name: "number", in: "path", required: true, schema: { type: "integer", minimum: 1, maximum: 114 } },
        ],
        responses: {
          "200": {
            description: "Surah historical and contextual details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    data: { $ref: "#/components/schemas/SurahHistoricalDetail" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/quran/surahs/{number}": {
      get: {
        tags: ["Quran"],
        summary: "Get full verses and translations for a specific Surah",
        parameters: [
          { name: "number", in: "path", required: true, schema: { type: "integer", minimum: 1, maximum: 114 } },
        ],
        responses: {
          "200": { description: "Surah details with all ayahs" },
        },
      },
    },
    "/prayers/today": {
      get: {
        tags: ["Prayers & Calendar"],
        summary: "Calculate today's astronomical prayer times",
        parameters: [
          { name: "lat", in: "query", schema: { type: "number", default: 9.03 } },
          { name: "lng", in: "query", schema: { type: "number", default: 38.74 } },
          { name: "method", in: "query", schema: { type: "string", default: "MWL" } },
          { name: "school", in: "query", schema: { type: "string", default: "standard" } },
        ],
        responses: {
          "200": { description: "Calculated 5 daily prayer times with countdown to next prayer" },
        },
      },
    },
    "/prayers/qibla": {
      get: {
        tags: ["Prayers & Calendar"],
        summary: "Calculate great circle Qibla bearing toward the Kaaba",
        parameters: [
          { name: "lat", in: "query", schema: { type: "number", default: 9.03 } },
          { name: "lng", in: "query", schema: { type: "number", default: 38.74 } },
        ],
        responses: {
          "200": { description: "Azimuth degrees and compass direction" },
        },
      },
    },
    "/calendar/hijri-today": {
      get: {
        tags: ["Prayers & Calendar"],
        summary: "Get today's astronomical Hijri date",
        responses: {
          "200": { description: "Day, month name, year, and formatted strings" },
        },
      },
    },
    "/hadith/books": {
      get: {
        tags: ["Hadith"],
        summary: "List canonical Hadith collections",
        responses: {
          "200": { description: "Bukhari, Muslim, Abu Dawood, Tirmidhi, etc." },
        },
      },
    },
    "/hadith/daily": {
      get: {
        tags: ["Hadith"],
        summary: "Get curated Hadith of the day",
        responses: {
          "200": { description: "Hadith with Arabic text, English/Amharic translation, and grade" },
        },
      },
    },
    "/duas/categories": {
      get: {
        tags: ["Duas"],
        summary: "List all Hisn al-Muslim supplication categories",
        responses: {
          "200": { description: "Morning, Evening, Sleep, Travel, Forgiveness, etc." },
        },
      },
    },
    "/places": {
      get: {
        tags: ["Places"],
        summary: "Search verified Masajid and Halal dining",
        parameters: [
          { name: "category", in: "query", schema: { type: "string", enum: ["all", "mosque", "restaurant", "grocery"] } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "List of nearby locations with coordinates and facilities" },
        },
      },
    },
    "/deenbot/chat": {
      post: {
        tags: ["AI & DeenBot"],
        summary: "Ask DeenBot scholarly assistant",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: { type: "string" },
                  language: { type: "string", default: "English" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "AI scholarly reply with Quran and Hadith citations" },
        },
      },
    },
    "/dashboard/daily": {
      get: {
        tags: ["Dashboard"],
        summary: "Get combined landing page payload for instant hydration",
        responses: {
          "200": { description: "Aggregated next prayer, ayah, hadith, and quote of the day" },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Server healthcheck and runtime diagnostics",
        responses: {
          "200": { description: "System operational status" },
        },
      },
    },
  },
  components: {
    schemas: {
      QamusRootInfo: {
        type: "object",
        properties: {
          root: { type: "string", example: "ك-ت-ب" },
          rootArabic: { type: "string", example: "كتب" },
          transliteration: { type: "string", example: "k-t-b" },
          generalMeaning: { type: "string", example: "To write, record, prescribe" },
          occurrencesInQuran: { type: "number", example: 319 },
        },
      },
      QamusEntry: {
        type: "object",
        properties: {
          query: { type: "string", example: "كَتَبَ" },
          normalizedQuery: { type: "string", example: "كتب" },
          wordType: { type: "string", example: "verb" },
          tashkeel: { type: "string", example: "كَتَبَ" },
          transliteration: { type: "string", example: "kataba" },
          rootInfo: { $ref: "#/components/schemas/QamusRootInfo" },
          meanings: {
            type: "object",
            properties: {
              primaryEnglish: { type: "string", example: "To write, inscribe, decree" },
              primaryAmharic: { type: "string", example: "ጻፈ፣ ደነገገ" },
              classicalArabicDefinition: { type: "string" },
              hansWehrEquivalent: { type: "string" },
            },
          },
        },
      },
      QamusLookupResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          entry: { $ref: "#/components/schemas/QamusEntry" },
          suggestedRoots: {
            type: "array",
            items: { $ref: "#/components/schemas/QamusRootInfo" },
          },
        },
      },
      AyahDetail: {
        type: "object",
        properties: {
          surahNumber: { type: "integer", example: 1 },
          ayahNumber: { type: "integer", example: 2 },
          surahNameEnglish: { type: "string", example: "Al-Fatihah" },
          surahNameArabic: { type: "string", example: "الفاتحة" },
          revelationType: { type: "string", enum: ["Meccan", "Medinan"], example: "Meccan" },
          arabic: { type: "string", example: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
          transliteration: { type: "string", example: "Al-ḥamdu lillāhi Rabbil-'ālamīn" },
          translationEnglish: { type: "string", example: "[All] praise is [due] to Allah, Lord of the worlds -" },
          translationAmharic: { type: "string", example: "ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለኾነው፤" },
          tafsirArabic: { type: "string", example: "الثناء الكامل والشكر التام لله تعالى وحده، المتفرد بالخلق والتدبير والإنعام." },
          audioUrl: { type: "string", example: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3" },
          juzNumber: { type: "integer", example: 1 },
        },
      },
      SurahHistoricalDetail: {
        type: "object",
        properties: {
          number: { type: "integer", example: 1 },
          nameArabic: { type: "string", example: "الفاتحة" },
          nameEnglish: { type: "string", example: "Al-Fatihah" },
          revelationPlace: { type: "string", example: "Makkah Al-Mukarramah" },
          revelationPlaceAmharic: { type: "string", example: "መካ አል-ሙከረማ" },
          revelationOrder: { type: "integer", example: 5 },
          revelationTimePeriod: { type: "string", example: "Meccan Period (610–622 CE)" },
          revelationTimePeriodAmharic: { type: "string", example: "የመካ ዘመን (610-622 እ.ኤ.አ)" },
          causeOfRevelation: { type: "string", example: "Revealed at the onset of prophetic mission as the comprehensive opening of the Quran." },
          causeOfRevelationAmharic: { type: "string", example: "የነቢይነት ተልዕኮ እንደተጀመረ የቁርኣን መክፈቻና ሁሉን አቀፍ ምዕራፍ ሆና ወረደች።" },
          causeOfRevelationArabic: { type: "string", example: "نزلت في أوائل البعثة النبوية بمكة المكرمة كفاتحة شاملة للقرآن العظيم." },
          mainThemes: {
            type: "array",
            items: { type: "string" },
            example: ["Tawheed and Praise", "Supplication and Guidance", "Righteous Path vs. Astray Path"],
          },
          mainThemesAmharic: {
            type: "array",
            items: { type: "string" },
            example: ["የአላህ አንድነትና ምስጋና", "ዱዓዕና ቅን መመሪያ", "የቅኖች መንገድና የጠማሞች መንገድ"],
          },
          virtues: {
            type: "array",
            items: { type: "string" },
            example: ["Greatest Surah in the Quran (Sab'ul-Mathani)", "Spiritual Cure (Al-Ruqyah)"],
          },
          virtuesAmharic: {
            type: "array",
            items: { type: "string" },
            example: ["በቁርኣን ውስጥ ታላቋ ምዕራፍ (ሰብዑል መሳኒ)", "ለመንፈሳዊ ፈውስ (ሩቅያህ) የምታገለግል"],
          },
          rukusCount: { type: "integer", example: 1 },
        },
      },
    },
  },
};
