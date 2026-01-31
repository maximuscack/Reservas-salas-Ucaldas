"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
          Error de Autenticación
        </h1>
        <p className="text-lg mb-8" style={{ color: "var(--secondary)" }}>
          Ocurrió un error durante el proceso de autenticación.
        </p>
        <Link href="/auth/login">
          <Button className="text-white font-semibold px-8" style={{ backgroundColor: "var(--primary)" }}>
            Volver al Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
