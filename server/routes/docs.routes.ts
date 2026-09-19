import { Router, Request, Response } from "express";
import { openApiSpec } from "../docs/openapi";

export const docsRouter = Router();

/**
 * Returns raw OpenAPI 3.0 specification in JSON format.
 */
docsRouter.get("/swagger.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openApiSpec);
});

docsRouter.get("/openapi.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openApiSpec);
});

/**
 * Serves an interactive, responsive Swagger UI interface.
 */
docsRouter.get("/", (req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Muslim Daily SuperApp API — Swagger UI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300B074'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>">
  <style>
    body {
      margin: 0;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .topbar {
      display: none !important;
    }
    .custom-header {
      background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
      color: white;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .custom-header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .custom-header a {
      color: #a7f3d0;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 14px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      transition: all 0.2s;
    }
    .custom-header a:hover {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    .swagger-ui .info {
      margin: 20px 0;
    }
    .swagger-ui .scheme-container {
      background: #fff;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
      padding: 15px 0;
    }
  </style>
</head>
<body>
  <header class="custom-header">
    <h1>
      <span>📖</span>
      <span>Muslim Daily REST API & Qamus Engine</span>
    </h1>
    <div style="display: flex; gap: 10px;">
      <a href="/api/docs/swagger.json" target="_blank">Download OpenAPI JSON</a>
      <a href="/">← Return to App</a>
    </div>
  </header>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});
