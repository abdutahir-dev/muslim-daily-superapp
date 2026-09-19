import { Router } from "express";
import { QamusController } from "../controllers/qamus.controller";

export const qamusRouter = Router();

// Universal endpoints supporting both root / and /lookup
qamusRouter.post("/", QamusController.lookup);
qamusRouter.get("/", QamusController.lookup);
qamusRouter.post("/lookup", QamusController.lookup);
qamusRouter.get("/lookup", QamusController.lookup);

// Catalogs & Reference endpoints
qamusRouter.get("/roots", QamusController.getRoots);
qamusRouter.get("/grammar-rules", QamusController.getGrammarRules);
