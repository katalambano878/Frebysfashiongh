"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Globe,
  Hash,
  ExternalLink,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const contactInfo = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+233 24 123 4567",
    href: "https://wa.me/233241234567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@laurasluxury.com",
    href: "mailto:hello@laurasluxury.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+233 30 212 3456",
    href: "tel:+233302123456",
  },
]

const socials = [
  { icon: Globe, label: "Instagram", href: "#" },
  { icon: Hash, label: "Facebook", href: "#" },
  { icon: ExternalLink, label: "Twitter / X", href: "#" },
]

const hours = [
  { day: "Monday — Friday", time: "9:00 AM — 6:00 PM" },
  { day: "Saturday", time: "10:00 AM — 4:00 PM" },
  { day: "Sunday", time: "Closed" },
]

export default function ContactPage() {
  const [subject, setSubject] = useState<string>("General")

  return (
    <>
      <Section className="bg-gradient-to-b from-rose-light/50 to-white">
        <Container>
          <Heading
            as="h1"
            align="center"
            subtitle="We'd love to hear from you. Reach out for orders, styling advice, or just to say hello."
          >
            Get in Touch
          </Heading>

          <div className="mt-14 grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              className="lg:col-span-3"
            >
              <div className="rounded-3xl border border-rose-border/50 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-heading text-xl font-semibold text-navy">
                  Send Us a Message
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in the form below and we&apos;ll get back to you within
                  24 hours.
                </p>

                <div className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Your Name</Label>
                      <Input
                        id="contactName"
                        placeholder="Full name"
                        className="h-10 rounded-xl border-rose-border focus-visible:border-rose-primary focus-visible:ring-rose-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="you@example.com"
                        className="h-10 rounded-xl border-rose-border focus-visible:border-rose-primary focus-visible:ring-rose-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                      defaultValue="General"
                      onValueChange={(val) => setSubject(val as string)}
                    >
                      <SelectTrigger className="h-10 w-full rounded-xl border-rose-border">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">
                          General Inquiry
                        </SelectItem>
                        <SelectItem value="Order Issue">
                          Order Issue
                        </SelectItem>
                        <SelectItem value="Returns">
                          Returns & Exchanges
                        </SelectItem>
                        <SelectItem value="Partnership">
                          Partnership Opportunity
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactMessage">Message</Label>
                    <Textarea
                      id="contactMessage"
                      placeholder="Tell us how we can help…"
                      className="min-h-32 rounded-xl border-rose-border focus-visible:border-rose-primary focus-visible:ring-rose-primary/20"
                    />
                  </div>

                  <Button className="w-full gap-2 rounded-xl bg-rose-primary py-3 text-white hover:bg-rose-primary/90 sm:w-auto sm:px-8">
                    <Send className="size-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="space-y-8 lg:col-span-2"
            >
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-4 rounded-2xl border border-rose-border/50 bg-white p-4 shadow-sm transition-all hover:border-rose-primary/30 hover:shadow-md"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-light">
                      <item.icon className="size-5 text-rose-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-0.5 font-medium text-navy">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Operating Hours */}
              <div className="rounded-2xl border border-rose-border/50 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-navy">
                  <Clock className="size-5 text-rose-primary" />
                  <h3 className="font-heading font-semibold">
                    Operating Hours
                  </h3>
                </div>
                <div className="mt-3 space-y-2">
                  {hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{h.day}</span>
                      <span className="font-medium text-navy">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div className="rounded-2xl border border-rose-border/50 bg-white p-5 shadow-sm">
                <h3 className="font-heading font-semibold text-navy">
                  Follow Us
                </h3>
                <div className="mt-3 flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex size-10 items-center justify-center rounded-xl border border-rose-border/50 text-muted-foreground transition-all hover:border-rose-primary hover:bg-rose-light hover:text-rose-primary"
                    >
                      <s.icon className="size-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/233241234567"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 font-medium text-white shadow-sm transition-all hover:bg-[#20BD5A] hover:shadow-md"
              >
                <MessageCircle className="size-5" />
                Chat on WhatsApp
              </a>

              {/* Map Placeholder */}
              <div className="overflow-hidden rounded-2xl">
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
                  <div className="text-center">
                    <MapPin className="mx-auto size-8 text-rose-primary/40" />
                    <p className="mt-2 text-sm font-medium text-navy/40">
                      Accra, Ghana
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  )
}
