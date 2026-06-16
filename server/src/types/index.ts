export interface Lead {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  status: string;
  notes: string;
}

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  project: string;
}

/**
 * Storage-agnostic repository contract.
 * Swap the concrete implementation (Apps Script, Postgres, CRM) without
 * touching routes, controllers, or the email service.
 */
export interface LeadRepository {
  /**
   * Persist a new lead.
   * Returns the stored lead and a `duplicate` flag (true = already existed
   * within the dedup window; row was NOT appended again).
   */
  submit(
    input: LeadInput,
    ip: string | null
  ): Promise<{ lead: Lead; duplicate: boolean }>;

  /** Return all leads, newest first. */
  list(): Promise<Lead[]>;
}
