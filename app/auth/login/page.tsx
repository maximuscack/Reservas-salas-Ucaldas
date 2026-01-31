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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Intentando iniciar sesión con:", email)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("[v0] Error de inicio de sesión:", signInError)
        throw signInError
      }

      console.log("[v0] Inicio de sesión exitoso, verificando perfil...")

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        console.error("[v0] Error al consultar perfil:", profileError)
        throw new Error(`Error al cargar perfil de usuario: ${profileError.message}`)
      }

      if (!profile) {
        console.error("[v0] No se encontró perfil para el usuario")
        throw new Error("No se encontró el perfil de usuario")
      }

      console.log("[v0] Perfil encontrado, rol:", profile.role)
      router.push("/dashboard")
    } catch (error: unknown) {
      console.error("[v0] Error en handleLogin:", error)
      setError(error instanceof Error ? error.message : "Error en el inicio de sesión")
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
              Ingreso
            </CardTitle>
            <CardDescription className="mt-2">Accede a tu cuenta de Bienestar Universitario</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
                {isLoading ? "Iniciando sesión..." : "Ingresar"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span style={{ color: "var(--foreground)" }}>¿Problemas para acceder? </span>
              <Link href="/auth/help" className="font-semibold hover:underline" style={{ color: "var(--primary)" }}>
                Contacta al administrador
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
