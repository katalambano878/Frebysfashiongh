import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

function makeTicketNumber() {
  const stamp = Date.now().toString().slice(-6)
  return `TKT-${stamp}`
}

export async function GET() {
  const { errorResponse } = await requireAdminApi("support_manage")
  if (errorResponse) return errorResponse

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("support_tickets")
    .select("id, ticket_number, customer_email, subject, status, priority, category, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) {
    if (error.code === "42P01") {
      return NextResponse.json({
        tickets: [],
        setupRequired: true,
        message:
          "Support CRM tables are not created yet. Apply the latest Supabase migration to enable this module.",
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ tickets: data ?? [], setupRequired: false })
}

export async function POST(req: NextRequest) {
  const { viewer, errorResponse } = await requireAdminApi("support_manage")
  if (errorResponse) return errorResponse
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const subject = String((body as { subject?: string }).subject ?? "").trim()
  const customerEmail = String((body as { customerEmail?: string }).customerEmail ?? "").trim()
  const priority = String((body as { priority?: string }).priority ?? "medium")
  const category = String((body as { category?: string }).category ?? "general")
  const message = String((body as { message?: string }).message ?? "").trim()

  if (!subject) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 })
  }

  const admin = createAdminClient()
  const ticketNumber = makeTicketNumber()
  const { data: created, error } = await admin
    .from("support_tickets")
    .insert({
      ticket_number: ticketNumber,
      customer_email: customerEmail || null,
      subject,
      priority,
      category,
      created_by: viewer.id,
      assigned_to: viewer.id,
    })
    .select("id")
    .single()

  if (error || !created) {
    if (error?.code === "42P01") {
      return NextResponse.json(
        { error: "Support CRM tables are missing. Apply latest migration first." },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: error?.message ?? "Failed to create ticket" }, { status: 500 })
  }

  if (message) {
    await admin.from("support_messages").insert({
      ticket_id: created.id,
      sender_id: viewer.id,
      sender_type: "staff",
      body: message,
      is_internal: false,
    })
  }

  return NextResponse.json({ success: true, ticketId: created.id })
}
