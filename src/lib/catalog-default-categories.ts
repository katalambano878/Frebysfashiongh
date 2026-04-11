/**
 * Canonical storefront category list (order + slugs). Keep in sync with
 * supabase/seed.sql and migrations that seed categories.
 */
export const CATALOG_DEFAULT_CATEGORIES = [
  { name: "Girls Ankara Dresses", slug: "girls-ankara-dresses", description: "Stylish Ankara dresses for girls of all ages", sort_order: 1 },
  { name: "Boys Ankara Sets", slug: "boys-ankara-sets", description: "Smart and comfortable Ankara sets for boys", sort_order: 2 },
  { name: "Two-Piece Sets", slug: "two-piece-sets", description: "Matching kids two-piece Ankara outfits", sort_order: 3 },
  { name: "Occasion Wear", slug: "occasion-wear", description: "Luxury kids wear for weddings and celebrations", sort_order: 4 },
  { name: "Casual Wear", slug: "casual-wear", description: "Everyday Ankara looks for school and outings", sort_order: 5 },
  { name: "Family Matching", slug: "family-matching", description: "Coordinated family Ankara looks for events", sort_order: 6 },
  { name: "Kids Accessories", slug: "kids-accessories", description: "Accessories that complete every kids outfit", sort_order: 7 },
  { name: "New Arrivals", slug: "new-arrivals", description: "Freshly added kids styles and limited drops", sort_order: 8 },
] as const
