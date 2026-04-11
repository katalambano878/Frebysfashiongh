"use client"

import { useMemo, useState, type ElementType, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChartSpline,
  FileText,
  Grid3X3,
  Headset,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Package,
  Percent,
  ScanLine,
  Settings,
  ShoppingCart,
  ShieldCheck,
  ToggleLeft,
  User,
  Users,
  Warehouse,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAdminUser } from "@/lib/hooks/use-admin-user"
import { cn, truncate as truncateText } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: ElementType
  requiredPermission?: string
}

const MAIN: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: ChartSpline, requiredPermission: "analytics_view" },
  { href: "/admin/pos", label: "POS", icon: ScanLine, requiredPermission: "pos_use" },
  { href: "/admin/products", label: "Products", icon: Package, requiredPermission: "catalog_manage" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, requiredPermission: "orders_manage" },
  { href: "/admin/customers", label: "Customers", icon: Users, requiredPermission: "customers_view" },
]

const CATALOG: NavItem[] = [
  { href: "/admin/categories", label: "Categories", icon: Grid3X3, requiredPermission: "catalog_manage" },
  { href: "/admin/collections", label: "Collections", icon: Layers, requiredPermission: "catalog_manage" },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse, requiredPermission: "catalog_manage" },
]

const CONTENT: NavItem[] = [
  { href: "/admin/blog", label: "Blog", icon: FileText, requiredPermission: "content_manage" },
  { href: "/admin/homepage", label: "Homepage", icon: Home, requiredPermission: "content_manage" },
  { href: "/admin/discounts", label: "Discounts", icon: Percent, requiredPermission: "discounts_manage" },
  { href: "/admin/notifications", label: "Marketing", icon: Megaphone, requiredPermission: "marketing_manage" },
  { href: "/admin/support", label: "Support CRM", icon: Headset, requiredPermission: "support_manage" },
]

const SYSTEM: NavItem[] = [
  { href: "/admin/team", label: "Team & Roles", icon: ShieldCheck, requiredPermission: "roles_manage" },
  { href: "/admin/settings", label: "Settings", icon: Settings, requiredPermission: "settings_manage" },
  { href: "/admin/feature-flags", label: "Feature Flags", icon: ToggleLeft, requiredPermission: "settings_manage" },
]

function navActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavSections({
  pathname,
  role,
  permissions,
  onNavigate,
}: {
  pathname: string
  role: string
  permissions: Record<string, boolean>
  onNavigate?: () => void
}) {
  const renderSection = (title: string, items: NavItem[]) => (
    <div key={title} className="space-y-1">
      <p className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-white/45 uppercase">
        {title}
      </p>
      <nav className="flex flex-col gap-0.5">
        {items.map(({ href, label, icon: Icon, requiredPermission }) => {
          const hasPermission =
            role === "superadmin" ||
            !requiredPermission ||
            permissions[requiredPermission] !== false
          if (!hasPermission) return null
          const active = navActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors",
                "hover:bg-white/10",
                active &&
                  "bg-rose-primary/20 text-rose-soft hover:bg-rose-primary/25"
              )}
            >
              <Icon className="size-4 shrink-0 opacity-90" />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {renderSection("Main", MAIN)}
      {renderSection("Catalog", CATALOG)}
      {renderSection("Content", CONTENT)}
      {renderSection("System", SYSTEM)}
    </div>
  )
}

function SidebarFooter({
  email,
  fullName,
  role,
  onSignOut,
}: {
  email: string
  fullName: string
  role: string
  onSignOut: () => void
}) {
  const initial =
    (fullName?.trim()?.[0] ?? email?.[0] ?? "?").toUpperCase()
  const displayRole = role.replace(/_/g, " ")

  return (
    <div className="mt-auto border-t border-white/10 pt-4">
      <div className="flex items-center gap-3 px-1">
        <Avatar size="sm" className="ring-2 ring-white/20">
          <AvatarFallback className="bg-navy-light text-xs font-semibold text-white">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {truncateText(email || "—", 28)}
          </p>
          <Badge
            variant="secondary"
            className="mt-1 border-0 bg-white/15 text-[10px] font-medium text-white/90 hover:bg-white/20"
          >
            {displayRole}
          </Badge>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        className="mt-3 w-full justify-start gap-2 text-white/90 hover:bg-white/10 hover:text-white"
        onClick={onSignOut}
      >
        <LogOut className="size-4" />
        Sign Out
      </Button>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const { user, profile, permissions, loading, signOut } = useAdminUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const adminUser = useMemo<{
    email: string
    fullName: string
    role: string
  }>(
    () => ({
      email: profile?.email ?? user?.email ?? "",
      fullName: profile?.full_name ?? "",
      role: profile?.role ?? "",
    }),
    [profile, user],
  )

  const breadcrumb = useMemo(() => {
    if (pathname === "/admin") return "Dashboard"
    const seg = pathname.replace(/^\/admin\/?/, "").split("/")[0]
    if (!seg) return "Dashboard"
    return seg
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }, [pathname])

  const closeMobile = () => setMobileOpen(false)

  return (
    <div
      className={cn(
        "min-h-screen bg-white font-sans",
        "[&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans"
      )}
    >
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-[260px] flex-col bg-navy text-white lg:flex">
        <div className="flex h-full flex-col px-4 pb-6 pt-6 shadow-[2px_0_24px_-4px_rgba(0,0,0,0.12)]">
          <div className="mb-8 flex items-center gap-2 px-2">
            <span className="text-lg font-semibold tracking-tight text-white">
              Frebys Fashion GH
            </span>
            <Badge className="border-0 bg-rose-primary/25 text-[10px] font-semibold text-rose-soft">
              Admin
            </Badge>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <NavSections pathname={pathname} role={adminUser.role} permissions={permissions} />
          </div>
          {!loading && (
            <SidebarFooter
              email={adminUser.email}
              fullName={adminUser.fullName}
              role={adminUser.role || "—"}
              onSignOut={signOut}
            />
          )}
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border/60 bg-white/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                    aria-label="Open menu"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[260px] border-r-0 bg-navy p-0 text-white sm:max-w-[260px]"
                showCloseButton
              >
                <SheetHeader className="border-b border-white/10 px-4 py-4 text-left">
                  <SheetTitle className="font-sans text-base font-semibold text-white">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex h-[calc(100%-4.5rem)] flex-col px-4 pb-6 pt-4">
                  <div className="mb-6 flex items-center gap-2 px-0">
                    <span className="text-base font-semibold tracking-tight">
                      Frebys Fashion GH
                    </span>
                    <Badge className="border-0 bg-rose-primary/25 text-[10px] font-semibold text-rose-soft">
                      Admin
                    </Badge>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <NavSections
                      pathname={pathname}
                      role={adminUser.role}
                      permissions={permissions}
                      onNavigate={closeMobile}
                    />
                  </div>
                  {!loading && (
                    <SidebarFooter
                      email={adminUser.email}
                      fullName={adminUser.fullName}
                      role={adminUser.role || "—"}
                      onSignOut={() => {
                        closeMobile()
                        void signOut()
                      }}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium text-foreground/80">
              {breadcrumb}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label="Orders"
              title="Recent orders"
              render={<Link href="/admin/orders" />}
            >
              <Bell className="size-[18px]" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    aria-label="Account menu"
                  />
                }
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-rose-primary/15 text-xs font-semibold text-rose-primary">
                    {(adminUser.fullName?.trim()?.[0] ?? adminUser.email?.[0] ?? "?").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem render={<Link href="/admin/profile" />}>
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/admin/settings" />}>
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => void signOut()}>
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 bg-white p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
