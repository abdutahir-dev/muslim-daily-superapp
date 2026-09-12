import { Router } from "express";
import { DeenBotController } from "../controllers/deenbot.controller";

export const deenbotRouter = Router();

deenbotRouter.post("/chat", DeenBotController.chat);
