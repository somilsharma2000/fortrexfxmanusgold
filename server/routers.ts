import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { anonymizeRegistration, createRegistration, createTournament, deleteRegistration, getAdminAuditLogs, getAnalyticsSummary, getLeaderboard, getRegistrationByEmail, getRegistrations, getSecuritySummary, getSettings, getTournaments, purgeExpiredData, recordAdminAudit, recordAnalyticsEvent, recordSecurityEvent, replaceLeaderboard, updateRegistration, updateSettings } from "./db";
import { getRequestKeyHash, safeSecurityMetadata } from "./_core/security";
import { broadcastGenesisCounter } from "./genesisRealtime";

const settingsInput = z.object({
  genesisCap: z.number().int().min(1).optional(),
  registrationCount: z.number().int().min(0).optional(),
  tierOneMultiplier: z.string().min(1).max(16).optional(),
  tierTwoMultiplier: z.string().min(1).max(16).optional(),
  tierThreeMultiplier: z.string().min(1).max(16).optional(),
  tierOneProgress: z.number().int().min(0).max(100).optional(),
  tierTwoProgress: z.number().int().min(0).max(100).optional(),
  tierThreeProgress: z.number().int().min(0).max(100).optional(),
  registrationRetentionDays: z.number().int().min(30).max(3650).optional(),
  analyticsRetentionDays: z.number().int().min(14).max(3650).optional(),
  securityRetentionDays: z.number().int().min(14).max(3650).optional(),
});

const analyticsPayload = z.record(z.string().trim().regex(/^[a-zA-Z0-9_]{1,40}$/), z.union([z.string().max(160), z.number().finite(), z.boolean()])).refine(value => Object.keys(value).length <= 12, "Analytics payload is too large").optional();
const analyticsTrackInput = z.object({ eventName: z.string().trim().regex(/^fortrex_[a-z0-9_]{1,70}$/, "Unsupported analytics event"), path: z.string().trim().regex(/^\/[a-zA-Z0-9_\-./?=&%]{0,254}$/, "Invalid analytics path").default("/"), payload: analyticsPayload });
const registrationInput = z.object({ name: z.string().trim().min(2).max(120), mobile: z.string().trim().regex(/^\+?[1-9][0-9\s-]{7,14}$/, "Enter a valid mobile number"), email: z.string().email(), handle: z.string().max(120).optional(), website: z.string().max(256).optional() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  analytics: router({
    track: publicProcedure.input(z.unknown()).mutation(async ({ input, ctx }) => { const parsed = analyticsTrackInput.safeParse(input); if (!parsed.success) { await recordSecurityEvent("analytics_payload_rejected", safeSecurityMetadata(ctx.req.path || "/api/trpc"), getRequestKeyHash(ctx.req, "analytics"), "schema"); throw new TRPCError({ code: "BAD_REQUEST", message: "Analytics payload rejected" }); } await recordAnalyticsEvent(parsed.data.eventName, parsed.data.path, parsed.data.payload); return { accepted: true as const }; }),
  }),
  genesis: router({
    counter: publicProcedure.query(async () => { const settings = await getSettings(); return { registrationCount: settings?.registrationCount ?? 0, genesisCap: settings?.genesisCap ?? 10000 }; }),
    settings: adminProcedure.query(() => getSettings()),
    leaderboard: publicProcedure.query(() => getLeaderboard()),
    lookup: publicProcedure.input(z.object({ email: z.string().email() })).query(() => ({ accepted: true as const })),
    register: publicProcedure.input(z.unknown()).mutation(async ({ input, ctx }) => { const parsed = registrationInput.safeParse(input); if (!parsed.success) { await recordSecurityEvent("registration_payload_rejected", safeSecurityMetadata(ctx.req.path || "/api/trpc"), getRequestKeyHash(ctx.req, "registration"), "schema"); throw new TRPCError({ code: "BAD_REQUEST", message: "Registration details could not be accepted" }); } if (parsed.data.website) { await recordSecurityEvent("bot_blocked", safeSecurityMetadata(ctx.req.path || "/api/trpc"), getRequestKeyHash(ctx.req, "registration"), parsed.data.website ? "honeypot" : "user_agent"); throw new TRPCError({ code: "FORBIDDEN", message: "Registration could not be verified" }); } const { website: _website, ...registrationInputData } = parsed.data;
      const existing = await getRegistrationByEmail(registrationInputData.email);
      const registration = await createRegistration(registrationInputData.name, registrationInputData.mobile, registrationInputData.email, registrationInputData.handle);
      if (!existing) {
        const settings = await getSettings();
        if (settings) broadcastGenesisCounter({ registrationCount: settings.registrationCount, genesisCap: settings.genesisCap, updatedAt: new Date().toISOString() });
      }
      return { id: registration.id, name: registration.name, email: registration.email, memberId: registration.memberId, multiplier: registration.multiplier, currentRex: registration.currentRex, circleSize: registration.circleSize, referralCode: registration.referralCode, createdAt: registration.createdAt };
    }),
  }),
  admin: router({
    analytics: adminProcedure.input(z.object({ days: z.number().int().min(1).max(90).default(30) })).query(({ input }) => getAnalyticsSummary(input.days)),
    security: adminProcedure.input(z.object({ days: z.number().int().min(1).max(90).default(30) })).query(({ input }) => getSecuritySummary(input.days)),
    settings: adminProcedure.query(() => getSettings()),
    updateSettings: adminProcedure.input(settingsInput).mutation(async ({ input, ctx }) => { const result = await updateSettings(input); await recordAdminAudit(ctx.user.id, "update_settings", "platform_settings", undefined, `fields=${Object.keys(input).sort().join(",")}`); return result; }),
    leaderboard: adminProcedure.query(() => getLeaderboard()),
    replaceLeaderboard: adminProcedure.input(z.object({ rows: z.array(z.object({ rank: z.number().int().min(1), architectId: z.string().min(1).max(32), circleSize: z.number().int().min(0), multiplier: z.string().max(16), rexAllocation: z.number().int().min(0) })) })).mutation(async ({ input, ctx }) => { const result = await replaceLeaderboard(input.rows); await recordAdminAudit(ctx.user.id, "replace_leaderboard", "leaderboard", undefined, `rows=${input.rows.length}`); return result; }),
    registrations: adminProcedure.query(() => getRegistrations()),
    updateRegistration: adminProcedure.input(z.object({ id: z.number().int().positive(), roiPercent: z.string().trim().regex(/^-?\d{1,7}(\.\d{1,2})?$/, "Enter ROI as a number with up to 2 decimals").optional(), currentRex: z.number().int().min(0).optional(), circleSize: z.number().int().min(0).optional(), multiplier: z.string().max(16).optional(), referralCode: z.string().max(32).optional() })).mutation(async ({ input, ctx }) => { const { id, ...values } = input; const result = await updateRegistration(id, values); await recordAdminAudit(ctx.user.id, "update_registration", "registration", String(id), `fields=${Object.keys(values).sort().join(",")}`); return result; }),
    anonymizeRegistration: adminProcedure.input(z.object({ id: z.number().int().positive(), confirmation: z.literal("ANONYMIZE") })).mutation(async ({ input, ctx }) => { const result = await anonymizeRegistration(input.id); await recordAdminAudit(ctx.user.id, "anonymize_registration", "registration", String(input.id), "pii=redacted"); return result; }),
    deleteRegistration: adminProcedure.input(z.object({ id: z.number().int().positive(), confirmation: z.literal("DELETE") })).mutation(async ({ input, ctx }) => { const result = await deleteRegistration(input.id); await recordAdminAudit(ctx.user.id, "delete_registration", "registration", String(input.id), "record=deleted"); return result; }),
    tournaments: adminProcedure.query(() => getTournaments()),
    auditLogs: adminProcedure.input(z.object({ days: z.number().int().min(1).max(90).default(30) })).query(({ input }) => getAdminAuditLogs(input.days)),
    purgeExpiredData: adminProcedure.input(z.object({ confirmation: z.literal("PURGE_EXPIRED") })).mutation(async ({ ctx }) => { const result = await purgeExpiredData(); await recordAdminAudit(ctx.user.id, "purge_expired_data", "retention", undefined, `registrations=${result.registrations},analytics=${result.analytics},security=${result.security},audit=${result.audit}`); return result; }),
    createTournament: adminProcedure.input(z.object({ name: z.string().min(1).max(120), startsAt: z.coerce.date(), endsAt: z.coerce.date(), status: z.enum(["draft", "scheduled", "live", "complete"]) })).mutation(async ({ input, ctx }) => { const result = await createTournament(input); await recordAdminAudit(ctx.user.id, "create_tournament", "tournament", undefined, `status=${input.status}`); return result; }),
  }),
});

export type AppRouter = typeof appRouter;
