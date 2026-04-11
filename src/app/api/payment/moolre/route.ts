import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateOrderNumber } from "@/lib/utils"

type CheckoutLine = {
  productId: string
  variantId?: string | null
  name: string
  sku: string
  price: number
  quantity: number
}

export async function POST(req: NextRequest) {
  const user = process.env.MOOLRE_API_USER
  const pubkey = process.env.MOOLRE_API_PUBKEY
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER

  if (!user || !pubkey || !accountNumber) {
    return NextResponse.json({ error: "Moolre is not configured" }, { status: 500 })
  }

  try {
    const body = (await req.json().catch(() => null)) as
      | {
          email?: string
          phone?: string
          firstName?: string
          lastName?: string
          address1?: string
          address2?: string
          city?: string
          region?: string
          country?: string
          postalCode?: string
          shippingMethod?: string
          items?: CheckoutLine[]
          subtotal?: number
          shippingCost?: number
          total?: number
        }
      | null

    const items = body?.items ?? []
    const total = Number(body?.total ?? 0)

    if (!items.length || total <= 0) {
      return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const orderNumber = generateOrderNumber()
    const uniqueRef = `${orderNumber}-R${Date.now()}`
    const trimmedEmail = String(body?.email ?? "").trim()
    const shippingAddress = {
      firstName: body?.firstName ?? "",
      lastName: body?.lastName ?? "",
      address1: body?.address1 ?? "",
      address2: body?.address2 ?? "",
      city: body?.city ?? "",
      region: body?.region ?? "",
      country: body?.country ?? "Ghana",
      postalCode: body?.postalCode ?? "",
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        guest_email: trimmedEmail || null,
        guest_phone: body?.phone || null,
        status: "pending",
        subtotal: Number(body?.subtotal ?? 0),
        shipping_total: Number(body?.shippingCost ?? 0),
        discount_total: 0,
        tax_total: 0,
        grand_total: total,
        currency: "GHS",
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        notes: `Shipping: ${body?.shippingMethod ?? "standard"} | moolre_ref=${uniqueRef}`,
      })
      .select("id, order_number")
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      name_snapshot: item.name,
      sku_snapshot: item.sku,
      unit_price: item.price,
      quantity: item.quantity,
      line_total: item.price * item.quantity,
    }))
    await supabase.from("order_items").insert(orderItems)

    await supabase.from("payments").insert({
      order_id: order.id,
      provider: "moolre",
      provider_ref: uniqueRef,
      amount: total,
      currency: "GHS",
      status: "pending",
      raw_payload: { order_number: orderNumber, init_at: new Date().toISOString() },
    })

    const baseUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_BASE_URL ||
      req.nextUrl.origin
    ).replace(/\/+$/, "")

    const payload = {
      type: 1,
      amount: total.toString(),
      email: process.env.MOOLRE_MERCHANT_EMAIL || trimmedEmail || ADMIN_EMAIL_FALLBACK,
      externalref: uniqueRef,
      callback: `${baseUrl}/api/payment/moolre/callback`,
      redirect: `${baseUrl}/checkout/success?order=${encodeURIComponent(orderNumber)}&payment_success=true`,
      reusable: "0",
      currency: "GHS",
      accountnumber: accountNumber,
      metadata: {
        customer_email: trimmedEmail || null,
        original_order_number: orderNumber,
      },
    }

    const moolreRes = await fetch("https://api.moolre.com/embed/link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-USER": user,
        "X-API-PUBKEY": pubkey,
      },
      body: JSON.stringify(payload),
    })
    const moolreJson = await moolreRes.json().catch(() => null)

    if (!moolreRes.ok || moolreJson?.status !== 1 || !moolreJson?.data?.authorization_url) {
      return NextResponse.json(
        { error: moolreJson?.message || "Moolre link creation failed" },
        { status: 502 },
      )
    }

    return NextResponse.json({
      url: moolreJson.data.authorization_url,
      reference: uniqueRef,
      order_number: orderNumber,
    })
  } catch (error) {
    console.error("[moolre/init] error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const ADMIN_EMAIL_FALLBACK = "info@frebys.com"
