import rateLimit from "express-rate-limit";

/** Throttles the public brochure endpoint — 5 submissions / 15 min / IP. */
export const brochureLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many requests. Please try again later." },
});

/** Protects the login endpoint against brute force — 10 attempts / 15 min / IP. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many login attempts. Please try again later." },
});
