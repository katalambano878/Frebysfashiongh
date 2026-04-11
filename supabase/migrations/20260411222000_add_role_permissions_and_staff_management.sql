-- Role permissions for admin dashboard access control.

create table if not exists public.role_permissions (
  role public.user_role primary key,
  permissions jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.role_permissions (role, permissions)
values
  (
    'staff',
    '{
      "catalog_manage": true,
      "orders_manage": true,
      "customers_view": true,
      "content_manage": false,
      "discounts_manage": false,
      "settings_manage": false,
      "roles_manage": false
    }'::jsonb
  ),
  (
    'admin',
    '{
      "catalog_manage": true,
      "orders_manage": true,
      "customers_view": true,
      "content_manage": true,
      "discounts_manage": true,
      "settings_manage": true,
      "roles_manage": false
    }'::jsonb
  ),
  (
    'superadmin',
    '{
      "catalog_manage": true,
      "orders_manage": true,
      "customers_view": true,
      "content_manage": true,
      "discounts_manage": true,
      "settings_manage": true,
      "roles_manage": true
    }'::jsonb
  )
on conflict (role) do update set
  permissions = excluded.permissions,
  updated_at = now();

alter table public.role_permissions enable row level security;

drop policy if exists "role_permissions_staff_read" on public.role_permissions;
create policy "role_permissions_staff_read"
  on public.role_permissions
  for select
  using (public.is_staff());

drop policy if exists "role_permissions_superadmin_manage" on public.role_permissions;
create policy "role_permissions_superadmin_manage"
  on public.role_permissions
  for all
  using (public.is_superadmin())
  with check (public.is_superadmin());
