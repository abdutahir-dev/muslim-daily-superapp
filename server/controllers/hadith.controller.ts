import { Request, Response } from "express";
import { HadithService } from "../services/hadith.service";

export class HadithController {
  public static getBooks(req: Request, res: Response): void {
    const books = HadithService.getBooks();
    res.json({
      status: "success",
      count: books.length,
      data: books,
    });
  }

  public static getChapter(req: Request, res: Response): void {
    const { book, chapter_number } = req.params;
    const chapterNum = parseInt(chapter_number, 10) || 1;

    const chapter = HadithService.getChapterHadiths(book, chapterNum);
    res.json({
      status: "success",
      data: chapter,
    });
  }

  public static getDaily(req: Request, res: Response): void {
    const daily = HadithService.getDailyHadith();
    res.json({
      status: "success",
      data: daily,
    });
  }

  public static search(req: Request, res: Response): void {
    const query = (req.query.q as string) || "";
    const bookSlug = req.query.book as string | undefined;

    if (!query) {
      res.status(400).json({ error: "Search query 'q' parameter is required." });
      return;
    }

    const results = HadithService.searchHadiths(query, bookSlug);
    res.json({
      status: "success",
      query,
      book: bookSlug || "all",
      count: results.length,
      data: results,
    });
  }
}
