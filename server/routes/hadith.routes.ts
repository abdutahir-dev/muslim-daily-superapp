import { Router } from "express";
import { HadithController } from "../controllers/hadith.controller";

export const hadithRouter = Router();

hadithRouter.get("/books", HadithController.getBooks);
hadithRouter.get("/daily", HadithController.getDaily);
hadithRouter.get("/search", HadithController.search);
hadithRouter.get("/:book/:chapter_number", HadithController.getChapter);
