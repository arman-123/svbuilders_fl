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

  appsScript: {
    url: process.env.APPS_SCRIPT_URL ?? "",
    secret: process.env.APPS_SCRIPT_SECRET ?? "",
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

  internalNotifyEmail:
    process.env.INTERNAL_NOTIFY_EMAIL ?? "marketing@svdevelopers.in",
};
