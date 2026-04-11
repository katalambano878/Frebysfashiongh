"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { Separator } from "@/components/ui/separator"

const sections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you visit or make a purchase on frebysfashiongh.com, we collect certain information to provide and improve our services. This includes:",
      "Personal Information: Name, email address, phone number, delivery address, and billing information provided during account creation or checkout.",
      "Order Information: Details of products purchased, order history, transaction amounts, and payment method (we do not store full card details).",
      "Device & Usage Information: IP address, browser type, device type, pages visited, time spent on pages, and referring URLs — collected automatically through cookies and similar technologies.",
      "Communication Data: Messages you send us via email, WhatsApp, or our contact form, including any attachments.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: [
      "We use the information we collect for the following purposes:",
      "To process and fulfil your orders, including delivery coordination and payment processing.",
      "To communicate with you about your orders, account, and customer service inquiries.",
      "To personalise your shopping experience, including product recommendations and tailored content.",
      "To send promotional communications such as newsletters, new arrivals, and exclusive offers — only with your consent. You can unsubscribe at any time.",
      "To improve our website, services, and overall customer experience through analytics.",
      "To detect and prevent fraud, protect our legal rights, and ensure the security of our platform.",
    ],
  },
  {
    title: "3. Information Sharing",
    paragraphs: [
      "Frebys Fashion GH does not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information with:",
      "Service Providers: Trusted third parties who help us operate our business, including payment processors (Paystack, MTN MoMo), courier partners, and email/SMS service providers. These partners only access your information to perform services on our behalf and are obligated to protect it.",
      "Legal Requirements: We may disclose your information if required by law, regulation, or legal process, or to protect the rights, property, or safety of Frebys Fashion GH, our customers, or the public.",
      "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.",
    ],
  },
  {
    title: "4. Data Security",
    paragraphs: [
      "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.",
      "All payment transactions are encrypted using SSL (Secure Socket Layer) technology. We do not store complete credit card or mobile money PIN information on our servers.",
      "Access to personal information is restricted to authorised personnel who need it to perform their duties.",
      "While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.",
    ],
  },
  {
    title: "5. Cookies & Tracking",
    paragraphs: [
      "Our website uses cookies and similar tracking technologies to enhance your browsing experience.",
      "Essential Cookies: Required for the website to function properly, including session management, shopping cart functionality, and security features.",
      "Analytics Cookies: Help us understand how visitors interact with our website, which pages are most popular, and how we can improve our services. We use Google Analytics for this purpose.",
      "Marketing Cookies: Used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. These may be set by third-party advertising partners.",
      "You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of our website.",
    ],
  },
  {
    title: "6. Your Rights",
    paragraphs: [
      "You have the following rights regarding your personal information:",
      "Access: You can request a copy of the personal data we hold about you at any time.",
      "Correction: You can update or correct inaccurate personal information through your account settings or by contacting us.",
      "Deletion: You can request that we delete your personal data, subject to legal and contractual obligations that may require us to retain certain information.",
      "Opt-Out: You can unsubscribe from marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.",
      "Data Portability: You can request your personal data in a structured, commonly used format.",
      "To exercise any of these rights, please contact us at info@frebysfashiongh.com or via WhatsApp at +233 24 472 0197. We will respond to your request within 30 days.",
    ],
  },
  {
    title: "7. Children's Privacy",
    paragraphs: [
      "Frebys Fashion GH does not knowingly collect personal information from individuals under the age of 18. Our products and services are intended for adults. If we become aware that we have collected data from a minor, we will take steps to delete that information promptly.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. When we make significant changes, we will notify you via email or a prominent notice on our website.",
      "We encourage you to review this page periodically to stay informed about how we protect your information. Your continued use of our website after any changes constitutes acceptance of the updated policy.",
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

export default function PrivacyPolicyPage() {
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
            subtitle="Your privacy matters to us. This policy explains how we collect, use, and protect your information."
          >
            Privacy Policy
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              If you have questions about this Privacy Policy, contact us at{" "}
              <a
                href="mailto:info@frebysfashiongh.com"
                className="font-medium text-rose-primary hover:underline"
              >
                info@frebysfashiongh.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  )
}
