"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Plus, Pencil, Search } from "lucide-react"

function formatDate(date: string | null) {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .order("updated_at", { ascending: false })
      setPosts(data ?? [])
      setLoading(false)
    }
    void load()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return posts
    const q = search.toLowerCase()
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q),
    )
  }, [posts, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
        <Button render={<Link href="/admin/blog/new" />}>
          <Plus className="size-4" />
          New post
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-slate-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <FileText className="mb-2 size-10" />
              <p className="text-sm">No posts yet</p>
              <Button className="mt-4" render={<Link href="/admin/blog/new" />}>
                Write a post
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Slug</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Updated</th>
                    <th className="px-6 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((post) => (
                    <tr
                      key={post.id}
                      className="text-slate-700 hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {post.slug}
                      </td>
                      <td className="px-6 py-4">
                        {post.published ? (
                          <Badge className="bg-emerald-100 text-emerald-800">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(post.updated_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          render={<Link href={`/admin/blog/${post.id}`} />}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
