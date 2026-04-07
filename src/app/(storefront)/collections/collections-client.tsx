"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Heading } from "@/components/shared/heading"
import type { StorefrontCategory } from "@/lib/supabase/storefront-products"
import { cn } from "@/lib/utils"

const gradients = [
  "from-rose-100 to-pink-50",
  "from-amber-50 to-orange-50",
  "from-sky-50 to-blue-50",
  "from-purple-50 to-fuchsia-50",
  "from-emerald-50 to-teal-50",
  "from-yellow-50 to-amber-50",
]

const icons = ["👜", "👗", "👠", "🌸", "✨", "🎁"]

export type CollectionsPageClientProps = {
  categories: StorefrontCategory[]
}

export default function CollectionsPageClient({
  categories,
}: CollectionsPageClientProps) {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-rose-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Collections</span>
        </div>

        <Heading
          as="h1"
          subtitle="Browse our curated collections of luxury essentials"
          align="left"
        >
          Collections
        </Heading>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group block"
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br luxury-shadow transition-all duration-300 group-hover:luxury-shadow-lg group-hover:scale-[1.02]",
                    gradients[idx % gradients.length],
                  )}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="mb-3 text-5xl">
                      {icons[idx % icons.length]}
                    </span>
                    <h3 className="font-heading text-2xl text-navy">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.productCount} products
                    </p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/80 to-transparent p-4">
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium text-navy transition-colors group-hover:text-rose-primary">
                    {category.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-rose-primary" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  )
}
