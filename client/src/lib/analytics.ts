type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

type UmamiLike = {
  track?: (eventName: string, payload?: AnalyticsPayload) => void;
};

declare global {
  interface Window {
    umami?: UmamiLike;
  }
}

export function trackEvent(eventName: string, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem("fortrex_analytics_consent") !== "granted") return;
  try {
    window.umami?.track?.(eventName, payload);
  } catch {
    // Analytics must never interrupt registration or navigation flows.
  }
  try {
    const safePayload = payload ? Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined).slice(0, 12)) : undefined;
    void fetch("/api/trpc/analytics.track?batch=1", { method: "POST", headers: { "content-type": "application/json" }, keepalive: true, body: JSON.stringify({ 0: { json: { eventName, path: window.location.pathname, payload: safePayload } } }) }).catch(() => undefined);
  } catch {
    // First-party analytics must never interrupt registration or navigation flows.
  }
}
