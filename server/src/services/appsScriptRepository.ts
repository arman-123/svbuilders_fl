import { env } from "../config/env.js";
import type { Lead, LeadInput, LeadRepository } from "../types/index.js";

const TIMEOUT_MS = 12_000;

/**
 * Apps Script executes doPost on the first POST to /exec, then returns a 302
 * whose Location points to a script.googleusercontent.com URL that serves the
 * response body — as a GET. Re-POSTing to that URL gives 405.
 * Correct flow: POST /exec (runs doPost) → GET the redirect URL (reads response).
 */
async function postScript<T>(payload: Record<string, unknown>): Promise<T> {
  const { url, secret } = env.appsScript;
  if (!url) throw new Error("APPS_SCRIPT_URL is not configured.");

  const body = JSON.stringify({ ...payload, secret });

  const hop1 = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // Google always redirects; the Location URL serves the script's return value.
  const target =
    hop1.status >= 300 && hop1.status < 400
      ? (hop1.headers.get("location") ?? url)
      : url;

  const hop2 = await fetch(target, {
    method: "GET",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!hop2.ok) {
    throw new Error(`Apps Script responded HTTP ${hop2.status}`);
  }
  return hop2.json() as Promise<T>;
}

async function getScript<T>(params: Record<string, string> = {}): Promise<T> {
  const { url, secret } = env.appsScript;
  if (!url) throw new Error("APPS_SCRIPT_URL is not configured.");

  const qs = new URLSearchParams({ secret, ...params }).toString();
  const res = await fetch(`${url}?${qs}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) throw new Error(`Apps Script responded HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Repository implementation ──────────────────────────────────────────────

class AppsScriptRepository implements LeadRepository {
  async submit(
    input: LeadInput,
    ip: string | null
  ): Promise<{ lead: Lead; duplicate: boolean }> {
    const timestamp = new Date().toISOString();

    const res = await postScript<{
      ok: boolean;
      duplicate: boolean;
      error?: string;
    }>({
      action: "submit",
      timestamp,
      name: input.name,
      email: input.email,
      phone: input.phone,
      project: input.project,
      ip: ip ?? "",
    });

    if (!res.ok) {
      throw new Error(res.error ?? "Apps Script returned an error.");
    }

    const lead: Lead = {
      timestamp,
      name: input.name,
      email: input.email,
      phone: input.phone,
      project: input.project,
      status: "New",
      notes: "",
    };

    return { lead, duplicate: res.duplicate };
  }

  async list(): Promise<Lead[]> {
    const res = await getScript<{
      ok: boolean;
      leads: Lead[];
      error?: string;
    }>();

    if (!res.ok) {
      throw new Error(res.error ?? "Apps Script returned an error.");
    }
    return res.leads;
  }
}

export const leadRepository: LeadRepository = new AppsScriptRepository();
