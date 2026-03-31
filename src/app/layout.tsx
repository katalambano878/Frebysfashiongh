import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Laura's Luxury — Premium Women's Fashion & Essentials",
    template: "%s | Laura's Luxury",
  },
  description:
    "Curated luxury bags, dresses, shoes, perfumes & accessories for the confident woman. Shop authentic premium fashion with fast delivery across Ghana.",
  keywords: [
    "luxury fashion",
    "women's bags",
    "designer dresses",
    "premium perfumes",
    "Ghana fashion",
    "Laura's Luxury",
  ],
  openGraph: {
    title: "Laura's Luxury — Premium Women's Fashion & Essentials",
    description:
      "Curated luxury bags, dresses, shoes, perfumes & accessories for the confident woman.",
    siteName: "Laura's Luxury",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
