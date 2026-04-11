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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Image as ImageIcon, Loader2, Upload } from "lucide-react"

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [body, setBody] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [category, setCategory] = useState("")
  const [readTime, setReadTime] = useState("")
  const [published, setPublished] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const submit = async () => {
    const t = title.trim()
    if (!t) return
    setSaving(true)
    const supabase = createClient()
    const s = (slug.trim() || slugify(t)).toLowerCase()
    const rt = Number.parseInt(readTime, 10)
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: t,
        slug: s,
        excerpt: excerpt.trim() || null,
        body: body.trim() || null,
        cover_image_url: coverUrl.trim() || null,
        category: category.trim() || null,
        read_time_minutes: Number.isFinite(rt) ? rt : null,
        published,
        published_at: published ? now : null,
        updated_at: now,
      })
      .select("id")
      .single()
    setSaving(false)
    if (!error && data?.id) router.push(`/admin/blog/${data.id}`)
  }

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    setUploadError("")
    const { url, error } = await uploadImageFile(file, "blog-covers")
    if (error) {
      setUploadError(error)
    } else if (url) {
      setCoverUrl(url)
    }
    setUploadingCover(false)
    event.target.value = ""
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-slate-600"
        render={<Link href="/admin/blog" />}
      >
        <ArrowLeft className="size-4" />
        Blog
      </Button>
      <h1 className="text-2xl font-bold text-slate-900">New post</h1>
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
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
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Cover image</Label>
              <div className="flex items-center gap-3">
                <div className="flex size-16 items-center justify-center overflow-hidden rounded-lg border bg-white">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover preview" className="size-full object-cover" />
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
                      onChange={(e) => void handleCoverUpload(e)}
                    />
                    <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
                      {uploadingCover ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      Upload cover
                    </span>
                  </label>
                  {coverUrl && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setCoverUrl("")}>
                      Remove image
                    </Button>
                  )}
                </div>
              </div>
              {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat">Category</Label>
              <Input
                id="cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rt">Read time (minutes)</Label>
              <Input
                id="rt"
                type="number"
                min={1}
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
              />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={published}
              onCheckedChange={(v) => setPublished(v === true)}
            />
            <span className="text-sm text-slate-700">Published</span>
          </label>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => void submit()}
              disabled={saving || !title.trim()}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Create
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
