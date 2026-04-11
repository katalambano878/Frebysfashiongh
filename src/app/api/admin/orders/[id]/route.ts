import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"
import { sendOrderStatusUpdate } from "@/lib/notifications"

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdminApi("orders_manage")
  if (errorResponse) return errorResponse

  const { id } = await params
  const admin = createAdminClient()

  const [{ data: order, error: orderError }, { data: items }, { data: payments }, { data: shipments }, { data: returns }] =
    await Promise.all([
      admin.from("orders").select("*").eq("id", id).single(),
      admin.from("order_items").select("*").eq("order_id", id).order("id", { ascending: true }),
      admin.from("payments").select("*").eq("order_id", id).order("created_at", { ascending: false }),
      admin.from("shipments").select("*").eq("order_id", id).order("created_at", { ascending: false }),
      admin.from("returns").select("*").eq("order_id", id).order("created_at", { ascending: false }),
    ])

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({
    order,
    items: items ?? [],
    payments: payments ?? [],
    shipments: shipments ?? [],
    returns: returns ?? [],
  })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { viewer, errorResponse } = await requireAdminApi("fulfillment_manage")
  if (errorResponse || !viewer) return errorResponse

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const action = String((body as { action?: string }).action ?? "")
  const admin = createAdminClient()

  if (action === "updateStatus") {
    const status = String((body as { status?: string }).status ?? "").trim()
    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 })
    }

    const { error } = await admin
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: order } = await admin
      .from("orders")
      .select("id, order_number, guest_email, guest_phone, shipping_address, grand_total")
      .eq("id", id)
      .maybeSingle()
    if (order) {
      await sendOrderStatusUpdate(order, status)
    }

    return NextResponse.json({ success: true })
  }

  if (action === "addShipment") {
    const carrier = String((body as { carrier?: string }).carrier ?? "").trim()
    const trackingNumber = String(
      (body as { trackingNumber?: string }).trackingNumber ?? "",
    ).trim()
    const shipmentStatus = String((body as { shipmentStatus?: string }).shipmentStatus ?? "pending")

    const { error } = await admin.from("shipments").insert({
      order_id: id,
      carrier: carrier || null,
      tracking_number: trackingNumber || null,
      status: shipmentStatus,
      shipped_at: shipmentStatus === "shipped" ? new Date().toISOString() : null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "createReturn") {
    const reason = String((body as { reason?: string }).reason ?? "").trim()
    const returnStatus = String((body as { returnStatus?: string }).returnStatus ?? "requested")

    const { error } = await admin.from("returns").insert({
      order_id: id,
      reason: reason || "Return requested by staff",
      status: returnStatus,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "addRefundPayment") {
    const amount = Number((body as { amount?: number }).amount ?? 0)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid refund amount" }, { status: 400 })
    }

    const providerRef = `manual-refund-${Date.now()}`
    const { error } = await admin.from("payments").insert({
      order_id: id,
      provider: "manual_refund",
      provider_ref: providerRef,
      amount: -Math.abs(amount),
      status: "success",
      raw_payload: { by: viewer.email, at: new Date().toISOString() },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 })
}
