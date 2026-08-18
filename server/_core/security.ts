import { createHmac } from "node:crypto";
import type { Request } from "express";
import { ENV } from "./env";

const BOT_USER_AGENT = /bot|crawler|spider|scrapy|headless|phantom|selenium|curl|wget/i;

export function getRequestKeyHash(req: Request, route: string) {
  const address = req.ip || "unknown";
  const userAgent = String(typeof req.get === "function" ? req.get("user-agent") || "unknown" : req.headers?.["user-agent"] || "unknown").slice(0, 180);
  const secret = ENV.cookieSecret || (process.env.NODE_ENV === "test" ? "fortrex-test-key" : "");
  if (!secret) throw new Error("Cookie secret is required for security key derivation");
  return createHmac("sha256", secret).update(`${route}|${address}|${userAgent}`).digest("hex");
}

export function isLikelyAutomatedRequest(req: Request) {
  const userAgent = String(typeof req.get === "function" ? req.get("user-agent") || "" : req.headers?.["user-agent"] || "");
  return BOT_USER_AGENT.test(userAgent);
}

export function safeSecurityRoute(path: string) {
  return path.replace(/[^a-zA-Z0-9_.:/-]/g, "").slice(0, 96) || "unknown";
}

export function safeSecurityMetadata(value: string) {
  return value.replace(/[^a-zA-Z0-9_.=:/-]/g, "").slice(0, 255);
}
