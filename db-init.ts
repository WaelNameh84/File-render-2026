/**
 * AttendX — Database Auto-Setup
 * Runs on every server startup. Creates all tables if they don't exist.
 * Safe to run repeatedly — uses CREATE TABLE IF NOT EXISTS.
 */
import { pool } from "../db/client";
import { logger } from "./logger";

export async function ensureTablesExist(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id                 SERIAL PRIMARY KEY,
        name               VARCHAR(255) NOT NULL,
        email              VARCHAR(255) NOT NULL UNIQUE,
        password_hash      TEXT NOT NULL,
        role               VARCHAR(20)  NOT NULL DEFAULT 'employee',
        department         VARCHAR(255),
        position           VARCHAR(255),
        phone              VARCHAR(50),
        avatar_url         TEXT,
        work_hours_per_day REAL NOT NULL DEFAULT 8,
        salary             REAL,
        is_approved        BOOLEAN NOT NULL DEFAULT false,
        created_at         TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token      TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        address    TEXT NOT NULL,
        lat        REAL,
        lng        REAL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id                  SERIAL PRIMARY KEY,
        user_id             INTEGER NOT NULL REFERENCES users(id),
        location_id         INTEGER REFERENCES locations(id),
        date                DATE NOT NULL,
        check_in            TIMESTAMP NOT NULL,
        check_out           TIMESTAMP,
        hours_worked        REAL,
        overtime            REAL,
        status              VARCHAR(30) NOT NULL DEFAULT 'present',
        notes               TEXT,
        biometric_verified  BOOLEAN NOT NULL DEFAULT false,
        created_at          TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS leave (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER NOT NULL REFERENCES users(id),
        type          VARCHAR(30) NOT NULL,
        start_date    DATE NOT NULL,
        end_date      DATE NOT NULL,
        total_days    INTEGER NOT NULL,
        reason        TEXT,
        document_path TEXT,
        status        VARCHAR(20) NOT NULL DEFAULT 'pending',
        reviewed_by   INTEGER REFERENCES users(id),
        reviewed_at   TIMESTAMP,
        created_at    TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id   INTEGER NOT NULL PRIMARY KEY REFERENCES users(id),
        theme     VARCHAR(20) NOT NULL DEFAULT 'system',
        font_size VARCHAR(20) NOT NULL DEFAULT 'medium',
        language  VARCHAR(10) NOT NULL DEFAULT 'en',
        ai_key    TEXT DEFAULT NULL
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id           SERIAL PRIMARY KEY,
        type         VARCHAR(50) NOT NULL,
        title        TEXT NOT NULL,
        message      TEXT NOT NULL,
        related_id   INTEGER,
        related_type VARCHAR(50),
        status       VARCHAR(20) NOT NULL DEFAULT 'unread',
        created_at   TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS payroll_reports (
        id                     SERIAL PRIMARY KEY,
        user_id                INTEGER NOT NULL REFERENCES users(id),
        employee_name          VARCHAR(255) NOT NULL,
        period                 VARCHAR(7) NOT NULL,
        period_start           DATE NOT NULL,
        period_end             DATE NOT NULL,
        base_salary            REAL NOT NULL,
        daily_rate             REAL NOT NULL,
        hourly_rate            REAL NOT NULL,
        working_days_in_month  INTEGER NOT NULL,
        days_present           INTEGER NOT NULL,
        days_absent            INTEGER NOT NULL,
        paid_leave_days        INTEGER NOT NULL DEFAULT 0,
        unpaid_leave_days      INTEGER NOT NULL DEFAULT 0,
        total_overtime_hours   REAL NOT NULL DEFAULT 0,
        total_late_minutes     INTEGER NOT NULL DEFAULT 0,
        overtime_bonus         REAL NOT NULL DEFAULT 0,
        late_penalty           REAL NOT NULL DEFAULT 0,
        unpaid_leave_deduction REAL NOT NULL DEFAULT 0,
        total_deductions       REAL NOT NULL DEFAULT 0,
        total_additions        REAL NOT NULL DEFAULT 0,
        net_salary             REAL NOT NULL,
        notes                  TEXT,
        generated_by           INTEGER REFERENCES users(id),
        created_at             TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS late_justifications (
        id            SERIAL PRIMARY KEY,
        attendance_id INTEGER NOT NULL REFERENCES attendance(id),
        user_id       INTEGER NOT NULL REFERENCES users(id),
        reason        TEXT NOT NULL,
        status        VARCHAR(20) NOT NULL DEFAULT 'pending',
        admin_note    TEXT,
        reviewed_by   INTEGER REFERENCES users(id),
        reviewed_at   TIMESTAMP,
        created_at    TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id           SERIAL PRIMARY KEY,
        sender_id    INTEGER NOT NULL,
        receiver_id  INTEGER,
        subject      VARCHAR(255) NOT NULL,
        body         TEXT NOT NULL,
        is_read      BOOLEAN NOT NULL DEFAULT false,
        is_broadcast BOOLEAN NOT NULL DEFAULT false,
        parent_id    INTEGER,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bonuses (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id),
        type       VARCHAR(20) NOT NULL DEFAULT 'bonus',
        amount     REAL NOT NULL,
        reason     TEXT,
        period     VARCHAR(7),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER NOT NULL REFERENCES users(id),
        type        VARCHAR(30) NOT NULL,
        date        VARCHAR(10) NOT NULL,
        start_time  VARCHAR(5),
        end_time    VARCHAR(5),
        hours       REAL,
        reason      TEXT,
        status      VARCHAR(20) NOT NULL DEFAULT 'pending',
        admin_note  TEXT,
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TIMESTAMP,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS work_reports (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id),
        image_url  TEXT NOT NULL,
        note       TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS salary_advances (
        id              SERIAL PRIMARY KEY,
        user_id         INTEGER NOT NULL REFERENCES users(id),
        amount          REAL NOT NULL,
        reason          TEXT,
        status          VARCHAR(20) NOT NULL DEFAULT 'pending',
        admin_note      TEXT,
        reviewed_by     INTEGER REFERENCES users(id),
        reviewed_at     TIMESTAMP,
        deducted_period VARCHAR(7),
        created_at      TIMESTAMP NOT NULL DEFAULT NOW()
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id    SERIAL PRIMARY KEY,
        key   VARCHAR(100) NOT NULL UNIQUE,
        value TEXT
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL UNIQUE REFERENCES users(id),
        endpoint   TEXT NOT NULL,
        p256dh     TEXT NOT NULL,
        auth       TEXT NOT NULL,
        enabled    VARCHAR(5) NOT NULL DEFAULT 'true',
        start_time VARCHAR(5) NOT NULL DEFAULT '09:00',
        end_time   VARCHAR(5) NOT NULL DEFAULT '17:00'
      )`);

    await client.query("COMMIT");
    logger.info("All database tables verified/created successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error({ err }, "Database init failed");
    throw err;
  } finally {
    client.release();
  }
}
