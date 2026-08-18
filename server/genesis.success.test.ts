import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createRegistration: vi.fn(async (name: string, mobile: string, email: string) => ({ id: 1, name, mobile, email, memberId: "#0000001", multiplier: "1.25x", currentRex: 0, circleSize: 0, referralCode: "REX-TEST01", createdAt: new Date() })),
  getRegistrationByEmail: vi.fn(async () => undefined),
  getSettings: vi.fn(async () => ({ id: 1, genesisCap: 10000, registrationCount: 1842, tierOneMultiplier: "1.25x", tierTwoMultiplier: "1.50x", tierThreeMultiplier: "2.00x", tierOneProgress: 72, tierTwoProgress: 38, tierThreeProgress: 14, updatedAt: new Date() })),
  updateSettings: vi.fn(async (values: Record<string, unknown>) => ({ id: 1, ...values })),
  getLeaderboard: vi.fn(async () => []),
  getRegistrations: vi.fn(async () => []),
  updateRegistration: vi.fn(async (_id: number, values: Record<string, unknown>) => ({ id: 1, ...values })),
  recordAnalyticsEvent: vi.fn(async () => undefined),
  recordSecurityEvent: vi.fn(async () => undefined),
  getSecuritySummary: vi.fn(async (days: number) => ({ days, totalEvents: 2, activeBuckets: 1, byType: [{ eventType: "rate_limit_blocked", count: 2 }], byRoute: [{ route: "genesis.register", count: 2 }], recent: [] })),
  getAnalyticsSummary: vi.fn(async (days: number) => ({ days, totalEvents: 3, daily: [{ date: "2026-08-17", count: 3 }], topEvents: [{ eventName: "fortrex_cta_click", count: 2 }], recent: [] })),
  getTournaments: vi.fn(async () => []),
  createTournament: vi.fn(async () => []),
  replaceLeaderboard: vi.fn(async () => []),
  recordAdminAudit: vi.fn(async () => undefined),
  getAdminAuditLogs: vi.fn(async (days: number) => ({ days, total: 0, recent: [] })),
  anonymizeRegistration: vi.fn(async (id: number) => ({ id })),
  deleteRegistration: vi.fn(async (id: number) => ({ id, deleted: true })),
  purgeExpiredData: vi.fn(async () => ({ registrations: 0, analytics: 0, security: 0, audit: 0 })),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const adminContext = (): TrpcContext => ({
  user: { id: 1, openId: "admin", email: "admin@example.com", name: "Admin", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("Fortrex success paths", () => {
  it("returns a personalized Genesis registration", async () => {
    const caller = appRouter.createCaller(adminContext());
    const result = await caller.genesis.register({ name: "Architect One", mobile: "+919876543210", email: "architect@example.com", handle: "@architect" });
    expect(result.memberId).toBe("#0000001");
    expect(result.referralCode).toBe("REX-TEST01");
  });

  it("accepts an admin variable update", async () => {
    const caller = appRouter.createCaller(adminContext());
    const result = await caller.admin.updateSettings({ registrationCount: 1900, tierOneProgress: 76 });
    expect(result).toMatchObject({ registrationCount: 1900, tierOneProgress: 76 });
  });

  it("accepts a validated admin ROI update", async () => {
    const caller = appRouter.createCaller(adminContext());
    const result = await caller.admin.updateRegistration({ id: 1, roiPercent: "12.50" });
    expect(result).toMatchObject({ id: 1, roiPercent: "12.50" });
  });

  it("accepts sanitized analytics events and exposes the summary to admins", async () => {
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(publicCaller.analytics.track({ eventName: "fortrex_cta_click", path: "/", payload: { placement: "hero", label: "Join" } })).resolves.toMatchObject({ accepted: true });
    const adminCaller = appRouter.createCaller(adminContext());
    await expect(adminCaller.admin.analytics({ days: 30 })).resolves.toMatchObject({ days: 30, totalEvents: 3 });
  });

  it("blocks analytics summaries for non-admin users", async () => {
    const caller = appRouter.createCaller({ user: { id: 2, openId: "user", email: "user@example.com", name: "User", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(caller.admin.analytics({ days: 30 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("exposes only the public Genesis counter and keeps full settings admin-only", async () => {
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(publicCaller.genesis.counter()).resolves.toEqual({ registrationCount: 1842, genesisCap: 10000 });
    await expect(publicCaller.genesis.settings()).rejects.toMatchObject({ code: "FORBIDDEN" });
    const adminCaller = appRouter.createCaller(adminContext());
    await expect(adminCaller.admin.settings()).resolves.toMatchObject({ tierOneMultiplier: "1.25x" });
  });

  it("does not disclose registration data through public recovery lookup", async () => {
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(publicCaller.genesis.lookup({ email: "architect@example.com" })).resolves.toEqual({ accepted: true });
  });

  it("exposes security summaries only to admins", async () => {
    const adminCaller = appRouter.createCaller(adminContext());
    await expect(adminCaller.admin.security({ days: 30 })).resolves.toMatchObject({ days: 30, activeBuckets: 1 });
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(publicCaller.admin.security({ days: 30 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects analytics payloads that exceed the bounded field count", async () => {
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    const payload = Object.fromEntries(Array.from({ length: 13 }, (_, index) => [`field_${index}`, true]));
    await expect(publicCaller.analytics.track({ eventName: "fortrex_cta_click", path: "/", payload })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("blocks a filled registration honeypot and records a bot event", async () => {
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(publicCaller.genesis.register({ name: "Automated Bot", mobile: "+919876543210", email: "bot@example.com", website: "filled" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
