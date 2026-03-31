"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { Separator } from "@/components/ui/separator"

const sections = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing and using the Laura's Luxury website (laurasluxury.com) and services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website or services.",
      "We reserve the right to update or modify these terms at any time without prior notice. Continued use of our website after any changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically.",
    ],
  },
  {
    title: "2. Account Registration",
    paragraphs: [
      "To make purchases and access certain features, you may be required to create an account. You agree to provide accurate, current, and complete information during registration and to keep your account details up to date.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately if you suspect any unauthorised access.",
      "Laura's Luxury reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or are otherwise deemed harmful to our community or business.",
    ],
  },
  {
    title: "3. Orders & Purchases",
    paragraphs: [
      "All orders placed through our website are subject to acceptance and availability. Placing an order constitutes an offer to purchase, which we may accept or decline at our discretion.",
      "Order confirmation is sent via email and/or SMS upon successful payment. This confirmation represents our acceptance of your order and forms a binding contract between you and Laura's Luxury.",
      "We reserve the right to cancel orders in cases of pricing errors, suspected fraud, product unavailability, or other circumstances beyond our control. If an order is cancelled, you will receive a full refund.",
      "All orders are subject to verification. We may contact you to confirm order details before processing.",
    ],
  },
  {
    title: "4. Pricing & Payment",
    paragraphs: [
      "All prices on our website are displayed in Ghana Cedis (GH₵) and include applicable taxes unless otherwise stated.",
      "We strive to ensure pricing accuracy, but errors may occasionally occur. If we discover a pricing error after your order has been placed, we will notify you and offer the option to proceed at the correct price or cancel for a full refund.",
      "We accept payments via mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money), bank cards (Visa, Mastercard), and bank transfers. All payment transactions are processed securely through our payment partners.",
      "Promotional codes and discounts are subject to their specific terms, may not be combined unless stated, and can be withdrawn at any time.",
    ],
  },
  {
    title: "5. Delivery",
    paragraphs: [
      "Delivery timelines provided at checkout and in our Shipping Policy are estimates and not guarantees. While we make every effort to deliver within the stated timeframes, delays may occur due to courier issues, weather, public holidays, or circumstances beyond our control.",
      "Risk of loss and title for items pass to you upon delivery. You are responsible for providing an accurate and complete delivery address. Laura's Luxury is not liable for delays or failed deliveries caused by incorrect address information.",
      "If you are unavailable at the time of delivery, our courier partner will attempt redelivery. After two failed attempts, the package may be returned to us, and a redelivery fee may apply.",
    ],
  },
  {
    title: "6. Returns & Refunds",
    paragraphs: [
      "Returns and refunds are governed by our Returns & Refunds Policy. By making a purchase, you agree to the terms outlined in that policy.",
      "In summary: items may be returned within 7 days of delivery if they are unused, unworn, and in original packaging. Certain items (opened perfumes, earrings, final sale items) are excluded from returns.",
      "Refunds are processed within 3–5 business days of receiving the returned item. Shipping fees are non-refundable unless the return is due to our error.",
    ],
  },
  {
    title: "7. Intellectual Property",
    paragraphs: [
      "All content on the Laura's Luxury website — including text, images, graphics, logos, product descriptions, and design elements — is the property of Laura's Luxury and is protected by copyright and intellectual property laws.",
      "You may not reproduce, distribute, modify, or use any content from our website for commercial purposes without our prior written consent.",
      "The Laura's Luxury name, logo, and associated branding are trademarks of Laura's Luxury. Unauthorised use of these trademarks is prohibited.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    paragraphs: [
      "Laura's Luxury provides its website and services on an \"as is\" and \"as available\" basis. While we strive for accuracy and reliability, we do not guarantee that our website will be uninterrupted, error-free, or free of viruses.",
      "To the maximum extent permitted by law, Laura's Luxury shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.",
      "Our total liability for any claim related to a purchase shall not exceed the amount you paid for the specific product in question.",
      "Nothing in these terms excludes or limits liability that cannot be lawfully excluded or limited under applicable Ghanaian law.",
    ],
  },
  {
    title: "9. Governing Law",
    paragraphs: [
      "These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of Ghana.",
      "Any disputes arising from or related to these terms or your use of our services shall be resolved through good-faith negotiation. If a resolution cannot be reached, the dispute shall be submitted to the courts of competent jurisdiction in Accra, Ghana.",
    ],
  },
  {
    title: "10. Contact Information",
    paragraphs: [
      "If you have any questions about these Terms & Conditions, please contact us:",
      "Email: legal@laurasluxury.com",
      "WhatsApp: +233 24 123 4567",
      "Address: Laura's Luxury, 12 Independence Avenue, East Legon, Accra, Ghana",
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function TermsPage() {
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
            subtitle="Please read these terms carefully before using our website and services."
          >
            Terms &amp; Conditions
          </Heading>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Effective Date: 1 January 2026 · Last Updated: March 2026
          </p>

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
                  <h2 className="font-heading text-lg font-semibold text-navy">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {section.paragraphs.map((para, j) => (
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

          <Separator className="mt-8 bg-rose-border/40" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            By using Laura&apos;s Luxury, you acknowledge that you have read,
            understood, and agree to these Terms &amp; Conditions.
          </motion.p>
        </motion.div>
      </Container>
    </Section>
  )
}
