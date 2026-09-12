import { Router } from "express";
import { FirebaseSyncController } from "../controllers/firebase.controller";

export const firebaseSyncRouter = Router();

firebaseSyncRouter.get("/prayer-logs", FirebaseSyncController.getPrayerLogs);
firebaseSyncRouter.post("/prayer-logs", FirebaseSyncController.savePrayerLogs);

firebaseSyncRouter.get("/tasbih", FirebaseSyncController.getTasbih);
firebaseSyncRouter.post("/tasbih", FirebaseSyncController.saveTasbih);

firebaseSyncRouter.get("/bookmarks", FirebaseSyncController.getBookmarks);
firebaseSyncRouter.post("/bookmarks", FirebaseSyncController.saveBookmarks);

firebaseSyncRouter.get("/khatmah", FirebaseSyncController.getKhatmah);
firebaseSyncRouter.put("/khatmah", FirebaseSyncController.updateKhatmah);
