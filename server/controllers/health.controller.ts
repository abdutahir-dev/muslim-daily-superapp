import { Request, Response } from "express";
import { isGeminiConfigured } from "../config/gemini";
import { HealthCheckResponse } from "../types";

const startTime = Date.now();

export class HealthController {
  public static getHealth(req: Request, res: Response): void {
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const geminiActive = isGeminiConfigured();

    const response: HealthCheckResponse = {
      status: "ok",
      app: "Muslim Daily SuperApp Backend",
      version: "2.5.0",
      timestamp: new Date().toISOString(),
      services: {
        geminiConfigured: geminiActive,
        serverUptimeSeconds: uptimeSeconds,
      },
    };

    res.json(response);
  }
}
