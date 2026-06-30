/**
 * AttendX — VAPID Key Generator
 * Run once before deploying to generate push notification keys.
 *
 * Usage:
 *   node scripts/generate-vapid.mjs
 *
 * Then paste the output into your backend .env file.
 */
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("\n✅ VAPID Keys Generated!\n");
console.log("Add these to your backend .env file:\n");
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_EMAIL=mailto:admin@your-domain.com`);
console.log("\nAlso add the public key to your frontend .env:");
console.log(`VITE_VAPID_PUBLIC_KEY=${keys.publicKey}\n`);
