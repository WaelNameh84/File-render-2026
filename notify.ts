/**
 * AttendX — Internal Notifications
 * Creates in-app notification records in the database.
 */
import { db, notificationsTable } from "../db/client";

interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  relatedId?: number;
  relatedType?: string;
}

export async function createNotification(payload: NotificationPayload) {
  try {
    await db.insert(notificationsTable).values({
      type:        payload.type,
      title:       payload.title,
      message:     payload.message,
      relatedId:   payload.relatedId,
      relatedType: payload.relatedType,
      status:      "unread",
    });
  } catch (err) {
    console.error("[Notify] Failed to create notification:", err);
  }
}
