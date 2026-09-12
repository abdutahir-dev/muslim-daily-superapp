import { Request, Response } from "express";
import { FirebaseSyncService, PrayerLogRecord, BookmarkRecord, KhatmahPlan, TasbihState } from "../services/firebase.service";

function getUserIdFromReq(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    // In production, token is verified via Firebase Admin; for preview/prototype we parse user or fallback safely
    return `user_${token.slice(0, 16).replace(/[^a-zA-Z0-9]/g, "_")}`;
  }
  return (req.query.userId as string) || "default_believer";
}

export class FirebaseSyncController {
  public static getPrayerLogs(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const logs = FirebaseSyncService.getPrayerLogs(userId);
    res.json({
      status: "success",
      userId,
      data: logs,
    });
  }

  public static savePrayerLogs(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const body = req.body as PrayerLogRecord;

    if (!body || !body.date) {
      res.status(400).json({ error: "Missing prayer log data or date." });
      return;
    }

    const updated = FirebaseSyncService.savePrayerLogs(userId, body);
    res.json({
      status: "success",
      userId,
      data: updated,
    });
  }

  public static getTasbih(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const tasbih = FirebaseSyncService.getTasbih(userId);
    res.json({
      status: "success",
      userId,
      data: tasbih,
    });
  }

  public static saveTasbih(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const body = req.body as Partial<TasbihState>;

    const updated = FirebaseSyncService.saveTasbih(userId, body);
    res.json({
      status: "success",
      userId,
      data: updated,
    });
  }

  public static getBookmarks(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const bookmarks = FirebaseSyncService.getBookmarks(userId);
    res.json({
      status: "success",
      userId,
      count: bookmarks.length,
      data: bookmarks,
    });
  }

  public static saveBookmarks(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const bookmarks = req.body.bookmarks as BookmarkRecord[];

    if (!Array.isArray(bookmarks)) {
      res.status(400).json({ error: "Body must contain an array of bookmarks." });
      return;
    }

    const updated = FirebaseSyncService.saveBookmarks(userId, bookmarks);
    res.json({
      status: "success",
      userId,
      count: updated.length,
      data: updated,
    });
  }

  public static getKhatmah(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const plan = FirebaseSyncService.getKhatmah(userId);
    res.json({
      status: "success",
      userId,
      data: plan,
    });
  }

  public static updateKhatmah(req: Request, res: Response): void {
    const userId = getUserIdFromReq(req);
    const body = req.body as Partial<KhatmahPlan>;

    const updated = FirebaseSyncService.updateKhatmah(userId, body);
    res.json({
      status: "success",
      userId,
      data: updated,
    });
  }
}
