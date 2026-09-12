import { Router } from "express";
import { healthRouter } from "./health.routes";
import { aiRouter } from "./ai.routes";
import { placesRouter } from "./places.routes";
import { dashboardRouter } from "./dashboard.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/ai", aiRouter);
apiRouter.use("/places", placesRouter);
apiRouter.use("/dashboard", dashboardRouter);

