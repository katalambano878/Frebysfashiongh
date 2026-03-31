"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Layers, Pencil } from "lucide-react"

type CollectionRow = {
  id: string
  name: string
  slug: string
  collection_type: string
  is_active: boolean
  sort_order: number
  productCount: number
}

export default function AdminCollectionsPage() {
  const [rows, setRows] = useState<CollectionRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const supabase = createClient()
    const [colsRes, cpRes] = await Promise.all([
      supabase.from("collections").select("*").order("sort_order"),
      supabase.from("collection_products").select("collection_id"),
    ])
    const counts = new Map<string, number>()
    for (const r of cpRes.data ?? []) {
      const id = r.collection_id as string
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    setRows(
      (colsRes.data ?? []).map((c) => ({
        id: c.id,
        name: c.name ?? "",
        slug: c.slug ?? "",
        collection_type: c.collection_type ?? "manual",
        is_active: c.is_active ?? true,
        sort_order: c.sort_order ?? 0,
        productCount: counts.get(c.id) ?? 0,
      })),
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const toggleActive = async (id: string, is_active: boolean) => {
    const supabase = createClient()
    await supabase.from("collections").update({ is_active }).eq("id", id)
    void load()
  }

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.sort_order - b.sort_order),
    [rows],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Collections</h1>
        <Button render={<Link href="/admin/collections/new" />}>
          New collection
        </Button>
      </div>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-slate-50" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Layers className="mb-2 size-10" />
              <p className="text-sm">No collections yet</p>
              <Button
                className="mt-4"
                render={<Link href="/admin/collections/new" />}
              >
                Create one
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Slug</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Products</th>
                    <th className="px-6 py-3">Active</th>
                    <th className="px-6 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sorted.map((row) => (
                    <tr
                      key={row.id}
                      className="text-slate-700 hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {row.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {row.slug}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="capitalize">
                          {row.collection_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{row.productCount}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            void toggleActive(row.id, !row.is_active)
                          }
                          className={
                            row.is_active
                              ? "text-emerald-600 hover:underline"
                              : "text-slate-400 hover:underline"
                          }
                        >
                          {row.is_active ? "Yes" : "No"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          render={<Link href={`/admin/collections/${row.id}`} />}
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
