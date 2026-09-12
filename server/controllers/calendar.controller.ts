import { Request, Response } from "express";
import { CalendarService } from "../services/calendar.service";

export class CalendarController {
  public static getHijriToday(req: Request, res: Response): void {
    const data = CalendarService.getHijriToday();
    res.json({
      status: "success",
      data,
    });
  }

  public static getEvents(req: Request, res: Response): void {
    const year = parseInt(req.query.year as string, 10) || 1448;
    const data = CalendarService.getEvents(year);
    res.json({
      status: "success",
      data,
    });
  }
}
