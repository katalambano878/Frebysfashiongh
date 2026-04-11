"use client"

import { motion } from "framer-motion"
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { Separator } from "@/components/ui/separator"

const sections = [
  {
    icon: Clock,
    title: "Return Window",
    content: [
      "We offer a 7-day return window from the date of delivery. To be eligible for a return, your item must be unused, unworn, and in its original packaging with all tags attached.",
      "To initiate a return, contact our team via WhatsApp at +233 24 472 0197 or email info@frebysfashiongh.com within 7 days of receiving your order. Please include your order number and reason for return.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Return Conditions",
    content: [
      "Items must be in their original, unworn condition with all tags and packaging intact.",
      "Custom-sized or personalized kids outfits may not be eligible for return unless received damaged or defective.",
      "Items showing signs of wear, stains, or alteration are not eligible for return.",
      "Sale items marked as 'Final Sale' are not eligible for returns.",
      "Gift items may be exchanged for store credit of equal value.",
    ],
  },
  {
    icon: RotateCcw,
    title: "Return Process",
    content: [
      "Step 1: Contact our customer service team via WhatsApp or email with your order number, the item(s) you wish to return, and the reason for your return.",
      "Step 2: Our team will review your request and, if approved, provide you with return instructions and a return authorisation number.",
      "Step 3: Package your item(s) securely in the original packaging and include the return authorisation number.",
      "Step 4: Drop off your return at any approved courier location, or arrange a pickup (Accra only, GH₵ 20 pickup fee).",
      "Step 5: Once we receive and inspect your return, we'll process your refund or exchange within 3–5 business days.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Refund Timeline",
    content: [
      "Refunds are processed within 3–5 business days after we receive and inspect your returned item(s).",
      "Refunds are issued to the original payment method used at checkout. Mobile money refunds typically reflect within 24 hours. Bank transfers may take 3–7 business days depending on your bank.",
      "Shipping fees are non-refundable unless the return is due to a defective or incorrect item shipped by us.",
      "If you haven't received your refund after 7 business days, please contact us with your order number for assistance.",
    ],
  },
  {
    icon: ArrowRightLeft,
    title: "Exchanges",
    content: [
      "We're happy to help you exchange items for a different size, colour, or product of equal or greater value.",
      "Exchanges follow the same 7-day window and condition requirements as returns.",
      "If the replacement item is of greater value, you'll be asked to pay the difference. If it's of lesser value, the difference will be issued as store credit.",
      "Exchange shipping is free for the first exchange. Subsequent exchanges within the same order may incur a delivery fee.",
      "To request an exchange, contact us via WhatsApp or email with your order number and the item you'd like instead.",
    ],
  },
  {
    icon: AlertCircle,
    title: "Damaged or Defective Items",
    content: [
      "If you receive a damaged, defective, or incorrect item, please contact us immediately — ideally within 48 hours of delivery.",
      "Provide clear photos of the issue along with your order number. We'll arrange a free return pickup and send you a replacement or full refund at no extra cost.",
      "Frebys Fashion GH stands behind the quality of every product we sell. Your satisfaction is our priority.",
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function ReturnsPolicyPage() {
  return (
    <Section className="bg-gradient-to-b from-rose-light/50 to-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto max-w-3xl"
        >
          <Heading
            as="h1"
            align="center"
            subtitle="We want you to love every piece. If something isn't right, here's how we'll make it better."
          >
            Returns &amp; Refunds
          </Heading>

          <div className="mt-12 space-y-0">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <div className="py-8 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-light">
                      <section.icon className="size-5 text-rose-primary" />
                    </div>
                    <h2 className="font-heading text-lg font-semibold text-navy">
                      {section.title}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-3 pl-[52px]">
                    {section.content.map((para, j) => (
                      <p
                        key={j}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
                {i < sections.length - 1 && (
                  <Separator className="bg-rose-border/40" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center text-sm text-muted-foreground"
          >
            Last updated: March 2026. For return inquiries, contact us at{" "}
            <a
              href="mailto:info@frebysfashiongh.com"
              className="font-medium text-rose-primary hover:underline"
            >
              info@frebysfashiongh.com
            </a>{" "}
            or WhatsApp +233 24 472 0197.
          </motion.p>
        </motion.div>
      </Container>
    </Section>
  )
}
