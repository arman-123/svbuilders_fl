import { Router } from "express";
import { downloadBrochure, submitEnquiry, getLeads } from "../controllers/leadController.js";
import { login } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { brochureLimiter, loginLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true, status: "up" }));

// Public lead capture
router.post("/brochure-download", brochureLimiter, downloadBrochure);
router.post("/enquiry", brochureLimiter, submitEnquiry);

// Admin auth + protected listing
router.post("/auth/login", loginLimiter, login);
router.get("/leads", requireAuth, getLeads);

export default router;
