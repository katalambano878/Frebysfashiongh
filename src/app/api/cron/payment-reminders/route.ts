import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendPaymentLink } from "@/lib/notifications"

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get("authorization")
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const threshold = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, status, guest_email, guest_phone, shipping_address, grand_total")
    .neq("status", "paid")
    .eq("payment_reminder_sent", false)
    .lt("created_at", threshold)
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  for (const order of orders ?? []) {
    await sendPaymentLink(order)
    await supabase
      .from("orders")
      .update({
        payment_reminder_sent: true,
        payment_reminder_sent_at: new Date().toISOString(),
      })
      .eq("id", order.id)
    sent += 1
  }

  return NextResponse.json({ success: true, sent, total: orders?.length ?? 0 })
}
