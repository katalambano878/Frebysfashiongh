import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdminApi("support_manage")
  if (errorResponse) return errorResponse

  const { id } = await params
  const admin = createAdminClient()

  const [{ data: ticket, error }, { data: messages }] = await Promise.all([
    admin
      .from("support_tickets")
      .select("id, ticket_number, customer_email, subject, status, priority, category, created_at, updated_at")
      .eq("id", id)
      .single(),
    admin
      .from("support_messages")
      .select("id, sender_type, body, is_internal, created_at")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true }),
  ])

  if (error || !ticket) {
    if (error?.code === "42P01") {
      return NextResponse.json(
        {
          error:
            "Support CRM tables are missing. Apply latest migration first.",
          setupRequired: true,
        },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
  }

  return NextResponse.json({ ticket, messages: messages ?? [] })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { viewer, errorResponse } = await requireAdminApi("support_manage")
  if (errorResponse) return errorResponse
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const action = String((body as { action?: string }).action ?? "")
  const admin = createAdminClient()

  if (action === "updateStatus") {
    const status = String((body as { status?: string }).status ?? "open")
    const priority = String((body as { priority?: string }).priority ?? "medium")

    const { error } = await admin
      .from("support_tickets")
      .update({
        status,
        priority,
        assigned_to: viewer.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { error: "Support CRM tables are missing. Apply latest migration first." },
          { status: 400 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  if (action === "addMessage") {
    const bodyText = String((body as { body?: string }).body ?? "").trim()
    const isInternal = Boolean((body as { isInternal?: boolean }).isInternal ?? false)
    if (!bodyText) return NextResponse.json({ error: "Message is required" }, { status: 400 })

    const { error } = await admin.from("support_messages").insert({
      ticket_id: id,
      sender_id: viewer.id,
      sender_type: "staff",
      body: bodyText,
      is_internal: isInternal,
    })
    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { error: "Support CRM tables are missing. Apply latest migration first." },
          { status: 400 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await admin.from("support_tickets").update({ updated_at: new Date().toISOString() }).eq("id", id)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 })
}
