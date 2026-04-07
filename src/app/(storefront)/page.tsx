import { HeroSection } from "@/components/home/hero-section"
import { CategoriesRow } from "@/components/home/categories-row"
import { FeaturedCollections } from "@/components/home/featured-collections"
import { BestSellersGrid } from "@/components/home/best-sellers-grid"
import { PromoBanner } from "@/components/shared/promo-banner"
import { TrendingCarousel } from "@/components/home/trending-carousel"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { InstagramGrid } from "@/components/home/instagram-grid"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { TrustBar } from "@/components/shared/trust-bar"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import {
  fetchNewArrivals,
  fetchBestSellers,
  fetchTrendingProducts,
  fetchProductsByCategorySlug,
} from "@/lib/supabase/storefront-products"

export default async function HomePage() {
  const [newArrivals, curatedPicks, perfumePicks, bestGrid, trending] =
    await Promise.all([
      fetchNewArrivals(4),
      fetchBestSellers(4),
      fetchProductsByCategorySlug("perfumes", 4),
      fetchBestSellers(8),
      fetchTrendingProducts(6),
    ])

  return (
    <>
      <HeroSection />

      <Section>
        <Container>
          <CategoriesRow />
        </Container>
      </Section>

      <Section>
        <Container>
          <FeaturedCollections
            newArrivals={newArrivals}
            curatedPicks={curatedPicks}
            perfumePicks={perfumePicks}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <BestSellersGrid products={bestGrid} />
        </Container>
      </Section>

      <PromoBanner
        title="The Perfect Gift, Every Time"
        subtitle="Explore our curated gift sets — beautifully wrapped and ready to delight."
        ctaText="Shop Gift Sets"
        ctaHref="/shop?category=gift-items"
      />

      <Section>
        <Container>
          <TrendingCarousel products={trending} />
        </Container>
      </Section>

      <TestimonialsSection />

      <Section>
        <Container>
          <InstagramGrid />
        </Container>
      </Section>

      <Section className="py-12">
        <Container>
          <TrustBar />
        </Container>
      </Section>

      <NewsletterSection />
    </>
  )
}
