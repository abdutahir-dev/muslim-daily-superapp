import { getGeminiClient, isGeminiConfigured } from "../config/gemini";

export interface DeenBotMessage {
  role: "user" | "model" | "assistant" | "system";
  content: string;
}

export interface DeenBotChatRequest {
  message: string;
  history?: DeenBotMessage[];
  language?: string;
}

export interface DeenBotChatResponse {
  reply: string;
  citations?: Array<{ title: string; reference: string; source: "Quran" | "Hadith" | "Scholar" }>;
  suggestedQuestions?: string[];
  error?: string;
}

export class DeenBotService {
  public static async chat(params: DeenBotChatRequest): Promise<DeenBotChatResponse> {
    const { message, history = [], language = "English" } = params;

    if (!isGeminiConfigured()) {
      return {
        reply: `Assalamu Alaikum wa Rahmatullahi wa Barakatuh.\n\nThank you for reaching out to DeenBot regarding: "${message}".\n\nTo enable full real-time Gemini AI scholarly analysis, please configure the GEMINI_API_KEY environment variable. In the meantime, remember the words of Allah in Surah Al-Baqarah (2:153): "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient."`,
        citations: [
          { title: "Patience and Prayer", reference: "Surah Al-Baqarah 2:153", source: "Quran" }
        ],
        suggestedQuestions: [
          "What are the core pillars of Islam?",
          "How do I calculate Zakat on savings?",
          "What are the benefits of Ayat al-Kursi?"
        ]
      };
    }

    const ai = getGeminiClient();
    if (!ai) {
      return {
        reply: "Sorry, the AI service could not be initialized at this moment.",
        error: "AI_INIT_FAILED"
      };
    }

    // Build context with history
    const conversationContext = history
      .map((h) => `${h.role === "user" ? "User" : "DeenBot"}: ${h.content}`)
      .join("\n");

    const prompt = `You are DeenBot, an empathetic, highly learned, and authentic Islamic scholarly assistant inside the Muslim Daily SuperApp.
Your duty is to assist Muslims and sincere seekers with answers grounded firmly in the Holy Quran, authentic Sunnah (Sahih al-Bukhari, Sahih Muslim, etc.), and the consensus of classical Islamic scholars.

Previous Conversation:
${conversationContext || "(No prior messages)"}

Current User Message: "${message}"
Target Language: ${language}

Instructions:
1. Greet with a warm Islamic greeting when beginning a dialogue (e.g. 'Bismillah', 'Assalamu Alaikum').
2. Provide a clear, nuanced, and compassionate explanation.
3. Quote relevant Quranic verses with Surah:Ayah numbers and authentic Hadiths where appropriate.
4. If asked about personal judicial disputes or contentious Fiqh matters (e.g., divorce talaq rulings, specific inheritance math, medical rulings), provide general educational background and politely encourage consulting local qualified Muftis.
5. End with an uplifting reflection or relevant Dua.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const reply = response.text || "May Allah grant you clarity and ease in your affairs.";

      return {
        reply,
        suggestedQuestions: [
          "Can you explain the virtues of Tahajjud prayer?",
          "What are the recommended morning and evening Adhkar?",
          "How do I perform Sujud as-Sahw (prostration of forgetfulness)?"
        ]
      };
    } catch (error: any) {
      console.error("DeenBot Gemini error:", error);
      return {
        reply: "An error occurred while consulting scholarly references. Please try again shortly.",
        error: error.message || "GENAI_ERROR"
      };
    }
  }
}
