import { Router, Request, Response } from "express";
import { query } from "../db";

// POST /api/track — analytics beacon từ frontend (src/lib/track.ts).
//
// Ghi behaviour events vào public.analytics_events (Supabase) qua pg pool sẵn
// có (kết nối Postgres trực tiếp → không đi qua RLS; bảng này deny-all cho
// anon theo thiết kế). Bảng được co-founder agent đọc bằng SQL để chẩn đoán
// funnel: sessions → service views → call clicks + form starts → submits.
//
// Nguyên tắc: analytics KHÔNG BAO GIỜ trả lỗi cho client — input sai hay DB
// lỗi đều trả 204 và chỉ log server-side. Chống rác: allowlist event, check
// UUID session, cắt độ dài chuỗi, lọc meta, drop bot theo user-agent.

const router = Router();

const ALLOWED_EVENTS = new Set([
  "page_view",
  "service_page_view",
  "quote_form_start",
  "quote_form_submit",
  "quote_form_abandon",
  "call_click",
  "sms_click",
  "cta_click",
  "outbound_click",
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|monitor|preview/i;

function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  return value.length > max ? value.slice(0, max) : value;
}

function deviceFromUA(ua: string): "bot" | "mobile" | "tablet" | "desktop" | "unknown" {
  if (!ua) return "unknown";
  if (BOT_RE.test(ua)) return "bot";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function sanitizeMeta(meta: unknown): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (meta === null || typeof meta !== "object" || Array.isArray(meta)) return out;
  let count = 0;
  for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
    if (count >= 20) break;
    const safeKey = key.slice(0, 40);
    if (typeof value === "string") {
      out[safeKey] = value.slice(0, 200);
    } else if (typeof value === "number" && Number.isFinite(value)) {
      out[safeKey] = value;
    } else if (typeof value === "boolean") {
      out[safeKey] = value;
    } else {
      continue;
    }
    count += 1;
  }
  return out;
}

router.post("/track", async (req: Request, res: Response) => {
  try {
    const ua = String(req.headers["user-agent"] ?? "");
    const device = deviceFromUA(ua);
    if (device === "bot") return res.status(204).end();

    const b = (req.body ?? {}) as Record<string, unknown>;

    const event = typeof b.event === "string" && ALLOWED_EVENTS.has(b.event) ? b.event : null;
    const sessionId =
      typeof b.session_id === "string" && UUID_RE.test(b.session_id) ? b.session_id : null;
    if (!event || !sessionId) return res.status(204).end();

    await query(
      `insert into analytics_events
         (event, session_id, path, service_slug, referrer, utm_source, utm_medium, utm_campaign, device, meta)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)`,
      [
        event,
        sessionId,
        clip(b.path, 512),
        clip(b.service_slug, 100),
        clip(b.referrer, 1024),
        clip(b.utm_source, 128),
        clip(b.utm_medium, 128),
        clip(b.utm_campaign, 128),
        device,
        JSON.stringify(sanitizeMeta(b.meta)),
      ]
    );

    return res.status(204).end();
  } catch (err) {
    console.error("[track] Ghi analytics_events lỗi:", err);
    return res.status(204).end(); // analytics must never error to the client
  }
});

export default router;
