import { getGeminiClient, isGeminiConfigured } from "../config/gemini";
import { AskAiRequest, AskAiResponse } from "../types";

export class GeminiAiService {
  /**
   * Generates a scholarly, respectful Islamic Knowledge response using Gemini 2.5 Flash
   */
  public static async answerQuestion(params: AskAiRequest): Promise<AskAiResponse> {
    const { question, language = "English", context } = params;

    if (!isGeminiConfigured()) {
      return {
        error: "AI service is currently unavailable (GEMINI_API_KEY is not configured on the server).",
        answer:
          "Please configure the GEMINI_API_KEY environment variable in your server settings to enable real-time scholarly AI responses.",
      };
    }

    const ai = getGeminiClient();
    if (!ai) {
      return {
        error: "Failed to initialize Gemini AI client.",
      };
    }

    const prompt = `You are a knowledgeable, compassionate, and respectful Islamic scholar & daily life assistant in 'Muslim Daily SuperApp'.
Your mission is to help Muslims and curious learners understand Islamic teachings, daily practices (Salah, Sawm, Zakat, Adhkar, Duas), Islamic history, and ethics in accordance with the Quran and authentic Sunnah.

User Question: "${question}"
User Context: ${context ? JSON.stringify(context) : "General Muslim daily app user"}
Target Language: ${language}

Strict Guidelines:
1. Provide accurate, clear, and encouraging responses.
2. Quote relevant Quranic verses (with Surah:Ayah) or authentic Hadiths (Bukhari, Muslim, Abu Dawood, Tirmidhi, etc.) where appropriate. Provide both the Arabic phrase and translation when citing common Duas or verses.
3. Keep tone respectful, objective, and warm (commence with 'Bismillah' or polite greeting when fitting).
4. If a question concerns complex legal jurisdictions or personal judicial disputes (e.g. divorce, complex inheritance), politely advise the user to consult their local qualified imam or Islamic scholar council.
5. Format your response cleanly with clear headings or bullet points if needed.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const answer = response.text || "No response generated. Please try again.";
      return { answer };
    } catch (error: any) {
      console.error("Gemini GenAI service error:", error);
      throw error;
    }
  }
}
