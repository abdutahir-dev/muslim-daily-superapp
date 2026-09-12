import { Router } from "express";
import { healthRouter } from "./health.routes";
import { aiRouter } from "./ai.routes";
import { placesRouter } from "./places.routes";
import { dashboardRouter } from "./dashboard.routes";
import { quranRouter } from "./quran.routes";
import { prayersRouter } from "./prayers.routes";
import { calendarRouter } from "./calendar.routes";
import { hadithRouter } from "./hadith.routes";
import { duasRouter } from "./duas.routes";
import { firebaseSyncRouter } from "./firebase.routes";
import { deenbotRouter } from "./deenbot.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/ai", aiRouter);
apiRouter.use("/places", placesRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/quran", quranRouter);
apiRouter.use("/prayers", prayersRouter);
apiRouter.use("/calendar", calendarRouter);
apiRouter.use("/hadith", hadithRouter);
apiRouter.use("/duas", duasRouter);
apiRouter.use("/firebase", firebaseSyncRouter);
apiRouter.use("/deenbot", deenbotRouter);

