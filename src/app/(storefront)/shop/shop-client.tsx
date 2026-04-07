"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  Package,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"
import type { StorefrontCategory } from "@/lib/supabase/storefront-products"
import { Container } from "@/components/shared/container"
import { Heading } from "@/components/shared/heading"
import { ProductCard } from "@/components/shared/product-card"
import { QuickViewModal } from "@/components/shared/quick-view-modal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const ITEMS_PER_PAGE = 9

const sortOptions = [
  { value: "best-sellers", label: "Best Sellers" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "top-rated", label: "Top Rated" },
] as const

const MIN_PRICE = 0

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.06 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export type ShopPageClientProps = {
  products: Product[]
  categories: StorefrontCategory[]
  maxPrice: number
  initialCategory?: string
}

export default function ShopPageClient({
  products,
  categories,
  maxPrice,
  initialCategory,
}: ShopPageClientProps) {
  const searchParams = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    initialCategory ? [initialCategory] : [],
  )
  const [priceRange, setPriceRange] = useState<number[]>([
    MIN_PRICE,
    maxPrice,
  ])
  const [sort, setSort] = useState<string>("best-sellers")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    setPriceRange([MIN_PRICE, maxPrice])
  }, [maxPrice])

  useEffect(() => {
    const cat = searchParams.get("category")
    if (cat) {
      setSelectedCategories([cat.toLowerCase()])
    }
    const filter = searchParams.get("filter")
    if (filter === "best-sellers") setSort("best-sellers")
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategories.length > 0) {
      const selected = new Set(selectedCategories.map((s) => s.toLowerCase()))
      result = result.filter((p) =>
        selected.has((p.categorySlug ?? "").toLowerCase()),
      )
    }

    result = result.filter((p) => {
      const price = p.salePrice ?? p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0)
    }

    switch (sort) {
      case "best-sellers":
        result.sort((a, b) => {
          if (a.isBestSeller !== b.isBestSeller) {
            return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
          }
          return b.reviewCount - a.reviewCount
        })
        break
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        break
      case "price-low":
        result.sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
        )
        break
      case "price-high":
        result.sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
        )
        break
      case "top-rated":
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [
    products,
    selectedCategories,
    priceRange,
    sort,
    inStockOnly,
  ])

  const displayedProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const activeCategoryName =
    selectedCategories.length === 1
      ? categories.find(
          (c) => c.slug.toLowerCase() === selectedCategories[0],
        )?.name
      : null

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > MIN_PRICE ||
    priceRange[1] < maxPrice ||
    inStockOnly

  function toggleCategory(slug: string) {
    const key = slug.toLowerCase()
    setSelectedCategories((prev) =>
      prev.includes(key)
        ? prev.filter((s) => s !== key)
        : [...prev, key],
    )
    setVisibleCount(ITEMS_PER_PAGE)
  }

  function clearFilters() {
    setSelectedCategories([])
    setPriceRange([MIN_PRICE, maxPrice])
    setInStockOnly(false)
    setSort("best-sellers")
    setVisibleCount(ITEMS_PER_PAGE)
  }

  function handleQuickView(product: Product) {
    setQuickViewProduct(product)
    setQuickViewOpen(true)
  }

  const filterContent = (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-navy">
          Categories
        </h3>
        <div className="mt-3 space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={selectedCategories.includes(cat.slug.toLowerCase())}
                onCheckedChange={() => toggleCategory(cat.slug.toLowerCase())}
              />
              <span className="text-sm text-navy/80">{cat.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-navy">
          Price Range
        </h3>
        <div className="mt-4 px-1">
          <Slider
            value={priceRange}
            onValueChange={(val) => setPriceRange(val as number[])}
            min={MIN_PRICE}
            max={maxPrice}
            step={10}
          />
          <div className="mt-3 flex items-center justify-between text-sm text-navy/70">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-navy">
          Availability
        </h3>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(Boolean(checked))}
          />
          <span className="text-sm text-navy/80">In Stock Only</span>
        </label>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-white">
        <Container className="py-8 sm:py-12">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-navy">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-navy">Shop</span>
          </nav>

          <div className="mb-8">
            <Heading as="h1">{activeCategoryName ?? "Shop All"}</Heading>
          </div>

          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger render={<Button variant="outline" className="gap-2" />}>
                <SlidersHorizontal className="size-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-rose-primary text-[10px] font-bold text-white">
                    {selectedCategories.length +
                      (priceRange[0] > MIN_PRICE || priceRange[1] < maxPrice
                        ? 1
                        : 0) +
                      (inStockOnly ? 1 : 0)}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-8">{filterContent}</div>
              </SheetContent>
            </Sheet>

            <div className="ml-auto">
              <Select
                value={sort}
                onValueChange={(val) => {
                  if (val) setSort(val)
                }}
              >
                <SelectTrigger className="w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {selectedCategories.map((slug) => {
                const cat = categories.find(
                  (c) => c.slug.toLowerCase() === slug,
                )
                if (!cat) return null
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => toggleCategory(slug)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-border bg-rose-light px-3 py-1 text-xs font-medium text-navy transition-colors hover:border-rose-primary"
                  >
                    {cat.name}
                    <X className="size-3" />
                  </button>
                )
              })}
              {(priceRange[0] > MIN_PRICE || priceRange[1] < maxPrice) && (
                <button
                  type="button"
                  onClick={() => setPriceRange([MIN_PRICE, maxPrice])}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-border bg-rose-light px-3 py-1 text-xs font-medium text-navy transition-colors hover:border-rose-primary"
                >
                  {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                  <X className="size-3" />
                </button>
              )}
              {inStockOnly && (
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-border bg-rose-light px-3 py-1 text-xs font-medium text-navy transition-colors hover:border-rose-primary"
                >
                  In Stock
                  <X className="size-3" />
                </button>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-rose-primary underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex gap-10">
            <aside className="hidden w-[280px] shrink-0 lg:block">
              <div className="sticky top-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-lg font-semibold text-navy">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-medium text-rose-primary underline underline-offset-2"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {filterContent}

                <div className="mt-8">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-navy">
                    Sort By
                  </h3>
                  <div className="mt-3">
                    <Select
                      value={sort}
                      onValueChange={(val) => {
                        if (val) setSort(val)
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-navy">
                    {displayedProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-navy">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>
              </div>

              {displayedProducts.length > 0 ? (
                <>
                  <motion.div
                    className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    key={`${selectedCategories.join(",")}-${sort}-${priceRange.join(",")}-${inStockOnly}`}
                  >
                    {displayedProducts.map((product) => (
                      <motion.div key={product.id} variants={staggerItem}>
                        <ProductCard
                          product={product}
                          onQuickView={handleQuickView}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {hasMore && (
                    <div className="mt-12 flex justify-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() =>
                            setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                          }
                          className="rounded-full border-rose-border px-8 py-2.5 font-medium text-navy hover:border-rose-primary hover:bg-rose-light hover:text-rose-primary"
                        >
                          Load More Products
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-24 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex size-20 items-center justify-center rounded-full bg-rose-light">
                    <Package className="size-8 text-rose-primary/60" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-navy">
                    No products found
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    We couldn&apos;t find anything matching your filters. Try
                    adjusting your criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-6 rounded-full border-rose-border px-6 hover:border-rose-primary hover:bg-rose-light hover:text-rose-primary"
                  >
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <QuickViewModal
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={quickViewProduct}
      />
    </>
  )
}
