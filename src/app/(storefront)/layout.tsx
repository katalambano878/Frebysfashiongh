"use client"

import { usePathname } from "next/navigation"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartDrawer } from "@/components/layout/cart-drawer"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideStorefrontChrome = pathname.startsWith("/auth")

  return (
    <>
      {!hideStorefrontChrome && <AnnouncementBar />}
      {!hideStorefrontChrome && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideStorefrontChrome && <Footer />}
      {!hideStorefrontChrome && <CartDrawer />}
    </>
  )
}
