import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Panduan Shalat",
  description: "Panduan bacaan dan doa dalam shalat wajib dengan berbagai versi",
  generator: "v0.dev",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  themeColor: "#F59E0B",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="application-name" content="Panduan Shalat" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Panduan Shalat" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F59E0B" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>
        {children}
        <Script src="/pwa.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
