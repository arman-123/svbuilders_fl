import * as sheets from "./sheetsService.js";
import type { SheetLead } from "./sheetsService.js";
import type { BrochureLeadInput } from "../validators/lead.js";

/** Window (minutes) within which a repeat email+project submission is treated as duplicate spam. */
const DUPLICATE_WINDOW_MIN = 30;

export type Lead = SheetLead;

export async function isDuplicate(email: string, project: string): Promise<boolean> {
  return sheets.isDuplicate(email, project, DUPLICATE_WINDOW_MIN);
}

export async function createLead(
  input: BrochureLeadInput,
  ip: string | null
): Promise<Lead> {
  return sheets.appendLead(
    { name: input.name, email: input.email, phone: input.phone, project: input.project },
    ip
  );
}

export async function listLeads(): Promise<Lead[]> {
  return sheets.listLeads();
}
