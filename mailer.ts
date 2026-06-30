/**
 * AttendX — Email Service
 * Uses nodemailer (SMTP). Configure via SMTP_* env vars.
 * Emails are silently skipped if SMTP is not configured.
 */
import nodemailer from "nodemailer";
import { db, usersTable } from "../db/client";
import { eq } from "drizzle-orm";
import { config } from "./config";

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = config;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function send(to: string, subject: string, html: string) {
  const transport = createTransport();
  if (!transport) {
    console.log(`[Mailer] SMTP not configured — skipping email to <${to}>`);
    return;
  }
  await transport.sendMail({ from: config.SMTP_FROM, to, subject, html });
}

export async function getAdminEmails(): Promise<string[]> {
  try {
    const admins = await db.select({ email: usersTable.email })
      .from(usersTable).where(eq(usersTable.role, "admin"));
    return admins.map(a => a.email).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export async function sendNewUserNotificationToAdmin(
  user: { name: string; email: string; role: string },
  appUrl: string,
) {
  const adminEmails = await getAdminEmails();
  if (!adminEmails.length) return;

  const subject = `[AttendX] New Account Pending Approval — ${user.name}`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;">
      <h2 style="color:#1d4ed8;">New Sign-up Awaiting Approval</h2>
      <p>A new user has registered and is waiting for your approval:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px;color:#555;"><strong>Name</strong></td><td style="padding:8px;">${user.name}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:8px;color:#555;"><strong>Email</strong></td><td style="padding:8px;">${user.email}</td></tr>
        <tr><td style="padding:8px;color:#555;"><strong>Role</strong></td><td style="padding:8px;">${user.role}</td></tr>
      </table>
      <a href="${appUrl}/dashboard" style="display:inline-block;padding:10px 20px;background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">Open Admin Dashboard</a>
    </div>`;

  for (const email of adminEmails) await send(email, subject, html);
}

export async function sendApprovalNotificationToUser(user: { name: string; email: string }, appUrl: string) {
  await send(user.email, "[AttendX] Your Account Has Been Approved!", `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;">
      <h2 style="color:#16a34a;">Your Account Has Been Approved</h2>
      <p>Hi ${user.name},</p>
      <p>Your AttendX account has been approved. You can now log in:</p>
      <a href="${appUrl}/login" style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">Log In Now</a>
    </div>`);
}

export async function sendRejectionNotificationToUser(user: { name: string; email: string }) {
  await send(user.email, "[AttendX] Account Registration Update", `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;">
      <h2 style="color:#dc2626;">Account Request Not Approved</h2>
      <p>Hi ${user.name},</p>
      <p>Your registration request for AttendX has not been approved. Please contact your administrator.</p>
    </div>`);
}
