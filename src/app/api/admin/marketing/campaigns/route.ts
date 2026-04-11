import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

export async function GET() {
  const { errorResponse } = await requireAdminApi("marketing_manage")
  if (errorResponse) return errorResponse

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("marketing_campaigns")
    .select("id, name, channel, audience, message, status, scheduled_at, sent_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) {
    if (error.code === "42P01") {
      return NextResponse.json({
        campaigns: [],
        stats: { total: 0, draft: 0, scheduled: 0, sent: 0, dueNow: 0 },
        setupRequired: true,
        message:
          "Marketing tables are not created yet. Apply the latest Supabase migration to enable this module.",
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const now = Date.now()
  const campaigns = data ?? []
  const stats = {
    total: campaigns.length,
    draft: campaigns.filter((row) => row.status === "draft").length,
    scheduled: campaigns.filter((row) => row.status === "scheduled").length,
    sent: campaigns.filter((row) => row.status === "sent").length,
    dueNow: campaigns.filter(
      (row) =>
        row.status === "scheduled" &&
        row.scheduled_at &&
        new Date(row.scheduled_at).getTime() <= now,
    ).length,
  }
  return NextResponse.json({ campaigns, stats, setupRequired: false })
}

export async function POST(req: NextRequest) {
  const { viewer, errorResponse } = await requireAdminApi("marketing_manage")
  if (errorResponse) return errorResponse
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const action = String((body as { action?: string }).action ?? "create")
  const admin = createAdminClient()

  if (action === "create") {
    const name = String((body as { name?: string }).name ?? "").trim()
    const channel = String((body as { channel?: string }).channel ?? "email")
    const audience = String((body as { audience?: string }).audience ?? "all_customers")
    const message = String((body as { message?: string }).message ?? "").trim()
    const status = String((body as { status?: string }).status ?? "draft")
    const scheduledAtRaw = String((body as { scheduledAt?: string }).scheduledAt ?? "").trim()
    const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw).toISOString() : null

    if (!name || !message) {
      return NextResponse.json({ error: "Campaign name and message are required" }, { status: 400 })
    }

    const { error } = await admin.from("marketing_campaigns").insert({
      name,
      channel,
      audience,
      message,
      status,
      scheduled_at: scheduledAt,
      created_by: viewer.id,
    })

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          {
            error:
              "Marketing tables are missing. Apply the latest Supabase migration first.",
          },
          { status: 400 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  if (action === "setStatus") {
    const id = String((body as { id?: string }).id ?? "").trim()
    const status = String((body as { status?: string }).status ?? "draft")
    if (!id) return NextResponse.json({ error: "Campaign id required" }, { status: 400 })

    const payload: Record<string, string | null> = {
      status,
    }
    if (status === "sent") {
      payload.sent_at = new Date().toISOString()
    }

    const { error } = await admin.from("marketing_campaigns").update(payload).eq("id", id)
    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          {
            error:
              "Marketing tables are missing. Apply the latest Supabase migration first.",
          },
          { status: 400 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 })
}
