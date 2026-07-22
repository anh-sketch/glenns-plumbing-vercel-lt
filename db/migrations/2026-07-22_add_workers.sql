-- Migration: bảng workers — danh sách thợ (quản lý ở /admin).
-- Thông tin: tên, số điện thoại, email (gmail), công việc (job/trade).
-- Tên cột camelCase bọc nháy kép để khớp quy ước JSON API của dự án.
--
-- Additive: không đụng bảng nào khác. RLS bật, KHÔNG policy — chặn anon key,
-- backend kết nối bằng role Postgres (bypass RLS) nên đọc/ghi bình thường
-- (giống leads / admin_users).

create table if not exists workers (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  phone       text        not null,
  email       text,
  job         text,
  "createdAt" timestamptz not null default now()
);

create index if not exists idx_workers_created on workers ("createdAt");

alter table workers enable row level security;
