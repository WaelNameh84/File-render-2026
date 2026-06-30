# AttendX — HR & Employee Attendance System

A full-stack, mobile-first HR platform with attendance tracking, payroll, AI assistant, leave management, and push notifications.

---

## Project Structure

```
AttendX/
├── config.js              ← Master configuration reference (read this first)
├── netlify.toml           ← Netlify deployment configuration (frontend)
│
├── backend/               ← Express.js API server (Node.js)
│   ├── .env.example       ← Copy to .env and fill in your values
│   ├── package.json
│   ├── tsconfig.json
│   ├── scripts/
│   │   └── generate-vapid.mjs   ← Run once to get push notification keys
│   └── src/
│       ├── index.ts       ← Entry point
│       ├── app.ts         ← Express app + middleware
│       ├── db/
│       │   ├── schema.ts  ← All database table definitions
│       │   └── client.ts  ← PostgreSQL connection
│       ├── lib/
│       │   ├── config.ts  ← Reads all env vars (edit .env, not this)
│       │   ├── db-init.ts ← Auto-creates DB tables on startup
│       │   ├── mailer.ts  ← Email notifications (SMTP)
│       │   ├── notify.ts  ← In-app notifications
│       │   ├── gemini-config.ts ← AI key management
│       │   └── logger.ts  ← Structured logging
│       └── routes/
│           ├── auth.ts         ← Login, register, sessions
│           ├── users.ts        ← Employee management
│           ├── attendance.ts   ← Check-in/out, summaries
│           ├── leave.ts        ← Leave requests & approval
│           ├── payroll.ts      ← Salary calculation & reports
│           ├── ai.ts           ← Gemini AI chat assistant
│           ├── push.ts         ← Web push notifications
│           ├── work-reports.ts ← Photo task documentation
│           ├── messages.ts     ← Internal messaging
│           ├── bonuses.ts      ← Bonuses & deductions
│           ├── departments.ts  ← Department management
│           ├── locations.ts    ← Work locations
│           ├── requests.ts     ← Time-off requests
│           ├── salary-advances.ts ← Salary advance requests
│           ├── settings.ts     ← App & user settings
│           ├── notifications.ts ← Notification feed
│           ├── reports.ts      ← Attendance reports
│           └── admin.ts        ← Admin panel actions
│
└── frontend/              ← React + Vite SPA (TypeScript)
    ├── .env.example       ← Copy to .env and fill in your values
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx       ← App entry point
        ├── App.tsx        ← Router setup
        ├── i18n.ts        ← Multi-language (AR/EN/SV)
        ├── pages/         ← All application pages/screens
        ├── components/    ← Shared UI components
        ├── hooks/         ← React hooks (auth, settings, offline)
        └── lib/           ← Utilities (API client, PDF export)
```

---

## Step-by-Step Deployment Guide

### Step 1 — Set Up a Free PostgreSQL Database

**Recommended: [Neon](https://neon.tech)** (free, generous limits)

1. Go to https://neon.tech and sign up
2. Create a new project → name it `attendx`
3. Copy the **Connection string** (looks like `postgresql://...`)
4. Save it — you'll need it for `DATABASE_URL`

---

### Step 2 — Deploy the Backend to Render (Free)

**[Render](https://render.com)** hosts the API server for free.

1. Push the `backend/` folder to a GitHub repository
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to your users
5. Add **Environment Variables** (from `backend/.env.example`):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon connection string |
   | `PORT` | `8080` |
   | `NODE_ENV` | `production` |
   | `APP_URL` | Your Netlify URL (fill in after step 3) |
   | `CORS_ORIGIN` | Your Netlify URL |
   | `AUTH_SALT` | Any secret phrase (e.g. `my-secret-2024`) |
   | `SMTP_HOST` | `smtp.gmail.com` (optional) |
   | `SMTP_PORT` | `587` (optional) |
   | `SMTP_USER` | Your Gmail address (optional) |
   | `SMTP_PASS` | Your Gmail App Password (optional) |
   | `GEMINI_API_KEY` | From https://makersuite.google.com (optional) |
   | `CLOUDINARY_CLOUD_NAME` | From cloudinary.com (optional) |
   | `CLOUDINARY_API_KEY` | From cloudinary.com (optional) |
   | `CLOUDINARY_API_SECRET` | From cloudinary.com (optional) |
   | `VAPID_PUBLIC_KEY` | Run `node scripts/generate-vapid.mjs` |
   | `VAPID_PRIVATE_KEY` | Run `node scripts/generate-vapid.mjs` |
   | `VAPID_EMAIL` | `mailto:admin@your-domain.com` |

6. Click **Deploy** — wait for the build to complete
7. Copy your Render URL (e.g. `https://attendx-api.onrender.com`)

---

### Step 3 — Deploy the Frontend to Netlify

1. Push the `frontend/` folder to a GitHub repository (can be same or different repo)
2. Go to https://netlify.com → Add new site → Import from Git
3. Configure build settings:
   - **Base directory**: *(leave blank)*
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
4. Add **Environment Variables** in Netlify UI:
   - Site Settings → Environment Variables → Add

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Your Render backend URL |
   | `VITE_VAPID_PUBLIC_KEY` | Same as `VAPID_PUBLIC_KEY` from backend |

5. Click **Deploy site**
6. Copy your Netlify URL (e.g. `https://my-attendx.netlify.app`)

7. **Important**: Go back to Render → Environment Variables → Update:
   - `APP_URL` → Your Netlify URL
   - `CORS_ORIGIN` → Your Netlify URL
   - Click **Manual Deploy** → Deploy latest commit

---

### Step 4 — Generate VAPID Keys (Push Notifications)

```bash
cd backend
npm install
node scripts/generate-vapid.mjs
```

Copy the output into:
- Backend `.env`: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`
- Frontend `.env`: `VITE_VAPID_PUBLIC_KEY`

---

### Step 5 — Create Your First Admin Account

1. Open your Netlify URL
2. Click **Register**
3. Select role: **Admin**
4. Admin accounts are auto-approved — you can log in immediately

---

## Updating Configuration from Your Phone

### Method A: Edit `.env` files directly

1. Connect to your server via SSH (Render provides a shell)
2. Open `backend/.env` in a text editor
3. Change the value after `=`
4. Restart the service

### Method B: Netlify / Render Dashboard (easier on mobile)

**For backend (Render)**:
1. Open https://render.com on your phone
2. Go to your service → Environment
3. Find the variable → Edit → Save
4. The server restarts automatically

**For frontend (Netlify)**:
1. Open https://netlify.com on your phone
2. Go to your site → Site configuration → Environment variables
3. Edit the variable → Save
4. Go to Deploys → Trigger deploy

### Method C: In-App Settings (no redeploy needed)

The following can be changed inside the app without redeploying:
- **Gemini AI key**: Settings → AI Assistant → Enter API Key
- **App name & logo**: Admin Dashboard → App Settings
- **Work start time**: Admin Dashboard → App Settings
- **Late threshold**: Admin Dashboard → App Settings

---

## Gmail App Password Setup

If you want email notifications:
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already on
3. Search for "App passwords" → Create one for "Mail"
4. Use that 16-character password as `SMTP_PASS` (not your Gmail password)

---

## Cloudinary Setup (Image Storage)

For work report photo uploads:
1. Sign up free at https://cloudinary.com
2. Dashboard → Settings → API Keys → Generate New Pair
3. Copy: Cloud Name, API Key, API Secret
4. Add to backend `.env`

---

## Features

| Feature | Description |
|---|---|
| 🕐 Attendance | Check-in/out with GPS location, multiple sessions per day |
| 📊 Dashboard | Real-time stats, employee summary, charts |
| 💰 Payroll | Automated salary calculation (overtime × 1.5 − late penalties − deductions) |
| 📅 Leave | Request & approval workflow (annual, sick, emergency, unpaid) |
| 🤖 AI Assistant | Gemini-powered HR chatbot, supports Arabic/English/Swedish |
| 📷 Work Reports | Photo documentation with Cloudinary upload |
| 🔔 Push Alerts | Browser push notifications for shift start/end |
| 💬 Messages | Internal staff messaging with broadcasts |
| 🌍 Multi-language | Arabic (RTL), English, Swedish |
| 🎨 Themes | 10 color themes + dark/light/system mode |
| 📱 Mobile-first | Optimized for iOS/Android browsers |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | Radix UI + shadcn/ui |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Drizzle ORM) |
| Authentication | Bearer tokens (SHA-256 + salt, 7-day sessions) |
| AI | Google Gemini 1.5 Flash |
| Email | Nodemailer (SMTP) |
| Image Storage | Cloudinary (with base64 DB fallback) |
| Push Notifications | Web Push API + VAPID |
| Hosting | Netlify (frontend) + Render (backend) |

---

## Payroll Formula

```
Net Salary = Base Salary
           + Overtime Hours × Hourly Rate × 1.5
           + Admin Bonuses
           − Late Minutes × (Hourly Rate / 60)
           − Unpaid Leave Days × Daily Rate
           − Absent Days × Daily Rate
           − Admin Deductions
```

---

## Security Notes

- Never commit `.env` files to version control
- Change `AUTH_SALT` before your first user registers
- Use a strong, unique `AUTH_SALT` (e.g. a random 32-character string)
- Restrict `CORS_ORIGIN` to your Netlify URL in production
- Use App Passwords for Gmail, never your actual password
- Rotate your Gemini API key if it gets exposed

---

## Support

- Database issues: Check Render logs → your service → Logs tab
- Frontend issues: Check Netlify → Deploys → Build log
- API errors: Add `/api/healthz` to your backend URL to test connectivity
