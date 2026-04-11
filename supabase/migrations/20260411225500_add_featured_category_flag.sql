-- Homepage featured categories control.
-- Allows admin to choose which categories appear in "Shop by Category".

alter table public.categories
  add column if not exists is_featured_on_home boolean not null default false;

-- Initial default: first four active categories by sort order.
with ranked as (
  select id
  from public.categories
  where is_active = true
  order by sort_order asc, created_at asc
  limit 4
)
update public.categories c
set is_featured_on_home = exists (
  select 1 from ranked r where r.id = c.id
);
