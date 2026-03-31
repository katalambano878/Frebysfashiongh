"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Share2,
  Globe,
  Link2,
  User,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { blogPosts } from "@/lib/mock-data"

const articleBody = `
Fashion is a language that speaks before you do. In a world overflowing with trends, the art of personal style lies in choosing pieces that resonate with who you are — not who the algorithm says you should be.

At Laura's Luxury, we believe that true elegance is less about following every trend and more about investing in quality pieces that tell your story. Whether it's a perfectly structured tote that carries your ambition, or a silk scarf that adds a whisper of sophistication to any outfit, the details matter.

The modern woman understands that luxury isn't about excess — it's about intention. It's choosing a handcrafted leather satchel over fast fashion. It's reaching for a perfume that becomes your signature, not just a scent. It's building a wardrobe where every piece earns its place.

Here are our guiding principles for timeless style:

Quality Over Quantity — A single well-made piece outlasts and outshines a dozen disposable ones. Look for premium materials, clean stitching, and thoughtful design. These are the hallmarks of pieces that age gracefully.

Know Your Silhouette — Understanding what flatters your body is the foundation of effortless dressing. A wrap dress that cinches at the waist, a blazer that sits perfectly on your shoulders — these aren't accidents. They're choices.

The Power of Accessories — Never underestimate how a pair of pearl earrings or a statement belt can transform a simple outfit into something extraordinary. Accessories are the punctuation marks of your style story.

Colour With Confidence — While neutrals are timeless, don't shy away from colour. A bold emerald clutch or a rich burgundy heel can be the exclamation point your outfit needs. The key is balance — let one piece sing while the others harmonise.

Invest in the Everyday — The pieces you wear most often deserve the most attention. Your everyday bag, your go-to shoes, your daily fragrance — these are the items worth investing in. They're not just purchases; they're part of your daily armour.

Style is deeply personal, and there's no single formula. But if there's one truth we've learned at Laura's Luxury, it's this: when a woman feels beautiful in what she's wearing, it shows. Not just in how she looks, but in how she walks, speaks, and carries herself through the world.

That's the kind of luxury worth investing in.
`

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const post = blogPosts.find((p) => p.slug === slug)
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2)

  if (!post) {
    return (
      <Section>
        <Container className="py-20 text-center">
          <h1 className="font-heading text-3xl font-semibold text-navy">
            Post Not Found
          </h1>
          <p className="mt-3 text-muted-foreground">
            The article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            className="mt-6 rounded-xl bg-rose-primary text-white hover:bg-rose-primary/90"
            render={<Link href="/blog" />}
          >
            Back to Journal
          </Button>
        </Container>
      </Section>
    )
  }

  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-b from-rose-light/50 to-white pb-0 sm:pb-0">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-rose-primary"
            >
              <ArrowLeft className="size-4" />
              Back to Journal
            </Link>

            <div className="mt-6 max-w-3xl">
              <Badge className="rounded-full bg-rose-light text-rose-primary border-rose-border">
                {post.category}
              </Badge>

              <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mt-4 text-lg text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {post.readTime} read
                </span>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Featured Image Placeholder */}
      <Section className="pt-8 pb-0 sm:pt-10 sm:pb-0">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="aspect-[21/9] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-200 via-pink-100 to-amber-50"
          >
            <div className="flex h-full items-center justify-center">
              <BookOpen className="size-16 text-navy/6" />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Article Body */}
      <Section>
        <Container>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto max-w-3xl"
          >
            <div className="prose-lg space-y-5 text-muted-foreground leading-[1.8]">
              {articleBody
                .trim()
                .split("\n\n")
                .map((para, i) => {
                  const isBold =
                    para.includes("Quality Over") ||
                    para.includes("Know Your") ||
                    para.includes("The Power of") ||
                    para.includes("Colour With") ||
                    para.includes("Invest in")

                  if (isBold) {
                    const [heading, ...rest] = para.split(" — ")
                    return (
                      <p key={i}>
                        <strong className="font-semibold text-navy">
                          {heading}
                        </strong>
                        {rest.length > 0 && <> — {rest.join(" — ")}</>}
                      </p>
                    )
                  }
                  return <p key={i}>{para}</p>
                })}
            </div>

            <Separator className="my-10" />

            {/* Share */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="size-4" />
                Share this article
              </div>
              <div className="flex gap-2">
                {[
                  { icon: Globe, label: "Share" },
                  { icon: Share2, label: "Repost" },
                  { icon: Link2, label: "Copy Link" },
                ].map((s) => (
                  <button
                    key={s.label}
                    aria-label={`Share on ${s.label}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-rose-border/50 text-muted-foreground transition-all hover:border-rose-primary hover:bg-rose-light hover:text-rose-primary"
                  >
                    <s.icon className="size-4" />
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-10" />

            {/* Author Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-rose-border/50 bg-rose-light/40 p-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-pink-100">
                <User className="size-6 text-rose-primary" />
              </div>
              <div>
                <p className="font-heading font-semibold text-navy">
                  Laura&apos;s Luxury Editorial
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Style insights and fashion wisdom from our curation team,
                  written for the modern woman who values elegance.
                </p>
              </div>
            </div>
          </motion.article>
        </Container>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section className="bg-gradient-to-b from-rose-light/30 to-white">
          <Container>
            <h2 className="text-center font-heading text-2xl font-semibold text-navy sm:text-3xl">
              You Might Also Enjoy
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {relatedPosts.map((rp, i) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link href={`/blog/${rp.slug}`} className="group block">
                    <article className="overflow-hidden rounded-2xl border border-rose-border/30 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="aspect-[16/9] bg-gradient-to-br from-violet-100 via-purple-50 to-pink-50">
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="size-10 text-navy/8" />
                        </div>
                      </div>
                      <div className="p-5">
                        <Badge className="rounded-full bg-rose-light text-rose-primary border-rose-border text-[10px]">
                          {rp.category}
                        </Badge>
                        <h3 className="mt-2 font-heading text-lg font-semibold text-navy group-hover:text-rose-primary">
                          {rp.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {rp.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
