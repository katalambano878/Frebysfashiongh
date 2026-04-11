"use client"

import { useEffect, useMemo, useState } from "react"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AnalyticsResponse = {
  metrics: {
    grossRevenue: number
    paidRevenue: number
    orderCount: number
    customers: number
    avgOrderValue: number
    discountTotal: number
    taxTotal: number
  }
  trend: Array<{
    month: string
    revenue: number
    orders: number
    customers: number
  }>
  statusBreakdown: Record<string, number>
  paymentMix: Record<string, number>
  hourlyOrders: Array<{ hour: number; count: number }>
  topProducts: Array<{
    id: string
    name: string
    soldQty: number
    revenue: number
    inventory: number
  }>
  error?: string
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/analytics/summary", { cache: "no-store" })
        const json = await res.json().catch(() => null)
        if (!res.ok) {
          setError(json?.error ?? "Failed to load analytics")
          setData(null)
          return
        }
        setData(json)
      } catch {
        setError("Unable to load analytics data right now")
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const maxRevenue = useMemo(
    () => Math.max(...(data?.trend ?? []).map((row) => row.revenue), 1),
    [data],
  )

  if (loading) return <div className="p-4 text-sm text-slate-500">Loading analytics...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Reporting</h1>
        <p className="text-sm text-slate-500">Live commerce intelligence for revenue, behavior, and operations.</p>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50/60">
          <CardContent className="py-4 text-sm text-red-700">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="py-5"><p className="text-xs text-slate-500">Gross Revenue (12m)</p><p className="mt-1 text-xl font-semibold">{formatPrice(data?.metrics.grossRevenue ?? 0)}</p></CardContent></Card>
        <Card><CardContent className="py-5"><p className="text-xs text-slate-500">Collected Revenue</p><p className="mt-1 text-xl font-semibold">{formatPrice(data?.metrics.paidRevenue ?? 0)}</p></CardContent></Card>
        <Card><CardContent className="py-5"><p className="text-xs text-slate-500">Orders</p><p className="mt-1 text-xl font-semibold">{data?.metrics.orderCount ?? 0}</p></CardContent></Card>
        <Card><CardContent className="py-5"><p className="text-xs text-slate-500">Average Order Value</p><p className="mt-1 text-xl font-semibold">{formatPrice(data?.metrics.avgOrderValue ?? 0)}</p></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.trend ?? []).map((row) => (
              <div key={row.month} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{row.month}</span>
                  <span>{formatPrice(row.revenue)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-rose-500"
                    style={{ width: `${Math.max((row.revenue / maxRevenue) * 100, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {Object.entries(data?.statusBreakdown ?? {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                <span className="capitalize">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {Object.entries(data?.paymentMix ?? {}).map(([provider, value]) => (
              <div key={provider} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="capitalize">{provider.replaceAll("_", " ")}</span>
                <span className="font-semibold">{formatPrice(value)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today Hourly Orders</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 gap-2 text-center text-xs">
            {(data?.hourlyOrders ?? []).map((row) => (
              <div key={row.hour} className="rounded-md border px-2 py-1">
                <p className="text-slate-500">{row.hour.toString().padStart(2, "0")}</p>
                <p className="font-semibold text-slate-800">{row.count}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Product Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-slate-500">
                  <th className="py-2">Product</th>
                  <th className="py-2">Units Sold</th>
                  <th className="py-2">Revenue</th>
                  <th className="py-2">Inventory</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topProducts ?? []).map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="py-2">{row.name}</td>
                    <td className="py-2">{row.soldQty}</td>
                    <td className="py-2">{formatPrice(row.revenue)}</td>
                    <td className="py-2">{row.inventory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
