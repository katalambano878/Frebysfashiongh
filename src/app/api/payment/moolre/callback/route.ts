import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendOrderConfirmation } from "@/lib/notifications"

type MoolreCallback = {
  status?: number | string
  message?: string
  secret?: string
  data?: {
    txtstatus?: number | string
    amount?: string
    externalref?: string
    transactionid?: string
    thirdpartyref?: string
  }
}

function parseBodyStatus(value: unknown) {
  return value === 1 || value === "1"
}

export async function POST(req: NextRequest) {
  try {
    const expectedSecret = process.env.MOOLRE_CALLBACK_SECRET
    const contentType = req.headers.get("content-type") ?? ""
    let body: MoolreCallback = {}

    if (contentType.includes("application/json")) {
      body = (await req.json().catch(() => ({}))) as MoolreCallback
    } else {
      const raw = await req.text()
      body = JSON.parse(raw || "{}") as MoolreCallback
    }

    if (expectedSecret && body.secret && body.secret !== expectedSecret) {
      return NextResponse.json({ success: false, message: "Invalid callback secret" }, { status: 401 })
    }

    const externalRef = body.data?.externalref || ""
    const orderNumber = externalRef.replace(/-R\d+$/, "")
    if (!orderNumber) {
      return NextResponse.json({ success: false, message: "Missing order reference" }, { status: 400 })
    }

    const success =
      parseBodyStatus(body.status) &&
      parseBodyStatus(body.data?.txtstatus) &&
      !String(body.message ?? "").toLowerCase().includes("fail")

    const supabase = createAdminClient()
    const { data: order } = await supabase
      .from("orders")
      .select("id, order_number, status, grand_total, guest_email, guest_phone, shipping_address")
      .eq("order_number", orderNumber)
      .maybeSingle()

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    const moolreReference =
      body.data?.transactionid || body.data?.thirdpartyref || externalRef || "callback"

    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, status")
      .eq("order_id", order.id)
      .eq("provider", "moolre")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (success) {
      if (order.status !== "paid") {
        await supabase
          .from("orders")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", order.id)
      }

      const paidAmount = Number(body.data?.amount ?? order.grand_total ?? 0)
      if (existingPayment) {
        await supabase
          .from("payments")
          .update({
            provider_ref: moolreReference,
            amount: paidAmount,
            status: "paid",
            raw_payload: body,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPayment.id)
      } else {
        await supabase.from("payments").insert({
          order_id: order.id,
          provider: "moolre",
          provider_ref: moolreReference,
          amount: paidAmount,
          currency: "GHS",
          status: "paid",
          raw_payload: body,
        })
      }

      await supabase.from("webhook_logs").insert({
        provider: "moolre",
        event_type: "payment.success.callback",
        payload: body,
      })

      await sendOrderConfirmation(order)
      return NextResponse.json({ success: true, message: "Payment confirmed" })
    }

    if (existingPayment) {
      await supabase
        .from("payments")
        .update({
          provider_ref: moolreReference,
          status: "failed",
          raw_payload: body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPayment.id)
    }

    await supabase.from("webhook_logs").insert({
      provider: "moolre",
      event_type: "payment.failed.callback",
      payload: body,
    })

    return NextResponse.json({ success: false, message: "Payment not successful" })
  } catch (error) {
    console.error("[moolre/callback] error", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "moolre-callback" })
}
