/**
 * ============================================================
 *  AttendX — Quick Configuration Reference
 *  ============================================================
 *
 *  This file documents EVERY configurable value in AttendX.
 *  The actual values live in .env files:
 *    - backend/.env   (never commit this)
 *    - frontend/.env  (never commit this)
 *
 *  How to edit from your phone:
 *  1. Open Files app → navigate to backend/.env or frontend/.env
 *  2. Open with any text editor app (e.g. Textastic, iSH, etc.)
 *  3. Change the value after the = sign
 *  4. Re-deploy the backend (push to GitHub → Render auto-deploys)
 *     OR re-deploy the frontend (push to GitHub → Netlify auto-deploys)
 *
 *  ============================================================
 */

const CONFIG_REFERENCE = {

  // ── BACKEND (backend/.env) ───────────────────────────────

  backend: {

    // Server
    PORT:         "8080",              // Port the API server listens on
    NODE_ENV:     "production",         // "production" or "development"
    APP_URL:      "https://your-frontend.netlify.app",  // Your Netlify URL

    // Allowed CORS origins — set to your Netlify URL for security
    CORS_ORIGIN:  "https://your-frontend.netlify.app",

    // PostgreSQL database connection string
    // Get from: neon.tech (free) or Render PostgreSQL
    DATABASE_URL: "postgresql://user:pass@host:5432/db?sslmode=require",

    // Password hashing salt — set ONCE before first user registers
    // WARNING: Changing this breaks all existing user passwords
    AUTH_SALT:    "change_this_to_something_secret",

    // Email (Gmail)
    SMTP_HOST:    "smtp.gmail.com",
    SMTP_PORT:    "587",
    SMTP_USER:    "your-gmail@gmail.com",
    SMTP_PASS:    "your-app-password",   // NOT your Gmail password — use App Password
    SMTP_FROM:    "AttendX <your-gmail@gmail.com>",

    // Google Gemini AI
    GEMINI_API_KEY: "AIzaXXXXXXXXXXXXXX",  // https://makersuite.google.com/app/apikey

    // Cloudinary (image uploads for work reports)
    CLOUDINARY_CLOUD_NAME: "your_cloud_name",
    CLOUDINARY_API_KEY:    "123456789012345",
    CLOUDINARY_API_SECRET: "your_secret",

    // Web push notification keys (generate with: node scripts/generate-vapid.mjs)
    VAPID_PUBLIC_KEY:  "generated_public_key",
    VAPID_PRIVATE_KEY: "generated_private_key",
    VAPID_EMAIL:       "mailto:admin@your-domain.com",
  },

  // ── FRONTEND (frontend/.env) ─────────────────────────────

  frontend: {
    // Your backend API URL (from Render or Railway)
    VITE_API_URL:         "https://your-backend.onrender.com",

    // Push notification public key (same as VAPID_PUBLIC_KEY above)
    VITE_VAPID_PUBLIC_KEY: "generated_public_key",
  },
};

module.exports = CONFIG_REFERENCE;
