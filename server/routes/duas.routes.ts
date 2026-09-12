import { Router } from "express";
import { DuasController } from "../controllers/duas.controller";

export const duasRouter = Router();

duasRouter.get("/categories", DuasController.getCategories);
duasRouter.get("/daily", DuasController.getDaily);
duasRouter.get("/category/:id", DuasController.getByCategory);
duasRouter.get("/:id/audio", DuasController.getAudio);
