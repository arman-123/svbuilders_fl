import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  // Behind a proxy (Render/Heroku/Nginx) so rate-limit & req.ip work correctly.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      methods: ["GET", "POST"],
    })
  );
  app.use(express.json({ limit: "10kb" }));

  app.use("/api", routes);

  app.use((_req, res) => res.status(404).json({ ok: false, message: "Not found." }));
  app.use(errorHandler);

  return app;
}
