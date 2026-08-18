import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Fortrex admin authorization", () => {
  it("rejects non-admin access to platform settings", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.admin.settings()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects a standard user from updating public variables", async () => {
    const caller = appRouter.createCaller(context({
      id: 42,
      openId: "standard-user",
      email: "user@example.com",
      name: "Standard User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.admin.updateSettings({ genesisCap: 10000 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
