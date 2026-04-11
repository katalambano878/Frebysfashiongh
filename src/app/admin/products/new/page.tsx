"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Package,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"

type Category = { id: string; name: string; slug: string }

type VariantRow = {
  key: string
  sku: string
  price: string
  compareAtPrice: string
  stock: string
  options: string
}

const BADGE_OPTIONS = ["New", "Best Seller", "Limited", "Sale"]

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function abbreviateOptionValues(options: string) {
  if (!options.trim()) return "BASE"
  const parts = options
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [, right] = chunk.split(":").map((s) => s.trim())
      const value = (right || chunk).replace(/[^a-z0-9]/gi, "").toUpperCase()
      return value.slice(0, 3)
    })
    .filter(Boolean)
  return parts.length ? parts.join("") : "BASE"
}

function regenerateVariantSkus(productName: string, rows: VariantRow[]) {
  const slug = slugifyName(productName)
  const base = (slug.replace(/-/g, "").toUpperCase() || "PRODUCT").slice(0, 8)
  return rows.map((row, index) => {
    const optionCode = abbreviateOptionValues(row.options)
    return {
      ...row,
      sku: `FF-${base}-${optionCode}-${String(index + 1).padStart(2, "0")}`,
    }
  })
}

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("draft")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isNewArrival, setIsNewArrival] = useState(false)
  const [isBestSeller, setIsBestSeller] = useState(false)
  const [badges, setBadges] = useState<string[]>([])
  const [deliveryEstimate, setDeliveryEstimate] = useState("2-4 business days")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")

  const [variants, setVariants] = useState<VariantRow[]>([
    { key: crypto.randomUUID(), sku: "", price: "", compareAtPrice: "", stock: "0", options: "" },
  ])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("categories")
      .select("id, name, slug")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data)
      })
  }, [])

  useEffect(() => {
    setSlug(slugifyName(name))
    setVariants((prev) => regenerateVariantSkus(name, prev))
  }, [name])

  function toggleBadge(badge: string) {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    )
  }

  function addVariant() {
    setVariants((prev) =>
      regenerateVariantSkus(name, [
        ...prev,
        { key: crypto.randomUUID(), sku: "", price: "", compareAtPrice: "", stock: "0", options: "" },
      ]),
    )
  }

  function removeVariant(key: string) {
    setVariants((prev) => regenerateVariantSkus(name, prev.filter((v) => v.key !== key)))
  }

  function updateVariant(key: string, field: keyof VariantRow, value: string) {
    setVariants((prev) => {
      const next = prev.map((v) => (v.key === key ? { ...v, [field]: value } : v))
      return regenerateVariantSkus(name, next)
    })
  }

  async function handleSave() {
    setError("")

    if (!name.trim()) {
      setError("Product name is required")
      return
    }
    if (variants.some((v) => !v.price.trim())) {
      setError("Each variant needs a price")
      return
    }

    setSaving(true)

    try {
      const supabase = createClient()

      const { data: product, error: prodErr } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          slug: slug.trim(),
          category_id: categoryId || null,
          short_description: shortDescription.trim() || null,
          description: description.trim() || null,
          status,
          is_featured: isFeatured,
          is_new_arrival: isNewArrival,
          is_best_seller: isBestSeller,
          badges,
          delivery_estimate: deliveryEstimate.trim() || null,
          seo_title: seoTitle.trim() || null,
          seo_description: seoDescription.trim() || null,
        })
        .select("id")
        .single()

      if (prodErr) throw prodErr

      const variantRows = variants.map((v) => ({
        product_id: product.id,
        sku: v.sku.trim(),
        price: parseFloat(v.price),
        compare_at_price: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
        stock_quantity: parseInt(v.stock) || 0,
        option_values: v.options.trim()
          ? v.options
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean)
              .map((o) => {
                const [optName, optVal] = o.split(":").map((s) => s.trim())
                return { name: optName || "Option", value: optVal || optName }
              })
          : [],
      }))

      const { error: varErr } = await supabase
        .from("variants")
        .insert(variantRows)

      if (varErr) throw varErr

      router.push("/admin/products")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save product"
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600">
            <ArrowLeft className="size-4" />
            Products
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Add Product</h1>
        <div className="flex gap-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-rose-primary text-white hover:bg-rose-primary/90"
          >
            {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            Save Product
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                  placeholder="e.g. Girls Ankara Occasion Dress"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  readOnly
                  placeholder="girls-ankara-occasion-dress"
                  className="rounded-lg bg-slate-50 font-mono text-sm text-slate-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="short">Short Description</Label>
                <Input
                  id="short"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One-line summary for cards & listings"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Full Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Detailed product description..."
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                Variants & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-500">
                Options format: <code className="rounded bg-slate-100 px-1.5 py-0.5">Size:M, Color:Black</code>
              </p>
              {variants.map((v, i) => (
                <div
                  key={v.key}
                  className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:grid-cols-5"
                >
                  <div className="space-y-1">
                    <Label className="text-xs">SKU *</Label>
                    <Input
                      value={v.sku}
                      readOnly
                      placeholder="Auto-generated"
                      className="rounded-lg bg-slate-50 font-mono text-sm text-slate-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Price (GH₵) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={(e) => updateVariant(v.key, "price", e.target.value)}
                      placeholder="450.00"
                      className="rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Compare Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={v.compareAtPrice}
                      onChange={(e) => updateVariant(v.key, "compareAtPrice", e.target.value)}
                      placeholder="550.00"
                      className="rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Stock</Label>
                    <Input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateVariant(v.key, "stock", e.target.value)}
                      className="rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Options</Label>
                    <div className="flex gap-1.5">
                      <Input
                        value={v.options}
                        onChange={(e) => updateVariant(v.key, "options", e.target.value)}
                        placeholder="Size:M, Color:Black"
                        className="rounded-lg text-sm"
                      />
                      {variants.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(v.key)}
                          className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="gap-1.5"
              >
                <Plus className="size-3.5" />
                Add Variant
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>SEO Title</Label>
                <Input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={name || "Page title for search engines"}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label>SEO Description</Label>
                <Textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  placeholder={shortDescription || "Meta description for search engines"}
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-rose-primary focus:outline-none focus:ring-1 focus:ring-rose-primary"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-rose-primary focus:outline-none focus:ring-1 focus:ring-rose-primary"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((badge) => (
                  <button
                    key={badge}
                    onClick={() => toggleBadge(badge)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      badges.includes(badge)
                        ? "border-rose-primary bg-rose-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={isFeatured}
                  onCheckedChange={(c) => setIsFeatured(c === true)}
                />
                Featured product
              </label>
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={isNewArrival}
                  onCheckedChange={(c) => setIsNewArrival(c === true)}
                />
                New arrival
              </label>
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={isBestSeller}
                  onCheckedChange={(c) => setIsBestSeller(c === true)}
                />
                Best seller
              </label>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={deliveryEstimate}
                onChange={(e) => setDeliveryEstimate(e.target.value)}
                placeholder="2-4 business days"
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
