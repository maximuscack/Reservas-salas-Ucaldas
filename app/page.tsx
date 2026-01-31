"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      }
      setLoading(false)
    }

    checkUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (user) {
    return (
      <div style={{ backgroundColor: "var(--background)" }} className="min-h-screen">
        <header className="border-b-2" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: "var(--primary)" }}
              >
                S
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                  Reserva de Salas
                </h1>
                <p className="text-sm" style={{ color: "var(--secondary)" }}>
                  Bienestar Universitario
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/dashboard")}
              className="text-white font-semibold px-6"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Ir al Dashboard
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
              Bienvenido de nuevo, {user.email}
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--secondary)" }}>
              Sistema de gestión de reservas de salas deportivas y materiales
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="text-white font-semibold px-8 py-3" style={{ backgroundColor: "var(--primary)" }}>
                  Ver Disponibilidades
                </Button>
              </Link>
              <Link href="/reservations">
                <Button
                  className="font-semibold px-8 py-3"
                  style={{ backgroundColor: "var(--border)", color: "var(--primary)" }}
                >
                  Mis Reservas
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-lg border-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--primary-light)" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                Salas Deportivas
              </h3>
              <p style={{ color: "var(--foreground)" }}>Accede a nuestras modernas instalaciones deportivas</p>
            </div>

            <div
              className="p-6 rounded-lg border-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary-light)" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                Materiales
              </h3>
              <p style={{ color: "var(--foreground)" }}>Reserva los materiales que necesitas</p>
            </div>

            <div
              className="p-6 rounded-lg border-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--accent-light)" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                Gestión Fácil
              </h3>
              <p style={{ color: "var(--foreground)" }}>Sistema intuitivo y rápido</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: "var(--background)" }} className="min-h-screen flex flex-col">
      <header className="border-b-2" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: "var(--primary)" }}
            >
              S
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                Reserva de Salas
              </h1>
              <p className="text-sm" style={{ color: "var(--secondary)" }}>
                Bienestar Universitario
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button
                className="font-semibold px-6"
                style={{ backgroundColor: "var(--border)", color: "var(--primary)" }}
              >
                Ingresar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="text-white font-semibold px-6" style={{ backgroundColor: "var(--primary)" }}>
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-20 flex-1 w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6" style={{ color: "var(--primary)" }}>
            Reserva Salas y Materiales Deportivos
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "var(--secondary)" }}>
            Sistema integral de reservas para la comunidad universitaria. Gestiona tus espacios y materiales de forma
            fácil, rápida y segura.
          </p>
          <Link href="/auth/sign-up">
            <Button className="text-white font-semibold px-8 py-3 text-lg" style={{ backgroundColor: "var(--accent)" }}>
              Comienza Ahora
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div
            className="p-8 rounded-lg border-2 text-center hover:shadow-lg transition-shadow"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--primary-light)" }}
          >
            <div className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
              1
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
              Crea tu Cuenta
            </h3>
            <p style={{ color: "var(--foreground)" }}>Regístrate en segundos con tu correo universitario</p>
          </div>

          <div
            className="p-8 rounded-lg border-2 text-center hover:shadow-lg transition-shadow"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary-light)" }}
          >
            <div className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
              2
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
              Explora Opciones
            </h3>
            <p style={{ color: "var(--foreground)" }}>Navega por salas y materiales disponibles</p>
          </div>

          <div
            className="p-8 rounded-lg border-2 text-center hover:shadow-lg transition-shadow"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--accent-light)" }}
          >
            <div className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
              3
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
              Reserva
            </h3>
            <p style={{ color: "var(--foreground)" }}>Confirma tu reserva y recibe confirmación</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-12 border-2" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            Características Principales
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
            <li style={{ color: "var(--foreground)" }}>✓ Visualización en tiempo real de disponibilidad</li>
            <li style={{ color: "var(--foreground)" }}>✓ Sistema de carrito para múltiples artículos</li>
            <li style={{ color: "var(--foreground)" }}>✓ Notificaciones automáticas por correo</li>
            <li style={{ color: "var(--foreground)" }}>✓ Panel de control para administradores</li>
            <li style={{ color: "var(--foreground)" }}>✓ Gestión de horarios y bloqueos</li>
            <li style={{ color: "var(--foreground)" }}>✓ Reportes y estadísticas</li>
          </ul>
        </div>
      </main>

      <footer className="border-t-2 mt-20 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center w-full">
          <p style={{ color: "var(--secondary)" }}>
            © 2025 Sistema de Reservas - Bienestar Universitario. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
