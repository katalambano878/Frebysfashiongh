"use client"

import { Truck, Shield, MessageCircle, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

const trustItems = [
  { icon: Truck, label: "Free Delivery" },
  { icon: Shield, label: "Secure Checkout" },
  { icon: MessageCircle, label: "WhatsApp Support" },
  { icon: RotateCcw, label: "Easy Returns" },
]

interface TrustBarProps {
  className?: string
}

export function TrustBar({ className }: TrustBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-0 gap-y-4 rounded-2xl border border-rose-border bg-white px-4 py-5 sm:gap-x-0 sm:divide-x sm:divide-rose-border sm:rounded-3xl sm:py-6",
        className
      )}
    >
      {trustItems.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex w-1/2 items-center justify-center gap-2.5 px-4 sm:w-auto sm:flex-1 sm:px-6"
        >
          <Icon className="size-5 shrink-0 text-rose-primary" strokeWidth={1.5} />
          <span className="text-sm font-medium text-navy/80">{label}</span>
        </div>
      ))}
    </div>
  )
}
