import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validators/lead.js";
import { env } from "../config/env.js";

/**
 * POST /api/auth/login
 * Validates against the single bootstrap admin defined in env and returns a JWT.
 * (For multiple admins, swap this for a users table + bcrypt-hashed passwords.)
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const ok = email.toLowerCase() === env.adminEmail.toLowerCase() && password === env.adminPassword;
    if (!ok) {
      return res.status(401).json({ ok: false, message: "Invalid credentials." });
    }
    const token = jwt.sign({ email: env.adminEmail }, env.jwtSecret, { expiresIn: "8h" });
    return res.json({ ok: true, token });
  } catch (err) {
    next(err);
  }
}
