import { Router } from "express";
import { PlacesController } from "../controllers/places.controller";

export const placesRouter = Router();

placesRouter.get("/", PlacesController.getPlaces);
