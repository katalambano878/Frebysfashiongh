import { Suspense } from "react"
import ShopPageClient from "./shop-client"
import {
  fetchActiveProducts,
  fetchStorefrontCategoriesWithCounts,
} from "@/lib/supabase/storefront-products"

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    fetchActiveProducts(),
    fetchStorefrontCategoriesWithCounts(),
  ])

  const maxPay = products.length
    ? Math.max(...products.map((p) => p.salePrice ?? p.price))
    : 1000
  const maxPrice = Math.max(500, Math.ceil(maxPay / 100) * 100)

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopPageClient
        products={products}
        categories={categories}
        maxPrice={maxPrice}
      />
    </Suspense>
  )
}
