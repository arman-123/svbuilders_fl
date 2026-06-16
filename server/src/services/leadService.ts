import { leadRepository } from "./appsScriptRepository.js";
import type { Lead } from "../types/index.js";
import type { BrochureLeadInput } from "../validators/lead.js";

export type { Lead };

export async function submitLead(
  input: BrochureLeadInput,
  ip: string | null
): Promise<{ lead: Lead; duplicate: boolean }> {
  return leadRepository.submit(
    {
      name: input.name,
      email: input.email,
      phone: input.phone,
      project: input.project,
    },
    ip
  );
}

export async function listLeads(): Promise<Lead[]> {
  return leadRepository.list();
}
