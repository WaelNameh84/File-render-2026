/**
 * AttendX — Central Configuration
 * ─────────────────────────────────
 * All configurable values come from environment variables.
 * Copy .env.example → .env and fill in your values before running.
 *
 * To edit on your phone:
 *   1. Open the .env file in any text editor app
 *   2. Change the values after the = sign
 *   3. Re-deploy the backend
 */
import "dotenv/config";

function require_env(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const config = {
  // ── Server ────────────────────────────────────────────────────────────────
  PORT:         parseInt(process.env.PORT ?? "8080"),
  NODE_ENV:     process.env.NODE_ENV ?? "production",
  APP_URL:      process.env.APP_URL ?? "https://your-frontend.netlify.app",

  // ── Database ──────────────────────────────────────────────────────────────
  // Get this from: Render → PostgreSQL → Connection String
  // or Neon (neon.tech) → Connection string
  DATABASE_URL: require_env("DATABASE_URL"),

  // ── Authentication ────────────────────────────────────────────────────────
  // Password hashing salt — change this before first deployment
  // IMPORTANT: Never change after users exist (it will invalidate all passwords)
  AUTH_SALT:    process.env.AUTH_SALT ?? "attendance_salt_2024",

  // ── Email (SMTP) ──────────────────────────────────────────────────────────
  // Gmail example: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587
  // Use an App Password if 2FA is enabled on Gmail
  SMTP_HOST:    process.env.SMTP_HOST ?? "",
  SMTP_PORT:    parseInt(process.env.SMTP_PORT ?? "587"),
  SMTP_USER:    process.env.SMTP_USER ?? "",
  SMTP_PASS:    process.env.SMTP_PASS ?? "",
  SMTP_FROM:    process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@attendx.app",

  // ── Gemini AI ─────────────────────────────────────────────────────────────
  // Get your key at: https://makersuite.google.com/app/apikey
  // Starts with "AIza..."
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",

  // ── Image Storage (Cloudinary) ────────────────────────────────────────────
  // Free tier at: https://cloudinary.com (25 GB storage)
  // Dashboard → Settings → API Keys
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  CLOUDINARY_API_KEY:    process.env.CLOUDINARY_API_KEY ?? "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",

  // ── Web Push Notifications (VAPID) ────────────────────────────────────────
  // Generate VAPID keys by running:  node scripts/generate-vapid.mjs
  // Then paste the output here
  VAPID_PUBLIC_KEY:  process.env.VAPID_PUBLIC_KEY ?? "",
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY ?? "",
  VAPID_EMAIL:       process.env.VAPID_EMAIL ?? "mailto:admin@attendx.app",
} as const;
