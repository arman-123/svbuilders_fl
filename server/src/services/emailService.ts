import { existsSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

interface SendArgs {
  to: string;
  name: string;
  project: string;
}

/**
 * Sends the brochure email with the PDF attached.
 * Throws on failure so the caller can decide how to respond — the lead is
 * already persisted, so a mail failure must not lose the record.
 */
export async function sendBrochureEmail({ to, name, project }: SendArgs): Promise<void> {
  const brochure = resolve(env.brochurePath);
  const attachments = existsSync(brochure)
    ? [{ filename: `${project}-Brochure.pdf`, path: brochure }]
    : [];

  await getTransporter().sendMail({
    from: env.smtp.from,
    to,
    subject: `${project} Project Brochure`,
    text: `Dear ${name},\n\nThank you for your interest in ${project}. Please find the brochure attached.\n\nWarm regards,\nSV Developers & Constructions`,
    html: brochureHtml(name, project),
    attachments,
  });
}

function brochureHtml(name: string, project: string): string {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2018;background:#E8DCC8;padding:40px 32px;">
    <div style="height:3px;background:linear-gradient(to right,#BE9234,rgba(190,146,52,0.2));margin-bottom:28px;"></div>
    <p style="letter-spacing:0.2em;text-transform:uppercase;font-size:11px;color:#473727;margin:0 0 8px;">SV Developers &amp; Constructions</p>
    <h1 style="font-size:30px;color:#0f0d0a;margin:0 0 18px;font-weight:700;">The ${project} Brochure</h1>
    <p style="font-size:16px;line-height:1.7;margin:0 0 14px;">Dear ${name},</p>
    <p style="font-size:16px;line-height:1.7;margin:0 0 14px;">
      Thank you for your interest in ${project}. Please find the brochure attached to this email.
    </p>
    <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">
      A member of our team will reach out shortly to answer any questions and arrange a private viewing.
    </p>
    <p style="font-size:15px;line-height:1.7;margin:0;color:#473727;">
      Warm regards,<br/><strong>SV Developers &amp; Constructions</strong><br/>Hoskote, Bangalore
    </p>
  </div>`;
}
