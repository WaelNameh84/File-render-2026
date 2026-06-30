/**
 * AttendX — Gemini AI Key Management
 * Priority order: 1) DB-stored key, 2) GEMINI_API_KEY env var
 */
import { db, appSettingsTable } from "../db/client";
import { eq } from "drizzle-orm";
import { config } from "./config";

const GEMINI_KEY_DB_KEY = "gemini_api_key";

export async function getGeminiApiKey(): Promise<string | null> {
  try {
    const [row] = await db.select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, GEMINI_KEY_DB_KEY))
      .limit(1);
    if (row?.value) return row.value;
  } catch { /* fall through */ }
  return config.GEMINI_API_KEY || null;
}

export async function getGeminiKeySource(): Promise<"db" | "env" | "none"> {
  try {
    const [row] = await db.select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, GEMINI_KEY_DB_KEY))
      .limit(1);
    if (row?.value) return "db";
  } catch { /* fall through */ }
  return config.GEMINI_API_KEY ? "env" : "none";
}

export async function saveGeminiApiKey(key: string): Promise<void> {
  await db.insert(appSettingsTable)
    .values({ key: GEMINI_KEY_DB_KEY, value: key })
    .onConflictDoUpdate({ target: appSettingsTable.key, set: { value: key } });
}

export async function clearGeminiApiKey(): Promise<void> {
  await db.delete(appSettingsTable).where(eq(appSettingsTable.key, GEMINI_KEY_DB_KEY));
}

export function maskKey(key: string): string {
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 6)}${"•".repeat(Math.max(0, key.length - 10))}${key.slice(-4)}`;
}
