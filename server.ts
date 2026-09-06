import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Muslim Daily SuperApp",
    timestamp: new Date().toISOString(),
  });
});

// AI Islamic Assistant endpoint (Server-side Gemini proxy)
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { question, language = "English", context } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "A valid question is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "AI service is currently unavailable (GEMINI_API_KEY not configured).",
        answer: "Please configure your GEMINI_API_KEY to receive real-time answers from the Islamic Knowledge Assistant."
      });
    }

    const prompt = `You are a knowledgeable, compassionate, and respectful Islamic scholar & daily life assistant in 'Muslim Daily SuperApp'.
Your mission is to help Muslims and curious learners understand Islamic teachings, daily practices (Salah, Sawm, Zakat, Adhkar, Duas), Islamic history, and ethics in accordance with the Quran and authentic Sunnah.

User Question: "${question}"
User Context: ${context ? JSON.stringify(context) : "General Muslim daily app user"}
Target Language: ${language}

Guidelines:
1. Provide accurate, clear, and encouraging responses.
2. Quote relevant Quranic verses (with Surah:Ayah) or authentic Hadiths (Bukhari, Muslim, Abu Dawood, Tirmidhi, etc.) where appropriate. Provide both the Arabic phrase and translation when citing common Duas or verses.
3. Keep tone respectful, objective, and warm (commence with 'Bismillah' or polite greeting when fitting).
4. If a question concerns complex legal jurisdictions or personal judicial disputes (e.g. divorce, complex inheritance), politely advise the user to consult their local qualified imam or Islamic scholar council.
5. Format your response cleanly with clear headings or bullet points if needed.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer = response.text || "No response generated. Please try again.";
    return res.json({ answer });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Failed to generate AI response",
      details: error?.message || "Internal server error"
    });
  }
});

// Curated Mosque & Halal Food directory API (with search and filter)
const PLACES_DATABASE = [
  {
    id: "m-1",
    name: "Islamic Cultural Center & Central Mosque",
    category: "mosque",
    address: "146 Park Road, Regent's Park",
    city: "London",
    distanceKm: 0.8,
    rating: 4.9,
    reviewsCount: 1420,
    facilities: ["Jummah Prayer", "Women's Area", "Wudu Facilities", "Wheelchair Accessible", "Library"],
    phone: "+44 20 7724 3363",
    coordinates: { lat: 51.5303, lng: -0.1652 }
  },
  {
    id: "m-2",
    name: "East London Mosque & London Muslim Centre",
    category: "mosque",
    address: "82-92 Whitechapel Rd",
    city: "London",
    distanceKm: 2.3,
    rating: 4.8,
    reviewsCount: 2850,
    facilities: ["Jummah Prayer", "Women's Area", "Mortuary", "Imam Consultation", "Islamic School"],
    phone: "+44 20 7650 3000",
    coordinates: { lat: 51.5186, lng: -0.0658 }
  },
  {
    id: "m-3",
    name: "Masjid Al-Farooq",
    category: "mosque",
    address: "4424 S King Dr",
    city: "Chicago",
    distanceKm: 1.5,
    rating: 4.8,
    reviewsCount: 420,
    facilities: ["Jummah Prayer", "Daily 5 Prayers", "Taraweeh", "Women Section", "Parking"],
    phone: "+1 773 924 1333",
    coordinates: { lat: 41.8145, lng: -87.6163 }
  },
  {
    id: "m-4",
    name: "Islamic Center of America",
    category: "mosque",
    address: "19500 Ford Rd",
    city: "Dearborn",
    distanceKm: 3.1,
    rating: 4.9,
    reviewsCount: 1890,
    facilities: ["Jummah Prayer", "Banquet Hall", "Library", "Women's Prayer Hall", "Museum"],
    phone: "+1 313 593 0000",
    coordinates: { lat: 42.3351, lng: -83.2324 }
  },
  {
    id: "h-1",
    name: "Saffron Halal Mediterranean Grill",
    category: "restaurant",
    cuisine: "Mediterranean & Middle Eastern",
    address: "52 Baker Street",
    city: "London",
    distanceKm: 0.9,
    rating: 4.7,
    reviewsCount: 680,
    halalCertification: "HMC Certified 100% Halal",
    priceRange: "$$",
    features: ["Prayer Space Available", "No Alcohol Served", "Family Seating", "Takeaway"],
    phone: "+44 20 7486 9912",
    coordinates: { lat: 51.5198, lng: -0.1568 }
  },
  {
    id: "h-2",
    name: "Bosphorus Ottoman Kebabs & Steaks",
    category: "restaurant",
    cuisine: "Turkish & Grills",
    address: "108 Edgware Rd",
    city: "London",
    distanceKm: 1.1,
    rating: 4.6,
    reviewsCount: 1120,
    halalCertification: "Hand-Slaughtered Halal Certified",
    priceRange: "$$$",
    features: ["Halal Certified", "No Alcohol", "Private Rooms", "Delivery"],
    phone: "+44 20 7262 8844",
    coordinates: { lat: 51.5167, lng: -0.1633 }
  },
  {
    id: "h-3",
    name: "Al-Madina Gourmet Grill & Shawarma",
    category: "restaurant",
    cuisine: "Arabic & Yemeni Mandi",
    address: "241 Michigan Ave",
    city: "Chicago",
    distanceKm: 1.8,
    rating: 4.8,
    reviewsCount: 940,
    halalCertification: "Zabihah Halal Verified",
    priceRange: "$$",
    features: ["Full Halal Kitchen", "Prayer Room", "Family Friendly"],
    phone: "+1 312 443 1200",
    coordinates: { lat: 41.8819, lng: -87.6238 }
  },
  {
    id: "h-4",
    name: "Medina Halal Artisan Supermarket & Deli",
    category: "grocery",
    cuisine: "Halal Butcher & Fresh Bakery",
    address: "88 Queensway",
    city: "London",
    distanceKm: 1.4,
    rating: 4.9,
    reviewsCount: 530,
    halalCertification: "100% Certified Zabihah Halal Meat",
    priceRange: "$$",
    features: ["Fresh Halal Meat", "Organic Dates & Honey", "Imported Spices", "Prepared Meals"],
    phone: "+44 20 7229 5543",
    coordinates: { lat: 51.5134, lng: -0.1887 }
  }
];

app.get("/api/places", (req, res) => {
  const { category, query, city } = req.query;
  let results = [...PLACES_DATABASE];

  if (category && category !== "all") {
    results = results.filter(p => p.category === category);
  }

  if (query && typeof query === "string") {
    const q = query.toLowerCase();
    results = results.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.cuisine && p.cuisine.toLowerCase().includes(q)) ||
        (p.facilities && p.facilities.some(f => f.toLowerCase().includes(q)))
    );
  }

  res.json({ places: results });
});

// Vite middleware in dev / static serve in prod
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Muslim Daily SuperApp server listening on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
