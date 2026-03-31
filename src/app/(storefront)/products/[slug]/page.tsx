"use client"

import { use, useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronRight,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Package,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import {
  getProductBySlug,
  products,
  categories,
  type Product,
} from "@/lib/mock-data"
import { Container } from "@/components/shared/container"
import { Heading } from "@/components/shared/heading"
import { ProductCard } from "@/components/shared/product-card"
import { QuickViewModal } from "@/components/shared/quick-view-modal"
import { BadgeSet } from "@/components/shared/badge-set"
import { Price } from "@/components/shared/price"
import { useCartStore } from "@/lib/store/cart-store"
import { getProductGalleryImages } from "@/lib/product-image"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const colorGradients: Record<string, string> = {
  Rosé: "from-pink-300 to-rose-400",
  Ivory: "from-amber-50 to-yellow-100",
  Black: "from-gray-800 to-gray-900",
  Noir: "from-gray-800 to-gray-900",
  Midnight: "from-indigo-900 to-slate-900",
  Champagne: "from-amber-100 to-yellow-200",
  Camel: "from-amber-300 to-orange-300",
  Burgundy: "from-red-800 to-red-900",
  Blush: "from-pink-200 to-rose-300",
  Sage: "from-green-300 to-emerald-300",
  Cream: "from-amber-50 to-orange-50",
  Cognac: "from-amber-600 to-orange-700",
  Emerald: "from-emerald-500 to-emerald-600",
  Ruby: "from-red-500 to-red-600",
  Sapphire: "from-blue-600 to-blue-800",
  Tan: "from-amber-200 to-amber-300",
  Charcoal: "from-gray-600 to-gray-700",
  "Dusty Rose": "from-pink-300 to-rose-400",
  Gold: "from-amber-300 to-yellow-400",
  Silver: "from-gray-300 to-gray-400",
  Nude: "from-orange-100 to-amber-200",
  Red: "from-red-500 to-red-600",
  Terracotta: "from-orange-400 to-red-400",
  "Ballet Pink": "from-pink-200 to-pink-300",
  Espresso: "from-amber-900 to-amber-950",
  Oatmeal: "from-amber-100 to-orange-100",
  Rose: "from-rose-300 to-pink-400",
  Garden: "from-green-400 to-emerald-500",
  Ocean: "from-blue-400 to-cyan-500",
  Sunset: "from-orange-400 to-red-400",
}

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const { slug } = use(params)
  const product = getProductBySlug(slug)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  )
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const addItem = useCartStore((s) => s.addItem)

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter(
        (p) => p.categoryId === product.categoryId && p.id !== product.id
      )
      .slice(0, 4)
  }, [product])

  const galleryImages = useMemo(
    () => (product ? getProductGalleryImages(product) : []),
    [product],
  )

  useEffect(() => {
    setSelectedImage(0)
  }, [slug])

  const sizeVariant = useMemo(
    () => product?.variants.find((v) => v.type === "size"),
    [product]
  )
  const colorVariant = useMemo(
    () => product?.variants.find((v) => v.type === "color"),
    [product]
  )

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Container className="flex flex-col items-center justify-center py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-rose-light">
              <Package className="size-10 text-rose-primary/50" />
            </div>
            <h1 className="mt-8 font-heading text-3xl font-semibold text-navy">
              Product Not Found
            </h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              The product you&apos;re looking for doesn&apos;t exist or
              may have been removed. Explore our collection to find
              something you&apos;ll love.
            </p>
            <Link href="/shop" className="mt-8 inline-block">
              <Button className="rounded-full bg-rose-primary px-8 py-2.5 text-white hover:bg-rose-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </Container>
      </div>
    )
  }

  const category = categories.find((c) => c.id === product.categoryId)

  const stockStatus =
    product.stock === 0
      ? {
          label: "Out of Stock",
          textColor: "text-red-600",
          dotColor: "bg-red-500",
        }
      : product.stock <= 5
        ? {
            label: `Low Stock — only ${product.stock} left`,
            textColor: "text-amber-600",
            dotColor: "bg-amber-500",
          }
        : {
            label: "In Stock",
            textColor: "text-emerald-600",
            dotColor: "bg-emerald-500",
          }

  function handleAddToBag() {
    if (!product) return
    addItem(
      product,
      quantity,
      selectedSize || undefined,
      selectedColor || undefined
    )
  }

  function handleBuyNow() {
    if (!product || product.stock === 0) return
    addItem(
      product,
      quantity,
      selectedSize || undefined,
      selectedColor || undefined
    )
    router.push("/checkout")
  }

  function handleQuickView(p: Product) {
    setQuickViewProduct(p)
    setQuickViewOpen(true)
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Container className="py-8 sm:py-12">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-navy"
            >
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href="/shop"
              className="transition-colors hover:text-navy"
            >
              Shop
            </Link>
            {category && (
              <>
                <ChevronRight className="size-3.5" />
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="transition-colors hover:text-navy"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="size-3.5" />
            <span className="truncate font-medium text-navy">
              {product.name}
            </span>
          </nav>

          <motion.div
            className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:gap-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-rose-light">
                <img
                  src={
                    galleryImages[
                      Math.min(
                        selectedImage,
                        Math.max(0, galleryImages.length - 1),
                      )
                    ] ?? galleryImages[0]
                  }
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                {product.badges.length > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <BadgeSet badges={product.badges} />
                  </div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-3">
                  {galleryImages.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "relative aspect-square w-20 overflow-hidden rounded-xl transition-all sm:w-24",
                        selectedImage === i
                          ? "ring-2 ring-navy ring-offset-2"
                          : "opacity-60 hover:opacity-100",
                      )}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <motion.div
              className="flex flex-col lg:sticky lg:top-24 lg:self-start"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {product.badges.length > 0 && (
                <BadgeSet badges={product.badges} className="mb-3" />
              )}

              <h1 className="font-heading text-2xl font-semibold tracking-tight text-navy md:text-3xl">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < Math.round(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating}
                </span>
                <span className="text-sm text-muted-foreground">·</span>
                <button className="text-sm text-navy/70 underline underline-offset-2 transition-colors hover:text-rose-primary">
                  {product.reviewCount} reviews
                </button>
              </div>

              <div className="mt-4">
                <Price
                  amount={product.price}
                  salePrice={product.salePrice}
                  size="lg"
                />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              <div className="mt-6 space-y-5">
                {sizeVariant && (
                  <div>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-navy">
                      {sizeVariant.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sizeVariant.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedSize(opt)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                            selectedSize === opt
                              ? "border-navy bg-navy text-white"
                              : "border-rose-border text-navy hover:border-navy/30"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colorVariant && (
                  <div>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-navy">
                      {colorVariant.name}
                      {selectedColor && (
                        <span className="ml-2 normal-case tracking-normal text-muted-foreground">
                          — {selectedColor}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {colorVariant.options.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "size-9 rounded-full bg-gradient-to-br transition-all",
                            colorGradients[color] ??
                              "from-gray-200 to-gray-300",
                            selectedColor === color
                              ? "ring-2 ring-navy ring-offset-2"
                              : "hover:scale-110"
                          )}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    stockStatus.dotColor
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    stockStatus.textColor
                  )}
                >
                  {stockStatus.label}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-rose-border">
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.max(1, q - 1))
                      }
                      className="flex size-10 items-center justify-center text-navy transition-colors hover:text-rose-primary"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-navy">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(product.stock, q + 1)
                        )
                      }
                      className="flex size-10 items-center justify-center text-navy transition-colors hover:text-rose-primary"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToBag}
                  disabled={product.stock === 0}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full bg-rose-primary py-4 text-sm font-semibold text-white transition-all hover:bg-rose-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag className="size-5" />
                  {product.stock === 0
                    ? "Unavailable"
                    : `Add ${quantity} to Bag • ${formatPrice((product.salePrice ?? product.price) * quantity)}`}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full border border-rose-border py-3.5 text-sm font-medium text-navy transition-all hover:border-rose-primary hover:text-rose-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Secure checkout. Free bag updates. No hidden charges at checkout.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl border border-rose-border/40 bg-rose-light/40 px-3 py-2">
                  <Truck className="size-4 shrink-0 text-navy/65" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/70">Delivery</p>
                    <p className="text-xs text-navy">{product.deliveryEstimate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-rose-border/40 bg-rose-light/40 px-3 py-2">
                  <ShieldCheck className="size-4 shrink-0 text-navy/65" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/70">Authentic</p>
                    <p className="text-xs text-navy">Verified quality</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-rose-border/40 bg-rose-light/40 px-3 py-2">
                  <RotateCcw className="size-4 shrink-0 text-navy/65" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/70">Returns</p>
                    <p className="text-xs text-navy">14-day window</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-rose-border/30 pt-6">
                <Accordion>
                  <AccordionItem>
                    <AccordionTrigger className="font-heading font-semibold text-navy">
                      Description
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionTrigger className="font-heading font-semibold text-navy">
                      Shipping &amp; Returns
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          We offer complimentary standard shipping on
                          all orders over GH₵ 500. Orders are
                          processed within 1–2 business days.
                        </p>
                        <p>
                          Returns are accepted within 14 days of
                          delivery. Items must be unused, in original
                          packaging, and accompanied by a receipt.
                        </p>
                        <p>
                          For more details, visit our Shipping &
                          Returns page or contact our concierge team.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionTrigger className="font-heading font-semibold text-navy">
                      Size Guide
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Our pieces are designed with a true-to-size
                          fit. If you&apos;re between sizes, we
                          recommend sizing up for a more relaxed feel.
                        </p>
                        <p>
                          For detailed measurements and fitting
                          advice, please reach out to our styling
                          team. We&apos;re happy to help you find
                          your perfect fit.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </motion.div>
          </motion.div>
        </Container>

        {relatedProducts.length > 0 && (
          <div className="border-t border-rose-border/20 bg-rose-light/30">
            <Container className="py-16 sm:py-24">
              <Heading as="h2" align="center" subtitle="Pieces we think you'll adore">
                You May Also Like
              </Heading>

              <motion.div
                className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={staggerContainer}
              >
                {relatedProducts.map((p) => (
                  <motion.div key={p.id} variants={staggerItem}>
                    <ProductCard
                      product={p}
                      onQuickView={handleQuickView}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </Container>
          </div>
        )}
      </div>

      <QuickViewModal
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={quickViewProduct}
      />
    </>
  )
}
