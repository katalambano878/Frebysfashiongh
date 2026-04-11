import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import {
  DEFAULT_ROLE_PERMISSIONS,
  isManageableRole,
  MANAGEABLE_ROLES,
  sanitizePermissions,
  type ManageableRole,
} from "@/lib/admin/role-permissions"

type Viewer = {
  id: string
  role: string
  email: string
}

async function getViewer(): Promise<Viewer | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email")
    .eq("id", user.id)
    .single()

  if (!profile) return null

  return {
    id: profile.id,
    role: profile.role,
    email: (profile.email ?? user.email ?? "").toLowerCase().trim(),
  }
}

function requireManager(viewer: Viewer | null) {
  if (!viewer || !["admin", "superadmin"].includes(viewer.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

async function syncAllowlists(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
  role: string,
) {
  const normalizedEmail = email.toLowerCase().trim()
  if (!normalizedEmail) return

  if (role === "superadmin") {
    await admin.from("superadmins").upsert({ email: normalizedEmail }, { onConflict: "email" })
    await admin.from("store_admins").delete().eq("email", normalizedEmail)
  } else if (role === "admin") {
    await admin.from("store_admins").upsert({ email: normalizedEmail }, { onConflict: "email" })
    await admin.from("superadmins").delete().eq("email", normalizedEmail)
  } else {
    await admin.from("superadmins").delete().eq("email", normalizedEmail)
    await admin.from("store_admins").delete().eq("email", normalizedEmail)
  }
}

export async function GET() {
  const viewer = await getViewer()
  const denied = requireManager(viewer)
  if (denied) return denied

  const admin = createAdminClient()
  const { data: staffMembers, error } = await admin
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .in("role", [...MANAGEABLE_ROLES])
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: rolePermissions } = await admin
    .from("role_permissions")
    .select("role, permissions")
    .in("role", [...MANAGEABLE_ROLES])

  return NextResponse.json({
    viewerRole: viewer?.role ?? null,
    staffMembers: staffMembers ?? [],
    rolePermissions: rolePermissions ?? [],
  })
}

export async function POST(req: NextRequest) {
  const viewer = await getViewer()
  const denied = requireManager(viewer)
  if (denied) return denied

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const action = String((body as { action?: string }).action ?? "")
  const admin = createAdminClient()

  if (action === "create") {
    if (viewer?.role !== "superadmin") {
      return NextResponse.json({ error: "Only superadmin can add staff users" }, { status: 403 })
    }

    const email = String((body as { email?: string }).email ?? "").toLowerCase().trim()
    const password = String((body as { password?: string }).password ?? "")
    const fullName = String((body as { fullName?: string }).fullName ?? "").trim()
    const role = String((body as { role?: string }).role ?? "staff")

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Email and password (min 8 chars) are required" },
        { status: 400 },
      )
    }
    if (!isManageableRole(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 })
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : undefined,
    })

    if (createError || !created.user?.id) {
      return NextResponse.json({ error: createError?.message ?? "Failed to create user" }, { status: 400 })
    }

    await syncAllowlists(admin, email, role)

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        role,
        full_name: fullName || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", created.user.id)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  if (action === "updateRole") {
    if (viewer?.role !== "superadmin") {
      return NextResponse.json({ error: "Only superadmin can update roles" }, { status: 403 })
    }

    const userId = String((body as { userId?: string }).userId ?? "").trim()
    const role = String((body as { role?: string }).role ?? "").trim()
    if (!userId || !isManageableRole(role)) {
      return NextResponse.json({ error: "Invalid role update payload" }, { status: 400 })
    }
    if (userId === viewer?.id) {
      return NextResponse.json({ error: "You cannot change your own role here" }, { status: 400 })
    }

    const { data: target, error: targetError } = await admin
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single()

    if (targetError || !target?.email) {
      return NextResponse.json({ error: "Staff user not found" }, { status: 404 })
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    await syncAllowlists(admin, target.email, role)
    return NextResponse.json({ success: true })
  }

  if (action === "demoteToCustomer") {
    if (viewer?.role !== "superadmin") {
      return NextResponse.json({ error: "Only superadmin can remove staff access" }, { status: 403 })
    }

    const userId = String((body as { userId?: string }).userId ?? "").trim()
    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    }
    if (userId === viewer?.id) {
      return NextResponse.json({ error: "You cannot remove your own access here" }, { status: 400 })
    }

    const { data: target, error: targetError } = await admin
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single()

    if (targetError || !target?.email) {
      return NextResponse.json({ error: "Staff user not found" }, { status: 404 })
    }

    const { error: demoteError } = await admin
      .from("profiles")
      .update({ role: "customer", updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (demoteError) {
      return NextResponse.json({ error: demoteError.message }, { status: 500 })
    }

    await syncAllowlists(admin, target.email, "customer")
    return NextResponse.json({ success: true })
  }

  if (action === "resetRolePermissions") {
    if (viewer?.role !== "superadmin") {
      return NextResponse.json({ error: "Only superadmin can reset role permissions" }, { status: 403 })
    }

    const rows = MANAGEABLE_ROLES.map((role) => ({
      role,
      permissions: DEFAULT_ROLE_PERMISSIONS[role],
      updated_at: new Date().toISOString(),
    }))

    const { error } = await admin
      .from("role_permissions")
      .upsert(rows, { onConflict: "role" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  if (action === "updateRolePermissions") {
    if (viewer?.role !== "superadmin") {
      return NextResponse.json({ error: "Only superadmin can update role permissions" }, { status: 403 })
    }

    const payload = (body as { permissionsByRole?: Record<string, unknown> }).permissionsByRole
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Missing permissions payload" }, { status: 400 })
    }

    const rows = MANAGEABLE_ROLES.map((role: ManageableRole) => ({
      role,
      permissions: sanitizePermissions(payload[role], DEFAULT_ROLE_PERMISSIONS[role]),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await admin
      .from("role_permissions")
      .upsert(rows, { onConflict: "role" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 })
}
