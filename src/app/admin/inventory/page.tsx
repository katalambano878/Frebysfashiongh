"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Warehouse, Loader2, Save } from "lucide-react"

type Row = {
  id: string
  productId: string
  productName: string
  sku: string
  price: number
  stock: number
  draftStock: string
}

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("variants")
      .select("id, sku, price, stock_quantity, products(id, name)")
      .order("sku")
    const list: Row[] = (data ?? []).map((v: Record<string, unknown>) => {
      const prod = v.products as { id?: string; name?: string } | null
      const stock = Number(v.stock_quantity ?? 0)
      return {
        id: v.id as string,
        productId: prod?.id ?? "",
        productName: prod?.name ?? "—",
        sku: (v.sku as string) ?? "",
        price: Number(v.price ?? 0),
        stock,
        draftStock: String(stock),
      }
    })
    setRows(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const setDraft = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, draftStock: value } : r)),
    )
  }

  const saveRow = async (row: Row) => {
    const next = Number.parseInt(row.draftStock, 10)
    if (!Number.isFinite(next) || next < 0) return
    setSavingId(row.id)
    const supabase = createClient()
    const prev = row.stock
    const delta = next - prev

    await supabase
      .from("variants")
      .update({
        stock_quantity: next,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id)

    if (delta !== 0) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      await supabase.from("inventory_movements").insert({
        variant_id: row.id,
        quantity_delta: delta,
        reason: "manual_adjustment",
        created_by: user?.id ?? null,
      })
    }

    setSavingId(null)
    void load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
      <p className="text-sm text-slate-500">
        Update stock per SKU. Changes are logged as manual adjustments.
      </p>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-slate-50" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Warehouse className="mb-2 size-10" />
              <p className="text-sm">No variants found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row) => (
                    <tr key={row.id} className="text-slate-700">
                      <td className="px-4 py-3">
                        {row.productId ? (
                          <Link
                            href={`/admin/products/${row.productId}`}
                            className="font-medium text-rose-600 hover:underline"
                          >
                            {row.productName}
                          </Link>
                        ) : (
                          row.productName
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {row.sku}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatPrice(row.price)}
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min={0}
                          className="h-9 w-24"
                          value={row.draftStock}
                          onChange={(e) => setDraft(row.id, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={
                            savingId === row.id ||
                            row.draftStock === String(row.stock)
                          }
                          onClick={() => void saveRow(row)}
                        >
                          {savingId === row.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Save className="size-4" />
                          )}
                          Apply
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
