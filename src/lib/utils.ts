import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Subtotal in GHS at or above which standard shipping is free */
export const FREE_SHIPPING_THRESHOLD_GHS = 2000

/** e.g. "GH₵ 2,000" for banners and policy copy */
export function formatFreeShippingMinimumLabel(): string {
  return `GH₵ ${FREE_SHIPPING_THRESHOLD_GHS.toLocaleString("en-GH")}`
}

export function formatPrice(amount: number, currency: string = "GH₵"): string {
  return `${currency} ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function generateOrderNumber(): string {
  const prefix = "FF"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}
