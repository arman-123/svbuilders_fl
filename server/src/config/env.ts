import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:8080")
    .split(",")
    .map((s) => s.trim()),

  google: {
    sheetId: process.env.GOOGLE_SHEET_ID ?? "",
    // Service-account credentials. The private key is stored with literal "\n"
    // in .env, so we unescape it back to real newlines here.
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL ?? "",
    privateKey: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    sheetName: process.env.GOOGLE_SHEET_NAME ?? "Leads",
  },

  jwtSecret: required("JWT_SECRET", "dev-insecure-secret-change-me"),
  adminEmail: required("ADMIN_EMAIL", "admin@svdevelopers.com"),
  adminPassword: required("ADMIN_PASSWORD", "change-this-strong-password"),

  smtp: {
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "marketing@svdevelopers.in",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.MAIL_FROM ?? "SV Developers <marketing@svdevelopers.in>",
  },

  brochurePath: process.env.BROCHURE_PATH ?? "./assets/aurora-brochure.pdf",
};
