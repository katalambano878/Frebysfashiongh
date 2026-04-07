"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProductBadge } from "@/types/product"

const badgeStyles: Record<ProductBadge, string> = {
  New: "bg-navy text-white hover:bg-navy/90",
  "Best Seller": "bg-rose-primary text-white hover:bg-rose-primary/90",
  Limited: "bg-amber-600 text-white hover:bg-amber-600/90",
  Sale: "bg-red-600 text-white hover:bg-red-600/90",
}

interface BadgeSetProps {
  badges: ProductBadge[]
  className?: string
}

export function BadgeSet({ badges, className }: BadgeSetProps) {
  if (!badges.length) return null

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((badge) => (
        <Badge
          key={badge}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
            badgeStyles[badge]
          )}
        >
          {badge}
        </Badge>
      ))}
    </div>
  )
}
