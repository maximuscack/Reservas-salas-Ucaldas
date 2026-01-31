"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface RoomReservation {
  id: string
  room_id: string
  start_time: string
  end_time: string
  status: string
  room_name?: string
}

interface MaterialReservation {
  id: string
  material_id: string
  quantity: number
  reservation_date: string
  status: string
  material_name?: string
}

export default function ReservationsPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [roomReservations, setRoomReservations] = useState<RoomReservation[]>([])
  const [materialReservations, setMaterialReservations] = useState<MaterialReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"rooms" | "materials">("rooms")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user as any)

        const [roomsResult, materialsResult, roomsMetaResult] = await Promise.all([
          supabase.from("room_reservations").select("*").eq("user_id", user.id),
          supabase.from("material_reservations").select("*").eq("user_id", user.id),
          supabase.from("sports_rooms").select("id, name"),
        ])

        if (roomsResult.data) {
          const roomsWithNames = roomsResult.data.map((r) => ({
            ...r,
            room_name: roomsMetaResult.data?.find((rm) => rm.id === r.room_id)?.name || "Sala desconocida",
          }))
          setRoomReservations(roomsWithNames)
        }

        if (materialsResult.data) {
          const materialsMetaResult = await supabase.from("sports_materials").select("id, name")

          const materialsWithNames = materialsResult.data.map((m) => ({
            ...m,
            material_name:
              materialsMetaResult.data?.find((sm) => sm.id === m.material_id)?.name || "Material desconocido",
          }))
          setMaterialReservations(materialsWithNames)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const handleCancelReservation = async (reservationId: string, type: "room" | "material") => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return

    try {
      const table = type === "room" ? "room_reservations" : "material_reservations"
      await supabase.from(table).update({ status: "cancelled" }).eq("id", reservationId)

      if (type === "room") {
        setRoomReservations(roomReservations.filter((r) => r.id !== reservationId))
      } else {
        setMaterialReservations(materialReservations.filter((m) => m.id !== reservationId))
      }
      alert("Reserva cancelada")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al cancelar la reserva")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p>Cargando...</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50"
      case "pending":
        return "var(--accent)"
      case "cancelled":
        return "#999999"
      default:
        return "var(--secondary)"
    }
  }

  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      {user && (
        <header className="border-b-2" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: "var(--primary)" }}
              >
                S
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                  Reserva de Salas
                </h1>
                <p className="text-xs" style={{ color: "var(--secondary)" }}>
                  Bienestar Universitario
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/dashboard" className="font-medium hover:opacity-70" style={{ color: "var(--primary)" }}>
                Inicio
              </Link>
              <Link href="/reservations" className="font-medium hover:opacity-70" style={{ color: "var(--primary)" }}>
                Mis Reservas
              </Link>
              <Link href="/cart" className="font-medium hover:opacity-70" style={{ color: "var(--primary)" }}>
                Carrito
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {user.email}
                </p>
                <p className="text-xs" style={{ color: "var(--secondary)" }}>
                  Usuario
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--primary)" }}>
          Mis Reservas
        </h2>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("rooms")}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "rooms" ? "var(--primary)" : "var(--border)",
              color: activeTab === "rooms" ? "white" : "var(--primary)",
            }}
          >
            Salas ({roomReservations.length})
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "materials" ? "var(--primary)" : "var(--border)",
              color: activeTab === "materials" ? "white" : "var(--primary)",
            }}
          >
            Materiales ({materialReservations.length})
          </button>
          <Link href="/dashboard" className="ml-auto">
            <Button className="text-white font-semibold" style={{ backgroundColor: "var(--secondary)" }}>
              Hacer Nueva Reserva
            </Button>
          </Link>
        </div>

        {activeTab === "rooms" && (
          <div className="space-y-4">
            {roomReservations.length === 0 ? (
              <Card className="border-2 text-center py-12" style={{ borderColor: "var(--border)" }}>
                <p style={{ color: "var(--secondary)" }}>No tienes reservas de salas</p>
              </Card>
            ) : (
              roomReservations.map((reservation) => (
                <Card key={reservation.id} className="border-2" style={{ borderColor: "var(--border)" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                          {reservation.room_name}
                        </h3>
                        <p className="text-sm mt-2" style={{ color: "var(--foreground)" }}>
                          Desde: {new Date(reservation.start_time).toLocaleString()}
                        </p>
                        <p className="text-sm" style={{ color: "var(--foreground)" }}>
                          Hasta: {new Date(reservation.end_time).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                          style={{ backgroundColor: getStatusColor(reservation.status) }}
                        >
                          {reservation.status === "pending" && "Pendiente"}
                          {reservation.status === "confirmed" && "Confirmada"}
                          {reservation.status === "cancelled" && "Cancelada"}
                        </span>
                        {reservation.status !== "cancelled" && (
                          <Button
                            onClick={() => handleCancelReservation(reservation.id, "room")}
                            className="text-white text-sm"
                            style={{ backgroundColor: "#F44336" }}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-4">
            {materialReservations.length === 0 ? (
              <Card className="border-2 text-center py-12" style={{ borderColor: "var(--border)" }}>
                <p style={{ color: "var(--secondary)" }}>No tienes reservas de materiales</p>
              </Card>
            ) : (
              materialReservations.map((reservation) => (
                <Card key={reservation.id} className="border-2" style={{ borderColor: "var(--border)" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                          {reservation.material_name}
                        </h3>
                        <p className="text-sm mt-2" style={{ color: "var(--foreground)" }}>
                          Cantidad: {reservation.quantity}
                        </p>
                        <p className="text-sm" style={{ color: "var(--foreground)" }}>
                          Fecha: {new Date(reservation.reservation_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                          style={{ backgroundColor: getStatusColor(reservation.status) }}
                        >
                          {reservation.status === "pending" && "Pendiente"}
                          {reservation.status === "confirmed" && "Confirmada"}
                          {reservation.status === "cancelled" && "Cancelada"}
                        </span>
                        {reservation.status !== "cancelled" && (
                          <Button
                            onClick={() => handleCancelReservation(reservation.id, "material")}
                            className="text-white text-sm"
                            style={{ backgroundColor: "#F44336" }}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
