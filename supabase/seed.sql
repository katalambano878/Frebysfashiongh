-- Optional seed (run after migration, as postgres or service role in SQL Editor)
-- Default catalog categories (mirrors src/lib/catalog-default-categories.ts)

insert into public.categories (name, slug, description, sort_order, is_active, is_featured_on_home)
values
  ('Girls Ankara Dresses', 'girls-ankara-dresses', 'Stylish Ankara dresses for girls of all ages', 1, true, true),
  ('Boys Ankara Sets', 'boys-ankara-sets', 'Smart and comfortable Ankara sets for boys', 2, true, true),
  ('Two-Piece Sets', 'two-piece-sets', 'Matching kids two-piece Ankara outfits', 3, true, true),
  ('Occasion Wear', 'occasion-wear', 'Luxury kids wear for weddings and celebrations', 4, true, true),
  ('Casual Wear', 'casual-wear', 'Everyday Ankara looks for school and outings', 5, true, false),
  ('Family Matching', 'family-matching', 'Coordinated family Ankara looks for events', 6, true, false),
  ('Kids Accessories', 'kids-accessories', 'Accessories that complete every kids outfit', 7, true, false),
  ('New Arrivals', 'new-arrivals', 'Freshly added kids styles and limited drops', 8, true, false)
on conflict (slug) do nothing;

update public.storefront_settings set
  announcement_bar = 'Unique kids wear for all occasions · Casual and luxury kids wear · Worldwide delivery',
  store_name = 'Frebys Fashion GH',
  whatsapp_number = '+233244720197',
  support_email = 'info@frebysfashiongh.com'
where id = 1;

update public.site_settings set
  feature_flags = jsonb_build_object(
    'reviews', true,
    'loyalty', false,
    'referrals', false,
    'bundles', false,
    'abandoned_cart', false,
    'store_credit', false,
    'subscriptions', false,
    'staff_chat', false,
    'advanced_analytics', false,
    'instagram_shop', false
  ),
  payment_providers = jsonb_build_object(
    'moolre', jsonb_build_object('enabled', true),
    'paystack', jsonb_build_object('enabled', false)
  )
where id = 1;
