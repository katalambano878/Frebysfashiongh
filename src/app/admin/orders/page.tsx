"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

const ORDER_STATUSES: string[] = [
  "all",
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-orange-100 text-orange-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-600",
}

type OrderRow = {
  id: string
  order_number: string
  created_at: string
  guest_email: string | null
  status: string
  grand_total: number
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient()
      try {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
        setOrders(data ?? [])
      } catch {
        // empty state will render
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = useMemo(() => {
    if (activeFilter === "all") return orders
    return orders.filter((o) => o.status === activeFilter)
  }, [orders, activeFilter])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
              activeFilter === status
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
          >
            {status}
            {status !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                {orders.filter((o) => o.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="ml-auto h-5 w-16 animate-pulse rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ShoppingCart className="mb-3 size-12" />
              <p className="text-base font-medium">No orders yet</p>
              <p className="mt-1 text-sm">
                {activeFilter !== "all"
                  ? `No ${activeFilter} orders found`
                  : "Orders will appear here once customers start shopping"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Order #</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-rose-700 hover:text-rose-600 hover:underline"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {order.guest_email ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            "capitalize",
                            statusStyles[order.status] ??
                              "bg-slate-100 text-slate-600",
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {formatPrice(order.grand_total ?? 0)}
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
