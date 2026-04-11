import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

export async function GET() {
  const { errorResponse } = await requireAdminApi("pos_use")
  if (errorResponse) return errorResponse

  try {
    const admin = createAdminClient()
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const { data: orders, error } = await admin
      .from("orders")
      .select("id, grand_total, created_at")
      .gte("created_at", start.toISOString())
      .eq("notes", "POS order")
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const totals = (orders ?? []).reduce(
      (acc, row) => {
        acc.revenue += Number(row.grand_total ?? 0)
        return acc
      },
      { revenue: 0 },
    )

    const orderCount = (orders ?? []).length

    return NextResponse.json({
      today: {
        orderCount,
        revenue: totals.revenue,
        avgTicket: orderCount > 0 ? totals.revenue / orderCount : 0,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load POS metrics"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
