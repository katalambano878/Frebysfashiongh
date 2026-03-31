"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Gem,
  ShieldCheck,
  Sparkles,
  Users,
  Heart,
  Truck,
  RefreshCw,
  Award,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const values = [
  {
    icon: Gem,
    title: "Quality",
    description:
      "Every piece in our collection is hand-selected for premium craftsmanship, from the finest Italian leathers to exquisite French lace.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticity",
    description:
      "We guarantee 100% authentic products. Each item comes with a certificate of authenticity and our personal quality seal.",
  },
  {
    icon: Sparkles,
    title: "Elegance",
    description:
      "We believe luxury should feel effortless. Our curation focuses on timeless pieces that elevate your everyday.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Laura's Luxury is more than a store — it's a sisterhood of confident women who celebrate each other through style.",
  },
]

const trustPoints = [
  {
    icon: Award,
    title: "Curated Selection",
    description: "Only the finest pieces make it to our shelves.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast, reliable delivery across Ghana and beyond.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy on all items.",
  },
  {
    icon: Heart,
    title: "Personal Styling",
    description: "Complimentary styling advice via WhatsApp.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-rose-light to-white">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <p className="text-sm font-medium uppercase tracking-widest text-rose-primary">
              Our Story
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Where Luxury Meets
              <br />
              <span className="text-rose-primary">Everyday Elegance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Born from a passion for premium fashion and a desire to make luxury
              accessible to every confident woman in Ghana and beyond.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Brand Story */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-200 via-pink-100 to-amber-50">
                <div className="flex h-full items-center justify-center">
                  <span className="font-heading text-8xl font-semibold text-navy/5 select-none">
                    LL
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="space-y-6"
            >
              <Heading as="h2">The Beginning</Heading>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Laura&apos;s Luxury was born from a simple but powerful
                  observation: women in Ghana deserve access to the same premium
                  fashion and luxury essentials available anywhere in the world —
                  without compromise on quality, authenticity, or experience.
                </p>
                <p>
                  What started as a curated Instagram page sharing style
                  inspiration quickly grew into a trusted destination for
                  designer bags, elegant dresses, premium shoes, and signature
                  perfumes. Every piece is handpicked with one woman in mind —
                  confident, bold, and unapologetically herself.
                </p>
                <p>
                  Today, Laura&apos;s Luxury serves thousands of women across
                  Accra, Kumasi, Takoradi, and beyond. From first purchases to
                  treasured gift sets, we&apos;re honoured to be part of the
                  moments that make women feel extraordinary.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      <Separator className="mx-auto max-w-5xl" />

      {/* Values */}
      <Section>
        <Container>
          <Heading
            as="h2"
            align="center"
            subtitle="The principles that guide every decision we make — from sourcing to delivery."
          >
            What We Stand For
          </Heading>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="group text-center"
              >
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-rose-light transition-colors group-hover:bg-rose-primary/10">
                  <value.icon className="size-7 text-rose-primary" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-navy">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Choose Us */}
      <Section className="bg-gradient-to-b from-rose-light/40 to-white">
        <Container>
          <Heading
            as="h2"
            align="center"
            subtitle="More than just a store — a commitment to excellence."
          >
            Why Choose Laura&apos;s Luxury
          </Heading>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point, i) => (
              <motion.div
                key={point.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="rounded-2xl border border-rose-border/50 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <point.icon className="size-6 text-rose-primary" />
                <h3 className="mt-4 font-heading text-base font-semibold text-navy">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="mx-auto max-w-xl"
          >
            <h2 className="font-heading text-3xl font-semibold text-navy sm:text-4xl">
              Ready to Elevate Your Style?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Discover our curated collections of bags, dresses, shoes,
              perfumes, and more — all chosen with you in mind.
            </p>
            <Button
              className="mt-8 rounded-xl bg-rose-primary px-8 py-3 text-white hover:bg-rose-primary/90"
              size="lg"
              render={<Link href="/shop" />}
            >
              Explore Our Collections
            </Button>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
