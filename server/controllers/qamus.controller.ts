import { Request, Response } from "express";
import { QamusService } from "../services/qamus.service";

export class QamusController {
  /**
   * Universal endpoint for word lookup, morphological analysis, I'rab, and translation.
   * Supports both POST (body) and GET (query param) for developer convenience.
   */
  public static async lookup(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.body?.query || req.query?.q || req.query?.query || "").toString().trim();
      const mode = (req.body?.mode || req.query?.mode || "all").toString();
      const targetLanguage = (req.body?.targetLanguage || req.query?.lang || "Both") as any;
      const context = req.body?.context;

      if (!query) {
        // If empty query on GET, return catalog overview
        const roots = QamusService.getRoots();
        res.json({
          status: "success",
          message: "Qamus Arabic Dictionary & Grammar API ready. Provide a 'query' to search.",
          roots: roots.slice(0, 8),
          endpoints: {
            lookup: "POST /api/qamus/lookup or /qamus/lookup { query, targetLanguage, mode }",
            roots: "GET /api/qamus/roots",
            grammar: "GET /api/qamus/grammar-rules",
          },
        });
        return;
      }

      const result = await QamusService.lookup({
        query,
        mode: mode as any,
        targetLanguage,
        context,
      });

      res.json(result);
    } catch (error: any) {
      console.error("[QamusController] Lookup Error:", error);
      res.status(500).json({
        status: "error",
        error: "Failed to perform dictionary lookup",
        details: error?.message || "Internal server error",
      });
    }
  }

  /**
   * Returns list of canonical roots with Quranic occurrence frequencies.
   */
  public static async getRoots(req: Request, res: Response): Promise<void> {
    try {
      const roots = QamusService.getRoots();
      res.json({
        status: "success",
        count: roots.length,
        roots,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        error: "Failed to fetch roots catalog",
        details: error?.message,
      });
    }
  }

  /**
   * Returns classical Arabic grammar reference rules (Nahw & Sarf).
   */
  public static async getGrammarRules(req: Request, res: Response): Promise<void> {
    try {
      const rules = QamusService.getGrammarRules();
      res.json({
        status: "success",
        count: rules.length,
        rules,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        error: "Failed to fetch grammar rules",
        details: error?.message,
      });
    }
  }
}
