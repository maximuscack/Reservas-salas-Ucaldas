"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-md">
        <Card className="border-2 text-center" style={{ borderColor: "var(--border)" }}>
          <CardHeader>
            <div className="text-4xl mb-4">✓</div>
            <CardTitle className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
              ¡Registro Exitoso!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-6 text-base">
              Se ha enviado un correo de confirmación a tu bandeja. Por favor, verifica tu correo electrónico para
              completar la activación de tu cuenta.
            </CardDescription>
            <p className="mb-8 text-sm" style={{ color: "var(--foreground)" }}>
              Una vez confirmado, podrás acceder a todas las funciones del sistema de reservas.
            </p>
            <Link href="/auth/login">
              <Button
                className="w-full text-white font-semibold py-2 text-base"
                style={{ backgroundColor: "var(--primary)" }}
              >
                Volver a Ingreso
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
