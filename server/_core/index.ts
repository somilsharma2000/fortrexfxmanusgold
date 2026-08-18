import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { WebSocketServer } from "ws";
import { addGenesisClient, removeGenesisClient } from "../genesisRealtime";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { consumeDistributedRateLimit, recordSecurityEvent } from "../db";
import { getRequestKeyHash, safeSecurityMetadata, safeSecurityRoute } from "./security";
import { serveStatic, setupVite } from "./vite";

function getConfiguredAnalyticsOrigin() {
  try { return process.env.VITE_ANALYTICS_ENDPOINT ? new URL(process.env.VITE_ANALYTICS_ENDPOINT).origin : ""; } catch { return ""; }
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  const analyticsOrigin = getConfiguredAnalyticsOrigin();
  const connectSources = ["'self'", "ws:", "wss:", analyticsOrigin].filter(Boolean).join(" ");
  const scriptSources = ["'self'", "'unsafe-inline'", analyticsOrigin].filter(Boolean).join(" ");
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "child-src 'none'",
    "frame-ancestors 'self' https://*.manus.computer https://manus.im",
    "form-action 'self'",
    "manifest-src 'self'",
    "media-src 'self'",
    "img-src 'self' https://fortrexfx-lwqfvhpi.manus.space data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    `script-src ${scriptSources}`,
    "script-src-attr 'none'",
    "worker-src 'self' blob:",
    `connect-src ${connectSources}`,
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Content-Security-Policy", contentSecurityPolicy);
    if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });
  const server = createServer(app);
  const genesisWss = new WebSocketServer({ noServer: true });
  genesisWss.on("connection", (socket) => {
    addGenesisClient(socket);
    socket.send(JSON.stringify({ type: "genesis-ready" }));
  });
  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    if (pathname !== "/ws/genesis") return;
    genesisWss.handleUpgrade(request, socket, head, (client) => genesisWss.emit("connection", client, request));
  });
  genesisWss.on("close", () => {
    genesisWss.clients.forEach((client) => removeGenesisClient(client));
  });
  // The public app stores avatar crops locally; server requests only need a small JSON envelope.
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "100kb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API: distributed public-burst protection backed by expiring database buckets.
  app.use("/api/trpc", async (req, res, next) => {
    const procedure = safeSecurityRoute(req.path);
    const isPublicBurstRoute = procedure.includes("genesis.register") || procedure.includes("genesis.lookup") || procedure.includes("analytics.track");
    if (!isPublicBurstRoute) return next();
    const limit = procedure.includes("analytics.track") ? 120 : procedure.includes("genesis.lookup") ? 20 : 10;
    const keyHash = getRequestKeyHash(req, procedure);
    try {
      const result = await consumeDistributedRateLimit(keyHash, procedure, limit);
      if (!result.allowed) {
        try { await recordSecurityEvent("rate_limit_blocked", procedure, keyHash, safeSecurityMetadata(`limit=${limit}`)); } catch (error) { console.warn("[Security] Could not record rate-limit block:", error); }
        res.setHeader("Retry-After", String(result.retryAfterSeconds));
        return res.status(429).json({ error: "Too many requests. Please try again shortly." });
      }
    } catch (error) {
      console.warn("[Security] Distributed rate-limit check failed; allowing request:", error);
    }
    return next();
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
