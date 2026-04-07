/**
 * Canonical storefront category list (order + slugs). Keep in sync with
 * supabase/seed.sql and migrations that seed categories.
 */
export const CATALOG_DEFAULT_CATEGORIES = [
  { name: "Dresses", slug: "dresses", description: "Dresses for every occasion", sort_order: 1 },
  { name: "Two piece", slug: "two-piece", description: "Coordinated two-piece sets", sort_order: 2 },
  { name: "Tops", slug: "tops", description: "Blouses, shirts, and tops", sort_order: 3 },
  { name: "Jeans", slug: "jeans", description: "Denim fits you will love", sort_order: 4 },
  { name: "Bags", slug: "bags", description: "Handbags and everyday bags", sort_order: 5 },
  { name: "Watches", slug: "watches", description: "Timepieces and wristwear", sort_order: 6 },
  { name: "Perfumes", slug: "perfumes", description: "Fragrances and scents", sort_order: 7 },
  { name: "Sunglasses", slug: "sunglasses", description: "Eyewear and sun protection", sort_order: 8 },
  { name: "Shoes", slug: "shoes", description: "Footwear for every look", sort_order: 9 },
  { name: "Heels", slug: "heels", description: "Heels and elevated styles", sort_order: 10 },
  { name: "Slippers", slug: "slippers", description: "Comfortable slip-ons", sort_order: 11 },
  { name: "Jewelries", slug: "jewelries", description: "Jewelry and accessories", sort_order: 12 },
  { name: "Luggage", slug: "luggage", description: "Travel bags and luggage", sort_order: 13 },
  { name: "Men", slug: "men", description: "Men’s collection", sort_order: 14 },
] as const
