-- Optional seed (run after migration, as postgres or service role in SQL Editor)
-- Categories for Laura's Luxury

insert into public.categories (name, slug, description, sort_order, is_active)
values
  ('Bags', 'bags', 'Luxury bags for every occasion', 1, true),
  ('Dresses', 'dresses', 'Elegant dresses that make a statement', 2, true),
  ('Shoes', 'shoes', 'Step out in style and comfort', 3, true),
  ('Perfumes', 'perfumes', 'Signature scents for the confident woman', 4, true),
  ('Accessories', 'accessories', 'The finishing touches that elevate', 5, true),
  ('Gift Items', 'gift-items', 'Thoughtful luxury gifts she''ll adore', 6, true)
on conflict (slug) do nothing;

update public.storefront_settings set
  announcement_bar = 'Free delivery on orders over GH₵ 500 · Authentic products · Easy returns',
  store_name = 'Laura''s Luxury',
  whatsapp_number = '+233000000000',
  support_email = 'hello@laurasluxury.com'
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
    'paystack', jsonb_build_object('enabled', false),
    'flutterwave', jsonb_build_object('enabled', false)
  )
where id = 1;
