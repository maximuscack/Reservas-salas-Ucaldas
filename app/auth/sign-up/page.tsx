"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error en el registro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-md">
        <Card className="border-2" style={{ borderColor: "var(--border)" }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
              Registro
            </CardTitle>
            <CardDescription className="mt-2">Crea tu cuenta para acceder al sistema de reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname" style={{ color: "var(--primary)" }} className="font-semibold">
                  Nombre Completo
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Juan García"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-2"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "var(--primary)" }} className="font-semibold">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: "var(--primary)" }} className="font-semibold">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repeat-password" style={{ color: "var(--primary)" }} className="font-semibold">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="border-2"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              {error && (
                <div className="p-3 rounded-md text-sm" style={{ backgroundColor: "#F44336", color: "white" }}>
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-semibold py-2 text-base"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {isLoading ? "Registrando..." : "Crear Cuenta"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span style={{ color: "var(--foreground)" }}>¿Ya tienes cuenta? </span>
              <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: "var(--primary)" }}>
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
