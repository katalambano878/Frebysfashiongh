"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Briefcase, Heart, Sun, Gift } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { occasions } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const occasionStyle: Record<string, { icon: typeof Briefcase; gradient: string }> = {
  work: {
    icon: Briefcase,
    gradient: "from-slate-700 via-slate-600 to-slate-500",
  },
  wedding: {
    icon: Heart,
    gradient: "from-rose-400 via-pink-400 to-fuchsia-300",
  },
  weekend: {
    icon: Sun,
    gradient: "from-amber-400 via-orange-300 to-yellow-300",
  },
  gifting: {
    icon: Gift,
    gradient: "from-violet-500 via-purple-400 to-indigo-400",
  },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function ShopByOccasion() {
  return (
    <Section>
      <Container>
        <Heading
          as="h2"
          subtitle="Find the perfect look for every moment"
          align="center"
        >
          Shop by Occasion
        </Heading>

        <motion.div
          variants={stagger}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {occasions.map((occasion) => {
            const style = occasionStyle[occasion.slug] ?? occasionStyle.work
            const Icon = style.icon

            return (
              <motion.div key={occasion.id} variants={fadeUp}>
                <Link href={`/shop?occasion=${occasion.slug}`} className="group block">
                  <div
                    className={cn(
                      "relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-500",
                      "luxury-shadow hover:luxury-shadow-lg hover:scale-[1.02]",
                      style.gradient,
                    )}
                  >
                    <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/10" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />

                    <div className="relative flex h-full flex-col items-center justify-center p-6 text-center text-white">
                      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                        <Icon className="size-7" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-heading text-xl font-semibold">{occasion.name}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/80">
                        {occasion.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </Section>
  )
}
