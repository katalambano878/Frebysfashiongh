import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateOrderNumber } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      phone,
      firstName,
      lastName,
      address1,
      address2,
      city,
      region,
      country,
      postalCode,
      shippingMethod,
      items,
      subtotal,
      shippingCost,
      total,
    } = body

    if (!email || !items?.length || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: "Paystack not configured" }, { status: 500 })
    }

    const supabase = createAdminClient()
    const orderNumber = generateOrderNumber()

    const shippingAddress = {
      firstName,
      lastName,
      address1,
      address2: address2 || "",
      city,
      region,
      country,
      postalCode: postalCode || "",
    }

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        guest_email: email,
        guest_phone: phone || null,
        status: "pending",
        subtotal,
        shipping_total: shippingCost,
        discount_total: 0,
        tax_total: 0,
        grand_total: total,
        currency: "GHS",
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        notes: `Shipping: ${shippingMethod}`,
      })
      .select("id")
      .single()

    if (orderErr || !order) {
      console.error("Order creation failed:", orderErr)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId || null,
      variant_id: item.variantId || null,
      name_snapshot: item.name,
      sku_snapshot: item.sku || "",
      unit_price: item.price,
      quantity: item.quantity,
      line_total: item.price * item.quantity,
    }))

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems)
    if (itemsErr) {
      console.error("Order items insert failed:", itemsErr)
    }

    const amountInPesewas = Math.round(total * 100)
    const callbackUrl = `${process.env.APP_BASE_URL || "http://localhost:3000"}/checkout/callback?reference=${orderNumber}`

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        currency: "GHS",
        reference: orderNumber,
        callback_url: callbackUrl,
        metadata: {
          order_id: order.id,
          order_number: orderNumber,
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: `${firstName} ${lastName}` },
            { display_name: "Phone", variable_name: "phone", value: phone || "N/A" },
          ],
        },
      }),
    })

    const paystackData = await paystackRes.json()

    if (!paystackData.status) {
      console.error("Paystack initialize failed:", paystackData)
      return NextResponse.json({ error: paystackData.message || "Payment init failed" }, { status: 502 })
    }

    await supabase.from("payments").insert({
      order_id: order.id,
      provider: "paystack",
      provider_ref: paystackData.data.reference,
      amount: total,
      currency: "GHS",
      status: "pending",
    })

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      order_id: order.id,
      order_number: orderNumber,
    })
  } catch (err) {
    console.error("Paystack initialize error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
