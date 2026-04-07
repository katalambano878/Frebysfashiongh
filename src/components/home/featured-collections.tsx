"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { ProductCard } from "@/components/shared/product-card"
import type { Product } from "@/types/product"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "best-sellers", label: "Curated Picks" },
  { id: "perfume-picks", label: "Perfume Picks" },
] as const

export type FeaturedCollectionsProps = {
  newArrivals: Product[]
  curatedPicks: Product[]
  perfumePicks: Product[]
}

function getTabProducts(
  id: string,
  data: FeaturedCollectionsProps,
): Product[] {
  switch (id) {
    case "new-arrivals":
      return data.newArrivals.slice(0, 4)
    case "best-sellers":
      return data.curatedPicks.slice(0, 4)
    case "perfume-picks":
      return data.perfumePicks.slice(0, 4)
    default:
      return []
  }
}

export function FeaturedCollections({
  newArrivals,
  curatedPicks,
  perfumePicks,
}: FeaturedCollectionsProps) {
  const [activeTab, setActiveTab] = useState<string>("new-arrivals")
  const activeProducts = getTabProducts(activeTab, {
    newArrivals,
    curatedPicks,
    perfumePicks,
  })

  return (
    <Section className="pt-6 sm:pt-8">
      <Container>
        <Heading
          as="h2"
          subtitle="Handpicked selections updated every week"
          align="center"
        >
          Featured Collections
        </Heading>

        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-border bg-white p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 sm:px-6",
                  activeTab === tab.id
                    ? "bg-rose-primary text-white shadow-md shadow-rose-primary/20"
                    : "text-muted-foreground hover:text-navy",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          >
            {activeProducts.map((product, i) => (
              <motion.div
                key={product.id}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  )
}
