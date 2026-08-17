// Thin wrapper around GA4 (gtag) and Meta Pixel (fbq) - both are no-ops until
// NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID are set and the scripts load
// (see components/Analytics.tsx). Safe to call anywhere, including before the
// scripts are ready.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "select_item"
  | "select_size_open"
  | "add_to_cart"
  | "view_cart"
  | "begin_checkout"
  | "purchase"
  | "payment_error"
  | "whatsapp_click"
  | "select_occasion";

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  window.fbq?.("trackCustom", event, params);
}
