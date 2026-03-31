"use client"

import { useState } from "react"
import Link from "next/link"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const shopLinks = [
  { href: "/shop/bags", label: "Bags" },
  { href: "/shop/dresses", label: "Dresses" },
  { href: "/shop/shoes", label: "Shoes" },
  { href: "/shop/perfumes", label: "Perfumes" },
  { href: "/shop/accessories", label: "Accessories" },
  { href: "/shop/gift-items", label: "Gift Items" },
]

const careLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping & Delivery" },
  { href: "/returns", label: "Returns & Exchanges" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/track-order", label: "Track Your Order" },
]

const aboutLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Blog & Style Guide" },
  { href: "/careers", label: "Careers" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
]

const socials = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "TikTok", href: "#" },
]

const payments = ["Visa", "Mastercard", "Amex", "MoMo"]

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
              Be the first to know about new arrivals, exclusive offers, and
              style inspiration.
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
            &copy; 2026 Laura&apos;s Luxury. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {payments.map((name) => (
              <span
                key={name}
                className="inline-flex h-6 items-center rounded bg-white/10 px-2 text-[10px] font-medium text-white/50"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-xs text-white/40 transition-colors hover:text-white"
                aria-label={social.label}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
