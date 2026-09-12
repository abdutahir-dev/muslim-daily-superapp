import { Request, Response } from "express";
import { QuranService } from "../services/quran.service";

export class QuranController {
  public static getSurahs(req: Request, res: Response): void {
    const surahs = QuranService.getAllSurahs();
    res.json({
      status: "success",
      count: surahs.length,
      data: surahs,
    });
  }

  public static getSurahDetail(req: Request, res: Response): void {
    const surahNumber = parseInt(req.params.number, 10);
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      res.status(400).json({ error: "Invalid surah number. Must be between 1 and 114." });
      return;
    }

    const data = QuranService.getSurahByNumber(surahNumber);
    if (!data) {
      res.status(404).json({ error: "Surah not found." });
      return;
    }

    res.json({
      status: "success",
      data,
    });
  }

  public static getAyahByKey(req: Request, res: Response): void {
    const surah = parseInt(req.params.surah, 10);
    const ayah = parseInt(req.params.ayah, 10);

    if (isNaN(surah) || isNaN(ayah)) {
      res.status(400).json({ error: "Surah and Ayah parameters must be valid integers." });
      return;
    }

    const ayahData = QuranService.getAyah(surah, ayah);
    if (!ayahData) {
      res.status(404).json({ error: "Ayah not found." });
      return;
    }

    res.json({
      status: "success",
      data: ayahData,
    });
  }

  public static search(req: Request, res: Response): void {
    const query = (req.query.q as string) || "";
    const lang = (req.query.lang as "ar" | "en") || "en";

    if (!query) {
      res.status(400).json({ error: "Search query 'q' parameter is required." });
      return;
    }

    const results = QuranService.searchQuran(query, lang);
    res.json({
      status: "success",
      query,
      lang,
      count: results.length,
      data: results,
    });
  }

  public static getReciters(req: Request, res: Response): void {
    const reciters = QuranService.getReciters();
    res.json({
      status: "success",
      count: reciters.length,
      data: reciters,
    });
  }

  public static getAudioStream(req: Request, res: Response): void {
    const { reciter_id, surah, ayah } = req.params;
    const surahNum = parseInt(surah, 10);
    const ayahNum = parseInt(ayah, 10);

    if (isNaN(surahNum) || isNaN(ayahNum)) {
      res.status(400).json({ error: "Invalid surah or ayah number." });
      return;
    }

    const audioInfo = QuranService.getAudioUrl(reciter_id, surahNum, ayahNum);
    res.json({
      status: "success",
      reciter: audioInfo.reciter,
      audioUrl: audioInfo.audioUrl,
    });
  }
}
