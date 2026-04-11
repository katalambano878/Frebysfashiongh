"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type OrderPayload = {
  order: {
    order_number: string
    status: string
    subtotal: number
    shipping_total: number
    tax_total: number
    grand_total: number
  }
  items: Array<{
    id: string
    name_snapshot: string
    sku_snapshot: string | null
    quantity: number
    line_total: number
  }>
  payments: Array<{
    id: string
    status: string
    amount: number
  }>
  shipments: Array<{
    id: string
    carrier: string | null
    tracking_number: string | null
    status: string
  }>
  returns: Array<{
    id: string
    reason: string | null
    status: string
  }>
}

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const orderId = params?.id

  const [data, setData] = useState<OrderPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState("pending")
  const [carrier, setCarrier] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [returnReason, setReturnReason] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!orderId) return
    const res = await fetch(`/api/admin/orders/${orderId}`, { cache: "no-store" })
    const payload = await res.json()
    if (!res.ok) {
      setError(payload.error ?? "Failed to load order")
      setLoading(false)
      return
    }
    setData(payload)
    setStatus(payload.order?.status ?? "pending")
    setError(null)
    setLoading(false)
  }, [orderId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const paidTotal = useMemo(
    () =>
      (data?.payments ?? []).reduce(
        (sum, payment) =>
          sum + (payment.status === "success" ? Number(payment.amount ?? 0) : 0),
        0,
      ),
    [data],
  )

  async function runAction(payload: Record<string, unknown>) {
    if (!orderId) return
    setSaving(true)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) {
      setError(json.error ?? "Failed action")
      return
    }
    await load()
  }

  if (loading) return <div className="p-4 text-sm text-slate-500">Loading order...</div>
  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{data.order.order_number}</h1>
          <p className="text-sm text-slate-500">Order fulfillment center</p>
        </div>
        <Badge className="capitalize">{data.order.status}</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-slate-800">{item.name_snapshot}</p>
                  <p className="text-xs text-slate-500">
                    SKU: {item.sku_snapshot || "N/A"} | Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-slate-800">{formatPrice(item.line_total ?? 0)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(data.order.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(data.order.shipping_total ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(data.order.tax_total ?? 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Grand Total</span>
              <span>{formatPrice(data.order.grand_total ?? 0)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Paid</span>
              <span>{formatPrice(paidTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button
              disabled={saving}
              onClick={() => void runAction({ action: "updateStatus", status })}
              className="w-full"
            >
              Save status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Shipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Carrier</Label>
              <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="DHL, FedEx..." />
            </div>
            <div>
              <Label>Tracking number</Label>
              <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="TRK-1234" />
            </div>
            <Button
              disabled={saving}
              onClick={() =>
                void runAction({
                  action: "addShipment",
                  carrier,
                  trackingNumber,
                  shipmentStatus: "shipped",
                })
              }
              className="w-full"
            >
              Save shipment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Returns & Refund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Return reason</Label>
              <Textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Item mismatch, damaged, size issue..."
              />
            </div>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => void runAction({ action: "createReturn", reason: returnReason })}
              className="w-full"
            >
              Create return
            </Button>
            <div>
              <Label>Refund amount</Label>
              <Input
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <Button
              variant="destructive"
              disabled={saving}
              onClick={() => void runAction({ action: "addRefundPayment", amount: Number(refundAmount || 0) })}
              className="w-full"
            >
              Record refund
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
