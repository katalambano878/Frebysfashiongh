import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateOrderNumber } from "@/lib/utils"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

type PosLine = {
  product_id: string
  variant_id: string
  name: string
  sku?: string | null
  price: number
  quantity: number
}

export async function POST(req: NextRequest) {
  const { viewer, errorResponse } = await requireAdminApi("pos_use")
  if (errorResponse) return errorResponse
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const lines = ((body as { lines?: PosLine[] }).lines ?? []).filter(
    (line) =>
      line &&
      line.product_id &&
      line.variant_id &&
      line.quantity > 0 &&
      line.price >= 0,
  )
  const customerEmail = String((body as { customerEmail?: string }).customerEmail ?? "").trim()
  const discountTotal = Number((body as { discountTotal?: number }).discountTotal ?? 0)
  const taxTotal = Number((body as { taxTotal?: number }).taxTotal ?? 0)
  const payments = ((body as { payments?: Array<{ method: string; amount: number }> }).payments ??
    []) as Array<{ method: string; amount: number }>

  if (!lines.length) {
    return NextResponse.json({ error: "Add at least one item" }, { status: 400 })
  }

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const shippingTotal = 0
  const grandTotal = Math.max(subtotal - Math.max(discountTotal, 0) + Math.max(taxTotal, 0), 0)
  const paidAmount = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0)
  const paymentStatus = paidAmount >= grandTotal ? "success" : "pending"

  const admin = createAdminClient()
  const orderNumber = generateOrderNumber()

  const { data: createdOrder, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: viewer.id,
      guest_email: customerEmail || null,
      status: paymentStatus === "success" ? "paid" : "pending",
      subtotal,
      discount_total: Math.max(discountTotal, 0),
      shipping_total: shippingTotal,
      tax_total: Math.max(taxTotal, 0),
      grand_total: grandTotal,
      notes: "POS order",
    })
    .select("id, order_number")
    .single()

  if (orderError || !createdOrder) {
    return NextResponse.json({ error: orderError?.message ?? "Failed to create order" }, { status: 500 })
  }

  const itemRows = lines.map((line) => ({
    order_id: createdOrder.id,
    product_id: line.product_id,
      variant_id: line.variant_id,
    name_snapshot: line.name,
    sku_snapshot: line.sku || null,
    unit_price: line.price,
    quantity: line.quantity,
    line_total: line.price * line.quantity,
  }))

  const { error: itemsError } = await admin.from("order_items").insert(itemRows)
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  for (const line of lines) {
    const { data: currentVariant } = await admin
      .from("variants")
      .select("stock_quantity")
      .eq("id", line.variant_id)
      .single()

    if (currentVariant) {
      const nextStock = Math.max(Number(currentVariant.stock_quantity ?? 0) - line.quantity, 0)
      await admin
        .from("variants")
        .update({ stock_quantity: nextStock, updated_at: new Date().toISOString() })
        .eq("id", line.variant_id)
    }
  }

  const paymentRows = (payments.length ? payments : [{ method: "mixed", amount: paidAmount }]).map(
    (payment) => ({
      order_id: createdOrder.id,
      provider: `pos_${payment.method}`,
      amount: Number(payment.amount ?? 0),
      status: paymentStatus === "success" ? "success" : "pending",
      raw_payload: { created_by: viewer.email, source: "pos" },
    }),
  )
  if (paymentRows.length) {
    const { error: paymentError } = await admin.from("payments").insert(paymentRows)
    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, orderId: createdOrder.id, orderNumber: createdOrder.order_number })
}
