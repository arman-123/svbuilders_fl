import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed.",
      errors: err.flatten().fieldErrors,
    });
  }
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  return res.status(500).json({ ok: false, message: "Internal server error." });
}
