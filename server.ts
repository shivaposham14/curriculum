import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "CurricuForge Backend is running" });
  });

  // Industry Trends Mock Data (In a real app, this might come from a DB or AI)
  app.get("/api/trends", (req, res) => {
    res.json([
      { name: "Python", adoption: 85, demand: 92, growth: [40, 55, 70, 85, 92] },
      { name: "AWS", adoption: 78, demand: 88, growth: [30, 45, 60, 75, 88] },
      { name: "React", adoption: 82, demand: 90, growth: [50, 65, 75, 82, 90] },
      { name: "Kubernetes", adoption: 45, demand: 75, growth: [10, 25, 40, 55, 75] },
      { name: "TensorFlow", adoption: 60, demand: 80, growth: [20, 40, 55, 70, 80] },
      { name: "PostgreSQL", adoption: 70, demand: 75, growth: [50, 55, 60, 65, 75] },
      { name: "Rust", adoption: 25, demand: 55, growth: [5, 10, 20, 35, 55] },
      { name: "Flutter", adoption: 40, demand: 60, growth: [15, 30, 45, 55, 60] },
      { name: "LangChain", adoption: 15, demand: 85, growth: [0, 5, 20, 50, 85] },
      { name: "Blockchain", adoption: 30, demand: 50, growth: [20, 40, 35, 45, 50] },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CurricuForge running at http://localhost:${PORT}`);
  });
}

startServer();
