import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/daily", DashboardController.getDaily);
dashboardRouter.get("/next-prayer", DashboardController.getNextPrayer);
dashboardRouter.get("/random-ayah", DashboardController.getRandomAyah);
dashboardRouter.get("/random-hadith", DashboardController.getRandomHadith);
dashboardRouter.get("/random-quote", DashboardController.getRandomQuote);
