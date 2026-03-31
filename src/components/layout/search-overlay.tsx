"use client"

import { useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const popularSearches = [
  "Rosé Quilted Tote",
  "Silk Wrap Dress",
  "Velvet Rose Perfume",
  "Kitten Heels",
  "Pearl Earrings",
  "Gift Sets",
]

type SearchOverlayProps = {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden border-t border-rose-border/30 bg-white"
        >
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-navy/30" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search bags, dresses, perfumes..."
                className="h-12 w-full rounded-2xl border border-rose-border bg-rose-light/30 pl-12 pr-12 font-sans text-base text-navy placeholder:text-navy/30 transition-all focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
              />
              <button
                onClick={onClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-navy/40 transition-colors hover:bg-rose-light hover:text-navy"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="mr-1 self-center text-xs text-navy/40">
                Popular:
              </span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="rounded-full bg-rose-light/50 px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-rose-light"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
