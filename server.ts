import path from "path";
import express from "express";
import { createServerApp } from "./server/app";
import { config } from "./server/config/env";

const app = createServerApp();
const PORT = config.port;

/**
 * Boots the server and configures Vite middleware in development or serves static dist/ in production.
 */
async function startServer() {
  if (!config.isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, config.host, () => {
    console.log(`[Muslim Daily SuperApp] Server running at http://${config.host}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

