# Supabase — Frebys Fashion GH

## Apply the database

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Paste the full contents of `migrations/20250324180000_init_lauras_luxury.sql` and run it once.
3. (Optional) Run `seed.sql` for default categories and storefront rows.

Or use the CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## First superadmin / store admin

RLS blocks normal clients from editing allowlists. In SQL Editor (runs with elevated privileges):

```sql
-- Platform owner (sign up in Auth with this exact email after running this)
insert into public.superadmins (email) values ('you@yourdomain.com')
on conflict (email) do nothing;

-- Store owner / staff admin list
insert into public.store_admins (email) values ('owner@frebysfashiongh.com')
on conflict (email) do nothing;
```

Then sign up that user via **Authentication → Users** or your app; the trigger sets `profiles.role` to `superadmin` or `admin`.

## Environment variables

Use **Project Settings → API** in Supabase:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` `public` key  
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, never expose to the browser  

Copy these into `.env.local` (not committed).

## Security note

If API keys were ever committed to git or shared, **rotate** them in Supabase (Settings → API → regenerate).

## Storage

The migration creates buckets `product-images`, `blog-covers`, `site-media`, `receipts` and basic policies. Adjust paths in the Dashboard if needed.
