import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function contextFor(role: AuthenticatedUser["role"]): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "privacy-test-user",
      email: "privacy-test@example.com",
      name: "Privacy Test",
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("privacy and audit controls", () => {
  it("rejects audit access for non-admin users", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.admin.auditLogs({ days: 30 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects retention periods outside the supported bounds", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    await expect(caller.admin.updateSettings({ registrationRetentionDays: 7 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("requires explicit confirmation for destructive privacy actions", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    await expect(caller.admin.deleteRegistration({ id: 12, confirmation: "DELETE_NOW" as "DELETE" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.anonymizeRegistration({ id: 12, confirmation: "ANONYMIZE_NOW" as "ANONYMIZE" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

export {};

