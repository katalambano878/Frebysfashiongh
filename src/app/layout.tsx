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
    default: "Frebys Fashion GH — Kids Ready-to-Wear Ankara Clothes",
    template: "%s | Frebys Fashion GH",
  },
  description:
    "Unique kids wear for all occasions. Passion for kids fashion with casual and luxury Ankara styles, worldwide delivery from Haatso, Accra, Ghana.",
  keywords: [
    "kids ready to wear",
    "ankara kids clothes",
    "kids fashion ghana",
    "casual kids wear",
    "luxury kids wear",
    "Frebys Fashion GH",
  ],
  openGraph: {
    title: "Frebys Fashion GH — Kids Ready-to-Wear Ankara Clothes",
    description:
      "Unique kids wear for all occasions with casual and luxury Ankara styles.",
    siteName: "Frebys Fashion GH",
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
