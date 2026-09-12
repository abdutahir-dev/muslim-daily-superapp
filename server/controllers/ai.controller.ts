import { Request, Response } from "express";
import { GeminiAiService } from "../services/gemini.service";

export class AiController {
  public static async askScholar(req: Request, res: Response): Promise<void> {
    try {
      const { question, language = "English", context } = req.body;

      if (!question || typeof question !== "string" || question.trim() === "") {
        res.status(400).json({
          error: "A valid 'question' string parameter is required in the request body.",
        });
        return;
      }

      const result = await GeminiAiService.answerQuestion({
        question: question.trim(),
        language,
        context,
      });

      if (result.error && !result.answer) {
        res.status(503).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error("AI Controller Error:", error);
      res.status(500).json({
        error: "Failed to generate AI response",
        details: error?.message || "Internal server error",
      });
    }
  }
}
