import { HeroSection } from "@/components/home/hero-section"
import { CategoriesRow } from "@/components/home/categories-row"
import { FeaturedCollections } from "@/components/home/featured-collections"
import { BestSellersGrid } from "@/components/home/best-sellers-grid"
import { PromoBanner } from "@/components/shared/promo-banner"
import { TrendingCarousel } from "@/components/home/trending-carousel"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { TrustBar } from "@/components/shared/trust-bar"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import {
  fetchNewArrivals,
  fetchBestSellers,
  fetchTrendingProducts,
  fetchProductsByCategorySlug,
  fetchStorefrontCategoriesWithCounts,
} from "@/lib/supabase/storefront-products"

export default async function HomePage() {
  const [newArrivals, curatedPicks, occasionPicks, bestGrid, trending, categories] =
    await Promise.all([
      fetchNewArrivals(4),
      fetchBestSellers(4),
      fetchProductsByCategorySlug("occasion-wear", 4),
      fetchBestSellers(8),
      fetchTrendingProducts(6),
      fetchStorefrontCategoriesWithCounts(),
    ])

  return (
    <>
      <HeroSection />

      <CategoriesRow categories={categories} />

      <Section>
        <Container>
          <FeaturedCollections
            newArrivals={newArrivals}
            curatedPicks={curatedPicks}
            occasionPicks={occasionPicks}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <BestSellersGrid products={bestGrid} />
        </Container>
      </Section>

      <PromoBanner
        title="Kids Ankara Styles for Every Event"
        subtitle="From casual outings to luxury occasions, dress your child with confidence."
        ctaText="Shop Kids Wear"
        ctaHref="/shop"
      />

      <Section>
        <Container>
          <TrendingCarousel products={trending} />
        </Container>
      </Section>

      <TestimonialsSection />

      <Section className="py-12">
        <Container>
          <TrustBar />
        </Container>
      </Section>

      <NewsletterSection />
    </>
  )
}
