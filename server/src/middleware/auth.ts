import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthedRequest extends Request {
  admin?: { email: string };
}

/** Bearer-token guard for admin-only routes. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, message: "Authentication required." });
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { email: string };
    req.admin = { email: payload.email };
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid or expired token." });
  }
}
