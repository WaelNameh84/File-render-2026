/**
 * AttendX — Express Application
 * Configures middleware and mounts all route modules.
 */
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import router from "./routes";

const app: Express = express();

app.use(pinoHttp({
  logger,
  serializers: {
    req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
    res(res) { return { statusCode: res.statusCode }; },
  },
}));

// Open CORS — tokens handled via Bearer header, no cookies needed.
// Set CORS_ORIGIN env var to restrict to your Netlify domain in production.
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: false,
}));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Health check — used by Render/Railway to confirm server is alive
app.get("/api/healthz", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "AttendX API" });
});

app.use("/api", router);

export default app;
