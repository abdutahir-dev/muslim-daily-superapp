import { Request, Response } from "express";
import { DeenBotService, DeenBotChatRequest } from "../services/deenbot.service";

export class DeenBotController {
  public static async chat(req: Request, res: Response): Promise<void> {
    const { message, history, language } = req.body as DeenBotChatRequest;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "A non-empty 'message' string is required." });
      return;
    }

    try {
      const response = await DeenBotService.chat({
        message: message.trim(),
        history,
        language,
      });

      res.json({
        status: "success",
        data: response,
      });
    } catch (error: any) {
      console.error("DeenBot controller error:", error);
      res.status(500).json({
        error: "Failed to process chat with DeenBot.",
        details: error.message,
      });
    }
  }
}
