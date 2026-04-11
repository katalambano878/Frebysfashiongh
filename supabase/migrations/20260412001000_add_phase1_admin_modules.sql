-- Phase 1 "god-level" admin modules:
-- analytics data, POS order creation support, support CRM, and marketing campaigns.

create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  channel text not null check (channel in ('email', 'sms', 'push', 'whatsapp')),
  audience text not null default 'all_customers',
  message text not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  customer_email text,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'pending', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  category text not null default 'general',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_type text not null check (sender_type in ('customer', 'staff', 'system')),
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists support_messages_ticket_idx on public.support_messages(ticket_id, created_at);

create table if not exists public.support_kb_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null,
  category text not null default 'general',
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketing_campaigns enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_kb_articles enable row level security;

drop policy if exists "marketing_campaigns_staff_read" on public.marketing_campaigns;
create policy "marketing_campaigns_staff_read"
  on public.marketing_campaigns
  for select
  using (public.is_staff());

drop policy if exists "marketing_campaigns_admin_manage" on public.marketing_campaigns;
create policy "marketing_campaigns_admin_manage"
  on public.marketing_campaigns
  for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

drop policy if exists "support_tickets_staff_manage" on public.support_tickets;
create policy "support_tickets_staff_manage"
  on public.support_tickets
  for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "support_messages_staff_manage" on public.support_messages;
create policy "support_messages_staff_manage"
  on public.support_messages
  for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "support_kb_staff_read" on public.support_kb_articles;
create policy "support_kb_staff_read"
  on public.support_kb_articles
  for select
  using (public.is_staff());

drop policy if exists "support_kb_admin_manage" on public.support_kb_articles;
create policy "support_kb_admin_manage"
  on public.support_kb_articles
  for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

insert into public.role_permissions (role, permissions)
values
  (
    'staff',
    '{
      "catalog_manage": true,
      "orders_manage": true,
      "fulfillment_manage": true,
      "customers_view": true,
      "content_manage": false,
      "discounts_manage": false,
      "analytics_view": true,
      "pos_use": true,
      "support_manage": false,
      "marketing_manage": false,
      "settings_manage": false,
      "roles_manage": false
    }'::jsonb
  ),
  (
    'admin',
    '{
      "catalog_manage": true,
      "orders_manage": true,
      "fulfillment_manage": true,
      "customers_view": true,
      "content_manage": true,
      "discounts_manage": true,
      "analytics_view": true,
      "pos_use": true,
      "support_manage": true,
      "marketing_manage": true,
      "settings_manage": true,
      "roles_manage": false
    }'::jsonb
  ),
  (
    'superadmin',
    '{
      "catalog_manage": true,
      "orders_manage": true,
      "fulfillment_manage": true,
      "customers_view": true,
      "content_manage": true,
      "discounts_manage": true,
      "analytics_view": true,
      "pos_use": true,
      "support_manage": true,
      "marketing_manage": true,
      "settings_manage": true,
      "roles_manage": true
    }'::jsonb
  )
on conflict (role) do update set
  permissions = excluded.permissions,
  updated_at = now();
