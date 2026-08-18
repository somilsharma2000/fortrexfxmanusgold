import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const platformSettings = mysqlTable("platform_settings", {
  id: int("id").autoincrement().primaryKey(),
  genesisCap: int("genesisCap").default(10000).notNull(),
  registrationCount: int("registrationCount").default(1842).notNull(),
  tierOneMultiplier: varchar("tierOneMultiplier", { length: 16 }).default("1.25x").notNull(),
  tierTwoMultiplier: varchar("tierTwoMultiplier", { length: 16 }).default("1.50x").notNull(),
  tierThreeMultiplier: varchar("tierThreeMultiplier", { length: 16 }).default("2.00x").notNull(),
  tierOneProgress: int("tierOneProgress").default(72).notNull(),
  tierTwoProgress: int("tierTwoProgress").default(38).notNull(),
  tierThreeProgress: int("tierThreeProgress").default(14).notNull(),
  registrationRetentionDays: int("registrationRetentionDays").default(365).notNull(),
  analyticsRetentionDays: int("analyticsRetentionDays").default(90).notNull(),
  securityRetentionDays: int("securityRetentionDays").default(14).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const registrations = mysqlTable("registrations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }),
  mobile: varchar("mobile", { length: 32 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  handle: varchar("handle", { length: 120 }),
  memberId: varchar("memberId", { length: 32 }).notNull().unique(),
  multiplier: varchar("multiplier", { length: 16 }).default("1.25x").notNull(),
  roiPercent: decimal("roiPercent", { precision: 10, scale: 2 }).default("0.00").notNull(),
  currentRex: int("currentRex").default(0).notNull(),
  circleSize: int("circleSize").default(0).notNull(),
  referralCode: varchar("referralCode", { length: 32 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const leaderboardEntries = mysqlTable("leaderboard_entries", {
  id: int("id").autoincrement().primaryKey(),
  rank: int("rank").notNull(),
  architectId: varchar("architectId", { length: 32 }).notNull(),
  circleSize: int("circleSize").default(0).notNull(),
  multiplier: varchar("multiplier", { length: 16 }).notNull(),
  rexAllocation: int("rexAllocation").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  eventName: varchar("eventName", { length: 80 }).notNull(),
  path: varchar("path", { length: 255 }).notNull().default("/"),
  payload: text("payload"),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
});

export const rateLimitBuckets = mysqlTable("rate_limit_buckets", {
  id: int("id").autoincrement().primaryKey(),
  bucketKey: varchar("bucketKey", { length: 128 }).notNull().unique(),
  route: varchar("route", { length: 96 }).notNull(),
  count: int("count").default(0).notNull(),
  windowStartedAt: timestamp("windowStartedAt").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const securityEvents = mysqlTable("security_events", {
  id: int("id").autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 48 }).notNull(),
  route: varchar("route", { length: 96 }).notNull(),
  keyHash: varchar("keyHash", { length: 64 }),
  metadata: varchar("metadata", { length: 255 }),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const adminAuditLogs = mysqlTable("admin_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminUserId: int("adminUserId").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: varchar("entityId", { length: 64 }),
  summary: varchar("summary", { length: 255 }).notNull(),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const tournaments = mysqlTable("tournaments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  status: mysqlEnum("status", ["draft", "scheduled", "live", "complete"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PlatformSettings = typeof platformSettings.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type RateLimitBucket = typeof rateLimitBuckets.$inferSelect;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
