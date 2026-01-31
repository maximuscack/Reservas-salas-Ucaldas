"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Reservation {
  id: string
  user_id: string
  user_email: string
  status: string
  created_at: string
  type: "room" | "material"
  details: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
}

interface SportsRoom {
  id: string
  name: string
  sport_type: string
  capacity: number
  location: string
  description: string
  is_available: boolean
}

interface SportsMaterial {
  id: string
  name: string
  category: string
  quantity: number
  available_qty: number
  description: string
  is_available: boolean
}

export default function AdminPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [userRole, setUserRole] = useState<string>("")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<"reservations" | "users" | "rooms" | "materials">("reservations")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserRole, setNewUserRole] = useState<"student" | "admin" | "superadmin">("student")
  const [creatingUser, setCreatingUser] = useState(false)
  const [userMessage, setUserMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [rooms, setRooms] = useState<SportsRoom[]>([])
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomSportType, setNewRoomSportType] = useState("")
  const [newRoomCapacity, setNewRoomCapacity] = useState("")
  const [newRoomLocation, setNewRoomLocation] = useState("")
  const [newRoomDescription, setNewRoomDescription] = useState("")
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [roomMessage, setRoomMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [materials, setMaterials] = useState<SportsMaterial[]>([])
  const [newMaterialName, setNewMaterialName] = useState("")
  const [newMaterialCategory, setNewMaterialCategory] = useState("")
  const [newMaterialQuantity, setNewMaterialQuantity] = useState("")
  const [newMaterialDescription, setNewMaterialDescription] = useState("")
  const [creatingMaterial, setCreatingMaterial] = useState(false)
  const [materialMessage, setMaterialMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user as any)

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (profile?.role !== "admin" && profile?.role !== "superadmin") {
          router.push("/dashboard")
          return
        }

        setUserRole(profile.role)
        setIsAdmin(true)
        await Promise.all([fetchReservations(), fetchUsers(), fetchRooms(), fetchMaterials()])
      } catch (error) {
        console.error("Error:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [])

  const fetchReservations = async () => {
    try {
      const [roomsResult, materialsResult, profilesResult] = await Promise.all([
        supabase.from("room_reservations").select("*").order("created_at", { ascending: false }),
        supabase.from("material_reservations").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, email"),
      ])

      const profileMap =
        profilesResult.data?.reduce(
          (acc, p) => {
            acc[p.id] = p.email
            return acc
          },
          {} as Record<string, string>,
        ) || {}

      const allReservations: Reservation[] = [
        ...(roomsResult.data?.map((r) => ({
          id: r.id,
          user_id: r.user_id,
          user_email: profileMap[r.user_id] || "Desconocido",
          status: r.status,
          created_at: r.created_at,
          type: "room" as const,
          details: `${new Date(r.start_time).toLocaleString()} - ${new Date(r.end_time).toLocaleString()}`,
        })) || []),
        ...(materialsResult.data?.map((m) => ({
          id: m.id,
          user_id: m.user_id,
          user_email: profileMap[m.user_id] || "Desconocido",
          status: m.status,
          created_at: m.created_at,
          type: "material" as const,
          details: `Cantidad: ${m.quantity}, Fecha: ${new Date(m.reservation_date).toLocaleDateString()}`,
        })) || []),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setReservations(allReservations)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data: userProfiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      setUsers(userProfiles || [])
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const fetchRooms = async () => {
    try {
      const { data } = await supabase.from("sports_rooms").select("*").order("created_at", { ascending: false })
      setRooms(data || [])
    } catch (error) {
      console.error("Error al cargar salas:", error)
    }
  }

  const fetchMaterials = async () => {
    try {
      const { data } = await supabase.from("sports_materials").select("*").order("created_at", { ascending: false })
      setMaterials(data || [])
    } catch (error) {
      console.error("Error al cargar materiales:", error)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingRoom(true)
    setRoomMessage(null)

    try {
      if (!newRoomName || !newRoomSportType || !newRoomCapacity || !newRoomLocation) {
        setRoomMessage({ type: "error", text: "Todos los campos son requeridos" })
        setCreatingRoom(false)
        return
      }

      const { error } = await supabase.from("sports_rooms").insert({
        name: newRoomName,
        sport_type: newRoomSportType,
        capacity: Number.parseInt(newRoomCapacity),
        location: newRoomLocation,
        description: newRoomDescription,
        is_available: true,
      })

      if (error) throw error

      setRoomMessage({ type: "success", text: `Sala "${newRoomName}" creada exitosamente` })
      setNewRoomName("")
      setNewRoomSportType("")
      setNewRoomCapacity("")
      setNewRoomLocation("")
      setNewRoomDescription("")

      await fetchRooms()
    } catch (error) {
      setRoomMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al crear sala",
      })
    } finally {
      setCreatingRoom(false)
    }
  }

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingMaterial(true)
    setMaterialMessage(null)

    try {
      if (!newMaterialName || !newMaterialCategory || !newMaterialQuantity) {
        setMaterialMessage({ type: "error", text: "Todos los campos son requeridos" })
        setCreatingMaterial(false)
        return
      }

      const quantity = Number.parseInt(newMaterialQuantity)

      const { error } = await supabase.from("sports_materials").insert({
        name: newMaterialName,
        category: newMaterialCategory,
        quantity: quantity,
        available_qty: quantity,
        description: newMaterialDescription,
        is_available: true,
      })

      if (error) throw error

      setMaterialMessage({ type: "success", text: `Material "${newMaterialName}" creado exitosamente` })
      setNewMaterialName("")
      setNewMaterialCategory("")
      setNewMaterialQuantity("")
      setNewMaterialDescription("")

      await fetchMaterials()
    } catch (error) {
      setMaterialMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al crear material",
      })
    } finally {
      setCreatingMaterial(false)
    }
  }

  const handleDeleteRoom = async (roomId: string, roomName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la sala "${roomName}"?`)) return

    try {
      const { error } = await supabase.from("sports_rooms").delete().eq("id", roomId)
      if (error) throw error

      await fetchRooms()
      alert("Sala eliminada exitosamente")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar la sala")
    }
  }

  const handleDeleteMaterial = async (materialId: string, materialName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el material "${materialName}"?`)) return

    try {
      const { error } = await supabase.from("sports_materials").delete().eq("id", materialId)
      if (error) throw error

      await fetchMaterials()
      alert("Material eliminado exitosamente")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el material")
    }
  }

  const handleToggleRoomAvailability = async (roomId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("sports_rooms").update({ is_available: !currentStatus }).eq("id", roomId)

      if (error) throw error
      await fetchRooms()
    } catch (error) {
      console.error("Error:", error)
      alert("Error al cambiar disponibilidad")
    }
  }

  const handleToggleMaterialAvailability = async (materialId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("sports_materials")
        .update({ is_available: !currentStatus })
        .eq("id", materialId)

      if (error) throw error
      await fetchMaterials()
    } catch (error) {
      console.error("Error:", error)
      alert("Error al cambiar disponibilidad")
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingUser(true)
    setUserMessage(null)

    try {
      if (!newUserEmail || !newUserName || !newUserPassword) {
        setUserMessage({ type: "error", text: "Todos los campos son requeridos" })
        setCreatingUser(false)
        return
      }

      if (newUserRole === "superadmin" && userRole !== "superadmin") {
        setUserMessage({ type: "error", text: "Solo un superadministrador puede crear otros superadministradores" })
        setCreatingUser(false)
        return
      }

      if (newUserRole === "admin" && userRole === "admin") {
        setUserMessage({ type: "error", text: "Solo un superadministrador puede crear administradores" })
        setCreatingUser(false)
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            full_name: newUserName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user?.id) {
        await supabase.from("profiles").update({ role: newUserRole }).eq("id", data.user.id)
      }

      setUserMessage({
        type: "success",
        text: `Usuario ${newUserEmail} creado exitosamente como ${
          newUserRole === "superadmin" ? "Superadministrador" : newUserRole === "admin" ? "Administrador" : "Estudiante"
        }`,
      })
      setNewUserEmail("")
      setNewUserName("")
      setNewUserPassword("")
      setNewUserRole("student")

      await fetchUsers()
    } catch (error) {
      setUserMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al crear usuario",
      })
    } finally {
      setCreatingUser(false)
    }
  }

  const handleApprove = async (id: string, type: "room" | "material") => {
    try {
      const table = type === "room" ? "room_reservations" : "material_reservations"
      await supabase.from(table).update({ status: "confirmed" }).eq("id", id)

      setReservations(reservations.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r)))
      alert("Reserva confirmada")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al confirmar la reserva")
    }
  }

  const handleReject = async (id: string, type: "room" | "material") => {
    try {
      const table = type === "room" ? "room_reservations" : "material_reservations"
      await supabase.from(table).update({ status: "cancelled" }).eq("id", id)

      setReservations(reservations.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)))
      alert("Reserva rechazada")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al rechazar la reserva")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p>Verificando permisos...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p>No tienes acceso a esta página</p>
      </div>
    )
  }

  const pendingReservations = reservations.filter((r) => r.status === "pending")
  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")

  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      {user && (
        <header className="border-b-2" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/dashboard")}
                className="text-white font-semibold"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Ir al Catálogo
              </Button>
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {user.email}
                </p>
                <p className="text-xs" style={{ color: "var(--secondary)" }}>
                  {userRole === "superadmin" ? "Superadministrador" : "Administrador"}
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--primary)" }}>
          Panel de Administración
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2" style={{ borderColor: "var(--border)" }}>
            <CardContent className="pt-6">
              <p className="text-sm" style={{ color: "var(--secondary)" }}>
                Reservas Pendientes
              </p>
              <p className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                {pendingReservations.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2" style={{ borderColor: "var(--border)" }}>
            <CardContent className="pt-6">
              <p className="text-sm" style={{ color: "var(--secondary)" }}>
                Confirmadas
              </p>
              <p className="text-3xl font-bold" style={{ color: "#4CAF50" }}>
                {confirmedReservations.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2" style={{ borderColor: "var(--border)" }}>
            <CardContent className="pt-6">
              <p className="text-sm" style={{ color: "var(--secondary)" }}>
                Total de Salas
              </p>
              <p className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                {rooms.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2" style={{ borderColor: "var(--border)" }}>
            <CardContent className="pt-6">
              <p className="text-sm" style={{ color: "var(--secondary)" }}>
                Total de Materiales
              </p>
              <p className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                {materials.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("reservations")}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "reservations" ? "var(--primary)" : "var(--border)",
              color: activeTab === "reservations" ? "white" : "var(--primary)",
            }}
          >
            Gestionar Reservas
          </button>
          <button
            onClick={() => setActiveTab("rooms")}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "rooms" ? "var(--primary)" : "var(--border)",
              color: activeTab === "rooms" ? "white" : "var(--primary)",
            }}
          >
            Gestionar Salas
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "materials" ? "var(--primary)" : "var(--border)",
              color: activeTab === "materials" ? "white" : "var(--primary)",
            }}
          >
            Gestionar Materiales
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "users" ? "var(--primary)" : "var(--border)",
              color: activeTab === "users" ? "white" : "var(--primary)",
            }}
          >
            Gestionar Usuarios
          </button>
        </div>

        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2" style={{ borderColor: "var(--border)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--primary)" }}>Crear Nueva Sala</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Nombre de la Sala
                    </Label>
                    <Input
                      type="text"
                      placeholder="Cancha de Fútbol A"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Tipo de Deporte
                    </Label>
                    <Input
                      type="text"
                      placeholder="Fútbol, Baloncesto, Voleibol, etc."
                      value={newRoomSportType}
                      onChange={(e) => setNewRoomSportType(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Capacidad (personas)
                    </Label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={newRoomCapacity}
                      onChange={(e) => setNewRoomCapacity(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Ubicación
                    </Label>
                    <Input
                      type="text"
                      placeholder="Edificio Deportivo, Piso 1"
                      value={newRoomLocation}
                      onChange={(e) => setNewRoomLocation(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Descripción (opcional)
                    </Label>
                    <Input
                      type="text"
                      placeholder="Cancha techada con iluminación LED"
                      value={newRoomDescription}
                      onChange={(e) => setNewRoomDescription(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>

                  {roomMessage && (
                    <div
                      className="p-3 rounded-lg text-sm"
                      style={{
                        backgroundColor: roomMessage.type === "success" ? "#E8F5E9" : "#FFEBEE",
                        color: roomMessage.type === "success" ? "#2E7D32" : "#C62828",
                      }}
                    >
                      {roomMessage.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={creatingRoom}
                    className="w-full text-white font-semibold py-2"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {creatingRoom ? "Creando sala..." : "Crear Sala"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: "var(--border)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--primary)" }}>Salas Existentes ({rooms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {rooms.length === 0 ? (
                    <p style={{ color: "var(--secondary)" }}>No hay salas registradas</p>
                  ) : (
                    rooms.map((room) => (
                      <div key={room.id} className="p-4 rounded-lg border-2" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold" style={{ color: "var(--primary)" }}>
                              {room.name}
                            </p>
                            <p className="text-sm mt-1" style={{ color: "var(--foreground)" }}>
                              Deporte: {room.sport_type}
                            </p>
                            <p className="text-sm" style={{ color: "var(--foreground)" }}>
                              Capacidad: {room.capacity} personas
                            </p>
                            <p className="text-sm" style={{ color: "var(--foreground)" }}>
                              Ubicación: {room.location}
                            </p>
                            {room.description && (
                              <p className="text-xs mt-1" style={{ color: "var(--secondary)" }}>
                                {room.description}
                              </p>
                            )}
                            <div className="mt-2">
                              <span
                                className="text-xs px-2 py-1 rounded-full font-semibold"
                                style={{
                                  backgroundColor: room.is_available ? "#E8F5E9" : "#FFEBEE",
                                  color: room.is_available ? "#2E7D32" : "#C62828",
                                }}
                              >
                                {room.is_available ? "Disponible" : "No disponible"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              onClick={() => handleToggleRoomAvailability(room.id, room.is_available)}
                              className="text-white text-sm px-3 py-1"
                              style={{ backgroundColor: room.is_available ? "#FF9800" : "#4CAF50" }}
                            >
                              {room.is_available ? "Desactivar" : "Activar"}
                            </Button>
                            <Button
                              onClick={() => handleDeleteRoom(room.id, room.name)}
                              className="text-white text-sm px-3 py-1"
                              style={{ backgroundColor: "#F44336" }}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "materials" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2" style={{ borderColor: "var(--border)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--primary)" }}>Crear Nuevo Material</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMaterial} className="space-y-4">
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Nombre del Material
                    </Label>
                    <Input
                      type="text"
                      placeholder="Balón de Fútbol"
                      value={newMaterialName}
                      onChange={(e) => setNewMaterialName(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Categoría
                    </Label>
                    <Input
                      type="text"
                      placeholder="Balones, Raquetas, Conos, etc."
                      value={newMaterialCategory}
                      onChange={(e) => setNewMaterialCategory(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Cantidad Total
                    </Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={newMaterialQuantity}
                      onChange={(e) => setNewMaterialQuantity(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Descripción (opcional)
                    </Label>
                    <Input
                      type="text"
                      placeholder="Balón profesional talla 5"
                      value={newMaterialDescription}
                      onChange={(e) => setNewMaterialDescription(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>

                  {materialMessage && (
                    <div
                      className="p-3 rounded-lg text-sm"
                      style={{
                        backgroundColor: materialMessage.type === "success" ? "#E8F5E9" : "#FFEBEE",
                        color: materialMessage.type === "success" ? "#2E7D32" : "#C62828",
                      }}
                    >
                      {materialMessage.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={creatingMaterial}
                    className="w-full text-white font-semibold py-2"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {creatingMaterial ? "Creando material..." : "Crear Material"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: "var(--border)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--primary)" }}>Materiales Existentes ({materials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {materials.length === 0 ? (
                    <p style={{ color: "var(--secondary)" }}>No hay materiales registrados</p>
                  ) : (
                    materials.map((material) => (
                      <div
                        key={material.id}
                        className="p-4 rounded-lg border-2"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold" style={{ color: "var(--primary)" }}>
                              {material.name}
                            </p>
                            <p className="text-sm mt-1" style={{ color: "var(--foreground)" }}>
                              Categoría: {material.category}
                            </p>
                            <p className="text-sm" style={{ color: "var(--foreground)" }}>
                              Cantidad total: {material.quantity}
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#4CAF50" }}>
                              Disponibles: {material.available_qty}
                            </p>
                            {material.description && (
                              <p className="text-xs mt-1" style={{ color: "var(--secondary)" }}>
                                {material.description}
                              </p>
                            )}
                            <div className="mt-2">
                              <span
                                className="text-xs px-2 py-1 rounded-full font-semibold"
                                style={{
                                  backgroundColor: material.is_available ? "#E8F5E9" : "#FFEBEE",
                                  color: material.is_available ? "#2E7D32" : "#C62828",
                                }}
                              >
                                {material.is_available ? "Disponible" : "No disponible"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              onClick={() => handleToggleMaterialAvailability(material.id, material.is_available)}
                              className="text-white text-sm px-3 py-1"
                              style={{ backgroundColor: material.is_available ? "#FF9800" : "#4CAF50" }}
                            >
                              {material.is_available ? "Desactivar" : "Activar"}
                            </Button>
                            <Button
                              onClick={() => handleDeleteMaterial(material.id, material.name)}
                              className="text-white text-sm px-3 py-1"
                              style={{ backgroundColor: "#F44336" }}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2" style={{ borderColor: "var(--border)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--primary)" }}>Crear Nuevo Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Nombre Completo
                    </Label>
                    <Input
                      type="text"
                      placeholder="Juan García"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Correo Electrónico
                    </Label>
                    <Input
                      type="email"
                      placeholder="usuario@universidad.edu"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Contraseña Temporal
                    </Label>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="border-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--primary)" }} className="font-semibold">
                      Rol
                    </Label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as "student" | "admin" | "superadmin")}
                      className="w-full border-2 rounded-lg p-2 mt-1"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option value="student">Estudiante</option>
                      {(userRole === "superadmin" || userRole === "admin") && (
                        <option value="admin">Administrador</option>
                      )}
                      {userRole === "superadmin" && <option value="superadmin">Superadministrador</option>}
                    </select>
                    <p className="text-xs mt-1" style={{ color: "var(--secondary)" }}>
                      {userRole === "superadmin"
                        ? "Superadmin: crea todo | Admin: crea estudiantes | Estudiante: solo reserva"
                        : "Admin: solo puede crear estudiantes"}
                    </p>
                  </div>

                  {userMessage && (
                    <div
                      className="p-3 rounded-lg text-sm"
                      style={{
                        backgroundColor: userMessage.type === "success" ? "#E8F5E9" : "#FFEBEE",
                        color: userMessage.type === "success" ? "#2E7D32" : "#C62828",
                      }}
                    >
                      {userMessage.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={creatingUser}
                    className="w-full text-white font-semibold py-2"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {creatingUser ? "Creando usuario..." : "Crear Usuario"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: "var(--border)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--primary)" }}>Usuarios Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.length === 0 ? (
                    <p style={{ color: "var(--secondary)" }}>No hay usuarios registrados</p>
                  ) : (
                    users.map((u) => (
                      <div key={u.id} className="p-3 rounded-lg border" style={{ borderColor: "var(--border)" }}>
                        <p className="font-semibold" style={{ color: "var(--primary)" }}>
                          {u.full_name}
                        </p>
                        <p className="text-sm" style={{ color: "var(--foreground)" }}>
                          {u.email}
                        </p>
                        <p className="text-xs mt-1 font-medium">
                          <span style={{ color: "var(--secondary)" }}>Rol: </span>
                          <span
                            style={{
                              color:
                                u.role === "superadmin"
                                  ? "#FF6B00"
                                  : u.role === "admin"
                                    ? "var(--primary)"
                                    : "var(--accent)",
                            }}
                          >
                            {u.role === "superadmin"
                              ? "Superadministrador"
                              : u.role === "admin"
                                ? "Administrador"
                                : "Estudiante"}
                          </span>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reservations" && (
          <div className="space-y-4">
            {pendingReservations.length === 0 ? (
              <Card className="border-2 text-center py-12" style={{ borderColor: "var(--border)" }}>
                <p style={{ color: "var(--secondary)" }}>No hay reservas pendientes</p>
              </Card>
            ) : (
              pendingReservations.map((reservation) => (
                <Card key={reservation.id} className="border-2" style={{ borderColor: "var(--border)" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: "var(--primary)" }}>
                          {reservation.type === "room" ? "Sala" : "Material"} - {reservation.user_email}
                        </h3>
                        <p className="text-sm mt-2" style={{ color: "var(--foreground)" }}>
                          {reservation.details}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--secondary)" }}>
                          Solicitado: {new Date(reservation.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(reservation.id, reservation.type)}
                          className="text-white font-semibold"
                          style={{ backgroundColor: "#4CAF50" }}
                        >
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => handleReject(reservation.id, reservation.type)}
                          className="text-white font-semibold"
                          style={{ backgroundColor: "#F44336" }}
                        >
                          Rechazar
                        </Button>
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
