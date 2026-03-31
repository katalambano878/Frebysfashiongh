"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { createClient } from "@/lib/supabase/client"
import { MOCK_PRODUCT_IMAGE } from "@/lib/product-image"

type CategoryRow = {
  id: string
  name: string
  slug: string
  image_url: string | null
}

export function CategoriesRow() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient()
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug, image_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      setCategories(data ?? [])
      setLoading(false)
    }

    void loadCategories()
  }, [])

  const displayCategories = categories.slice(0, 4)

  return (
    <Section className="pt-8 pb-6 sm:pt-10 sm:pb-8">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="inline-flex rounded-full border border-border px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Collections
            </span>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
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

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-100"
              />
            ))}
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="rounded-2xl border border-rose-border/50 bg-rose-50/30 p-8 text-center text-sm text-muted-foreground">
            No categories yet. Add categories in the admin dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayCategories.map((category) => {
              const imageSrc =
                category.image_url?.trim() || MOCK_PRODUCT_IMAGE
              return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm transition-transform duration-500 group-hover:-translate-y-0.5">
                  <img
                    src={imageSrc}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-heading text-3xl leading-none font-semibold tracking-tight text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium tracking-wide text-white/80">
                      Browse Collection
                    </p>
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
