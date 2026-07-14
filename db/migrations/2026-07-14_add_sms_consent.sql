-- Migration: TCPA proof-of-consent cho SMS opt-in (Twilio A2P 10DLC).
-- ĐÃ APPLY lên Supabase prod (glenns-plumbing-prod) ngày 2026-07-14.
-- File này lưu lại để môi trường khác / DB mới chạy theo.
--
-- "smsConsent"   — khách đã chủ động tick checkbox consent trên form
--                  (checkbox unchecked mặc định, bắt buộc tick mới submit được).
-- "smsConsentAt" — thời điểm SERVER ghi nhận consent (now(), không tin client).
--
-- Additive + backward-compatible: code cũ không đụng 2 cột này;
-- các lead cũ (trước khi có checkbox) giữ default false.

alter table leads
  add column if not exists "smsConsent"   boolean     not null default false,
  add column if not exists "smsConsentAt" timestamptz;
