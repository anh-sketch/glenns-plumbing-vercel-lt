// Google Analytics 4 (gtag.js) integration.
//
// The base gtag loader lives in index.html and is configured with
// `send_page_view: false`. We send `page_view` manually on every client-side
// route change (see <RouteChangeTracker /> in App.tsx) — this is Google's
// recommended pattern for single-page apps and, together with the Enhanced
// Measurement "history changes" option disabled on the data stream, guarantees
// exactly one page_view per route (no duplicates).
//
// GA_MEASUREMENT_ID MUST stay in sync with the ID hardcoded in index.html.

export const GA_MEASUREMENT_ID = "G-YYEW9NV35L";

type GtagCommand =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["set", Record<string, unknown>];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: GtagCommand) => void;
  }
}

/**
 * Send a GA4 page_view for the current route. Safe to call before gtag has
 * finished loading — it simply no-ops until the tag is ready. Reads
 * document.title, so it must run after the active page has set its title
 * (the tracker is rendered after <Routes /> to guarantee this ordering).
 */
export function trackPageView(pathname: string, search: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${pathname}${search}`,
    send_to: GA_MEASUREMENT_ID,
  });
}
