import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import type { StorefrontCategory } from "@/lib/supabase/storefront-products"
import { MOCK_PRODUCT_IMAGE } from "@/lib/product-image"

export type CategoriesRowProps = {
  categories: StorefrontCategory[]
}

export function CategoriesRow({ categories }: CategoriesRowProps) {
  return (
    <Section className="pt-8 pb-6 sm:pt-10 sm:pb-8">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="inline-flex rounded-full border border-border px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Featured Categories
            </span>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-navy sm:text-[2.8rem]">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-muted"
          >
            Explore All
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-rose-border/50 bg-rose-50/30 p-8 text-center text-sm text-muted-foreground">
            No featured categories yet. In admin, turn on "Featured category" for up to 4 categories.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const imageSrc =
                category.image_url?.trim() || MOCK_PRODUCT_IMAGE
              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group overflow-hidden rounded-3xl border border-rose-border/40 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
                    <img
                      src={imageSrc}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur">
                      <Sparkles className="size-3" />
                      Featured
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-heading text-3xl leading-none font-semibold tracking-tight text-white drop-shadow-sm">
                        {category.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs font-medium tracking-wide text-white/85">
                          {category.productCount}{" "}
                          {category.productCount === 1 ? "item" : "items"}
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                          View
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Container>
    </Section>
  )
}
