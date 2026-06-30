# AttendX Backend

## Render Deployment Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | *(leave empty)* |
| **Start Command** | `node --enable-source-maps index.mjs` |
| **Node Version** | 20 |

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL/Neon connection string |
| `NODE_ENV` | ✅ Yes | Set to `production` |
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini AI key (starts with AIza) |
| `VAPID_PUBLIC_KEY` | Optional | Push notifications public key |
| `VAPID_PRIVATE_KEY` | Optional | Push notifications private key |
| `VAPID_EMAIL` | Optional | Email for VAPID (e.g. mailto:you@email.com) |
| `CLOUDINARY_CLOUD_NAME` | Optional | Image uploads |
| `CLOUDINARY_API_KEY` | Optional | Image uploads |
| `CLOUDINARY_API_SECRET` | Optional | Image uploads |
| `APP_URL` | Optional | Your Netlify URL for push notification links |
| `SMTP_HOST` | Optional | Email sending |
| `SMTP_PORT` | Optional | Email port (587) |
| `SMTP_USER` | Optional | Email username |
| `SMTP_PASS` | Optional | Email password |

> **Note:** `PORT` is set automatically by Render — do NOT add it manually.
