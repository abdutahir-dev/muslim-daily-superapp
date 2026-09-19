import express, { Express } from "express";
import { apiRouter } from "./routes";
import { qamusRouter } from "./routes/qamus.routes";
import { docsRouter } from "./routes/docs.routes";

/**
 * Creates and configures the Express application with all middlewares and API routes.
 */
export function createServerApp(): Express {
  const app = express();

  // Standard middlewares
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api", apiRouter);

  // Direct root aliases
  app.use("/qamus", qamusRouter);
  app.use("/docs", docsRouter);

  return app;
}
