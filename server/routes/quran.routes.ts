import { Router } from "express";
import { QuranController } from "../controllers/quran.controller";

export const quranRouter = Router();

quranRouter.get("/random", QuranController.getRandomAyahs);
quranRouter.get("/surahs", QuranController.getSurahs);
quranRouter.get("/surahs/:number/historical", QuranController.getSurahHistoricalDetails);
quranRouter.get("/surahs/:number", QuranController.getSurahDetail);
quranRouter.get("/ayah/:surah/:ayah", QuranController.getAyahByKey);
quranRouter.get("/search", QuranController.search);
quranRouter.get("/reciters", QuranController.getReciters);
quranRouter.get("/audio/:reciter_id/:surah/:ayah", QuranController.getAudioStream);
