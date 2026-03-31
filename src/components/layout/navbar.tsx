"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { SearchOverlay } from "./search-overlay"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartItemCount = useCartStore((s) => s.getItemCount())
  const openCart = useCartStore((s) => s.openCart)
  const wishlistCount = useWishlistStore((s) => s.items.length)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rose-border/50 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="-ml-2 rounded-xl p-2 transition-colors hover:bg-rose-light lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5 text-navy" />
            </button>

            <Link href="/" className="shrink-0">
              <span className="font-heading text-xl font-bold tracking-tight text-navy sm:text-2xl">
                Laura&apos;s{" "}
                <span className="text-rose-primary">Luxury</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-navy/70 transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-rose-primary after:transition-all hover:text-navy hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className="rounded-xl p-2 transition-colors hover:bg-rose-light"
                aria-label="Toggle search"
              >
                <Search className="size-5 text-navy" />
              </button>

              <Link
                href="/wishlist"
                className="relative rounded-xl p-2 transition-colors hover:bg-rose-light"
                aria-label="Wishlist"
              >
                <Heart className="size-5 text-navy" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-primary px-1 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="relative rounded-xl p-2 transition-colors hover:bg-rose-light"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="size-5 text-navy" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-primary px-1 text-[10px] font-semibold text-white">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <Link
                href="/account"
                className="hidden rounded-xl p-2 transition-colors hover:bg-rose-light sm:flex"
                aria-label="Account"
              >
                <User className="size-5 text-navy" />
              </Link>
            </div>
          </div>
        </div>

        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      <Sheet
        open={mobileMenuOpen}
        onOpenChange={(open: boolean) => {
          if (!open) setMobileMenuOpen(false)
        }}
      >
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl text-navy">
              Laura&apos;s{" "}
              <span className="text-rose-primary">Luxury</span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
          </SheetHeader>

          <nav className="mt-4 flex flex-col gap-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-navy transition-colors hover:bg-rose-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-rose-border/30 p-4">
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-navy transition-colors hover:bg-rose-light"
            >
              <User className="size-4" />
              My Account
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
