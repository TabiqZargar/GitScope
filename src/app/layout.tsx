import type { Metadata } from "next"
import "./globals.css"
import { NavBar } from "@/components/nav-bar"
import { SWRConfig } from "swr"

export const metadata: Metadata = {
  title: "GitScope - Engineering Intelligence",
  description: "Next-generation engineering intelligence for modern dev teams. Understand your repositories like never before.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@100..900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background font-sans antialiased selection:bg-primary/30">
        <SWRConfig value={{ dedupingInterval: 5 * 60 * 1000, revalidateOnFocus: false, revalidateOnReconnect: false }}>
          <NavBar />
          {children}
        </SWRConfig>
      </body>
    </html>
  )
}
