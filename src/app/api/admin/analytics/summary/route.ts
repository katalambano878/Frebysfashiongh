import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

function monthKey(dateInput: string) {
  const date = new Date(dateInput)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export async function GET() {
  const { errorResponse } = await requireAdminApi("analytics_view")
  if (errorResponse) return errorResponse

  try {
    const admin = createAdminClient()
    const since = new Date()
    since.setMonth(since.getMonth() - 11)

    const [{ data: orders }, { data: customers }, { data: payments }, { data: variants }] =
      await Promise.all([
        admin
          .from("orders")
          .select("id, created_at, grand_total, status, discount_total, tax_total")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true }),
        admin
          .from("profiles")
          .select("id, created_at")
          .eq("role", "customer")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true }),
        admin
          .from("payments")
          .select("id, provider, status, amount, created_at")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true }),
        admin.from("variants").select("product_id, stock_quantity"),
      ])

    const orderIds = (orders ?? []).map((order) => order.id)
    const { data: orderItems } = orderIds.length
      ? await admin
          .from("order_items")
          .select("order_id, product_id, name_snapshot, quantity, line_total")
          .in("order_id", orderIds)
      : { data: [] as Array<{ order_id: string; product_id: string; name_snapshot: string; quantity: number; line_total: number }> }

    const months = new Map<string, { revenue: number; orders: number; customers: number }>()
    const statusBreakdown: Record<string, number> = {}
    const paymentMix: Record<string, number> = {}
    const hourlyOrders = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }))
    const topProductMap = new Map<string, { id: string; name: string; soldQty: number; revenue: number }>()
    const inventoryByProduct = new Map<string, number>()

    ;(orders ?? []).forEach((row) => {
      const key = monthKey(row.created_at)
      const current = months.get(key) ?? { revenue: 0, orders: 0, customers: 0 }
      current.revenue += Number(row.grand_total ?? 0)
      current.orders += 1
      months.set(key, current)

      statusBreakdown[row.status] = (statusBreakdown[row.status] ?? 0) + 1

      const created = new Date(row.created_at)
      const isToday = created.toDateString() === new Date().toDateString()
      if (isToday) {
        hourlyOrders[created.getHours()].count += 1
      }
    })

    ;(customers ?? []).forEach((row) => {
      const key = monthKey(row.created_at)
      const current = months.get(key) ?? { revenue: 0, orders: 0, customers: 0 }
      current.customers += 1
      months.set(key, current)
    })

    ;(payments ?? []).forEach((payment) => {
      const provider = payment.provider || "unknown"
      paymentMix[provider] = (paymentMix[provider] ?? 0) + Number(payment.amount ?? 0)
    })

    ;(variants ?? []).forEach((variant) => {
      inventoryByProduct.set(
        variant.product_id,
        (inventoryByProduct.get(variant.product_id) ?? 0) +
          Number(variant.stock_quantity ?? 0),
      )
    })

    ;(orderItems ?? []).forEach((item) => {
      const key = `${item.product_id}:${item.name_snapshot}`
      const entry =
        topProductMap.get(key) ??
        {
          id: item.product_id,
          name: item.name_snapshot,
          soldQty: 0,
          revenue: 0,
        }
      entry.soldQty += Number(item.quantity ?? 0)
      entry.revenue += Number(item.line_total ?? 0)
      topProductMap.set(key, entry)
    })

    const trend = Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        month: key,
        ...value,
      }))

    const grossRevenue = (orders ?? []).reduce(
      (sum, order) => sum + Number(order.grand_total ?? 0),
      0,
    )
    const paidRevenue = (orders ?? [])
      .filter((order) =>
        ["paid", "processing", "shipped", "delivered"].includes(order.status),
      )
      .reduce((sum, order) => sum + Number(order.grand_total ?? 0), 0)
    const discountTotal = (orders ?? []).reduce(
      (sum, order) => sum + Number(order.discount_total ?? 0),
      0,
    )
    const taxTotal = (orders ?? []).reduce(
      (sum, order) => sum + Number(order.tax_total ?? 0),
      0,
    )

    return NextResponse.json({
      metrics: {
        grossRevenue,
        paidRevenue,
        orderCount: (orders ?? []).length,
        customers: (customers ?? []).length,
        avgOrderValue:
          (orders ?? []).length > 0 ? grossRevenue / (orders ?? []).length : 0,
        discountTotal,
        taxTotal,
      },
      trend,
      statusBreakdown,
      paymentMix,
      hourlyOrders,
      topProducts: Array.from(topProductMap.values())
        .sort((a, b) => b.soldQty - a.soldQty)
        .slice(0, 10)
        .map((row) => ({
          ...row,
          inventory: inventoryByProduct.get(row.id) ?? 0,
        })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analytics failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
