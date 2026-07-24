// First-party behaviour tracking for glennph.com (zero dependencies).
//
// Sends events to the Express backend (POST /api/track → Supabase
// analytics_events) via navigator.sendBeacon, with a fetch-keepalive fallback.
// Never throws, never blocks the UI.
//
// This runs ALONGSIDE GA4 (lib/analytics.ts): GA4 is for humans in the Google
// dashboard; analytics_events is the SQL table the co-founder agent reads.
//
// Auto-wired (via RouteChangeTracker in App.tsx):
//   page_view, service_page_view              — trackRoute()
//   call_click, sms_click, outbound_click     — initAutoClickTracking()
//     (tel:/sms:/external links — nothing to wire in components; with a
//      plumbing business the phone tap is the #1 conversion, so it's automatic)
//
// Manually-wired (BookForm):
//   trackQuoteFormStart / trackQuoteFormSubmit  (abandon fires automatically)

export type TrackEventName =
  | "page_view"
  | "service_page_view"
  | "quote_form_start"
  | "quote_form_submit"
  | "quote_form_abandon"
  | "call_click"
  | "sms_click"
  | "cta_click"
  | "outbound_click";

export type TrackMeta = Record<string, string | number | boolean | null | undefined>;

// Same base the lead form uses — empty string in production (same-origin via
// the vercel.json rewrite), VITE_API_URL for local dev against a remote API.
const API_BASE: string = import.meta.env.VITE_API_URL ?? "";
const ENDPOINT = `${API_BASE}/api/track`;
const SID_KEY = "gp_sid";
const FIRST_TOUCH_KEY = "gp_ft";

interface FirstTouch {
  referrer: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** In-memory fallbacks when sessionStorage is unavailable (private mode, etc.). */
let memorySid: string | null = null;
let memoryFirstTouch: FirstTouch | null = null;

function getSessionId(): string {
  if (!isBrowser()) return "00000000-0000-4000-8000-000000000000";
  try {
    const existing = window.sessionStorage.getItem(SID_KEY);
    if (existing) return existing;
    const sid = uuid();
    window.sessionStorage.setItem(SID_KEY, sid);
    return sid;
  } catch {
    if (!memorySid) memorySid = uuid();
    return memorySid;
  }
}

/** Capture referrer + UTM once per session so every event carries first-touch attribution. */
function getFirstTouch(): FirstTouch {
  const empty: FirstTouch = { referrer: "", utm_source: null, utm_medium: null, utm_campaign: null };
  if (!isBrowser()) return empty;
  try {
    const cached = window.sessionStorage.getItem(FIRST_TOUCH_KEY);
    if (cached) return JSON.parse(cached) as FirstTouch;
  } catch {
    if (memoryFirstTouch) return memoryFirstTouch;
  }
  let ft: FirstTouch = empty;
  try {
    const params = new URLSearchParams(window.location.search);
    ft = {
      referrer: (document.referrer || "").slice(0, 1024),
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };
  } catch {
    /* keep empty */
  }
  try {
    window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(ft));
  } catch {
    memoryFirstTouch = ft;
  }
  return ft;
}

/** Extract the service slug from a detail path: /services/drain-cleaning → "drain-cleaning". */
export function serviceSlugFromPath(path: string): string | null {
  const m = /^\/services\/([^/?#]+)/.exec(path);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function clipMeta(meta: TrackMeta | undefined): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!meta) return out;
  let count = 0;
  for (const [key, value] of Object.entries(meta)) {
    if (count >= 20) break;
    if (value === null || value === undefined) continue;
    if (typeof value === "string") {
      out[key.slice(0, 40)] = value.slice(0, 200);
    } else if (typeof value === "number" && Number.isFinite(value)) {
      out[key.slice(0, 40)] = value;
    } else if (typeof value === "boolean") {
      out[key.slice(0, 40)] = value;
    } else {
      continue;
    }
    count += 1;
  }
  return out;
}

function send(payload: Record<string, unknown>): void {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* analytics must never surface errors */
    });
  } catch {
    /* analytics must never surface errors */
  }
}

/**
 * Core tracker. `meta.service_slug` (if provided) is promoted to the row's
 * service_slug column; otherwise inferred from the path on /services/:slug.
 */
export function track(event: TrackEventName, meta?: TrackMeta): void {
  if (!isBrowser()) return;
  try {
    const ft = getFirstTouch();
    const path = window.location.pathname.slice(0, 512);
    const metaSlug = meta && typeof meta.service_slug === "string" ? meta.service_slug : null;
    const restMeta: TrackMeta = { ...meta };
    delete restMeta.service_slug;

    send({
      event,
      session_id: getSessionId(),
      path,
      service_slug: metaSlug ?? serviceSlugFromPath(path),
      referrer: ft.referrer || null,
      utm_source: ft.utm_source,
      utm_medium: ft.utm_medium,
      utm_campaign: ft.utm_campaign,
      meta: clipMeta(restMeta),
    });
  } catch {
    /* never break the page for analytics */
  }
}

/** Shorthand for CTA clicks: trackCtaClick('emergency_banner'). */
export function trackCtaClick(name: string, meta?: TrackMeta): void {
  track("cta_click", { ...meta, name });
}

/* --------------------------------------------------------------------- */
/* Route tracking (SPA): called from RouteChangeTracker in App.tsx.       */
/* --------------------------------------------------------------------- */

let lastTrackedPath: string | null = null;

/**
 * Fire the first-party page/service view for a route. Dedupes on pathname
 * (search-only changes are ignored here — GA4 handles its own page_views),
 * and closes out an in-progress quote form as abandoned on SPA navigation.
 */
export function trackRoute(pathname: string): void {
  if (pathname === lastTrackedPath) return;
  if (lastTrackedPath !== null) {
    fireAbandonIfNeeded();
    resetQuoteFormState();
  }
  lastTrackedPath = pathname;

  const slug = serviceSlugFromPath(pathname);
  if (slug) {
    track("service_page_view", { service_slug: slug });
  } else {
    track("page_view");
  }
}

/* --------------------------------------------------------------------- */
/* Auto click tracking: tel: / sms: / outbound links — zero wiring.       */
/* --------------------------------------------------------------------- */

let clickListenerArmed = false;

/** Installed once by RouteChangeTracker. Captures clicks on links before navigation. */
export function initAutoClickTracking(): void {
  if (clickListenerArmed || !isBrowser()) return;
  clickListenerArmed = true;
  document.addEventListener(
    "click",
    (e) => {
      try {
        const target = e.target as Element | null;
        const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
        if (!anchor) return;
        const href = anchor.getAttribute("href") || "";
        const label =
          anchor.getAttribute("data-track-name") ||
          (anchor.textContent || "").trim().slice(0, 80);
        // Landing pages outside /services/:slug (e.g. /24-hour-plumber-nyc)
        // tag their CTAs with data-service-slug so track() promotes it to the
        // service_slug column; absent everywhere else, so behavior is unchanged.
        const slug = anchor.getAttribute("data-service-slug");

        if (/^tel:/i.test(href)) {
          track("call_click", { href: href.slice(0, 64), name: label, ...(slug ? { service_slug: slug } : {}) });
          return;
        }
        if (/^sms:/i.test(href)) {
          track("sms_click", { href: href.slice(0, 64), name: label, ...(slug ? { service_slug: slug } : {}) });
          return;
        }
        if (/^https?:\/\//i.test(href)) {
          const host = new URL(href).host;
          if (host && host !== window.location.host) {
            track("outbound_click", { host: host.slice(0, 100), name: label });
          }
        }
      } catch {
        /* never break clicks for analytics */
      }
    },
    { capture: true, passive: true },
  );
}

/* ------------------------------------------------------------------- */
/* Quote-form funnel: start → submit, with automatic abandon detection. */
/* ------------------------------------------------------------------- */

interface QuoteFormState {
  started: boolean;
  submitted: boolean;
  serviceSlug: string | null;
  listenersArmed: boolean;
}

const quoteForm: QuoteFormState = {
  started: false,
  submitted: false,
  serviceSlug: null,
  listenersArmed: false,
};

function fireAbandonIfNeeded(): void {
  if (!quoteForm.started || quoteForm.submitted) return;
  quoteForm.started = false; // fire at most once per started form
  track("quote_form_abandon", quoteForm.serviceSlug ? { service_slug: quoteForm.serviceSlug } : undefined);
}

function resetQuoteFormState(): void {
  quoteForm.started = false;
  quoteForm.submitted = false;
  quoteForm.serviceSlug = null;
}

function armAbandonListeners(): void {
  if (quoteForm.listenersArmed || !isBrowser()) return;
  quoteForm.listenersArmed = true;
  // Real page unload / tab close / mobile app switch-away.
  window.addEventListener("pagehide", fireAbandonIfNeeded);
}

/**
 * Call on the FIRST interaction with the quote form (onFocusCapture on the
 * <form>). Safe to call repeatedly — only the first call per page emits.
 */
export function trackQuoteFormStart(serviceSlug?: string): void {
  if (quoteForm.started || quoteForm.submitted) return;
  quoteForm.started = true;
  quoteForm.submitted = false;
  quoteForm.serviceSlug =
    serviceSlug ?? (isBrowser() ? serviceSlugFromPath(window.location.pathname) : null);
  armAbandonListeners();
  track("quote_form_start", quoteForm.serviceSlug ? { service_slug: quoteForm.serviceSlug } : undefined);
}

/** Call after the quote form submits successfully (API confirmed the lead). */
export function trackQuoteFormSubmit(serviceSlug?: string): void {
  quoteForm.submitted = true;
  const slug = serviceSlug ?? quoteForm.serviceSlug;
  track("quote_form_submit", slug ? { service_slug: slug } : undefined);
}
