"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { cn, formatPrice, FREE_SHIPPING_THRESHOLD_GHS } from "@/lib/utils"
import type { Product } from "@/types/product"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { ProductCard } from "@/components/shared/product-card"
import { useCartStore } from "@/lib/store/cart-store"
import { getProductPrimaryImageUrl } from "@/lib/product-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

function itemKey(productId: string, size?: string, color?: string) {
  return `${productId}-${size || ""}-${color || ""}`
}

export type CartPageClientProps = {
  recommendations: Product[]
}

export default function CartPageClient({
  recommendations,
}: CartPageClientProps) {
  const [mounted, setMounted] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.product.salePrice ?? item.product.price
        return sum + price * item.quantity
      }, 0),
    [items],
  )

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const discount = couponApplied ? subtotal * 0.1 : 0
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_GHS
  const estimatedTotal = subtotal - discount

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "FREBYS10") {
      setCouponApplied(true)
    }
  }

  if (!mounted) {
    return (
      <main className="min-h-[60vh]">
        <Container>
          <div className="py-20" />
        </Container>
      </main>
    )
  }

  return (
    <main>
      <Container>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="py-6"
        >
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-rose-primary"
              >
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3.5" />
            </li>
            <li className="font-medium text-navy">Your Bag</li>
          </ol>
        </motion.nav>

        <div className="mb-10">
          <Heading as="h1">
            Your Bag
            {itemCount > 0 && (
              <span className="ml-3 text-2xl font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </Heading>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="flex size-28 items-center justify-center rounded-full bg-rose-light">
              <ShoppingBag className="size-12 text-rose-primary/40" />
            </div>
            <h3 className="mt-8 font-heading text-2xl font-semibold text-navy">
              Your bag is empty
            </h3>
            <p className="mt-2 text-muted-foreground">
              Discover something you&apos;ll love
            </p>
            <Link href="/" className="mt-8">
              <Button className="h-auto rounded-full px-10 py-3.5 text-base font-semibold">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
            <div>
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const key = itemKey(
                    item.product.id,
                    item.selectedSize,
                    item.selectedColor,
                  )
                  const effectivePrice =
                    item.product.salePrice ?? item.product.price

                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: -80,
                        transition: { duration: 0.25 },
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1] as const,
                      }}
                      className="border-b border-rose-border py-6 first:pt-0"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="shrink-0"
                        >
                          <div className="size-20 overflow-hidden rounded-xl bg-rose-light sm:size-28">
                            <img
                              src={getProductPrimaryImageUrl(item.product)}
                              alt=""
                              className="size-full object-cover"
                            />
                          </div>
                        </Link>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="font-heading text-base font-semibold text-navy transition-colors hover:text-rose-primary"
                              >
                                {item.product.name}
                              </Link>
                              {(item.selectedSize || item.selectedColor) && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {item.selectedSize &&
                                    `Size: ${item.selectedSize}`}
                                  {item.selectedSize &&
                                    item.selectedColor &&
                                    " · "}
                                  {item.selectedColor &&
                                    `Color: ${item.selectedColor}`}
                                </p>
                              )}
                              <p className="mt-1 text-sm font-medium text-navy">
                                {formatPrice(effectivePrice)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor,
                                )
                              }
                              className="hidden shrink-0 text-muted-foreground transition-colors hover:text-rose-primary sm:block"
                              aria-label="Remove item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1,
                                    item.selectedSize,
                                    item.selectedColor,
                                  )
                                }
                                className="flex size-8 items-center justify-center rounded-lg border border-rose-border transition-colors hover:bg-rose-light"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1,
                                    item.selectedSize,
                                    item.selectedColor,
                                  )
                                }
                                className="flex size-8 items-center justify-center rounded-lg border border-rose-border transition-colors hover:bg-rose-light"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-sm font-semibold text-navy">
                                {formatPrice(effectivePrice * item.quantity)}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor,
                                  )
                                }
                                className="text-muted-foreground transition-colors hover:text-rose-primary sm:hidden"
                                aria-label="Remove item"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="sticky top-6"
              >
                <Card className="luxury-shadow overflow-visible border-rose-border">
                  <CardContent className="space-y-5 p-6">
                    <h3 className="font-heading text-lg font-semibold text-navy">
                      Order Summary
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium text-navy">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span
                          className={cn(
                            "font-medium",
                            freeShipping
                              ? "text-emerald-600"
                              : "text-muted-foreground",
                          )}
                        >
                          {freeShipping ? "Free" : "Calculated at checkout"}
                        </span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600">
                            Discount (FREBYS10)
                          </span>
                          <span className="font-medium text-emerald-600">
                            -{formatPrice(discount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {!couponApplied && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyCoupon()
                          }
                          className="h-9"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          className="shrink-0"
                        >
                          Apply
                        </Button>
                      </div>
                    )}

                    <Separator className="bg-rose-border" />

                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-navy">
                        Estimated Total
                      </span>
                      <span className="text-lg font-bold text-navy">
                        {formatPrice(estimatedTotal)}
                      </span>
                    </div>

                    <Link href="/checkout" className="block">
                      <Button className="h-auto w-full rounded-full py-4 text-base font-semibold">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="size-4" />
                      <span>Secure checkout guaranteed</span>
                    </div>

                    <Separator className="bg-rose-border" />

                    <p className="text-center text-xs tracking-wide text-muted-foreground">
                      Mobile Money &middot; Card Payment
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </Container>

      {recommendations.length > 0 && (
        <Section className="bg-rose-light/50">
          <Container>
            <Heading
              as="h2"
              align="center"
              subtitle="Curated picks our customers love"
            >
              You May Also Like
            </Heading>
            <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </main>
  )
}
