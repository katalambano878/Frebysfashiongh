import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendOrderConfirmation } from "@/lib/notifications"

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference")
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 })
  }

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    const data = await res.json()

    if (!data.status) {
      return NextResponse.json({ error: data.message || "Verification failed" }, { status: 502 })
    }

    const tx = data.data
    const supabase = createAdminClient()

    if (tx.status === "success") {
      await supabase
        .from("payments")
        .update({
          status: "paid",
          raw_payload: tx,
          updated_at: new Date().toISOString(),
        })
        .eq("provider_ref", reference)

      await supabase
        .from("orders")
        .update({
          status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("order_number", reference)

      const { data: order } = await supabase
        .from("orders")
        .select("id, order_number, guest_email, guest_phone, shipping_address, grand_total")
        .eq("order_number", reference)
        .maybeSingle()
      if (order) {
        await sendOrderConfirmation(order)
      }

      return NextResponse.json({
        verified: true,
        status: "success",
        order_number: reference,
        amount: tx.amount / 100,
        currency: tx.currency,
      })
    }

    await supabase
      .from("payments")
      .update({
        status: "failed",
        raw_payload: tx,
        updated_at: new Date().toISOString(),
      })
      .eq("provider_ref", reference)

    return NextResponse.json({
      verified: false,
      status: tx.status,
      order_number: reference,
    })
  } catch (err) {
    console.error("Paystack verify error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
