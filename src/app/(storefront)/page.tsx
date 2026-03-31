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

export default function HomePage() {
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
          <FeaturedCollections />
        </Container>
      </Section>

      <Section>
        <Container>
          <BestSellersGrid />
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
          <TrendingCarousel />
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
