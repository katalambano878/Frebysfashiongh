export type { Product, ProductBadge, Variant } from "@/types/product"

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

export const occasions: Occasion[] = [
  { id: "occ-1", name: "School & Everyday", slug: "school-everyday", image: "/mock-product.png", description: "Comfortable Ankara looks for daily wear" },
  { id: "occ-2", name: "Parties", slug: "parties", image: "/mock-product.png", description: "Standout outfits for birthdays and celebrations" },
  { id: "occ-3", name: "Weddings & Events", slug: "weddings-events", image: "/mock-product.png", description: "Elegant kids looks for special occasions" },
  { id: "occ-4", name: "Family Matching", slug: "family-matching", image: "/mock-product.png", description: "Coordinated styles for memorable moments" },
]

export const testimonials: Testimonial[] = [
  { id: "t-1", name: "Ama Mensah", location: "Accra", content: "I ordered matching Ankara sets for my twins and the fit was perfect. Frebys Fashion GH really understands kids style.", rating: 5, avatar: "/images/avatars/1.jpg", product: "Twin Ankara Party Set" },
  { id: "t-2", name: "Nana Adwoa", location: "Kumasi", content: "The quality is beautiful and my son stayed comfortable all day at his birthday party. I will definitely order again.", rating: 5, avatar: "/images/avatars/2.jpg", product: "Boys Ankara Occasion Set" },
  { id: "t-3", name: "Efya Owusu", location: "Takoradi", content: "Worldwide delivery was smooth and the outfit looked exactly like the photos. My daughter looked amazing.", rating: 5, avatar: "/images/avatars/3.jpg", product: "Girls Ankara Flare Dress" },
  { id: "t-4", name: "Abena Darko", location: "Tema", content: "Great finishing, neat stitching, and vibrant colors. This is now my go-to shop for kids events.", rating: 5, avatar: "/images/avatars/4.jpg", product: "Kids Ankara Two-Piece Set" },
  { id: "t-5", name: "Serwaa K.", location: "Cape Coast", content: "Customer support was very friendly on WhatsApp and helped me pick the right size quickly.", rating: 5, avatar: "/images/avatars/5.jpg", product: "Custom Kids Ankara Collection" },
]

export const blogPosts: BlogPost[] = [
  { id: "blog-1", title: "How to Choose Ankara Outfits for Kids Events", slug: "kids-ankara-events", excerpt: "Simple styling ideas for birthdays, weddings, and church programs.", image: "/mock-product.png", category: "Kids Style", date: "2026-03-20", readTime: "4 min" },
  { id: "blog-2", title: "Casual vs Luxury Kids Wear: What to Pick", slug: "casual-vs-luxury-kids-wear", excerpt: "A quick parent guide to choosing the right look for each occasion.", image: "/mock-product.png", category: "Parent Guide", date: "2026-03-15", readTime: "5 min" },
  { id: "blog-3", title: "Ankara Care Tips for Long-Lasting Colors", slug: "ankara-care-tips", excerpt: "Keep your kids Ankara pieces bright, clean, and comfortable.", image: "/mock-product.png", category: "Care", date: "2026-03-10", readTime: "3 min" },
]

export const heroContent = {
  announcement: `Unique kids wear for all occasions · Casual and luxury kids wear · Worldwide delivery`,
  headline: "Unique Kids Wear for Every Occasion",
  subheadline: "Passion for kids fashion with casual and luxury Ankara styles.",
  ctaPrimary: "Shop Kids Collections",
  ctaSecondary: "Explore New Arrivals",
}
