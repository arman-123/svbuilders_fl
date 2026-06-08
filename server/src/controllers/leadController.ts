import type { NextFunction, Request, Response } from "express";
import { brochureLeadSchema } from "../validators/lead.js";
import { createLead, isDuplicate, listLeads } from "../services/leadService.js";
import { sendBrochureEmail } from "../services/emailService.js";

/** POST /api/brochure-download */
export async function downloadBrochure(req: Request, res: Response, next: NextFunction) {
  try {
    const data = brochureLeadSchema.parse(req.body);
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || null;

    // Prevent duplicate spam submissions within the dedupe window.
    if (await isDuplicate(data.email, data.project)) {
      return res.status(200).json({
        ok: true,
        message: "We've already received your request — the brochure is on its way.",
        duplicate: true,
      });
    }

    const lead = await createLead(data, ip);

    // Email must not block the success response on transient SMTP failure;
    // the lead is already saved. We still attempt and report mail status.
    let emailed = true;
    try {
      await sendBrochureEmail({ to: lead.email, name: lead.name, project: lead.project });
    } catch (mailErr) {
      emailed = false;
      // eslint-disable-next-line no-console
      console.error("Brochure email failed (lead saved):", mailErr);
    }

    return res.status(201).json({
      ok: true,
      message: emailed
        ? "Thank you. The Aurora brochure has been sent to your email."
        : "Thank you. Your request is received — our team will email the brochure shortly.",
      emailed,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/leads (admin only) */
export async function getLeads(_req: Request, res: Response, next: NextFunction) {
  try {
    const leads = await listLeads();
    return res.json({
      ok: true,
      count: leads.length,
      leads: leads.map((l) => ({
        name: l.name,
        email: l.email,
        phone: l.phone,
        project: l.project,
        date: l.timestamp,
      })),
    });
  } catch (err) {
    next(err);
  }
}
