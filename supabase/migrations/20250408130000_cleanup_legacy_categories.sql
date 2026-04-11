-- Sync catalog to the canonical kids categories, then remove anything else.
-- Products linked to deleted categories get category_id = null (FK).

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
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  is_featured_on_home = excluded.is_featured_on_home;

delete from public.categories
where lower(trim(slug)) not in (
  'girls-ankara-dresses',
  'boys-ankara-sets',
  'two-piece-sets',
  'occasion-wear',
  'casual-wear',
  'family-matching',
  'kids-accessories',
  'new-arrivals'
);
