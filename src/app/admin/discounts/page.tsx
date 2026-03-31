"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Percent, Plus, Pencil, Search } from "lucide-react"

function formatDate(date: string | null) {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AdminDiscountsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false })
      setRows(data ?? [])
      setLoading(false)
    }
    void load()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (r) =>
        r.code?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q),
    )
  }, [rows, search])

  const formatValue = (r: any) => {
    if (r.discount_type === "free_shipping") return "Free shipping"
    if (r.discount_type === "percent")
      return `${Number(r.value ?? 0)}%`
    return formatPrice(Number(r.value ?? 0))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Discounts</h1>
        <Button render={<Link href="/admin/discounts/new" />}>
          <Plus className="size-4" />
          New code
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Search codes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-slate-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Percent className="mb-2 size-10" />
              <p className="text-sm">No discount codes yet</p>
              <Button className="mt-4" render={<Link href="/admin/discounts/new" />}>
                Create code
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3">Uses</th>
                    <th className="px-6 py-3">Active</th>
                    <th className="px-6 py-3">Ends</th>
                    <th className="px-6 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="text-slate-700 hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 font-mono font-medium text-slate-800">
                        {r.code}
                      </td>
                      <td className="px-6 py-4 capitalize">{r.discount_type}</td>
                      <td className="px-6 py-4">{formatValue(r)}</td>
                      <td className="px-6 py-4 tabular-nums">
                        {r.uses_count ?? 0}
                        {r.max_uses != null ? ` / ${r.max_uses}` : ""}
                      </td>
                      <td className="px-6 py-4">
                        {r.is_active ? (
                          <Badge className="bg-emerald-100 text-emerald-800">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(r.ends_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          render={<Link href={`/admin/discounts/${r.id}`} />}
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
