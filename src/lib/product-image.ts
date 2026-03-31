/** Single mock asset used when a product has no images (and for category fallbacks). */
export const MOCK_PRODUCT_IMAGE = "/mock-product.png"

export function getProductGalleryImages(product: {
  images?: string[] | null
}): string[] {
  const list = (product.images ?? [])
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean)
  return list.length > 0 ? list : [MOCK_PRODUCT_IMAGE]
}

export function getProductPrimaryImageUrl(product: {
  images?: string[] | null
}): string {
  return getProductGalleryImages(product)[0]
}
