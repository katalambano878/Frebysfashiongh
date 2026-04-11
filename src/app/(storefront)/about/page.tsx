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
      "Every kids outfit is carefully made with quality Ankara fabric, neat finishing, and comfort in mind.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticity",
    description:
      "We guarantee 100% authentic products. Each item comes with a certificate of authenticity and our personal quality seal.",
  },
  {
    icon: Sparkles,
    title: "Style",
    description:
      "From casual days to luxury events, our designs help children look and feel special.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Frebys Fashion GH is a trusted community for parents who love quality kids fashion.",
  },
]

const trustPoints = [
  {
    icon: Award,
    title: "Unique Designs",
    description: "Every collection is created for standout kids looks.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast, reliable delivery across Ghana and beyond.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Simple support and quick issue resolution.",
  },
  {
    icon: Heart,
    title: "Friendly Support",
    description: "Fast order support on WhatsApp: 0244720197.",
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
              Where Ankara Style Meets
              <br />
              <span className="text-rose-primary">Kids Fashion</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Born from a passion for kids fashion and unique ready-to-wear
              Ankara clothes for all occasions.
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
                    FF
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
                  Frebys Fashion GH was built with one clear mission: to provide
                  unique kids ready-to-wear Ankara outfits for every occasion.
                </p>
                <p>
                  What started as a small fashion idea has grown into a trusted
                  brand for parents looking for casual and luxury kids wear with
                  quality finishing.
                </p>
                <p>
                  Based in Haatso, Accra, Ghana, we proudly serve families in
                  Ghana and around the world through reliable delivery.
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
            Why Choose Frebys Fashion GH
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
              Ready to Dress Your Kids in Style?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Explore unique Ankara pieces for casual days, celebrations, and
              luxury occasions.
            </p>
            <Button
              className="mt-8 rounded-xl bg-rose-primary px-8 py-3 text-white hover:bg-rose-primary/90"
              size="lg"
              render={<Link href="/shop" />}
            >
              Shop Kids Collections
            </Button>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
