"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden bg-navy text-white"
        >
          <div className="relative flex items-center justify-center px-10 py-2.5">
            <p className="text-center text-xs font-light tracking-wide sm:text-sm">
              Free delivery on orders over GH₵ 500 · Authentic products · Easy
              returns
            </p>
            <button
              onClick={() => setVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/10"
              aria-label="Dismiss announcement"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
