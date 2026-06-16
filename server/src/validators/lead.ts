import { z } from "zod";

const CONTROL_CHARS = new RegExp("[\\x00-\\x1F\\x7F]", "g");
const stripControl = (s: string) => s.replace(CONTROL_CHARS, "").trim();

const sanitized = (max: number) =>
  z
    .string()
    .transform(stripControl)
    .pipe(z.string().min(1).max(max));

export const brochureLeadSchema = z.object({
  name: sanitized(120).pipe(z.string().min(2, "Name is too short")),
  email: sanitized(160).pipe(z.string().email("Invalid email address")),
  phone: z
    .string()
    .transform((s) => s.replace(/[^\d+]/g, ""))
    .pipe(z.string().min(7).max(18, "Invalid phone number")),
  project: sanitized(80).optional().default("Aurora"),
});

export type BrochureLeadInput = z.infer<typeof brochureLeadSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
