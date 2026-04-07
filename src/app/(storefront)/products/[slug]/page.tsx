import { notFound } from "next/navigation"
import {
  fetchStorefrontProductBySlug,
  fetchRelatedProducts,
} from "@/lib/supabase/storefront-products"
import { ProductDetailClient } from "./product-detail-client"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const detail = await fetchStorefrontProductBySlug(slug)
  if (!detail) notFound()

  const related = await fetchRelatedProducts(
    detail.product.categoryId || null,
    detail.product.id,
    4,
  )

  return (
    <ProductDetailClient
      product={detail.product}
      variantRows={detail.variantRows}
      relatedProducts={related}
    />
  )
}
