"use client"

import { useState } from "react"
import Link from "next/link"
import { Send, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const shopLinks = [
  { href: "/shop?category=girls-ankara-dresses", label: "Girls Ankara Dresses" },
  { href: "/shop?category=boys-ankara-sets", label: "Boys Ankara Sets" },
  { href: "/shop?category=two-piece-sets", label: "Two-Piece Sets" },
  { href: "/shop?category=occasion-wear", label: "Occasion Wear" },
  { href: "/shop?category=casual-wear", label: "Casual Wear" },
  { href: "/shop?category=kids-accessories", label: "Kids Accessories" },
]

const careLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/policies/shipping", label: "Shipping & Delivery" },
  { href: "/policies/returns", label: "Returns & Exchanges" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/track-order", label: "Track Your Order" },
]

const aboutLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Kids Style Journal" },
  { href: "/policies/terms", label: "Terms & Conditions" },
]

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/frebysfashiongh",
    iconSrc: "https://cdn.simpleicons.org/instagram/FFFFFF",
  },
  {
    label: "X",
    href: "https://x.com/frebysfashiongh",
    iconSrc: "https://cdn.simpleicons.org/x/FFFFFF",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/frebysfashiongh",
    iconSrc: "https://cdn.simpleicons.org/facebook/FFFFFF",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@frebysfashiongh",
    iconSrc: "https://cdn.simpleicons.org/tiktok/FFFFFF",
  },
] as const

/** Brand marks via Simple Icons CDN (https://simpleicons.org) — MoMo uses a phone icon (no SI slug). */
const payments = [
  {
    label: "Visa",
    iconSrc: "https://cdn.simpleicons.org/visa/FFFFFF",
  },
  {
    label: "Mastercard",
    iconSrc: "https://cdn.simpleicons.org/mastercard",
  },
  {
    label: "American Express",
    iconSrc: "https://cdn.simpleicons.org/americanexpress/FFFFFF",
  },
] as const

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h3 className="mb-5 font-heading text-lg font-semibold">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Customer Care" links={careLinks} />
          <FooterColumn title="About" links={aboutLinks} />

          <div>
            <h3 className="mb-5 font-heading text-lg font-semibold">
              Stay in Touch
            </h3>
            <p className="mb-4 text-sm text-white/60">
              New kids Ankara arrivals, luxury occasion looks, and updates from
              Frebys Fashion GH.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setEmail("")
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-rose-primary focus-visible:ring-rose-primary/30"
              />
              <Button
                type="submit"
                className="h-9 shrink-0 bg-rose-primary text-white hover:bg-rose-primary/90"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; 2026 Frebys Fashion GH. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
            {payments.map((p) => (
              <span
                key={p.label}
                className="inline-flex h-6 items-center justify-center rounded bg-white/10 px-1.5 py-0.5"
                title={p.label}
              >
                <img
                  src={p.iconSrc}
                  alt=""
                  width={28}
                  height={16}
                  className="h-3.5 w-auto max-w-[2rem] object-contain opacity-90"
                  loading="lazy"
                  decoding="async"
                />
                <span className="sr-only">{p.label}</span>
              </span>
            ))}
            <span
              className="inline-flex h-6 items-center justify-center rounded bg-white/10 px-1.5 py-0.5"
              title="Mobile Money (MoMo)"
            >
              <Smartphone
                className="size-3.5 text-white/90"
                aria-hidden
              />
              <span className="sr-only">Mobile Money (MoMo)</span>
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:justify-end">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="inline-flex size-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label={social.label}
              >
                <img
                  src={social.iconSrc}
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 object-contain opacity-90"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
