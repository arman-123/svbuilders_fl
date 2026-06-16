import { existsSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { getProject } from "../config/projects.js";

let transporter: nodemailer.Transporter | null = null;
let smtpWarningLogged = false;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  if (!env.smtp.pass) {
    if (!smtpWarningLogged) {
      // eslint-disable-next-line no-console
      console.warn(
        "[EmailService] SMTP_PASS is not set — email sending is disabled. Leads are still saved."
      );
      smtpWarningLogged = true;
    }
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
  return transporter;
}

interface SendArgs {
  to: string;
  name: string;
  project: string;
}

/**
 * Sends the brochure PDF to the lead.
 * Returns true on success, false when SMTP is unconfigured or sending fails.
 * Does NOT throw — lead capture must never fail because of mail.
 */
export async function sendBrochureEmail({ to, name, project }: SendArgs): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) return false;

  const cfg = getProject(project);
  const brochurePath = resolve(cfg.brochurePath);
  const attachments = existsSync(brochurePath)
    ? [{ filename: `${cfg.name}-Brochure.pdf`, path: brochurePath }]
    : [];

  await transport.sendMail({
    from: env.smtp.from,
    to,
    subject: `${cfg.name} — Project Brochure`,
    text: `Dear ${name},\n\nThank you for your interest in ${cfg.name}. Please find the brochure attached.\n\nWarm regards,\nSV Developers & Constructions`,
    html: brochureHtml(name, cfg.name),
    attachments,
  });
  return true;
}

/**
 * Notifies the internal sales team whenever a new lead is captured.
 * Silently skips if SMTP is not configured.
 */
export async function sendInternalLeadNotification({
  name,
  email,
  phone,
  project,
}: {
  name: string;
  email: string;
  phone: string;
  project: string;
}): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;

  await transport.sendMail({
    from: env.smtp.from,
    to: env.internalNotifyEmail,
    subject: `New Lead: ${project} — ${name}`,
    text: `A new brochure request was submitted.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject: ${project}\nTime: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
    html: internalLeadHtml({ name, email, phone, project }),
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

function internalLeadHtml(lead: {
  name: string;
  email: string;
  phone: string;
  project: string;
}): string {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  return `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e0d9d0;">
    <h2 style="margin:0 0 16px;color:#473727;">New Lead — ${lead.project}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr><td style="padding:8px 0;color:#888;width:90px;">Name</td><td style="padding:8px 0;font-weight:600;">${lead.name}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${lead.email}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;">${lead.phone}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Project</td><td style="padding:8px 0;">${lead.project}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Time</td><td style="padding:8px 0;">${time}</td></tr>
    </table>
  </div>`;
}
