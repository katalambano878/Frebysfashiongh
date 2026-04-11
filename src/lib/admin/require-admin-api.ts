import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export type AdminApiViewer = {
  id: string
  role: string
  email: string
}

export async function requireAdminApi(permissionKey?: string): Promise<{
  viewer: AdminApiViewer | null
  errorResponse: NextResponse | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      viewer: null,
      errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email")
    .eq("id", user.id)
    .single()

  if (!profile || !["staff", "admin", "superadmin"].includes(profile.role)) {
    return {
      viewer: null,
      errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  if (permissionKey && profile.role !== "superadmin") {
    const { data: permissionRow } = await supabase
      .from("role_permissions")
      .select("permissions")
      .eq("role", profile.role)
      .single()

    const permissions =
      (permissionRow?.permissions as Record<string, boolean> | null) ?? null
    if (permissions && permissions[permissionKey] === false) {
      return {
        viewer: null,
        errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      }
    }
  }

  return {
    viewer: {
      id: profile.id,
      role: profile.role,
      email: (profile.email ?? user.email ?? "").toLowerCase().trim(),
    },
    errorResponse: null,
  }
}
