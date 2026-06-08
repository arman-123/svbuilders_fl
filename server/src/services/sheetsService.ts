import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import { env } from "../config/env.js";

/**
 * Google Sheets as the lead store.
 *
 * Sheet layout (row 1 is a header, written automatically on first use):
 *   Timestamp | Name | Email | Phone | Project | IP
 *
 * Auth uses a Google service account. Share the target spreadsheet with the
 * service-account email (Editor) so it can append rows.
 */

export const HEADER = ["Timestamp", "Name", "Email", "Phone", "Project", "IP"];

let cached: sheets_v4.Sheets | null = null;

function getSheets(): sheets_v4.Sheets {
  if (cached) return cached;
  if (!env.google.clientEmail || !env.google.privateKey || !env.google.sheetId) {
    throw new Error(
      "Google Sheets is not configured. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY and GOOGLE_SHEET_ID."
    );
  }
  const auth = new google.auth.JWT({
    email: env.google.clientEmail,
    key: env.google.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  cached = google.sheets({ version: "v4", auth });
  return cached;
}

const tab = () => env.google.sheetName;

/** Reads every data row (excluding the header). */
async function readRows(): Promise<string[][]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: env.google.sheetId,
    range: `${tab()}!A2:F`,
  });
  return (res.data.values as string[][]) ?? [];
}

/** Ensures row 1 holds the header. Cheap, run before the first append. */
async function ensureHeader(): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: env.google.sheetId,
    range: `${tab()}!A1:F1`,
  });
  const existing = res.data.values?.[0] ?? [];
  if (existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.google.sheetId,
      range: `${tab()}!A1:F1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADER] },
    });
  }
}

export interface SheetLead {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  project: string;
}

export async function appendLead(
  lead: Omit<SheetLead, "timestamp">,
  ip: string | null
): Promise<SheetLead> {
  await ensureHeader();
  const timestamp = new Date().toISOString();
  await getSheets().spreadsheets.values.append({
    spreadsheetId: env.google.sheetId,
    range: `${tab()}!A:F`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[timestamp, lead.name, lead.email, lead.phone, lead.project, ip ?? ""]],
    },
  });
  return { timestamp, ...lead };
}

/** True if the same email+project was submitted within the last `windowMin` minutes. */
export async function isDuplicate(
  email: string,
  project: string,
  windowMin = 30
): Promise<boolean> {
  const rows = await readRows();
  const cutoff = Date.now() - windowMin * 60 * 1000;
  return rows.some((r) => {
    const [ts, , rowEmail, , rowProject] = r;
    if (!rowEmail || !ts) return false;
    const sameLead =
      rowEmail.trim().toLowerCase() === email.toLowerCase() && (rowProject ?? "") === project;
    const recent = new Date(ts).getTime() >= cutoff;
    return sameLead && recent;
  });
}

/** All leads, newest first. */
export async function listLeads(): Promise<SheetLead[]> {
  const rows = await readRows();
  return rows
    .map((r) => ({
      timestamp: r[0] ?? "",
      name: r[1] ?? "",
      email: r[2] ?? "",
      phone: r[3] ?? "",
      project: r[4] ?? "",
    }))
    .reverse();
}
