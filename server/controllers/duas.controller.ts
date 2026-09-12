import { Request, Response } from "express";
import { DuasService } from "../services/duas.service";

export class DuasController {
  public static getCategories(req: Request, res: Response): void {
    const categories = DuasService.getCategories();
    res.json({
      status: "success",
      count: categories.length,
      data: categories,
    });
  }

  public static getByCategory(req: Request, res: Response): void {
    const categoryId = req.params.id;
    const duas = DuasService.getByCategory(categoryId);
    res.json({
      status: "success",
      categoryId,
      count: duas.length,
      data: duas,
    });
  }

  public static getDaily(req: Request, res: Response): void {
    const daily = DuasService.getDailyDua();
    res.json({
      status: "success",
      data: daily,
    });
  }

  public static getAudio(req: Request, res: Response): void {
    const duaId = req.params.id;
    const audio = DuasService.getAudio(duaId);
    res.json({
      status: "success",
      data: audio,
    });
  }
}
