import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, gte, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { AnalyticsEvent, InsertUser, adminAuditLogs, analyticsEvents, leaderboardEntries, platformSettings, rateLimitBuckets, registrations, securityEvents, tournaments, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getSettings() {
  const db = await getDb(); if (!db) return null;
  const existing = await db.select().from(platformSettings).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(platformSettings).values({});
  const seeded = await db.select().from(platformSettings).limit(1);
  return seeded[0] ?? null;
}

export async function getLeaderboard() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(leaderboardEntries).orderBy(asc(leaderboardEntries.rank)).limit(50);
}

export async function getRegistrationByEmail(email: string) {
  const db = await getDb(); if (!db) return undefined;
  const rows = await db.select().from(registrations).where(eq(registrations.email, email)).limit(1);
  return rows[0];
}

export async function createRegistration(name: string, mobile: string, email: string, handle?: string | null) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const settings = await getSettings();
  if (!settings) throw new Error("Settings unavailable");
  return db.transaction(async tx => {
    const lockedRows = await tx.select().from(platformSettings).where(eq(platformSettings.id, settings.id)).for("update");
    const lockedSettings = lockedRows[0];
    if (!lockedSettings || lockedSettings.registrationCount >= lockedSettings.genesisCap) throw new Error("Genesis allocation is closed");
    const existingRows = await tx.select().from(registrations).where(eq(registrations.email, email)).limit(1);
    if (existingRows[0]) return existingRows[0];
    const next = lockedSettings.registrationCount + 1;
    const memberId = `#${String(next).padStart(7, "0")}`;
    const referralCode = `REX-${randomBytes(4).toString("hex").toUpperCase()}`;
    await tx.insert(registrations).values({ name, mobile, email, handle: handle || null, memberId, referralCode });
    await tx.update(platformSettings).set({ registrationCount: next }).where(eq(platformSettings.id, lockedSettings.id));
    const createdRows = await tx.select().from(registrations).where(eq(registrations.email, email)).limit(1);
    if (!createdRows[0]) throw new Error("Registration could not be created");
    return createdRows[0];
  });
}

export async function updateSettings(values: Partial<typeof platformSettings.$inferInsert>) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const settings = await getSettings(); if (!settings) throw new Error("Settings unavailable");
  await db.update(platformSettings).set(values).where(eq(platformSettings.id, settings.id));
  return getSettings();
}

export async function replaceLeaderboard(rows: Array<typeof leaderboardEntries.$inferInsert>) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.delete(leaderboardEntries);
  if (rows.length) await db.insert(leaderboardEntries).values(rows);
  return getLeaderboard();
}

export async function getRegistrations() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(registrations).orderBy(desc(registrations.createdAt));
}

export async function updateRegistration(id: number, values: Partial<typeof registrations.$inferInsert>) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.update(registrations).set(values).where(eq(registrations.id, id));
  const rows = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
  return rows[0];
}

export async function anonymizeRegistration(id: number) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.update(registrations).set({ name: null, mobile: null, email: `redacted+${id}@invalid.fortrex`, handle: null, memberId: `ANON-${id}`, multiplier: "1.25x", roiPercent: "0.00", currentRex: 0, circleSize: 0, referralCode: `ANON-REX-${id}` }).where(eq(registrations.id, id));
  return db.select().from(registrations).where(eq(registrations.id, id)).limit(1).then(rows => rows[0]);
}

export async function deleteRegistration(id: number) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.delete(registrations).where(eq(registrations.id, id));
  return { id, deleted: true as const };
}

export async function recordAdminAudit(adminUserId: number, action: string, entityType: string, entityId: string | undefined, summary: string) {
  const db = await getDb(); if (!db) return;
  const settings = await getSettings();
  const retentionDays = Math.max(14, settings?.securityRetentionDays ?? 14);
  await db.insert(adminAuditLogs).values({ adminUserId, action: action.slice(0, 64), entityType: entityType.slice(0, 64), entityId: entityId?.slice(0, 64) || null, summary: summary.replace(/[^a-zA-Z0-9_.:, -]/g, "").slice(0, 255), expiresAt: new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000) });
}

export async function getAdminAuditLogs(days = 30) {
  const db = await getDb(); if (!db) return { days, total: 0, recent: [] };
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await db.select().from(adminAuditLogs).where(gte(adminAuditLogs.occurredAt, since)).orderBy(desc(adminAuditLogs.occurredAt)).limit(500);
  return { days, total: rows.length, recent: rows.map(({ id, adminUserId, action, entityType, entityId, summary, occurredAt }) => ({ id, adminUserId, action, entityType, entityId, summary, occurredAt })) };
}

export async function purgeExpiredData() {
  const db = await getDb(); if (!db) return { registrations: 0, analytics: 0, security: 0, audit: 0 };
  const settings = await getSettings(); if (!settings) throw new Error("Settings unavailable");
  const now = Date.now();
  const registrationCutoff = new Date(now - settings.registrationRetentionDays * 24 * 60 * 60 * 1000);
  const analyticsCutoff = new Date(now - settings.analyticsRetentionDays * 24 * 60 * 60 * 1000);
  const securityCutoff = new Date(now - settings.securityRetentionDays * 24 * 60 * 60 * 1000);
  const [registrationResult, analyticsResult, securityResult, auditResult] = await Promise.all([
    db.delete(registrations).where(lt(registrations.createdAt, registrationCutoff)),
    db.delete(analyticsEvents).where(lt(analyticsEvents.occurredAt, analyticsCutoff)),
    db.delete(securityEvents).where(lt(securityEvents.expiresAt, new Date())),
    db.delete(adminAuditLogs).where(lt(adminAuditLogs.expiresAt, new Date())),
  ]);
  return { registrations: registrationResult[0]?.affectedRows ?? 0, analytics: analyticsResult[0]?.affectedRows ?? 0, security: securityResult[0]?.affectedRows ?? 0, audit: auditResult[0]?.affectedRows ?? 0 };
}

export async function recordAnalyticsEvent(eventName: string, path: string, payload?: Record<string, string | number | boolean>) {
  const db = await getDb();
  if (!db) return;
  await db.insert(analyticsEvents).values({ eventName, path, payload: payload ? JSON.stringify(payload) : null });
}

export async function consumeDistributedRateLimit(bucketKey: string, route: string, limit: number, windowMs = 60_000) {
  const db = await getDb();
  if (!db) return { allowed: true, count: 0, retryAfterSeconds: 0 };
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  await db.insert(rateLimitBuckets).values({ bucketKey, route, count: 1, windowStartedAt: now, expiresAt }).onDuplicateKeyUpdate({ set: {
    count: sql`IF(${rateLimitBuckets.expiresAt} <= NOW(), 1, ${rateLimitBuckets.count} + 1)`,
    windowStartedAt: sql`IF(${rateLimitBuckets.expiresAt} <= NOW(), ${now}, ${rateLimitBuckets.windowStartedAt})`,
    expiresAt: sql`IF(${rateLimitBuckets.expiresAt} <= NOW(), ${expiresAt}, ${rateLimitBuckets.expiresAt})`,
    updatedAt: now,
  } });
  const rows = await db.select().from(rateLimitBuckets).where(eq(rateLimitBuckets.bucketKey, bucketKey)).limit(1);
  const bucket = rows[0];
  if (!bucket) return { allowed: true, count: 0, retryAfterSeconds: 0 };
  return { allowed: bucket.count <= limit, count: bucket.count, retryAfterSeconds: Math.max(1, Math.ceil((bucket.expiresAt.getTime() - Date.now()) / 1000)) };
}

export async function recordSecurityEvent(eventType: string, route: string, keyHash?: string, metadata?: string) {
  const db = await getDb();
  if (!db) return;
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  await db.insert(securityEvents).values({ eventType, route, keyHash: keyHash || null, metadata: metadata?.slice(0, 255) || null, expiresAt });
}

export async function getSecuritySummary(days = 30) {
  const db = await getDb();
  if (!db) return { days, totalEvents: 0, byType: [], byRoute: [], recent: [], activeBuckets: 0 };
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [events, buckets] = await Promise.all([
    db.select().from(securityEvents).where(gte(securityEvents.occurredAt, since)).orderBy(desc(securityEvents.occurredAt)).limit(5000),
    db.select().from(rateLimitBuckets).where(sql`${rateLimitBuckets.expiresAt} > NOW()`).limit(2000),
  ]);
  const byType = new Map<string, number>();
  const byRoute = new Map<string, number>();
  for (const event of events) {
    byType.set(event.eventType, (byType.get(event.eventType) || 0) + 1);
    byRoute.set(event.route, (byRoute.get(event.route) || 0) + 1);
  }
  return {
    days,
    totalEvents: events.length,
    activeBuckets: buckets.length,
    byType: Array.from(byType.entries()).sort(([, a], [, b]) => b - a).map(([eventType, count]) => ({ eventType, count })),
    byRoute: Array.from(byRoute.entries()).sort(([, a], [, b]) => b - a).map(([route, count]) => ({ route, count })),
    recent: events.slice(0, 40).map(({ id, eventType, route, metadata, occurredAt }) => ({ id, eventType, route, metadata, occurredAt })),
  };
}

export async function getAnalyticsSummary(days = 30) {
  const db = await getDb();
  if (!db) return { days, totalEvents: 0, daily: [], topEvents: [], recent: [] };
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await db.select().from(analyticsEvents).where(gte(analyticsEvents.occurredAt, since)).orderBy(desc(analyticsEvents.occurredAt)).limit(5000);
  const eventCounts = new Map<string, number>();
  const dailyCounts = new Map<string, number>();
  for (const row of rows) {
    eventCounts.set(row.eventName, (eventCounts.get(row.eventName) || 0) + 1);
    const date = row.occurredAt.toISOString().slice(0, 10);
    dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
  }
  return {
    days,
    totalEvents: rows.length,
    daily: Array.from(dailyCounts.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count })),
    topEvents: Array.from(eventCounts.entries()).sort(([, a], [, b]) => b - a).slice(0, 12).map(([eventName, count]) => ({ eventName, count })),
    recent: rows.slice(0, 30).map(({ id, eventName, path, payload, occurredAt }) => ({ id, eventName, path, payload, occurredAt })),
  };
}

export async function getTournaments() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(tournaments).orderBy(desc(tournaments.startsAt)).limit(50);
}

export async function createTournament(input: typeof tournaments.$inferInsert) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.insert(tournaments).values(input);
  return getTournaments();
}
