import type { NextFunction, Request, Response } from "express";
import { brochureLeadSchema } from "../validators/lead.js";
import { submitLead, listLeads } from "../services/leadService.js";
import {
  sendBrochureEmail,
  sendInternalLeadNotification,
} from "../services/emailService.js";

/** POST /api/brochure-download */
export async function downloadBrochure(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = brochureLeadSchema.parse(req.body);
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      null;

    const { lead, duplicate } = await submitLead(data, ip);

    if (duplicate) {
      return res.status(200).json({
        success: true,
        message:
          "We've already received your request — the brochure is on its way.",
        duplicate: true,
      });
    }

    // Fire emails in the background — don't block the response.
    Promise.allSettled([
      // sendBrochureEmail({ to: lead.email, name: lead.name, project: lead.project }),
      Promise.resolve({ status: "fulfilled", value: true }),
      sendInternalLeadNotification({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        project: lead.project,
      }),
    ]).then(([brochureResult]) => {
      if (brochureResult.status === "rejected") {
        // eslint-disable-next-line no-console
        console.error("Brochure email failed (lead saved):", brochureResult.reason);
      }
    });

    return res.status(201).json({
      success: true,
      message: "Thank you. Our team will share the brochure shortly.",
    });
  } catch (err) {
    next(err);
  }
}

/** POST /api/enquiry — stores lead + internal notification, no brochure email */
export async function submitEnquiry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = brochureLeadSchema.parse(req.body);
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      null;

    const { lead, duplicate } = await submitLead(data, ip);

    if (duplicate) {
      return res.status(200).json({
        success: true,
        message: "We already have your details — our team will be in touch.",
        duplicate: true,
      });
    }

    sendInternalLeadNotification({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      project: lead.project,
    }).catch((err) => console.error("Internal notification failed:", err));

    return res.status(201).json({
      success: true,
      message: "Thank you. Our team will get in touch shortly.",
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/leads (admin only) */
export async function getLeads(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leads = await listLeads();
    return res.json(
      leads.map((l) => ({
        timestamp: l.timestamp,
        name: l.name,
        email: l.email,
        phone: l.phone,
        project: l.project,
        status: l.status,
        notes: l.notes,
      }))
    );
  } catch (err) {
    next(err);
  }
}
