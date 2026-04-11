import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendOrderConfirmation } from "@/lib/notifications"

type VerifyBody = {
  orderNumber?: string
}

export async function POST(req: NextRequest) {
  const apiUser = process.env.MOOLRE_API_USER
  const pubkey = process.env.MOOLRE_API_PUBKEY
  if (!apiUser || !pubkey) {
    return NextResponse.json({ success: false, message: "Moolre not configured" }, { status: 500 })
  }

  const body = (await req.json().catch(() => null)) as VerifyBody | null
  const orderNumber = String(body?.orderNumber ?? "").trim()
  if (!orderNumber) {
    return NextResponse.json({ success: false, message: "orderNumber is required" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, status, grand_total, guest_email, guest_phone, shipping_address")
    .eq("order_number", orderNumber)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
  }

  if (order.status === "paid") {
    return NextResponse.json({ success: true, status: "paid", message: "Order already paid" })
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("id, provider_ref")
    .eq("order_id", order.id)
    .eq("provider", "moolre")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const refs = [payment?.provider_ref, orderNumber].filter(Boolean) as string[]
  let verified = false
  let payload: Record<string, unknown> | null = null
  let reference = payment?.provider_ref ?? orderNumber

  for (const ref of refs) {
    const res = await fetch("https://api.moolre.com/embed/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-USER": apiUser,
        "X-API-PUBKEY": pubkey,
      },
      body: JSON.stringify({ externalref: ref }),
    })
    const json = (await res.json().catch(() => null)) as
      | {
          status?: number | string
          message?: string
          data?: { txtstatus?: number | string; transactionid?: string; thirdpartyref?: string; amount?: string }
        }
      | null

    if (!json) continue
    payload = json as unknown as Record<string, unknown>
    const apiOk = json.status === 1 || json.status === "1"
    const txOk = json.data?.txtstatus === 1 || json.data?.txtstatus === "1"
    const msg = String(json.message ?? "").toLowerCase()
    if (apiOk && txOk && !msg.includes("fail")) {
      verified = true
      reference = json.data?.transactionid || json.data?.thirdpartyref || ref
      break
    }
  }

  if (!verified) {
    return NextResponse.json({ success: false, status: "pending", message: "Payment not yet confirmed" })
  }

  await supabase
    .from("orders")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", order.id)

  const amount = Number(
    ((payload?.data as { amount?: string } | undefined)?.amount as string | undefined) ??
      order.grand_total,
  )
  if (payment) {
    await supabase
      .from("payments")
      .update({
        status: "paid",
        provider_ref: reference,
        amount: amount || order.grand_total,
        raw_payload: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id)
  }

  await sendOrderConfirmation(order)

  return NextResponse.json({ success: true, status: "paid", orderNumber })
}
