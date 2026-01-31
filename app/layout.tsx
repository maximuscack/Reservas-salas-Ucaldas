import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Reserva de Salas Deportivas | Bienestar Universitario",
  description: "Sistema de reserva de salas deportivas y materiales para la comunidad universitaria",
  generator: "v0.app",
  keywords: ["reserva", "salas", "deportivas", "materiales", "universidad"],
  authors: [{ name: "Bienestar Universitario" }],
  openGraph: {
    title: "Reserva de Salas Deportivas",
    description: "Sistema de reserva para la comunidad universitaria",
    type: "website",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-background text-foreground`}>{children}</body>
    </html>
  )
}
