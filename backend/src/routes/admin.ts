import { Router, Response } from "express";
import { query } from "../db";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { sendPlainEmail } from "../lib/mailer";
import { sendPlainSms } from "../lib/sms";

const router = Router();

const VALID_STATUSES = ["NEW", "CONTACTED", "QUOTED", "SCHEDULED", "DONE", "LOST"];

// GET /api/admin/leads — danh sách leads mới nhất trước
router.get("/leads", requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      select id, name, phone, email, address,
             service, source, status, message, notes,
             "smsConsent", "smsConsentAt",
             "createdAt", "respondedAt", "closedAt"
      from leads
      order by "createdAt" desc
    `);
    return res.json({ ok: true, leads: result.rows });
  } catch (err) {
    console.error("[GET /api/admin/leads]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// PATCH /api/admin/leads/:id/status — đổi trạng thái lead
router.patch("/leads/:id/status", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid status" });
    }
    await query("update leads set status = $1 where id = $2", [status, id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/admin/leads/:id/status]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// POST /api/admin/leads/:id/dispatch — điều phối 1 lead cho 1 thợ:
// gửi email (nếu thợ có email) + SMS (số thợ) với nội dung admin đã sửa.
router.post("/leads/:id/dispatch", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const b = (req.body ?? {}) as Record<string, unknown>;
    const workerId = typeof b.workerId === "string" ? b.workerId : "";
    const message = typeof b.message === "string" ? b.message.trim() : "";
    const subject =
      typeof b.subject === "string" && b.subject.trim()
        ? b.subject.trim()
        : "New job — Glenn's Plumbing";

    if (!workerId) return res.status(400).json({ ok: false, error: "Please choose a worker" });
    if (!message) return res.status(400).json({ ok: false, error: "Message is empty" });
    if (message.length > 2000)
      return res.status(400).json({ ok: false, error: "Message is too long" });

    // Lead phải tồn tại (tránh điều phối lead rác / id sai).
    const lead = await query("select id from leads where id = $1", [id]);
    if (lead.rowCount === 0) return res.status(404).json({ ok: false, error: "Lead not found" });

    const w = await query(
      "select name, phone, email from workers where id = $1",
      [workerId]
    );
    if (w.rowCount === 0) return res.status(404).json({ ok: false, error: "Worker not found" });
    const worker = w.rows[0] as { name: string; phone: string; email: string | null };

    // Gửi song song email + SMS; kênh nào thiếu cấu hình/lỗi trả false, không ném.
    const [emailSent, smsSent] = await Promise.all([
      worker.email ? sendPlainEmail(worker.email, subject, message) : Promise.resolve(false),
      sendPlainSms(worker.phone, message),
    ]);

    // Ghi vết điều phối vào lịch sử lead (giữ nguyên trạng thái hiện tại).
    await query(
      `insert into lead_events ("leadId", "toStatus", note)
       select $1, status, $2 from leads where id = $1`,
      [id, `Dispatched to ${worker.name} (email:${emailSent} sms:${smsSent})`]
    ).catch((err) => console.error("[dispatch] ghi lead_events lỗi:", err));

    return res.json({
      ok: true,
      sent: { email: emailSent, sms: smsSent },
      worker: { name: worker.name, hasEmail: !!worker.email },
    });
  } catch (err) {
    console.error("[POST /api/admin/leads/:id/dispatch]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ─── Workers (thợ) — CRUD ───────────────────────────────────────────────────
// Thông tin thợ: name, phone (bắt buộc) · email, job (tùy chọn).

// Chuẩn hóa + validate payload thợ. Trả { ok, data } hoặc { ok:false, error }.
function parseWorker(body: unknown):
  | { ok: true; data: { name: string; phone: string; email: string | null; job: string | null } }
  | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const job = typeof b.job === "string" ? b.job.trim() : "";
  if (!name) return { ok: false, error: "Name is required" };
  if (!phone) return { ok: false, error: "Phone is required" };
  if (name.length > 120) return { ok: false, error: "Name is too long" };
  if (phone.length > 40) return { ok: false, error: "Phone is too long" };
  if (email && email.length > 254) return { ok: false, error: "Email is too long" };
  if (job && job.length > 120) return { ok: false, error: "Job is too long" };
  return { ok: true, data: { name, phone, email: email || null, job: job || null } };
}

// GET /api/admin/workers — danh sách thợ (mới nhất trước)
router.get("/workers", requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `select id, name, phone, email, job, "createdAt"
       from workers order by "createdAt" desc`
    );
    return res.json({ ok: true, workers: result.rows });
  } catch (err) {
    console.error("[GET /api/admin/workers]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// POST /api/admin/workers — thêm thợ
router.post("/workers", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = parseWorker(req.body);
    if (!parsed.ok) return res.status(400).json({ ok: false, error: parsed.error });
    const { name, phone, email, job } = parsed.data;
    const result = await query(
      `insert into workers (name, phone, email, job)
       values ($1, $2, $3, $4)
       returning id, name, phone, email, job, "createdAt"`,
      [name, phone, email, job]
    );
    return res.json({ ok: true, worker: result.rows[0] });
  } catch (err) {
    console.error("[POST /api/admin/workers]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// PATCH /api/admin/workers/:id — sửa thợ
router.patch("/workers/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = parseWorker(req.body);
    if (!parsed.ok) return res.status(400).json({ ok: false, error: parsed.error });
    const { name, phone, email, job } = parsed.data;
    const result = await query(
      `update workers set name = $1, phone = $2, email = $3, job = $4
       where id = $5
       returning id, name, phone, email, job, "createdAt"`,
      [name, phone, email, job, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ ok: false, error: "Worker not found" });
    return res.json({ ok: true, worker: result.rows[0] });
  } catch (err) {
    console.error("[PATCH /api/admin/workers/:id]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// DELETE /api/admin/workers/:id — xóa thợ
router.delete("/workers/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query("delete from workers where id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ ok: false, error: "Worker not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/workers/:id]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET /api/admin/settings — lấy cài đặt (hiện tại: email + sđt thông báo)
router.get("/settings", requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await query("select key, value from admin_settings");
    const settings: Record<string, string | null> = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }
    return res.json({ ok: true, settings });
  } catch (err) {
    console.error("[GET /api/admin/settings]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// PATCH /api/admin/settings — cập nhật một setting (UPSERT)
router.patch("/settings", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body ?? {};
    if (typeof key !== "string" || key.length === 0) {
      return res.status(400).json({ ok: false, error: "Missing key" });
    }
    await query(
      `insert into admin_settings (key, value) values ($1, $2)
       on conflict (key) do update set value = excluded.value`,
      [key, value ?? null]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/admin/settings]", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
