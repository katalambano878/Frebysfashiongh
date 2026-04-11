import { Resend } from "resend"
import { createAdminClient } from "@/lib/supabase/admin"

const resend = new Resend(process.env.RESEND_API_KEY ?? "")

const BRAND_NAME = "Frebys Fashion GH"
const DEFAULT_FROM = process.env.EMAIL_FROM ?? `${BRAND_NAME} <noreply@frebys.com>`
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@frebys.com"
const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_BASE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "")

export function formatPhoneNumber(rawPhone: string) {
  const cleaned = rawPhone.replace(/\D/g, "")
  if (!cleaned) return ""
  if (cleaned.startsWith("233")) return `+${cleaned}`
  if (cleaned.startsWith("0")) return `+233${cleaned.slice(1)}`
  if (cleaned.length === 9) return `+233${cleaned}`
  return `+${cleaned}`
}

export async function sendEmail(args: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) return null
  if (!args.to?.trim()) return null
  try {
    return await resend.emails.send({
      from: DEFAULT_FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
    })
  } catch (error) {
    console.error("[notifications] email failed", error)
    return null
  }
}

export async function sendSMS(args: { to: string; message: string }) {
  const vasKey = process.env.MOOLRE_SMS_API_KEY || process.env.MOOLRE_API_KEY
  if (!vasKey || !args.to?.trim() || !args.message?.trim()) return null

  const recipient = formatPhoneNumber(args.to)
  if (!recipient) return null

  try {
    const res = await fetch("https://api.moolre.com/open/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-VASKEY": vasKey,
      },
      body: JSON.stringify({
        type: 1,
        senderid: process.env.SMS_SENDER_ID || "FrebysGH",
        messages: [{ recipient, message: args.message }],
      }),
    })
    return await res.json().catch(() => null)
  } catch (error) {
    console.error("[notifications] sms failed", error)
    return null
  }
}

function orderHtml(orderNumber: string, title: string, message: string, ctaLabel: string, ctaUrl: string) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f7f7f8;padding:24px;color:#0f172a">
  <div style="max-width:620px;margin:0 auto;background:white;border-radius:14px;padding:28px;border:1px solid #e5e7eb">
    <h2 style="margin:0 0 8px 0">${title}</h2>
    <p style="margin:0 0 14px 0;color:#475569">Order <strong>${orderNumber}</strong></p>
    <p style="line-height:1.7;color:#334155">${message}</p>
    <p style="margin-top:20px">
      <a href="${ctaUrl}" style="display:inline-block;background:#e11d48;color:white;padding:12px 18px;border-radius:9999px;text-decoration:none;font-weight:700">${ctaLabel}</a>
    </p>
    <p style="font-size:12px;color:#64748b;margin-top:18px">${BRAND_NAME}</p>
  </div>
  </body></html>`
}

export type NotificationOrder = {
  id: string
  order_number: string
  guest_email: string | null
  guest_phone: string | null
  shipping_address: Record<string, unknown> | null
  grand_total: number
}

function customerNameFromAddress(address: Record<string, unknown> | null) {
  if (!address) return "Customer"
  const first = String(address.firstName ?? "").trim()
  const last = String(address.lastName ?? "").trim()
  const full = `${first} ${last}`.trim()
  return full || "Customer"
}

export async function sendOrderConfirmation(order: NotificationOrder) {
  const name = customerNameFromAddress(order.shipping_address)
  const trackUrl = `${APP_URL}/track-order`
  const message = `Hi ${name}, your payment was successful and your order has been confirmed. You can track updates from your account.`
  const html = orderHtml(order.order_number, "Order Confirmed", message, "Track Order", trackUrl)

  await Promise.all([
    order.guest_email
      ? sendEmail({
          to: order.guest_email,
          subject: `Order confirmed - ${order.order_number}`,
          html,
        })
      : Promise.resolve(null),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New paid order - ${order.order_number}`,
      html,
    }),
    order.guest_phone
      ? sendSMS({
          to: order.guest_phone,
          message: `Hi ${name}, your order ${order.order_number} is confirmed. Track via ${trackUrl}`,
        })
      : Promise.resolve(null),
  ])
}

export async function sendOrderStatusUpdate(order: NotificationOrder, status: string) {
  const name = customerNameFromAddress(order.shipping_address)
  const trackUrl = `${APP_URL}/track-order`
  const html = orderHtml(
    order.order_number,
    "Order Status Updated",
    `Hi ${name}, your order status is now "${status}".`,
    "Track Order",
    trackUrl,
  )
  await Promise.all([
    order.guest_email
      ? sendEmail({
          to: order.guest_email,
          subject: `Order update - ${order.order_number}`,
          html,
        })
      : Promise.resolve(null),
    order.guest_phone
      ? sendSMS({
          to: order.guest_phone,
          message: `Hi ${name}, order ${order.order_number} status is now ${status}. Track via ${trackUrl}`,
        })
      : Promise.resolve(null),
  ])
}

export async function sendPaymentLink(order: NotificationOrder) {
  const payUrl = `${APP_URL}/checkout/success?order=${encodeURIComponent(order.order_number)}`
  const html = orderHtml(
    order.order_number,
    "Complete Your Payment",
    `Your order is pending payment. Use the link below to complete checkout.`,
    "Pay Now",
    payUrl,
  )

  await Promise.all([
    order.guest_email
      ? sendEmail({
          to: order.guest_email,
          subject: `Complete payment - ${order.order_number}`,
          html,
        })
      : Promise.resolve(null),
    order.guest_phone
      ? sendSMS({
          to: order.guest_phone,
          message: `Payment pending for ${order.order_number}. Complete payment here: ${payUrl}`,
        })
      : Promise.resolve(null),
  ])
}

export async function sendCampaign(args: {
  message: string
  subject: string
  channels: { email: boolean; sms: boolean }
  recipients?: Array<{ email?: string | null; phone?: string | null; fullName?: string | null }>
}) {
  const supabase = createAdminClient()
  const recipients =
    args.recipients && args.recipients.length
      ? args.recipients
      : (
          await supabase
            .from("profiles")
            .select("email, phone, full_name")
            .eq("role", "customer")
            .limit(1000)
        ).data?.map((row) => ({
          email: row.email,
          phone: row.phone,
          fullName: row.full_name,
        })) ?? []

  let emailCount = 0
  let smsCount = 0
  for (const recipient of recipients) {
    if (args.channels.email && recipient.email) {
      const html = orderHtml(
        "Campaign",
        args.subject,
        args.message,
        "Visit Store",
        APP_URL,
      )
      await sendEmail({
        to: recipient.email,
        subject: args.subject,
        html,
      })
      emailCount += 1
    }
    if (args.channels.sms && recipient.phone) {
      await sendSMS({
        to: recipient.phone,
        message: args.message,
      })
      smsCount += 1
    }
  }

  return { emailCount, smsCount, recipientCount: recipients.length }
}
