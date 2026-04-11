import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

export async function GET() {
  const { errorResponse } = await requireAdminApi("pos_use")
  if (errorResponse) return errorResponse

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("variants")
      .select("id, product_id, sku, price, stock_quantity, product:products(id, name, status)")
      .order("updated_at", { ascending: false })
      .limit(500)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    type ProductRow = { id: string; name: string; status: string }
    const catalog = (data ?? [])
      .filter((row) => {
        const p = Array.isArray(row.product) ? row.product[0] : row.product
        return p && typeof p === "object" && (p as ProductRow).status === "active"
      })
      .map((row) => {
        const p = (Array.isArray(row.product) ? row.product[0] : row.product) as ProductRow
        return {
          variantId: row.id,
          productId: row.product_id,
          name: p.name,
          sku: row.sku,
          price: Number(row.price ?? 0),
          stock: Number(row.stock_quantity ?? 0),
        }
      })

    return NextResponse.json({ catalog })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load catalog"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
