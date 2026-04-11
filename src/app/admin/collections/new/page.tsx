"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { uploadImageFile } from "@/lib/admin/upload-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Image as ImageIcon, Loader2, Upload } from "lucide-react"

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
}

export default function NewCollectionPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const submit = async () => {
    const n = name.trim()
    if (!n) return
    setSaving(true)
    const supabase = createClient()
    const s = (slug.trim() || slugify(n)).toLowerCase()
    const sort = Number.parseInt(sortOrder, 10)
    const { data, error } = await supabase
      .from("collections")
      .insert({
        name: n,
        slug: s,
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        collection_type: "manual",
        sort_order: Number.isFinite(sort) ? sort : 0,
        is_active: true,
      })
      .select("id")
      .single()
    setSaving(false)
    if (!error && data?.id) router.push(`/admin/collections/${data.id}`)
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError("")
    const { url, error } = await uploadImageFile(file, "site-media")
    if (error) {
      setUploadError(error)
    } else if (url) {
      setImageUrl(url)
    }
    setUploading(false)
    event.target.value = ""
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
      <h1 className="text-2xl font-bold text-slate-900">New collection</h1>
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!slug) setSlug(slugify(e.target.value))
              }}
            />
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
                    {uploading ? (
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
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => void submit()}
              disabled={saving || !name.trim()}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Create
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
