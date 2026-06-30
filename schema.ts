/**
 * AttendX — Database Schema
 * All table definitions in one place. Drizzle ORM + PostgreSQL.
 */
import {
  pgTable, serial, varchar, text, boolean, real,
  integer, timestamp, date,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id:               serial("id").primaryKey(),
  name:             varchar("name", { length: 255 }).notNull(),
  email:            varchar("email", { length: 255 }).notNull().unique(),
  passwordHash:     text("password_hash").notNull(),
  role:             varchar("role", { length: 20 }).notNull().default("employee"),
  department:       varchar("department", { length: 255 }),
  position:         varchar("position", { length: 255 }),
  phone:            varchar("phone", { length: 50 }),
  avatarUrl:        text("avatar_url"),
  workHoursPerDay:  real("work_hours_per_day").notNull().default(8),
  salary:           real("salary"),
  isApproved:       boolean("is_approved").notNull().default(false),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  token:     text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const departmentsTable = pgTable("departments", {
  id:        serial("id").primaryKey(),
  name:      varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const locationsTable = pgTable("locations", {
  id:        serial("id").primaryKey(),
  name:      varchar("name", { length: 255 }).notNull(),
  address:   text("address").notNull(),
  lat:       real("lat"),
  lng:       real("lng"),
  createdBy: integer("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attendanceTable = pgTable("attendance", {
  id:                serial("id").primaryKey(),
  userId:            integer("user_id").notNull().references(() => usersTable.id),
  locationId:        integer("location_id").references(() => locationsTable.id),
  date:              date("date").notNull(),
  checkIn:           timestamp("check_in").notNull(),
  checkOut:          timestamp("check_out"),
  hoursWorked:       real("hours_worked"),
  overtime:          real("overtime"),
  status:            varchar("status", { length: 30 }).notNull().default("present"),
  notes:             text("notes"),
  biometricVerified: boolean("biometric_verified").notNull().default(false),
  createdAt:         timestamp("created_at").notNull().defaultNow(),
});

export const leaveTable = pgTable("leave", {
  id:           serial("id").primaryKey(),
  userId:       integer("user_id").notNull().references(() => usersTable.id),
  type:         varchar("type", { length: 30 }).notNull(),
  startDate:    date("start_date").notNull(),
  endDate:      date("end_date").notNull(),
  totalDays:    integer("total_days").notNull(),
  reason:       text("reason"),
  documentPath: text("document_path"),
  status:       varchar("status", { length: 20 }).notNull().default("pending"),
  reviewedBy:   integer("reviewed_by").references(() => usersTable.id),
  reviewedAt:   timestamp("reviewed_at"),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

export const userSettingsTable = pgTable("user_settings", {
  userId:   integer("user_id").notNull().primaryKey().references(() => usersTable.id),
  theme:    varchar("theme", { length: 20 }).notNull().default("system"),
  fontSize: varchar("font_size", { length: 20 }).notNull().default("medium"),
  language: varchar("language", { length: 10 }).notNull().default("en"),
  aiKey:    text("ai_key"),
});

export const notificationsTable = pgTable("notifications", {
  id:          serial("id").primaryKey(),
  type:        varchar("type", { length: 50 }).notNull(),
  title:       text("title").notNull(),
  message:     text("message").notNull(),
  relatedId:   integer("related_id"),
  relatedType: varchar("related_type", { length: 50 }),
  status:      varchar("status", { length: 20 }).notNull().default("unread"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
});

export const payrollReportsTable = pgTable("payroll_reports", {
  id:                   serial("id").primaryKey(),
  userId:               integer("user_id").notNull().references(() => usersTable.id),
  employeeName:         varchar("employee_name", { length: 255 }).notNull(),
  period:               varchar("period", { length: 7 }).notNull(),
  periodStart:          date("period_start").notNull(),
  periodEnd:            date("period_end").notNull(),
  baseSalary:           real("base_salary").notNull(),
  dailyRate:            real("daily_rate").notNull(),
  hourlyRate:           real("hourly_rate").notNull(),
  workingDaysInMonth:   integer("working_days_in_month").notNull(),
  daysPresent:          integer("days_present").notNull(),
  daysAbsent:           integer("days_absent").notNull(),
  paidLeaveDays:        integer("paid_leave_days").notNull().default(0),
  unpaidLeaveDays:      integer("unpaid_leave_days").notNull().default(0),
  totalOvertimeHours:   real("total_overtime_hours").notNull().default(0),
  totalLateMinutes:     integer("total_late_minutes").notNull().default(0),
  overtimeBonus:        real("overtime_bonus").notNull().default(0),
  latePenalty:          real("late_penalty").notNull().default(0),
  unpaidLeaveDeduction: real("unpaid_leave_deduction").notNull().default(0),
  totalDeductions:      real("total_deductions").notNull().default(0),
  totalAdditions:       real("total_additions").notNull().default(0),
  netSalary:            real("net_salary").notNull(),
  notes:                text("notes"),
  generatedBy:          integer("generated_by").references(() => usersTable.id),
  createdAt:            timestamp("created_at").notNull().defaultNow(),
});

export const lateJustificationsTable = pgTable("late_justifications", {
  id:           serial("id").primaryKey(),
  attendanceId: integer("attendance_id").notNull().references(() => attendanceTable.id),
  userId:       integer("user_id").notNull().references(() => usersTable.id),
  reason:       text("reason").notNull(),
  status:       varchar("status", { length: 20 }).notNull().default("pending"),
  adminNote:    text("admin_note"),
  reviewedBy:   integer("reviewed_by").references(() => usersTable.id),
  reviewedAt:   timestamp("reviewed_at"),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id:          serial("id").primaryKey(),
  senderId:    integer("sender_id").notNull(),
  receiverId:  integer("receiver_id"),
  subject:     varchar("subject", { length: 255 }).notNull(),
  body:        text("body").notNull(),
  isRead:      boolean("is_read").notNull().default(false),
  isBroadcast: boolean("is_broadcast").notNull().default(false),
  parentId:    integer("parent_id"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
});

export const bonusesTable = pgTable("bonuses", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => usersTable.id),
  type:      varchar("type", { length: 20 }).notNull().default("bonus"),
  amount:    real("amount").notNull(),
  reason:    text("reason"),
  period:    varchar("period", { length: 7 }),
  createdBy: integer("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const requestsTable = pgTable("requests", {
  id:         serial("id").primaryKey(),
  userId:     integer("user_id").notNull().references(() => usersTable.id),
  type:       varchar("type", { length: 30 }).notNull(),
  date:       varchar("date", { length: 10 }).notNull(),
  startTime:  varchar("start_time", { length: 5 }),
  endTime:    varchar("end_time", { length: 5 }),
  hours:      real("hours"),
  reason:     text("reason"),
  status:     varchar("status", { length: 20 }).notNull().default("pending"),
  adminNote:  text("admin_note"),
  reviewedBy: integer("reviewed_by").references(() => usersTable.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
});

export const workReportsTable = pgTable("work_reports", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => usersTable.id),
  imageUrl:  text("image_url").notNull(),
  note:      text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const salaryAdvancesTable = pgTable("salary_advances", {
  id:             serial("id").primaryKey(),
  userId:         integer("user_id").notNull().references(() => usersTable.id),
  amount:         real("amount").notNull(),
  reason:         text("reason"),
  status:         varchar("status", { length: 20 }).notNull().default("pending"),
  adminNote:      text("admin_note"),
  reviewedBy:     integer("reviewed_by").references(() => usersTable.id),
  reviewedAt:     timestamp("reviewed_at"),
  deductedPeriod: varchar("deducted_period", { length: 7 }),
  createdAt:      timestamp("created_at").notNull().defaultNow(),
});

export const appSettingsTable = pgTable("app_settings", {
  id:    serial("id").primaryKey(),
  key:   varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
});

export const pushSubscriptionsTable = pgTable("push_subscriptions", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().unique().references(() => usersTable.id),
  endpoint:  text("endpoint").notNull(),
  p256dh:    text("p256dh").notNull(),
  auth:      text("auth").notNull(),
  enabled:   varchar("enabled", { length: 5 }).notNull().default("true"),
  startTime: varchar("start_time", { length: 5 }).notNull().default("09:00"),
  endTime:   varchar("end_time", { length: 5 }).notNull().default("17:00"),
});
