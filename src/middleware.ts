import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { createServerClient } from "@supabase/ssr"

function requiredPermissionForPath(pathname: string): string | null {
  if (pathname.startsWith("/admin/team")) return "roles_manage"
  if (pathname.startsWith("/admin/analytics")) return "analytics_view"
  if (pathname.startsWith("/admin/pos")) return "pos_use"
  if (pathname.startsWith("/admin/support")) return "support_manage"
  if (pathname.startsWith("/admin/notifications")) return "marketing_manage"
  if (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/feature-flags")) return "settings_manage"
  if (pathname.startsWith("/admin/orders/")) return "fulfillment_manage"
  if (pathname.startsWith("/admin/orders")) return "orders_manage"
  if (pathname.startsWith("/admin/customers")) return "customers_view"
  if (
    pathname.startsWith("/admin/products") ||
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/collections") ||
    pathname.startsWith("/admin/inventory")
  ) return "catalog_manage"
  if (pathname.startsWith("/admin/blog") || pathname.startsWith("/admin/homepage")) return "content_manage"
  if (pathname.startsWith("/admin/discounts")) return "discounts_manage"
  return null
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  const { pathname } = request.nextUrl
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/superadmin")

  if (isAdminPath) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      loginUrl.searchParams.set("error", "admin_config_missing")
      return NextResponse.redirect(loginUrl)
    }

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const role = profile?.role

    if (pathname.startsWith("/superadmin") && role !== "superadmin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/admin") && !["admin", "superadmin", "staff"].includes(role ?? "")) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/admin") && role !== "superadmin") {
      const requiredPermission = requiredPermissionForPath(pathname)
      if (requiredPermission) {
        const { data: rolePermissionRow } = await supabase
          .from("role_permissions")
          .select("permissions")
          .eq("role", role ?? "")
          .single()

        const permissions =
          (rolePermissionRow?.permissions as Record<string, boolean> | null) ?? null
        if (permissions && permissions[requiredPermission] === false) {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
