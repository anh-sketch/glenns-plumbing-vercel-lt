-- Glenn's Plumbing — Postgres Schema (Supabase)
-- Chạy theo thứ tự: admin_users trước, rồi leads, lead_events, admin_settings
-- Khớp với backend/src/db.ts (kết nối qua pg Pool tới Supabase Postgres)

create extension if not exists pgcrypto;

-- ============================================================
-- Bảng admin_users — tài khoản đăng nhập trang quản trị
-- ============================================================
create table admin_users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  "passwordHash" text not null,
  "createdAt"   timestamptz not null default now()
);
-- Tạo tài khoản: chạy lệnh  npm run seed-admin -- admin YourPassword  trong backend/

alter table admin_users enable row level security;

-- ============================================================
-- Bảng leads — thông tin khách hàng + yêu cầu dịch vụ (gộp)
-- ============================================================
create table leads (
  id            uuid primary key default gen_random_uuid(),
  -- Thông tin khách hàng
  phone         text not null,
  name          text not null,
  email         text,
  address       text,
  -- Thông tin yêu cầu dịch vụ
  service       text not null,
  "serviceSlug" text,
  message       text,
  source        text not null,  -- HOME | PRICING | SERVICE
  status        text not null default 'NEW',  -- NEW | CONTACTED | QUOTED | SCHEDULED | DONE | LOST
  notes         text,
  "createdAt"   timestamptz not null default now(),
  "respondedAt" timestamptz,
  "closedAt"    timestamptz
);

create index idx_leads_status_created on leads (status, "createdAt");
create index idx_leads_phone on leads (phone);

alter table leads enable row level security;

-- ============================================================
-- Bảng lead_events — lịch sử thay đổi trạng thái
-- ============================================================
create table lead_events (
  id           uuid primary key default gen_random_uuid(),
  "leadId"     uuid not null references leads(id) on delete cascade,
  "fromStatus" text,
  "toStatus"   text not null,
  note         text,
  "createdAt"  timestamptz not null default now()
);

create index idx_lead_events_leadid on lead_events ("leadId", "createdAt");

alter table lead_events enable row level security;

-- ============================================================
-- Bảng admin_settings — cấu hình trang quản trị (key-value)
-- ============================================================
create table admin_settings (
  key   text primary key,
  value text
);

alter table admin_settings enable row level security;

-- Seed mặc định: email + số điện thoại thông báo (để trống, cấu hình qua trang /admin)
insert into admin_settings (key, value) values ('notification_email', null);
insert into admin_settings (key, value) values ('notification_phone', null);
