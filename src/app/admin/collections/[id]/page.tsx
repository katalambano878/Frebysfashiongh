"use client"

import { use, useEffect, useMemo, useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { uploadImageFile } from "@/lib/admin/upload-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Search, Upload } from "lucide-react"

export default function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [isActive, setIsActive] = useState(true)
  const [collectionType, setCollectionType] = useState("manual")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const [catalogProducts, setCatalogProducts] = useState<
    { id: string; name: string }[]
  >([])
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [productSearch, setProductSearch] = useState("")
  const [savingProducts, setSavingProducts] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [colRes, prodRes, linkRes] = await Promise.all([
        supabase.from("collections").select("*").eq("id", id).single(),
        supabase.from("products").select("id, name").order("name"),
        supabase
          .from("collection_products")
          .select("product_id, sort_order")
          .eq("collection_id", id)
          .order("sort_order"),
      ])

      if (colRes.error || !colRes.data) {
        router.replace("/admin/collections")
        return
      }
      const data = colRes.data
      setName(data.name ?? "")
      setSlug(data.slug ?? "")
      setDescription(data.description ?? "")
      setImageUrl(data.image_url ?? "")
      setSortOrder(String(data.sort_order ?? 0))
      setIsActive(data.is_active ?? true)
      setCollectionType(data.collection_type ?? "manual")

      setCatalogProducts(
        (prodRes.data ?? []).map((p) => ({
          id: p.id,
          name: p.name ?? "",
        })),
      )
      setSelectedProductIds(
        new Set(
          (linkRes.data ?? []).map((r) => r.product_id as string),
        ),
      )
      setLoading(false)
    }
    void load()
  }, [id, router])

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    const sort = Number.parseInt(sortOrder, 10)
    await supabase
      .from("collections")
      .update({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        sort_order: Number.isFinite(sort) ? sort : 0,
        is_active: isActive,
      })
      .eq("id", id)
    setSaving(false)
    router.refresh()
  }

  const filteredCatalog = useMemo(() => {
    const q = productSearch.trim().toLowerCase()
    if (!q) return catalogProducts
    return catalogProducts.filter((p) => p.name.toLowerCase().includes(q))
  }, [catalogProducts, productSearch])

  const toggleProduct = (productId: string, on: boolean) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev)
      if (on) next.add(productId)
      else next.delete(productId)
      return next
    })
  }

  const saveProducts = async () => {
    setSavingProducts(true)
    const supabase = createClient()
    await supabase.from("collection_products").delete().eq("collection_id", id)
    const ids = [...selectedProductIds]
    if (ids.length > 0) {
      await supabase.from("collection_products").insert(
        ids.map((product_id, sort_order) => ({
          collection_id: id,
          product_id,
          sort_order,
        })),
      )
    }
    setSavingProducts(false)
    router.refresh()
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    setUploadError("")
    const { url, error } = await uploadImageFile(file, "site-media")
    if (error) {
      setUploadError(error)
    } else if (url) {
      setImageUrl(url)
    }
    setUploadingImage(false)
    event.target.value = ""
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-slate-600"
        render={<Link href="/admin/collections" />}
      >
        <ArrowLeft className="size-4" />
        Collections
      </Button>
      <h1 className="text-2xl font-bold text-slate-900">Edit collection</h1>
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
          <p className="text-sm text-slate-500">
            Type: <span className="capitalize">{collectionType}</span> (change
            in database if needed)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Collection Image</Label>
            <div className="flex items-center gap-3">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-lg border bg-white">
                {imageUrl ? (
                  <img src={imageUrl} alt="Collection preview" className="size-full object-cover" />
                ) : (
                  <ImageIcon className="size-5 text-slate-300" />
                )}
              </div>
              <div className="space-y-2">
                <label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    className="hidden"
                    onChange={(e) => void handleImageUpload(e)}
                  />
                  <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
                    {uploadingImage ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    Upload image
                  </span>
                </label>
                {imageUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setImageUrl("")}>
                    Remove image
                  </Button>
                )}
              </div>
            </div>
            {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sort">Sort order</Label>
            <Input
              id="sort"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={isActive}
              onCheckedChange={(v) => setIsActive(v === true)}
            />
            <span className="text-sm text-slate-700">Active (visible on site)</span>
          </label>
          <div className="flex justify-end pt-2">
            <Button type="button" onClick={() => void save()} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {collectionType === "manual" && (
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Products in this collection</CardTitle>
            <p className="text-sm text-slate-500">
              Manual collections: choose which products appear. Save assignments
              separately from details above.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search products…"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-2">
              {filteredCatalog.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">
                  No products match.
                </p>
              ) : (
                filteredCatalog.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
                  >
                    <Checkbox
                      checked={selectedProductIds.has(p.id)}
                      onCheckedChange={(v) => toggleProduct(p.id, v === true)}
                    />
                    <span className="text-sm text-slate-800">{p.name}</span>
                  </label>
                ))
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => void saveProducts()}
                disabled={savingProducts}
              >
                {savingProducts ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Save product list
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
