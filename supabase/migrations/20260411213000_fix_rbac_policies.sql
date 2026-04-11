-- Restore missing RBAC policies for auth/role checks.
-- These policies are required for profile role lookup from client + middleware.

alter table public.profiles enable row level security;
alter table public.superadmins enable row level security;
alter table public.store_admins enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (id = auth.uid());

drop policy if exists "profiles_staff_all" on public.profiles;
create policy "profiles_staff_all"
  on public.profiles
  for all
  using (public.is_staff());

drop policy if exists "superadmins_super_only" on public.superadmins;
create policy "superadmins_super_only"
  on public.superadmins
  for all
  using (public.is_superadmin());

drop policy if exists "store_admins_admin_plus" on public.store_admins;
create policy "store_admins_admin_plus"
  on public.store_admins
  for all
  using (public.is_admin_or_above());
