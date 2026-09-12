import { Request, Response } from "express";
import { PrayersService } from "../services/prayers.service";

export class PrayersController {
  public static getToday(req: Request, res: Response): void {
    const lat = parseFloat(req.query.lat as string) || 9.03;
    const lng = parseFloat(req.query.lng as string) || 38.74;
    const method = (req.query.method as string) || "MWL";
    const school = (req.query.school as string) || "standard";

    const data = PrayersService.getTodayPrayers(lat, lng, method, school);
    res.json({
      status: "success",
      data,
    });
  }

  public static getCalendar(req: Request, res: Response): void {
    const now = new Date();
    const month = parseInt(req.query.month as string, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year as string, 10) || now.getFullYear();
    const lat = parseFloat(req.query.lat as string) || 9.03;
    const lng = parseFloat(req.query.lng as string) || 38.74;
    const method = (req.query.method as string) || "MWL";

    const data = PrayersService.getMonthlyCalendar(month, year, lat, lng, method);
    res.json({
      status: "success",
      data,
    });
  }

  public static getQibla(req: Request, res: Response): void {
    const lat = parseFloat(req.query.lat as string) || 9.03;
    const lng = parseFloat(req.query.lng as string) || 38.74;

    const qibla = PrayersService.calculateQiblaDirection(lat, lng);
    res.json({
      status: "success",
      coordinates: { lat, lng },
      kaabaCoordinates: { lat: 21.422487, lng: 39.826206 },
      qibla,
    });
  }
}
