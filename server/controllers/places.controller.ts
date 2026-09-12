import { Request, Response } from "express";
import { PlacesService } from "../services/places.service";

export class PlacesController {
  public static getPlaces(req: Request, res: Response): void {
    const { category, query, city } = req.query;

    const places = PlacesService.findPlaces({
      category: typeof category === "string" ? category : undefined,
      query: typeof query === "string" ? query : undefined,
      city: typeof city === "string" ? city : undefined,
    });

    res.json({
      count: places.length,
      places,
    });
  }
}
