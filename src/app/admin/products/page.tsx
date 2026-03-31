"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Plus, Search, Pencil, ImageIcon } from "lucide-react"
import { MOCK_PRODUCT_IMAGE } from "@/lib/product-image"

const productStatusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-slate-100 text-slate-600",
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      try {
        const { data } = await supabase
          .from("products")
          .select("*, categories(name), variants(price, compare_at_price, stock_quantity), product_images(url, sort_order)")
          .order("created_at", { ascending: false })
        setProducts(data ?? [])
      } catch {
        // empty state will render
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q),
    )
  }, [products, search])

  const getPrice = (product: any) => {
    const variants = product.variants ?? []
    if (variants.length === 0) return null
    return Math.min(...variants.map((v: any) => v.price ?? 0))
  }

  const getStock = (product: any) => {
    return (product.variants ?? []).reduce(
      (sum: number, v: any) => sum + (v.stock_quantity ?? 0),
      0,
    )
  }

  const getImage = (product: any): string => {
    const imgs = (product.product_images ?? []) as { url: string; sort_order: number }[]
    if (imgs.length === 0) return MOCK_PRODUCT_IMAGE
    const sorted = [...imgs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return sorted[0].url || MOCK_PRODUCT_IMAGE
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Button render={<Link href="/admin/products/new" />}>
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search products…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="size-10 shrink-0 animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="ml-auto h-5 w-16 animate-pulse rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Package className="mb-3 size-12" />
              <p className="text-base font-medium">No products yet</p>
              <p className="mt-1 text-sm">
                {search ? "Try a different search term" : "Add your first product to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((product) => {
                    const price = getPrice(product)
                    const stock = getStock(product)
                    return (
                      <tr
                        key={product.id}
                        className="text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="flex items-center gap-3 hover:text-rose-600"
                          >
                            <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              <img
                                src={getImage(product)}
                                alt=""
                                className="size-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800">
                                {product.name}
                              </p>
                              <p className="truncate text-xs text-slate-400">
                                {product.slug}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {product.categories?.name ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={cn(
                              "capitalize",
                              productStatusStyles[product.status] ??
                                "bg-slate-100 text-slate-600",
                            )}
                          >
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {price != null ? formatPrice(price) : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "font-medium",
                              stock <= 0
                                ? "text-red-600"
                                : stock < 10
                                  ? "text-amber-600"
                                  : "text-slate-700",
                            )}
                          >
                            {stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            render={
                              <Link href={`/admin/products/${product.id}`} />
                            }
                          >
                            <Pencil className="size-4" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
