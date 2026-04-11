-- Add storefront branding fields used by admin settings and hero rendering.

alter table public.storefront_settings
  add column if not exists hero_content jsonb,
  add column if not exists logo_url text,
  add column if not exists favicon_url text;

update public.storefront_settings
set hero_content = coalesce(hero_content, '{}'::jsonb)
where id = 1;
