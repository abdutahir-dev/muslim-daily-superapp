import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
  /**
   * GET /api/dashboard/daily
   * Returns complete daily landing page payload: next prayer, random ayah, random hadith, random quote
   */
  public static getDaily(req: Request, res: Response): void {
    try {
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
      const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
      const method = req.query.method as string | undefined;
      const school = req.query.school as string | undefined;
      const locationName = req.query.locationName as string | undefined;

      const data = DashboardService.getDailyDashboard({
        lat,
        lng,
        method,
        school,
        locationName,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Error generating daily dashboard data:", error);
      res.status(500).json({
        error: "Failed to fetch daily dashboard data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * GET /api/dashboard/next-prayer
   */
  public static getNextPrayer(req: Request, res: Response): void {
    try {
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
      const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
      const method = req.query.method as string | undefined;
      const school = req.query.school as string | undefined;
      const locationName = req.query.locationName as string | undefined;

      const nextPrayer = DashboardService.calculateNextPrayer({
        lat,
        lng,
        method,
        school,
        locationName,
      });

      res.status(200).json(nextPrayer);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate next prayer" });
    }
  }

  /**
   * GET /api/dashboard/random-ayah
   */
  public static getRandomAyah(_req: Request, res: Response): void {
    try {
      const ayah = DashboardService.getRandomAyah();
      res.status(200).json(ayah);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch random Ayah" });
    }
  }

  /**
   * GET /api/dashboard/random-hadith
   */
  public static getRandomHadith(_req: Request, res: Response): void {
    try {
      const hadith = DashboardService.getRandomHadith();
      res.status(200).json(hadith);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch random Hadith" });
    }
  }

  /**
   * GET /api/dashboard/random-quote
   */
  public static getRandomQuote(_req: Request, res: Response): void {
    try {
      const quote = DashboardService.getRandomQuote();
      res.status(200).json(quote);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch random quote" });
    }
  }
}
