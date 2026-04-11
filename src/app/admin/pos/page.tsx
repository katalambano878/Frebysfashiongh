"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CatalogRow = {
  variantId: string
  productId: string
  name: string
  price: number
  sku: string
  stock: number
}

type CartRow = CatalogRow & { quantity: number; customPrice: number | null }
type HoldCart = { id: string; label: string; cart: CartRow[]; createdAt: string }
type PosMetrics = { today: { orderCount: number; revenue: number; avgTicket: number } }

export default function PosPage() {
  const [catalog, setCatalog] = useState<CatalogRow[]>([])
  const [query, setQuery] = useState("")
  const [cart, setCart] = useState<CartRow[]>([])
  const [holds, setHolds] = useState<HoldCart[]>([])
  const [holdLabel, setHoldLabel] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [discountMode, setDiscountMode] = useState<"percent" | "fixed">("percent")
  const [discountValue, setDiscountValue] = useState("0")
  const [taxRate, setTaxRate] = useState("0")
  const [cashAmount, setCashAmount] = useState("0")
  const [cardAmount, setCardAmount] = useState("0")
  const [momoAmount, setMomoAmount] = useState("0")
  const [metrics, setMetrics] = useState<PosMetrics | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [catalogRes, metricsRes] = await Promise.all([
        fetch("/api/admin/pos/catalog", { cache: "no-store" }),
        fetch("/api/admin/pos/metrics", { cache: "no-store" }),
      ])
      const catalogJson = await catalogRes.json().catch(() => null)
      const metricsJson = await metricsRes.json().catch(() => null)
      if (!catalogRes.ok) {
        setError(catalogJson?.error ?? "Failed to load POS catalog")
      } else {
        setCatalog(catalogJson.catalog ?? [])
      }
      if (metricsRes.ok) {
        setMetrics(metricsJson)
      }
    } catch {
      setError("Unable to load POS data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ff-pos-holds")
      if (raw) {
        const parsed = JSON.parse(raw) as HoldCart[]
        setHolds(Array.isArray(parsed) ? parsed : [])
      }
    } catch {
      setHolds([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ff-pos-holds", JSON.stringify(holds))
  }, [holds])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return catalog
    return catalog.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        (item.sku ?? "").toLowerCase().includes(normalized),
    )
  }, [catalog, query])

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.customPrice ?? item.price ?? 0) * item.quantity,
        0,
      ),
    [cart],
  )
  const discountAmount = useMemo(() => {
    const parsed = Number(discountValue || 0)
    if (!Number.isFinite(parsed) || parsed <= 0) return 0
    if (discountMode === "percent") {
      return Math.min(subtotal * (parsed / 100), subtotal)
    }
    return Math.min(parsed, subtotal)
  }, [discountValue, discountMode, subtotal])
  const taxableBase = Math.max(subtotal - discountAmount, 0)
  const taxAmount = useMemo(() => {
    const rate = Number(taxRate || 0)
    if (!Number.isFinite(rate) || rate <= 0) return 0
    return taxableBase * (rate / 100)
  }, [taxRate, taxableBase])
  const grandTotal = taxableBase + taxAmount
  const paidTotal = Number(cashAmount || 0) + Number(cardAmount || 0) + Number(momoAmount || 0)
  const balance = Math.max(grandTotal - paidTotal, 0)
  const changeDue = Math.max(paidTotal - grandTotal, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(row: CatalogRow) {
    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === row.variantId)
      if (existing) {
        return prev.map((item) =>
          item.variantId === row.variantId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...row, quantity: 1, customPrice: null }]
    })
  }

  function saveHold() {
    if (!cart.length) return
    const hold: HoldCart = {
      id: crypto.randomUUID(),
      label: holdLabel.trim() || `Hold ${new Date().toLocaleTimeString()}`,
      cart,
      createdAt: new Date().toISOString(),
    }
    setHolds((prev) => [hold, ...prev].slice(0, 20))
    setCart([])
    setHoldLabel("")
  }

  async function checkout() {
    if (!cart.length) return
    setSubmitting(true)
    setMessage(null)
    setError(null)
    const res = await fetch("/api/admin/pos/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail,
        discountTotal: discountAmount,
        taxTotal: taxAmount,
        payments: [
          { method: "cash", amount: Number(cashAmount || 0) },
          { method: "card", amount: Number(cardAmount || 0) },
          { method: "momo", amount: Number(momoAmount || 0) },
        ].filter((item) => item.amount > 0),
        lines: cart.map((line) => ({
          product_id: line.productId,
          variant_id: line.variantId,
          name: line.name,
          sku: line.sku,
          price: Number(line.customPrice ?? line.price),
          quantity: line.quantity,
        })),
      }),
    })
    const json = await res.json().catch(() => ({}))
    setSubmitting(false)
    if (!res.ok) {
      setError(json.error ?? "Checkout failed")
      return
    }
    setMessage(`POS order created: ${json.orderNumber}`)
    setCart([])
    setCustomerEmail("")
    setCashAmount("0")
    setCardAmount("0")
    setMomoAmount("0")
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">POS Orders Today</p><p className="mt-1 text-xl font-semibold">{metrics?.today.orderCount ?? 0}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">POS Revenue Today</p><p className="mt-1 text-xl font-semibold">{formatPrice(metrics?.today.revenue ?? 0)}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">Average Ticket</p><p className="mt-1 text-xl font-semibold">{formatPrice(metrics?.today.avgTicket ?? 0)}</p></CardContent></Card>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50/60">
          <CardContent className="py-3 text-sm text-red-700">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>POS Catalog Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search by product name or SKU" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            {loading ? (
              <p className="text-sm text-slate-500">Loading catalog...</p>
            ) : null}
            {filtered.map((product) => (
              <button
                key={product.variantId}
                type="button"
                onClick={() => addToCart(product)}
                className="rounded-lg border p-3 text-left transition hover:border-rose-300 hover:bg-rose-50"
              >
                <p className="font-medium text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">{product.sku || "No SKU"} • Stock {product.stock}</p>
                <p className="mt-2 text-sm font-semibold text-rose-700">{formatPrice(product.price ?? 0)}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cart, Split Pay & Hold</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[330px] space-y-2 overflow-auto">
            {cart.map((item) => (
              <div key={item.variantId} className="rounded-lg border p-2">
                <p className="text-sm font-medium">{item.name}</p>
                <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                  <span>{formatPrice(item.customPrice ?? item.price ?? 0)} x {item.quantity}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded border px-2"
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((row) =>
                            row.variantId === item.variantId
                              ? { ...row, quantity: Math.max(row.quantity - 1, 1) }
                              : row,
                          ),
                        )
                      }
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="rounded border px-2"
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((row) =>
                            row.variantId === item.variantId
                              ? { ...row, quantity: row.quantity + 1 }
                              : row,
                          ),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-rose-700"
                    onClick={() =>
                      setCart((prev) => prev.filter((row) => row.variantId !== item.variantId))
                    }
                  >
                    Remove
                  </button>
                </div>
                <Input
                  value={item.customPrice == null ? "" : String(item.customPrice)}
                  onChange={(e) =>
                    setCart((prev) =>
                      prev.map((row) =>
                        row.variantId === item.variantId
                          ? {
                              ...row,
                              customPrice:
                                e.target.value.trim() === ""
                                  ? null
                                  : Number(e.target.value),
                            }
                          : row,
                      ),
                    )
                  }
                  type="number"
                  step="0.01"
                  className="mt-2 h-8 text-xs"
                  placeholder={`Custom price (${formatPrice(item.price)})`}
                />
              </div>
            ))}
            {!cart.length && <p className="text-sm text-slate-500">No items in cart.</p>}
          </div>

          <div className="space-y-2">
            <Input
              value={holdLabel}
              onChange={(e) => setHoldLabel(e.target.value)}
              placeholder="Hold label (e.g. Walk-in 1)"
            />
            <Button variant="outline" className="w-full" onClick={saveHold} disabled={!cart.length}>
              Hold Cart
            </Button>
            <Input
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Customer email (optional)"
              type="email"
            />
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label className="text-xs">Discount</Label>
              <div className="mt-1 flex gap-2">
                <select
                  value={discountMode}
                  onChange={(e) => setDiscountMode(e.target.value as "percent" | "fixed")}
                  className="w-24 rounded-lg border px-2 py-2 text-xs"
                >
                  <option value="percent">%</option>
                  <option value="fixed">GHS</option>
                </select>
                <Input value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} type="number" step="0.01" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Tax rate (%)</Label>
              <Input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} type="number" step="0.01" />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div><Label className="text-xs">Cash</Label><Input value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} type="number" step="0.01" /></div>
            <div><Label className="text-xs">Card</Label><Input value={cardAmount} onChange={(e) => setCardAmount(e.target.value)} type="number" step="0.01" /></div>
            <div><Label className="text-xs">MoMo</Label><Input value={momoAmount} onChange={(e) => setMomoAmount(e.target.value)} type="number" step="0.01" /></div>
          </div>

          <div className="space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between"><span>Items</span><span>{itemCount}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(taxAmount)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
            <div className="flex justify-between text-emerald-700"><span>Paid</span><span>{formatPrice(paidTotal)}</span></div>
            <div className="flex justify-between text-amber-700"><span>Balance</span><span>{formatPrice(balance)}</span></div>
            <div className="flex justify-between text-blue-700"><span>Change Due</span><span>{formatPrice(changeDue)}</span></div>
          </div>

          <Button
            className="w-full"
            onClick={() => void checkout()}
            disabled={submitting || !cart.length}
          >
            {submitting ? "Processing..." : "Complete POS Order"}
          </Button>
          {message ? <p className="text-xs text-slate-600">{message}</p> : null}
        </CardContent>
      </Card>

      </div>

      {holds.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Held Carts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {holds.map((hold) => (
              <div key={hold.id} className="rounded-lg border p-3">
                <p className="font-medium text-slate-800">{hold.label}</p>
                <p className="text-xs text-slate-500">
                  {hold.cart.length} items • {new Date(hold.createdAt).toLocaleString()}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCart(hold.cart)
                      setHolds((prev) => prev.filter((row) => row.id !== hold.id))
                    }}
                  >
                    Resume
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setHolds((prev) => prev.filter((row) => row.id !== hold.id))
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
