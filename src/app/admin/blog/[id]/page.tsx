"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react"

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [body, setBody] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [category, setCategory] = useState("")
  const [readTime, setReadTime] = useState("")
  const [published, setPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single()
      if (error || !data) {
        router.replace("/admin/blog")
        return
      }
      setTitle(data.title ?? "")
      setSlug(data.slug ?? "")
      setExcerpt(data.excerpt ?? "")
      setBody(data.body ?? "")
      setCoverUrl(data.cover_image_url ?? "")
      setCategory(data.category ?? "")
      setReadTime(
        data.read_time_minutes != null ? String(data.read_time_minutes) : "",
      )
      setPublished(data.published ?? false)
      setPublishedAt(data.published_at ?? null)
      setLoading(false)
    }
    void load()
  }, [id, router])

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    const rt = Number.parseInt(readTime, 10)
    const now = new Date().toISOString()
    const nextPublishedAt = published
      ? publishedAt ?? now
      : null
    await supabase
      .from("blog_posts")
      .update({
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        excerpt: excerpt.trim() || null,
        body: body.trim() || null,
        cover_image_url: coverUrl.trim() || null,
        category: category.trim() || null,
        read_time_minutes: Number.isFinite(rt) ? rt : null,
        published,
        published_at: nextPublishedAt,
        updated_at: now,
      })
      .eq("id", id)
    if (nextPublishedAt) setPublishedAt(nextPublishedAt)
    setSaving(false)
    router.refresh()
  }

  const remove = async () => {
    if (!confirm("Delete this post permanently?")) return
    const supabase = createClient()
    await supabase.from("blog_posts").delete().eq("id", id)
    router.push("/admin/blog")
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    )
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Edit post</h1>
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => void remove()}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
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
              <Label htmlFor="cover">Cover image URL</Label>
              <Input
                id="cover"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />
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
            <Button type="button" onClick={() => void save()} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
