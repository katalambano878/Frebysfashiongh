"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react"

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-orange-100 text-orange-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-600",
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface StatCard {
  label: string
  value: string
  change: string
  icon: React.ElementType
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [revenue, setRevenue] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      try {
        const [
          revenueRes,
          ordersRes,
          productsRes,
          customersRes,
          recentRes,
          topRes,
        ] = await Promise.all([
          supabase
            .from("orders")
            .select("grand_total")
            .in("status", ["paid", "processing", "shipped", "delivered"]),
          supabase
            .from("orders")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("products")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "customer"),
          supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("products")
            .select("*, categories(name)")
            .order("review_count", { ascending: false })
            .limit(5),
        ])

        const total = revenueRes.data?.reduce(
          (sum, o) => sum + (o.grand_total || 0),
          0,
        ) ?? 0
        setRevenue(total)
        setOrderCount(ordersRes.count ?? 0)
        setProductCount(productsRes.count ?? 0)
        setCustomerCount(customersRes.count ?? 0)
        setRecentOrders(recentRes.data ?? [])
        setTopProducts(topRes.data ?? [])
      } catch {
        // silently handle — empty states will render
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const stats: StatCard[] = [
    {
      label: "Total Revenue",
      value: formatPrice(revenue),
      change: "+12.5%",
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: orderCount.toLocaleString(),
      change: "+8.2%",
      icon: ShoppingCart,
    },
    {
      label: "Total Products",
      value: productCount.toLocaleString(),
      change: "+3.1%",
      icon: Package,
    },
    {
      label: "Total Customers",
      value: customerCount.toLocaleString(),
      change: "+5.4%",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">{today}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-xl border shadow-sm">
                <CardContent className="flex items-center gap-4">
                  <div className="size-12 animate-pulse rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.label} className="rounded-xl border shadow-sm">
                <CardContent className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50">
                    <stat.icon className="size-6 text-rose-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-emerald-600">
                      <TrendingUp className="size-3" />
                      {stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Recent Orders
            </CardTitle>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                    </div>
                    <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ShoppingCart className="mb-2 size-10" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-slate-500">
                      <th className="pb-2 pr-4">Order</th>
                      <th className="pb-2 pr-4">Date</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="text-slate-700">
                        <td className="py-3 pr-4 font-medium">
                          {order.order_number}
                        </td>
                        <td className="py-3 pr-4 text-slate-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge
                            className={cn(
                              "capitalize",
                              statusStyles[order.status] ?? "bg-slate-100 text-slate-600",
                            )}
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-medium">
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

        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Top Products
            </CardTitle>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="size-10 animate-pulse rounded-lg bg-slate-200" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Package className="mb-2 size-10" />
                <p className="text-sm">No products yet</p>
              </div>
            ) : (
              <ul className="divide-y">
                {topProducts.map((product, idx) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.categories?.name ?? "Uncategorized"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      <Star className="size-3.5 fill-amber-400" />
                      {product.review_count ?? 0}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
