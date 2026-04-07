"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Grid3X3, LayoutList, Loader2, Plus, Trash2 } from "lucide-react"
import { CATALOG_DEFAULT_CATEGORIES } from "@/lib/catalog-default-categories"

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
}

type Row = {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  sort_order: number
  is_active: boolean
}

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [seedingDefaults, setSeedingDefaults] = useState(false)

  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newSort, setNewSort] = useState("0")
  const autoSeededEmptyDb = useRef(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    let { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })

    if (
      (data ?? []).length === 0 &&
      !autoSeededEmptyDb.current
    ) {
      const { error } = await supabase.from("categories").insert(
        CATALOG_DEFAULT_CATEGORIES.map((c) => ({
          name: c.name,
          slug: c.slug,
          description: c.description,
          sort_order: c.sort_order,
          is_active: true,
        })),
      )
      if (!error) {
        autoSeededEmptyDb.current = true
        const again = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true })
        data = again.data
      }
    }

    setRows(
      (data ?? []).map((r) => ({
        id: r.id,
        name: r.name ?? "",
        slug: r.slug ?? "",
        description: r.description ?? "",
        image_url: r.image_url ?? "",
        sort_order: r.sort_order ?? 0,
        is_active: r.is_active ?? true,
      })),
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updateLocal = (id: string, patch: Partial<Row>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    )
  }

  const saveRow = async (row: Row) => {
    setSavingId(row.id)
    const supabase = createClient()
    await supabase
      .from("categories")
      .update({
        name: row.name.trim(),
        slug: row.slug.trim() || slugify(row.name),
        description: row.description.trim() || null,
        image_url: row.image_url.trim() || null,
        sort_order: row.sort_order,
        is_active: row.is_active,
      })
      .eq("id", row.id)
    setSavingId(null)
    void load()
  }

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this category? Products may lose their category.")) return
    const supabase = createClient()
    await supabase.from("categories").delete().eq("id", id)
    void load()
  }

  const createCategory = async () => {
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    const supabase = createClient()
    const slug = (newSlug.trim() || slugify(name)).toLowerCase()
    const sort = Number.parseInt(newSort, 10)
    await supabase.from("categories").insert({
      name,
      slug,
      image_url: newImageUrl.trim() || null,
      sort_order: Number.isFinite(sort) ? sort : 0,
      is_active: true,
    })
    setNewName("")
    setNewSlug("")
    setNewImageUrl("")
    setNewSort("0")
    setCreating(false)
    void load()
  }

  const addCatalogDefaults = async () => {
    const supabase = createClient()
    setSeedingDefaults(true)
    const { data: existing } = await supabase.from("categories").select("slug")
    const taken = new Set((existing ?? []).map((r) => (r.slug ?? "").toLowerCase()))
    const missing = CATALOG_DEFAULT_CATEGORIES.filter(
      (c) => !taken.has(c.slug.toLowerCase()),
    )
    if (missing.length === 0) {
      setSeedingDefaults(false)
      alert("All catalog categories are already in the list.")
      return
    }
    const { error } = await supabase.from("categories").insert(
      missing.map((c) => ({
        name: c.name,
        slug: c.slug,
        description: c.description,
        sort_order: c.sort_order,
        is_active: true,
      })),
    )
    setSeedingDefaults(false)
    if (error) {
      alert(error.message)
      return
    }
    void load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-2"
          disabled={seedingDefaults}
          onClick={() => void addCatalogDefaults()}
        >
          {seedingDefaults ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LayoutList className="size-4" />
          )}
          Add catalog defaults (14)
        </Button>
      </div>

      <p className="-mt-2 text-sm text-slate-600">
        The 14 catalog categories are added automatically when the list is empty (first
        visit) and when you run Supabase migrations. Use the button below only to fill in
        any slugs you are still missing.
      </p>

      <Card className="rounded-xl border border-sky-100 bg-sky-50/40 shadow-sm">
        <CardContent className="space-y-2 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">How this shows on the storefront</p>
          <ul className="list-inside list-disc space-y-1 text-slate-600">
            <li>
              <strong>Add one by one:</strong> fill Name (and Slug if you want a custom URL
              piece), optional Image URL and Sort, then click <strong>Add</strong>.
            </li>
            <li>
              <strong>Existing rows:</strong> edit fields, then click <strong>Save</strong> on
              that row — changes apply immediately to the live site.
            </li>
            <li>
              <strong>Visible</strong> must be checked — unchecked categories are hidden from
              shoppers (homepage “Shop by Category”, shop filters, and collections).
            </li>
            <li>
              <strong>Products:</strong> open each product in Admin → Products and set its
              category so it appears when customers tap that category or use the shop filter.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-slate-700">Add category</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="min-w-[160px] flex-1 space-y-1">
              <label className="text-xs text-slate-500">Name</label>
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value)
                  if (!newSlug) setNewSlug(slugify(e.target.value))
                }}
                placeholder="e.g. Hair Care"
              />
            </div>
            <div className="min-w-[140px] flex-1 space-y-1">
              <label className="text-xs text-slate-500">Slug</label>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="hair-care"
              />
            </div>
            <div className="min-w-[220px] flex-1 space-y-1">
              <label className="text-xs text-slate-500">Image URL</label>
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="w-24 space-y-1">
              <label className="text-xs text-slate-500">Sort</label>
              <Input
                type="number"
                value={newSort}
                onChange={(e) => setNewSort(e.target.value)}
              />
            </div>
            <Button
              type="button"
              onClick={() => void createCategory()}
              disabled={creating || !newName.trim()}
            >
              {creating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-slate-50" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Grid3X3 className="mb-2 size-10" />
              <p className="text-sm">No categories yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Name & Description</th>
                    <th className="px-4 py-3">Slug & Image URL</th>
                    <th className="px-4 py-3">Sort</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row) => (
                    <tr key={row.id} className="text-slate-700">
                      <td className="px-4 py-2 align-top">
                        <Input
                          value={row.name}
                          onChange={(e) =>
                            updateLocal(row.id, { name: e.target.value })
                          }
                          className="h-9"
                          placeholder="Name"
                        />
                        <Input
                          value={row.description}
                          onChange={(e) =>
                            updateLocal(row.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Description"
                          className="mt-1 h-8 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <Input
                          value={row.slug}
                          onChange={(e) =>
                            updateLocal(row.id, { slug: e.target.value })
                          }
                          className="h-9 font-mono text-xs"
                          placeholder="slug"
                        />
                        <Input
                          value={row.image_url}
                          onChange={(e) =>
                            updateLocal(row.id, { image_url: e.target.value })
                          }
                          placeholder="Image URL"
                          className="mt-1 h-8 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <Input
                          type="number"
                          className="h-9 w-20"
                          value={row.sort_order}
                          onChange={(e) =>
                            updateLocal(row.id, {
                              sort_order: Number.parseInt(e.target.value, 10) || 0,
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <label className="flex cursor-pointer items-center gap-2">
                          <Checkbox
                            checked={row.is_active}
                            onCheckedChange={(v) =>
                              updateLocal(row.id, {
                                is_active: v === true,
                              })
                            }
                          />
                          <span className="text-slate-500">Visible</span>
                        </label>
                      </td>
                      <td className="px-4 py-2 align-top text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => void saveRow(row)}
                            disabled={savingId === row.id}
                          >
                            {savingId === row.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : null}
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void deleteRow(row.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
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
