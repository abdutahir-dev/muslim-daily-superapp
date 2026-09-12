import { Router } from "express";
import { PrayersController } from "../controllers/prayers.controller";

export const prayersRouter = Router();

prayersRouter.get("/today", PrayersController.getToday);
prayersRouter.get("/calendar", PrayersController.getCalendar);
prayersRouter.get("/qibla", PrayersController.getQibla);
