"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Container } from "@/components/shared/container"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type HeroSlide = { image_url: string; alt: string }
type HeroData = {
  headline: string
  subheadline: string
  cta_primary: string
  cta_secondary: string
  slides: HeroSlide[]
}

const FALLBACK: HeroData = {
  headline: "Luxury That Fits Your Everyday",
  subheadline: "Bags, shoes, dresses & perfumes — curated for confident women.",
  cta_primary: "Shop New Arrivals",
  cta_secondary: "Explore Collections",
  slides: [
    { image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop", alt: "Luxury fashion and bags" },
    { image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop", alt: "Premium perfumes" },
    { image_url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2000&auto=format&fit=crop", alt: "Elegant dresses" },
  ],
}

export function HeroSection() {
  const [hero, setHero] = useState<HeroData>(FALLBACK)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("storefront_settings")
        .select("hero_content")
        .eq("id", 1)
        .single()
      if (data?.hero_content) {
        const h = data.hero_content as HeroData
        setHero({
          headline: h.headline || FALLBACK.headline,
          subheadline: h.subheadline || FALLBACK.subheadline,
          cta_primary: h.cta_primary || FALLBACK.cta_primary,
          cta_secondary: h.cta_secondary || FALLBACK.cta_secondary,
          slides: (h.slides?.length ?? 0) > 0 ? h.slides : FALLBACK.slides,
        })
      }
    }
    void load()
  }, [])

  const slides = hero.slides

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-navy">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[currentSlide % slides.length]?.image_url})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <Container className="relative z-10 flex h-full items-center justify-center">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/shop?filter=new"
              className="inline-flex items-center rounded-full bg-rose-primary px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-rose-primary/90 hover:shadow-lg hover:shadow-rose-primary/25 active:scale-[0.98]"
            >
              {hero.cta_primary}
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 active:scale-[0.98]"
            >
              {hero.cta_secondary}
            </Link>
          </motion.div>
        </div>
      </Container>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                currentSlide === i ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
