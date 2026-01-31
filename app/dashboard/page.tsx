"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Room {
  id: string
  name: string
  description: string
  capacity: number
  location: string
  is_available: boolean
  hourly_rate: number
}

interface Material {
  id: string
  name: string
  description: string
  category: string
  quantity_total: number
  quantity_available: number
  is_available: boolean
  daily_rate: number
}

function Header({ userEmail, userRole }: { userEmail: string; userRole?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const isAdminUser = userRole === "admin" || userRole === "superadmin"

  return (
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

        <nav className="hidden md:flex gap-6 items-center">
          <a href="/dashboard" className="font-medium hover:opacity-70" style={{ color: "var(--primary)" }}>
            Inicio
          </a>
          <a href="/reservations" className="font-medium hover:opacity-70" style={{ color: "var(--primary)" }}>
            Mis Reservas
          </a>
          <a href="/cart" className="font-medium hover:opacity-70" style={{ color: "var(--primary)" }}>
            Carrito
          </a>
          {isAdminUser && (
            <a
              href="/admin"
              className="font-medium hover:opacity-70 px-3 py-1 rounded-lg text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Panel Admin
            </a>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {userEmail}
            </p>
            <p className="text-xs" style={{ color: "var(--secondary)" }}>
              {userRole === "superadmin" ? "Superadmin" : userRole === "admin" ? "Admin" : "Usuario"}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            className="text-white font-semibold"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {isLoading ? "..." : "Salir"}
          </Button>
        </div>
      </div>
    </header>
  )
}

function RoomCard({
  id,
  name,
  description,
  capacity,
  location,
  isAvailable,
  onReserve,
}: {
  id: string
  name: string
  description: string
  capacity: number
  location: string
  isAvailable: boolean
  onReserve: (roomId: string) => void
}) {
  return (
    <Card
      className="border-2 overflow-hidden hover:shadow-lg transition-shadow"
      style={{ borderColor: "var(--border)" }}
    >
      <CardHeader style={{ backgroundColor: "var(--primary-light)" }}>
        <CardTitle className="text-lg" style={{ color: "var(--primary)" }}>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <p className="text-sm">{description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p style={{ color: "var(--secondary)" }} className="font-semibold">
                Capacidad
              </p>
              <p className="font-medium">{capacity} personas</p>
            </div>
            <div>
              <p style={{ color: "var(--secondary)" }} className="font-semibold">
                Ubicación
              </p>
              <p className="font-medium">{location}</p>
            </div>
          </div>
          <Button
            onClick={() => onReserve(id)}
            disabled={!isAvailable}
            className="w-full text-white font-semibold mt-4"
            style={{
              backgroundColor: isAvailable ? "var(--primary)" : "#999999",
            }}
          >
            {isAvailable ? "Reservar" : "No Disponible"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MaterialCard({
  id,
  name,
  description,
  category,
  quantityAvailable,
  isAvailable,
  onAddToCart,
}: {
  id: string
  name: string
  description: string
  category: string
  quantityAvailable: number
  isAvailable: boolean
  onAddToCart: (materialId: string, quantity: number) => void
}) {
  const [quantity, setQuantity] = useState("1")

  const handleAdd = () => {
    const qty = Number.parseInt(quantity) || 1
    if (qty > 0 && qty <= quantityAvailable) {
      onAddToCart(id, qty)
      setQuantity("1")
    }
  }

  return (
    <Card
      className="border-2 overflow-hidden hover:shadow-lg transition-shadow"
      style={{ borderColor: "var(--border)" }}
    >
      <CardHeader style={{ backgroundColor: "var(--secondary-light)" }}>
        <CardTitle className="text-lg" style={{ color: "var(--primary)" }}>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <p className="text-sm">{description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p style={{ color: "var(--secondary)" }} className="font-semibold">
                Categoría
              </p>
              <p className="font-medium">{category}</p>
            </div>
            <div>
              <p style={{ color: "var(--secondary)" }} className="font-semibold">
                Disponibles
              </p>
              <p className="font-medium text-green-600">{quantityAvailable}</p>
            </div>
          </div>
          <div className="pt-2 border-t-2 flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <Input
              type="number"
              min="1"
              max={quantityAvailable}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-16 border-2"
              style={{ borderColor: "var(--border)" }}
              disabled={!isAvailable}
            />
            <Button
              onClick={handleAdd}
              disabled={!isAvailable || quantityAvailable === 0}
              className="flex-1 text-white font-semibold"
              style={{
                backgroundColor: isAvailable && quantityAvailable > 0 ? "var(--accent)" : "#999999",
              }}
            >
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [userRole, setUserRole] = useState<string>("")
  const [rooms, setRooms] = useState<Room[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"rooms" | "materials">("rooms")
  const [error, setError] = useState<string | null>(null)
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
  const [showCreateMaterialModal, setShowCreateMaterialModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[v0] Verificando usuario autenticado...")
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("[v0] Error al obtener usuario:", userError)
          throw userError
        }

        if (!user) {
          console.log("[v0] No hay usuario autenticado, redirigiendo a login")
          router.push("/auth/login")
          return
        }

        console.log("[v0] Usuario autenticado:", user.email)
        setUser(user)

        console.log("[v0] Consultando perfil del usuario...")
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("[v0] Error al consultar perfil:", profileError)
          throw new Error(`Error al cargar perfil: ${profileError.message}`)
        }

        if (profile) {
          console.log("[v0] Perfil encontrado, rol:", profile.role)
          setUserRole(profile.role)
        } else {
          console.warn("[v0] No se encontró perfil para el usuario")
        }

        console.log("[v0] Cargando salas y materiales...")
        const [roomsResult, materialsResult] = await Promise.all([
          supabase.from("sports_rooms").select("*").eq("is_available", true),
          supabase.from("sports_materials").select("*").eq("is_available", true),
        ])

        if (roomsResult.error) {
          console.error("[v0] Error al cargar salas:", roomsResult.error)
        } else {
          console.log("[v0] Salas cargadas:", roomsResult.data?.length)
          setRooms(roomsResult.data || [])
        }

        if (materialsResult.error) {
          console.error("[v0] Error al cargar materiales:", materialsResult.error)
        } else {
          console.log("[v0] Materiales cargados:", materialsResult.data?.length)
          setMaterials(materialsResult.data || [])
        }
      } catch (error) {
        console.error("[v0] Error en fetchData:", error)
        setError(error instanceof Error ? error.message : "Error al cargar datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleReserveRoom = (roomId: string) => {
    const cart = JSON.parse(localStorage.getItem("roomCart") || "[]")
    if (!cart.includes(roomId)) {
      cart.push(roomId)
      localStorage.setItem("roomCart", JSON.stringify(cart))
      alert("Sala agregada al carrito")
    } else {
      alert("Esta sala ya está en tu carrito")
    }
  }

  const handleAddMaterialToCart = (materialId: string, quantity: number) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}")
    cart[materialId] = (cart[materialId] || 0) + quantity
    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Material agregado al carrito")
  }

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    console.log("[v0] Intentando crear sala...")
    try {
      const roomData = {
        name: formData.get("name") as string,
        capacity: Number(formData.get("capacity")),
        location: formData.get("location") as string,
        description: formData.get("description") as string,
        hourly_rate: 0,
        is_available: true,
      }

      console.log("[v0] Datos de la sala:", roomData)

      const { data, error } = await supabase.from("sports_rooms").insert(roomData).select()

      if (error) {
        console.error("[v0] Error de Supabase completo:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        throw new Error(`Error de base de datos: ${error.message}. ${error.hint || "Verifica las políticas RLS."}`)
      }

      console.log("[v0] Sala creada exitosamente:", data)
      alert("Sala creada exitosamente")
      setShowCreateRoomModal(false)

      const { data: roomsData } = await supabase.from("sports_rooms").select("*").eq("is_available", true)
      if (roomsData) setRooms(roomsData)
    } catch (error) {
      console.error("[v0] Error al crear sala:", error)
      alert(`Error al crear sala: ${error instanceof Error ? error.message : "Error desconocido"}`)
    }
  }

  const handleCreateMaterial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const quantity = Number(formData.get("quantity"))

    console.log("[v0] Intentando crear material...")
    try {
      const materialData = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        quantity_total: quantity,
        quantity_available: quantity,
        description: formData.get("description") as string,
        is_available: true,
      }

      console.log("[v0] Datos del material:", materialData)

      const { data, error } = await supabase.from("sports_materials").insert(materialData).select()

      if (error) {
        console.error("[v0] Error de Supabase completo:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        throw new Error(`Error de base de datos: ${error.message}. ${error.hint || "Verifica las políticas RLS."}`)
      }

      console.log("[v0] Material creado exitosamente:", data)
      alert("Material creado exitosamente")
      setShowCreateMaterialModal(false)

      const { data: materialsData } = await supabase.from("sports_materials").select("*").eq("is_available", true)
      if (materialsData) setMaterials(materialsData)
    } catch (error) {
      console.error("[v0] Error al crear material:", error)
      alert(`Error al crear material: ${error instanceof Error ? error.message : "Error desconocido"}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Card className="max-w-md border-2" style={{ borderColor: "var(--border)" }}>
          <CardHeader>
            <CardTitle className="text-red-600">Error al cargar dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Volver al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      {user && <Header userEmail={user.email || ""} userRole={userRole} />}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--primary)" }}>
            Bienvenido a Reserva de Salas Deportivas
          </h2>
          <p className="text-lg" style={{ color: "var(--foreground)" }}>
            Reserva salas y materiales deportivos de forma fácil y rápida
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("rooms")}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: activeTab === "rooms" ? "var(--primary)" : "var(--border)",
                color: activeTab === "rooms" ? "white" : "var(--primary)",
              }}
            >
              Salas Deportivas ({rooms.length})
            </button>
            <button
              onClick={() => setActiveTab("materials")}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: activeTab === "materials" ? "var(--primary)" : "var(--border)",
                color: activeTab === "materials" ? "white" : "var(--primary)",
              }}
            >
              Materiales ({materials.length})
            </button>
          </div>

          <div className="flex gap-3">
            {activeTab === "rooms" && (
              <Button
                onClick={() => setShowCreateRoomModal(true)}
                className="text-white font-semibold"
                style={{ backgroundColor: "var(--accent)" }}
              >
                + Crear Nueva Sala
              </Button>
            )}
            {activeTab === "materials" && (
              <Button
                onClick={() => setShowCreateMaterialModal(true)}
                className="text-white font-semibold"
                style={{ backgroundColor: "var(--accent)" }}
              >
                + Crear Nuevo Material
              </Button>
            )}
          </div>
        </div>

        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  description={room.description || ""}
                  capacity={room.capacity}
                  location={room.location}
                  isAvailable={room.is_available}
                  onReserve={handleReserveRoom}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg" style={{ color: "var(--secondary)" }}>
                  No hay salas disponibles en este momento
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "materials" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.length > 0 ? (
              materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  id={material.id}
                  name={material.name}
                  description={material.description || ""}
                  category={material.category}
                  quantityAvailable={material.quantity_available}
                  isAvailable={material.is_available}
                  onAddToCart={handleAddMaterialToCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg" style={{ color: "var(--secondary)" }}>
                  No hay materiales disponibles en este momento
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {showCreateRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg border-2" style={{ borderColor: "var(--border)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--primary)" }}>Crear Nueva Sala Deportiva</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Nombre de la Sala *
                  </label>
                  <Input
                    name="name"
                    required
                    placeholder="Ej: Cancha de Fútbol 1"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Capacidad (personas) *
                  </label>
                  <Input
                    name="capacity"
                    type="number"
                    required
                    min="1"
                    placeholder="Ej: 10"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Ubicación *
                  </label>
                  <Input
                    name="location"
                    required
                    placeholder="Ej: Edificio A - Piso 2"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Descripción
                  </label>
                  <Input
                    name="description"
                    placeholder="Descripción de la sala"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowCreateRoomModal(false)}
                    className="flex-1 font-semibold"
                    style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 text-white font-semibold"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Crear Sala
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showCreateMaterialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg border-2" style={{ borderColor: "var(--border)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--primary)" }}>Crear Nuevo Material Deportivo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMaterial} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Nombre del Material *
                  </label>
                  <Input
                    name="name"
                    required
                    placeholder="Ej: Balón de Fútbol"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Categoría *
                  </label>
                  <Input
                    name="category"
                    required
                    placeholder="Ej: Balones, Raquetas, Redes"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Cantidad Total *
                  </label>
                  <Input
                    name="quantity"
                    type="number"
                    required
                    min="1"
                    placeholder="Ej: 10"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    Descripción
                  </label>
                  <Input
                    name="description"
                    placeholder="Descripción breve del material"
                    className="border-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowCreateMaterialModal(false)}
                    className="flex-1 border-2"
                    variant="outline"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 text-white font-semibold"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Crear Material
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
