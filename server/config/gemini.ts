import { GoogleGenAI } from "@google/genai";
import { config } from "./env";

let aiClient: GoogleGenAI | null = null;

/**
 * Lazy-initialized singleton client for Google Gemini Gen AI.
 * Prevents application startup failure if API key is not yet set.
 */
export function getGeminiClient(): GoogleGenAI | null {
  if (!config.geminiApiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: config.geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export function isGeminiConfigured(): boolean {
  return Boolean(config.geminiApiKey && config.geminiApiKey.length > 0);
}
