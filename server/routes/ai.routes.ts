import { Router } from "express";
import { AiController } from "../controllers/ai.controller";

export const aiRouter = Router();

aiRouter.post("/ask", AiController.askScholar);
