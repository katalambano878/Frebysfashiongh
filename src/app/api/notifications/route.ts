import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"
import {
  sendCampaign,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendPaymentLink,
  type NotificationOrder,
} from "@/lib/notifications"

type NotificationPayload = {
  type: "order_created" | "order_status" | "payment_link" | "campaign"
  payload: Record<string, unknown>
}

async function fetchOrderByNumber(orderNumber: string): Promise<NotificationOrder | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("orders")
    .select("id, order_number, guest_email, guest_phone, shipping_address, grand_total")
    .eq("order_number", orderNumber)
    .maybeSingle()
  return data ?? null
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as NotificationPayload | null
  if (!body?.type || !body?.payload) {
    return NextResponse.json({ error: "type and payload are required" }, { status: 400 })
  }

  if (body.type === "campaign" || body.type === "order_status" || body.type === "payment_link") {
    const { errorResponse } = await requireAdminApi("marketing_manage")
    if (errorResponse) return errorResponse
  }

  if (body.type === "order_created") {
    const orderNumber = String(body.payload.orderNumber ?? "").trim()
    if (!orderNumber) {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 })
    }
    const order = await fetchOrderByNumber(orderNumber)
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    await sendOrderConfirmation(order)
    return NextResponse.json({ success: true })
  }

  if (body.type === "order_status") {
    const orderNumber = String(body.payload.orderNumber ?? "").trim()
    const status = String(body.payload.status ?? "").trim()
    if (!orderNumber || !status) {
      return NextResponse.json({ error: "orderNumber and status are required" }, { status: 400 })
    }
    const order = await fetchOrderByNumber(orderNumber)
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    await sendOrderStatusUpdate(order, status)
    return NextResponse.json({ success: true })
  }

  if (body.type === "payment_link") {
    const orderNumber = String(body.payload.orderNumber ?? "").trim()
    if (!orderNumber) {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 })
    }
    const order = await fetchOrderByNumber(orderNumber)
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    await sendPaymentLink(order)
    return NextResponse.json({ success: true })
  }

  if (body.type === "campaign") {
    const subject = String(body.payload.subject ?? "").trim()
    const message = String(body.payload.message ?? "").trim()
    const channels = (body.payload.channels ?? {}) as { email?: boolean; sms?: boolean }
    if (!subject || !message) {
      return NextResponse.json({ error: "subject and message are required" }, { status: 400 })
    }
    const result = await sendCampaign({
      subject,
      message,
      channels: {
        email: channels.email !== false,
        sms: channels.sms === true,
      },
    })
    return NextResponse.json({ success: true, ...result })
  }

  return NextResponse.json({ error: "Unsupported notification type" }, { status: 400 })
}
