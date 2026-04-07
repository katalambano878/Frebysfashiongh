import { formatFreeShippingMinimumLabel } from "./utils"

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
  announcement: `Free delivery on orders over ${formatFreeShippingMinimumLabel()} · Authentic products · Easy returns`,
  headline: "Luxury That Fits Your Everyday",
  subheadline: "Bags, shoes, dresses & perfumes — curated for confident women.",
  ctaPrimary: "Shop New Arrivals",
  ctaSecondary: "Explore Collections",
}
