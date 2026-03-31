export type Category = {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

export type ProductBadge = "New" | "Best Seller" | "Limited" | "Sale"

export type Variant = {
  id: string
  name: string
  type: "size" | "color"
  options: string[]
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  categoryId: string
  categoryName: string
  price: number
  salePrice?: number
  images: string[]
  badges: ProductBadge[]
  variants: Variant[]
  stock: number
  rating: number
  reviewCount: number
  sku: string
  isFeatured: boolean
  isNewArrival: boolean
  isBestSeller: boolean
  deliveryEstimate: string
  createdAt: string
}

export type Testimonial = {
  id: string
  name: string
  location: string
  content: string
  rating: number
  avatar: string
  product: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  image: string
  category: string
  date: string
  readTime: string
}

export type Occasion = {
  id: string
  name: string
  slug: string
  image: string
  description: string
}

export const categories: Category[] = [
  { id: "cat-1", name: "Bags", slug: "bags", description: "Luxury bags for every occasion", image: "/mock-product.png", productCount: 8 },
  { id: "cat-2", name: "Dresses", slug: "dresses", description: "Elegant dresses that make a statement", image: "/mock-product.png", productCount: 6 },
  { id: "cat-3", name: "Shoes", slug: "shoes", description: "Step out in style and comfort", image: "/mock-product.png", productCount: 5 },
  { id: "cat-4", name: "Perfumes", slug: "perfumes", description: "Signature scents for the confident woman", image: "/mock-product.png", productCount: 5 },
  { id: "cat-5", name: "Accessories", slug: "accessories", description: "The finishing touches that elevate", image: "/mock-product.png", productCount: 4 },
  { id: "cat-6", name: "Gift Items", slug: "gift-items", description: "Thoughtful luxury gifts she'll adore", image: "/mock-product.png", productCount: 2 },
]

export const products: Product[] = [
  {
    id: "prod-1", name: "Rosé Quilted Tote", slug: "rose-quilted-tote",
    description: "A timeless quilted tote in soft rosé leather, designed for the woman who carries her world with elegance. Features gold-tone hardware, interior zip pocket, and magnetic snap closure. The perfect everyday luxury companion.",
    shortDescription: "Quilted rosé leather tote with gold-tone hardware",
    categoryId: "cat-1", categoryName: "Bags", price: 450, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [{ id: "v1", name: "Color", type: "color", options: ["Rosé", "Ivory", "Black"] }],
    stock: 12, rating: 4.8, reviewCount: 124, sku: "LL-BAG-001",
    isFeatured: true, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-12-01",
  },
  {
    id: "prod-2", name: "Midnight Clutch", slug: "midnight-clutch",
    description: "An exquisite evening clutch in deep midnight satin, adorned with a crystal clasp that catches every light. Compact yet thoughtfully designed with a chain strap for hands-free elegance.",
    shortDescription: "Satin evening clutch with crystal clasp",
    categoryId: "cat-1", categoryName: "Bags", price: 280, salePrice: 220,
    images: ["/mock-product.png"],
    badges: ["Sale"], variants: [{ id: "v2", name: "Color", type: "color", options: ["Midnight", "Champagne"] }],
    stock: 8, rating: 4.6, reviewCount: 67, sku: "LL-BAG-002",
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2025-11-15",
  },
  {
    id: "prod-3", name: "Parisian Leather Satchel", slug: "parisian-leather-satchel",
    description: "Inspired by the effortless chic of Parisian style, this structured satchel in premium pebbled leather transitions seamlessly from boardroom to bistro. Adjustable crossbody strap included.",
    shortDescription: "Structured pebbled leather satchel",
    categoryId: "cat-1", categoryName: "Bags", price: 520, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["New"], variants: [{ id: "v3", name: "Color", type: "color", options: ["Camel", "Noir", "Burgundy"] }],
    stock: 15, rating: 4.9, reviewCount: 89, sku: "LL-BAG-003",
    isFeatured: true, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2026-02-20",
  },
  {
    id: "prod-4", name: "Cloud Mini Crossbody", slug: "cloud-mini-crossbody",
    description: "Petite but mighty — this cloud-soft mini crossbody in buttery leather is the hands-free essential for your most curated outings. Fits your phone, cards, and lipstick with room to spare.",
    shortDescription: "Buttery soft mini crossbody bag",
    categoryId: "cat-1", categoryName: "Bags", price: 195, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [{ id: "v4", name: "Color", type: "color", options: ["Blush", "Sage", "Cream"] }],
    stock: 22, rating: 4.7, reviewCount: 203, sku: "LL-BAG-004",
    isFeatured: false, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-10-05",
  },
  {
    id: "prod-5", name: "Executive Tote", slug: "executive-tote",
    description: "For the woman who means business. This structured executive tote in premium Italian leather features a padded laptop compartment, organizational pockets, and a detachable pouch.",
    shortDescription: "Italian leather executive tote with laptop compartment",
    categoryId: "cat-1", categoryName: "Bags", price: 680, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: [], variants: [{ id: "v5", name: "Color", type: "color", options: ["Cognac", "Black"] }],
    stock: 6, rating: 4.9, reviewCount: 45, sku: "LL-BAG-005",
    isFeatured: true, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "3-5 business days", createdAt: "2025-09-10",
  },
  {
    id: "prod-6", name: "Woven Straw Shoulder", slug: "woven-straw-shoulder",
    description: "Summer's most coveted accessory — a handwoven straw shoulder bag with leather trim and brass buckle. Ideal for weekend markets, beach getaways, and brunch with friends.",
    shortDescription: "Handwoven straw bag with leather trim",
    categoryId: "cat-1", categoryName: "Bags", price: 165, salePrice: 130,
    images: ["/mock-product.png"],
    badges: ["Sale"], variants: [],
    stock: 18, rating: 4.5, reviewCount: 91, sku: "LL-BAG-006",
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2025-08-22",
  },
  {
    id: "prod-7", name: "Velvet Chain Bag", slug: "velvet-chain-bag",
    description: "Rich velvet meets gold chain hardware in this statement evening bag. The perfect companion for cocktail hours, galas, and nights that deserve to be remembered.",
    shortDescription: "Velvet evening bag with gold chain strap",
    categoryId: "cat-1", categoryName: "Bags", price: 340, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Limited"], variants: [{ id: "v7", name: "Color", type: "color", options: ["Emerald", "Ruby", "Sapphire"] }],
    stock: 3, rating: 4.8, reviewCount: 34, sku: "LL-BAG-007",
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2026-03-01",
  },
  {
    id: "prod-8", name: "The Everyday Hobo", slug: "everyday-hobo",
    description: "Slouchy, sophisticated, and effortlessly cool. This premium leather hobo bag molds to your body and gets more beautiful with age. A Laura's Luxury signature piece.",
    shortDescription: "Premium slouchy leather hobo bag",
    categoryId: "cat-1", categoryName: "Bags", price: 395, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["New"], variants: [{ id: "v8", name: "Color", type: "color", options: ["Tan", "Charcoal"] }],
    stock: 10, rating: 4.7, reviewCount: 56, sku: "LL-BAG-008",
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2026-03-10",
  },

  // DRESSES
  {
    id: "prod-9", name: "Silk Wrap Midi Dress", slug: "silk-wrap-midi-dress",
    description: "Pure silk in a universally flattering wrap silhouette. This midi dress drapes like a dream, cinching at the waist with a self-tie belt. Perfect for dinners, dates, and everything in between.",
    shortDescription: "Pure silk wrap dress in midi length",
    categoryId: "cat-2", categoryName: "Dresses", price: 580, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [
      { id: "v9a", name: "Size", type: "size", options: ["XS", "S", "M", "L", "XL"] },
      { id: "v9b", name: "Color", type: "color", options: ["Champagne", "Dusty Rose", "Black"] },
    ],
    stock: 20, rating: 4.9, reviewCount: 156, sku: "LL-DRS-001",
    isFeatured: true, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-11-01",
  },
  {
    id: "prod-10", name: "Lace Evening Gown", slug: "lace-evening-gown",
    description: "A show-stopping evening gown in delicate French lace over a satin lining. Features a sweetheart neckline, fitted bodice, and floor-length skirt with a subtle train.",
    shortDescription: "French lace gown with sweetheart neckline",
    categoryId: "cat-2", categoryName: "Dresses", price: 1200, salePrice: 950,
    images: ["/mock-product.png"],
    badges: ["Sale", "Limited"], variants: [
      { id: "v10a", name: "Size", type: "size", options: ["XS", "S", "M", "L"] },
      { id: "v10b", name: "Color", type: "color", options: ["Ivory", "Blush"] },
    ],
    stock: 4, rating: 5.0, reviewCount: 28, sku: "LL-DRS-002",
    isFeatured: true, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "3-5 business days", createdAt: "2025-10-15",
  },
  {
    id: "prod-11", name: "Tailored Blazer Dress", slug: "tailored-blazer-dress",
    description: "Power dressing redefined. This structured blazer dress features sharp shoulders, a double-breasted front, and a flattering above-knee length. Add heels and you're unstoppable.",
    shortDescription: "Structured blazer dress with sharp tailoring",
    categoryId: "cat-2", categoryName: "Dresses", price: 420, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["New"], variants: [
      { id: "v11a", name: "Size", type: "size", options: ["S", "M", "L", "XL"] },
      { id: "v11b", name: "Color", type: "color", options: ["Noir", "Camel", "Emerald"] },
    ],
    stock: 14, rating: 4.7, reviewCount: 73, sku: "LL-DRS-003",
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2026-02-28",
  },
  {
    id: "prod-12", name: "Floral Maxi Dress", slug: "floral-maxi-dress",
    description: "Romance in motion — this flowing maxi dress features an exclusive watercolor floral print on lightweight chiffon. V-neck, flutter sleeves, and a hidden zip make it effortlessly wearable.",
    shortDescription: "Watercolor floral chiffon maxi dress",
    categoryId: "cat-2", categoryName: "Dresses", price: 350, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: [], variants: [
      { id: "v12a", name: "Size", type: "size", options: ["XS", "S", "M", "L", "XL"] },
    ],
    stock: 25, rating: 4.6, reviewCount: 112, sku: "LL-DRS-004",
    isFeatured: false, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-09-20",
  },
  {
    id: "prod-13", name: "Cashmere Knit Dress", slug: "cashmere-knit-dress",
    description: "Cozy meets couture in this impossibly soft cashmere-blend knit dress. The relaxed turtleneck and ribbed hem create a silhouette that's equally at home by the fireplace or at a gallery opening.",
    shortDescription: "Cashmere-blend turtleneck knit dress",
    categoryId: "cat-2", categoryName: "Dresses", price: 490, salePrice: 380,
    images: ["/mock-product.png"],
    badges: ["Sale"], variants: [
      { id: "v13a", name: "Size", type: "size", options: ["S", "M", "L"] },
      { id: "v13b", name: "Color", type: "color", options: ["Oatmeal", "Charcoal", "Rose"] },
    ],
    stock: 9, rating: 4.8, reviewCount: 67, sku: "LL-DRS-005",
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2025-12-10",
  },
  {
    id: "prod-14", name: "Satin Slip Dress", slug: "satin-slip-dress",
    description: "The essence of understated glamour. This bias-cut satin slip dress skims the body beautifully, with delicate spaghetti straps and a cowl neckline. Layer with a blazer or wear alone.",
    shortDescription: "Bias-cut satin slip dress with cowl neck",
    categoryId: "cat-2", categoryName: "Dresses", price: 310, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["New", "Best Seller"], variants: [
      { id: "v14a", name: "Size", type: "size", options: ["XS", "S", "M", "L"] },
      { id: "v14b", name: "Color", type: "color", options: ["Gold", "Silver", "Midnight", "Rosé"] },
    ],
    stock: 30, rating: 4.9, reviewCount: 189, sku: "LL-DRS-006",
    isFeatured: true, isNewArrival: true, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2026-03-05",
  },

  // SHOES
  {
    id: "prod-15", name: "Pointed Kitten Heels", slug: "pointed-kitten-heels",
    description: "Classic pointed-toe kitten heels in premium patent leather. The 5cm heel offers all-day comfort without compromising on style. A wardrobe essential for the modern woman.",
    shortDescription: "Patent leather pointed-toe kitten heels",
    categoryId: "cat-3", categoryName: "Shoes", price: 280, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [
      { id: "v15a", name: "Size", type: "size", options: ["36", "37", "38", "39", "40", "41"] },
      { id: "v15b", name: "Color", type: "color", options: ["Nude", "Black", "Red"] },
    ],
    stock: 35, rating: 4.7, reviewCount: 234, sku: "LL-SHO-001",
    isFeatured: true, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-08-01",
  },
  {
    id: "prod-16", name: "Suede Block Heel Sandals", slug: "suede-block-heel-sandals",
    description: "Walk tall and steady in these elegant suede block heel sandals. Ankle strap closure, padded insole, and a flattering 8cm heel that you can dance in all night.",
    shortDescription: "Suede sandals with comfortable block heel",
    categoryId: "cat-3", categoryName: "Shoes", price: 240, salePrice: 195,
    images: ["/mock-product.png"],
    badges: ["Sale"], variants: [
      { id: "v16a", name: "Size", type: "size", options: ["36", "37", "38", "39", "40"] },
      { id: "v16b", name: "Color", type: "color", options: ["Terracotta", "Black", "Sage"] },
    ],
    stock: 18, rating: 4.6, reviewCount: 87, sku: "LL-SHO-002",
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2025-10-20",
  },
  {
    id: "prod-17", name: "Crystal Stiletto Pumps", slug: "crystal-stiletto-pumps",
    description: "When the occasion calls for extraordinary. These stiletto pumps feature hand-placed crystal embellishments on a mesh overlay, 10cm heel, and cushioned insole for comfort that lasts.",
    shortDescription: "Crystal-embellished stiletto pumps",
    categoryId: "cat-3", categoryName: "Shoes", price: 550, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Limited"], variants: [
      { id: "v17a", name: "Size", type: "size", options: ["36", "37", "38", "39", "40"] },
    ],
    stock: 5, rating: 4.9, reviewCount: 42, sku: "LL-SHO-003",
    isFeatured: true, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "3-5 business days", createdAt: "2026-02-15",
  },
  {
    id: "prod-18", name: "Leather Ankle Boots", slug: "leather-ankle-boots",
    description: "From autumn walks to winter soirées, these Italian leather ankle boots with a sleek silhouette, side zip, and 6cm stacked heel are a seasonal must. Break them in once, love them forever.",
    shortDescription: "Italian leather ankle boots with stacked heel",
    categoryId: "cat-3", categoryName: "Shoes", price: 380, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["New"], variants: [
      { id: "v18a", name: "Size", type: "size", options: ["36", "37", "38", "39", "40", "41"] },
      { id: "v18b", name: "Color", type: "color", options: ["Espresso", "Black"] },
    ],
    stock: 12, rating: 4.8, reviewCount: 98, sku: "LL-SHO-004",
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2026-03-01",
  },
  {
    id: "prod-19", name: "Slingback Ballet Flats", slug: "slingback-ballet-flats",
    description: "The ballet flat reimagined — with a chic slingback strap and cap toe detail. In butter-soft nappa leather, these are the flats you'll reach for every single day.",
    shortDescription: "Nappa leather slingback ballet flats",
    categoryId: "cat-3", categoryName: "Shoes", price: 210, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [
      { id: "v19a", name: "Size", type: "size", options: ["36", "37", "38", "39", "40"] },
      { id: "v19b", name: "Color", type: "color", options: ["Ballet Pink", "Cream", "Black"] },
    ],
    stock: 40, rating: 4.8, reviewCount: 312, sku: "LL-SHO-005",
    isFeatured: false, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-07-15",
  },

  // PERFUMES
  {
    id: "prod-20", name: "Velvet Rose — Eau de Parfum", slug: "velvet-rose-edp",
    description: "A captivating blend of Bulgarian rose absolute, velvety oud, and warm amber. Velvet Rose is the scent of a woman who enters a room and is remembered long after she leaves. 50ml spray.",
    shortDescription: "Rose, oud & amber — sophisticated femininity in a bottle",
    categoryId: "cat-4", categoryName: "Perfumes", price: 320, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [{ id: "v20", name: "Size", type: "size", options: ["30ml", "50ml", "100ml"] }],
    stock: 25, rating: 4.9, reviewCount: 278, sku: "LL-PRF-001",
    isFeatured: true, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-06-01",
  },
  {
    id: "prod-21", name: "Midnight Bloom — Eau de Parfum", slug: "midnight-bloom-edp",
    description: "For the after-dark woman. Midnight Bloom opens with black cherry and night-blooming jasmine, settling into a base of sandalwood and vanilla. Intoxicating, mysterious, unforgettable. 50ml spray.",
    shortDescription: "Cherry, jasmine & sandalwood — your signature night scent",
    categoryId: "cat-4", categoryName: "Perfumes", price: 350, salePrice: 280,
    images: ["/mock-product.png"],
    badges: ["Sale"], variants: [{ id: "v21", name: "Size", type: "size", options: ["50ml", "100ml"] }],
    stock: 15, rating: 4.7, reviewCount: 134, sku: "LL-PRF-002",
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2025-09-01",
  },
  {
    id: "prod-22", name: "Lumière — Eau de Toilette", slug: "lumiere-edt",
    description: "Light, radiant, and effortlessly fresh. Lumière captures the first morning light with notes of bergamot, white tea, and sheer musk. Perfect for everyday elegance. 75ml spray.",
    shortDescription: "Bergamot, white tea & musk — fresh everyday luxury",
    categoryId: "cat-4", categoryName: "Perfumes", price: 220, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["New"], variants: [{ id: "v22", name: "Size", type: "size", options: ["50ml", "75ml"] }],
    stock: 30, rating: 4.6, reviewCount: 89, sku: "LL-PRF-003",
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "2-4 business days", createdAt: "2026-02-10",
  },
  {
    id: "prod-23", name: "Opulence Noir — Eau de Parfum", slug: "opulence-noir-edp",
    description: "Bold, rich, unapologetic. Opulence Noir wraps you in saffron, black orchid, and smoky leather. This is not a perfume — it's an entrance. Limited edition 50ml spray.",
    shortDescription: "Saffron, orchid & leather — bold luxury fragrance",
    categoryId: "cat-4", categoryName: "Perfumes", price: 450, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Limited"], variants: [{ id: "v23", name: "Size", type: "size", options: ["50ml"] }],
    stock: 8, rating: 4.9, reviewCount: 56, sku: "LL-PRF-004",
    isFeatured: true, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "3-5 business days", createdAt: "2025-11-20",
  },
  {
    id: "prod-24", name: "Pétale — Body Mist", slug: "petale-body-mist",
    description: "A delicate body mist with notes of peony, lily of the valley, and soft cotton. Pétale is your all-day freshness companion — light enough to layer, beautiful enough to stand alone. 150ml spray.",
    shortDescription: "Peony & cotton — delicate all-day body mist",
    categoryId: "cat-4", categoryName: "Perfumes", price: 120, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [],
    stock: 50, rating: 4.5, reviewCount: 401, sku: "LL-PRF-005",
    isFeatured: false, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "2-4 business days", createdAt: "2025-05-10",
  },

  // ACCESSORIES
  {
    id: "prod-25", name: "Pearl Drop Earrings", slug: "pearl-drop-earrings",
    description: "Freshwater pearl drops on 18k gold-plated settings. These earrings bring a whisper of old-world glamour to any outfit. Lightweight and hypoallergenic.",
    shortDescription: "Freshwater pearl earrings on 18k gold plate",
    categoryId: "cat-5", categoryName: "Accessories", price: 85, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller"], variants: [],
    stock: 60, rating: 4.8, reviewCount: 356, sku: "LL-ACC-001",
    isFeatured: true, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "1-3 business days", createdAt: "2025-04-01",
  },
  {
    id: "prod-26", name: "Silk Scarf — Botanical", slug: "silk-scarf-botanical",
    description: "A hand-rolled silk scarf featuring an exclusive botanical illustration. Wear it as a neck scarf, hair accessory, or tied to your favourite bag. 70x70cm.",
    shortDescription: "Hand-rolled silk scarf with botanical print",
    categoryId: "cat-5", categoryName: "Accessories", price: 145, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["New"], variants: [{ id: "v26", name: "Color", type: "color", options: ["Garden", "Ocean", "Sunset"] }],
    stock: 20, rating: 4.7, reviewCount: 78, sku: "LL-ACC-002",
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "1-3 business days", createdAt: "2026-03-12",
  },
  {
    id: "prod-27", name: "Gold Chain Belt", slug: "gold-chain-belt",
    description: "Elevate any dress, blazer, or jeans with this adjustable gold-tone chain belt. Features a rose medallion clasp that's signature Laura's Luxury.",
    shortDescription: "Adjustable gold-tone chain belt with rose clasp",
    categoryId: "cat-5", categoryName: "Accessories", price: 110, salePrice: 85,
    images: ["/mock-product.png"],
    badges: ["Sale"], variants: [],
    stock: 15, rating: 4.6, reviewCount: 45, sku: "LL-ACC-003",
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    deliveryEstimate: "1-3 business days", createdAt: "2025-08-15",
  },
  {
    id: "prod-28", name: "Leather Card Holder", slug: "leather-card-holder",
    description: "Slim, sleek, and perfectly practical. This premium leather card holder features 4 card slots and a centre pocket. The ideal everyday wallet for the minimalist.",
    shortDescription: "Slim premium leather card holder",
    categoryId: "cat-5", categoryName: "Accessories", price: 75, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: [], variants: [{ id: "v28", name: "Color", type: "color", options: ["Blush", "Noir", "Sage"] }],
    stock: 45, rating: 4.5, reviewCount: 167, sku: "LL-ACC-004",
    isFeatured: false, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "1-3 business days", createdAt: "2025-07-01",
  },

  // GIFT ITEMS
  {
    id: "prod-29", name: "Luxury Gift Set — Velvet Rose", slug: "luxury-gift-set-velvet-rose",
    description: "The ultimate gift for the woman who has everything. This curated set includes Velvet Rose Eau de Parfum (30ml), a silk hair scrunchie, and a hand-poured rose candle, all wrapped in Laura's Luxury signature box.",
    shortDescription: "Perfume, silk scrunchie & candle in luxury box",
    categoryId: "cat-6", categoryName: "Gift Items", price: 450, salePrice: undefined,
    images: ["/mock-product.png"],
    badges: ["Best Seller", "Limited"], variants: [],
    stock: 10, rating: 5.0, reviewCount: 89, sku: "LL-GFT-001",
    isFeatured: true, isNewArrival: false, isBestSeller: true,
    deliveryEstimate: "3-5 business days", createdAt: "2025-12-01",
  },
  {
    id: "prod-30", name: "Self-Care Pamper Box", slug: "self-care-pamper-box",
    description: "Because she deserves it. This pamper box includes a Pétale body mist, a cashmere-blend eye mask, botanical bath salts, and a handwritten note card. Beautifully gift-wrapped.",
    shortDescription: "Body mist, eye mask, bath salts & note card set",
    categoryId: "cat-6", categoryName: "Gift Items", price: 280, salePrice: 240,
    images: ["/mock-product.png"],
    badges: ["Sale", "New"], variants: [],
    stock: 20, rating: 4.8, reviewCount: 134, sku: "LL-GFT-002",
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    deliveryEstimate: "3-5 business days", createdAt: "2026-03-15",
  },
]

export const occasions: Occasion[] = [
  { id: "occ-1", name: "Work", slug: "work", image: "/mock-product.png", description: "Power pieces for the boardroom" },
  { id: "occ-2", name: "Wedding", slug: "wedding", image: "/mock-product.png", description: "Elegant guest & bridal looks" },
  { id: "occ-3", name: "Weekend", slug: "weekend", image: "/mock-product.png", description: "Effortless style for days off" },
  { id: "occ-4", name: "Gifting", slug: "gifting", image: "/mock-product.png", description: "Thoughtful gifts she'll adore" },
]

export const testimonials: Testimonial[] = [
  { id: "t-1", name: "Ama Mensah", location: "Accra", content: "The Rosé Quilted Tote is everything. The quality is impeccable and I get compliments every single time I carry it. Laura's Luxury has become my go-to.", rating: 5, avatar: "/images/avatars/1.jpg", product: "Rosé Quilted Tote" },
  { id: "t-2", name: "Nana Adwoa", location: "Kumasi", content: "I ordered the Silk Wrap Dress for my anniversary dinner and it was absolutely stunning. The fabric quality is unmatched. Will definitely be ordering more.", rating: 5, avatar: "/images/avatars/2.jpg", product: "Silk Wrap Midi Dress" },
  { id: "t-3", name: "Efya Owusu", location: "Takoradi", content: "Velvet Rose is hands down the most beautiful perfume I've ever owned. People always ask me what I'm wearing. It lasts all day too!", rating: 5, avatar: "/images/avatars/3.jpg", product: "Velvet Rose — Eau de Parfum" },
  { id: "t-4", name: "Abena Darko", location: "Tema", content: "The delivery was fast and the packaging was so luxurious. The pearl earrings are now my everyday pair. Elegant and lightweight — perfect!", rating: 5, avatar: "/images/avatars/4.jpg", product: "Pearl Drop Earrings" },
  { id: "t-5", name: "Serwaa K.", location: "Cape Coast", content: "I got the Self-Care Pamper Box for my best friend and she cried. The presentation alone is worth it. This brand understands luxury gifting.", rating: 5, avatar: "/images/avatars/5.jpg", product: "Self-Care Pamper Box" },
]

export const blogPosts: BlogPost[] = [
  { id: "blog-1", title: "5 Ways to Style a Silk Scarf This Season", slug: "style-silk-scarf", excerpt: "From your hair to your handbag — discover the most elegant ways to wear silk scarves.", image: "/mock-product.png", category: "Style", date: "2026-03-20", readTime: "4 min" },
  { id: "blog-2", title: "Building a Capsule Wardrobe: The Luxury Edition", slug: "capsule-wardrobe", excerpt: "Invest in fewer, better pieces. Here's your guide to a curated closet that works.", image: "/mock-product.png", category: "Fashion", date: "2026-03-15", readTime: "6 min" },
  { id: "blog-3", title: "The Art of Gifting: How to Choose the Perfect Present", slug: "art-of-gifting", excerpt: "Thoughtful gifting is an art. Learn how to choose gifts that truly resonate.", image: "/mock-product.png", category: "Lifestyle", date: "2026-03-10", readTime: "3 min" },
]

export const heroContent = {
  announcement: "Free delivery on orders over GH₵ 500 · Authentic products · Easy returns",
  headline: "Luxury That Fits Your Everyday",
  subheadline: "Bags, shoes, dresses & perfumes — curated for confident women.",
  ctaPrimary: "Shop New Arrivals",
  ctaSecondary: "Explore Collections",
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = categories.find(c => c.slug === categorySlug)
  if (!cat) return []
  return products.filter(p => p.categoryId === cat.id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured)
}

export function getNewArrivals(): Product[] {
  return products.filter(p => p.isNewArrival)
}

export function getBestSellers(): Product[] {
  return products.filter(p => p.isBestSeller)
}

export function getSaleProducts(): Product[] {
  return products.filter(p => p.salePrice !== undefined)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}
