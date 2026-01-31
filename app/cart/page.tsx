"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CartMaterial {
  id: string
  name: string
  quantity: number
}

interface CartRoom {
  id: string
  name: string
  location: string
  capacity: number
}

function Header({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

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
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {userEmail}
            </p>
            <p className="text-xs" style={{ color: "var(--secondary)" }}>
              Usuario
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

export default function CartPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [cartMaterials, setCartMaterials] = useState<CartMaterial[]>([])
  const [cartRooms, setCartRooms] = useState<CartRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [reservationDate, setReservationDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user as any)

        const cart = JSON.parse(localStorage.getItem("cart") || "{}")
        const materialIds = Object.keys(cart)

        if (materialIds.length > 0) {
          const { data: materials } = await supabase.from("sports_materials").select("id, name").in("id", materialIds)

          if (materials) {
            const cartWithDetails = materials.map((m) => ({
              id: m.id,
              name: m.name,
              quantity: cart[m.id],
            }))
            setCartMaterials(cartWithDetails)
          }
        }

        const roomCart = JSON.parse(localStorage.getItem("roomCart") || "[]")
        if (roomCart.length > 0) {
          const { data: rooms } = await supabase
            .from("sports_rooms")
            .select("id, name, location, capacity")
            .in("id", roomCart)
          if (rooms) {
            setCartRooms(rooms)
          }
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRemoveMaterial = (materialId: string) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}")
    delete cart[materialId]
    localStorage.setItem("cart", JSON.stringify(cart))
    setCartMaterials(cartMaterials.filter((item) => item.id !== materialId))
  }

  const handleRemoveRoom = (roomId: string) => {
    const roomCart = JSON.parse(localStorage.getItem("roomCart") || "[]")
    const updatedCart = roomCart.filter((id: string) => id !== roomId)
    localStorage.setItem("roomCart", JSON.stringify(updatedCart))
    setCartRooms(cartRooms.filter((room) => room.id !== roomId))
  }

  const handleUpdateQuantity = (materialId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveMaterial(materialId)
      return
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "{}")
    cart[materialId] = newQuantity
    localStorage.setItem("cart", JSON.stringify(cart))
    setCartMaterials(cartMaterials.map((item) => (item.id === materialId ? { ...item, quantity: newQuantity } : item)))
  }

  const handleCheckout = async () => {
    if (!reservationDate) {
      alert("Por favor, selecciona una fecha")
      return
    }

    if (cartRooms.length > 0 && (!startTime || !endTime)) {
      alert("Por favor, selecciona hora de inicio y fin para las salas")
      return
    }

    if (!user) {
      alert("Usuario no autenticado")
      return
    }

    setIsSubmitting(true)
    try {
      for (const room of cartRooms) {
        const startDateTime = `${reservationDate}T${startTime}:00`
        const endDateTime = `${reservationDate}T${endTime}:00`

        await supabase.from("room_reservations").insert({
          user_id: user.id,
          room_id: room.id,
          start_time: startDateTime,
          end_time: endDateTime,
          status: "pending",
        })
      }

      for (const item of cartMaterials) {
        await supabase.from("material_reservations").insert({
          user_id: user.id,
          material_id: item.id,
          quantity: item.quantity,
          reservation_date: reservationDate,
          status: "pending",
        })
      }

      localStorage.removeItem("cart")
      localStorage.removeItem("roomCart")
      alert("¡Reserva creada exitosamente! Espera confirmación del administrador.")
      router.push("/reservations")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear la reserva")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p>Cargando...</p>
      </div>
    )
  }

  const hasItems = cartRooms.length > 0 || cartMaterials.length > 0

  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      {user && <Header userEmail={user.email} />}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--primary)" }}>
          Mi Carrito
        </h2>

        {!hasItems ? (
          <Card className="border-2 text-center py-12" style={{ borderColor: "var(--border)" }}>
            <p className="text-lg" style={{ color: "var(--secondary)" }}>
              Tu carrito está vacío
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="mt-4 text-white font-semibold"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Volver al Catálogo
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {cartRooms.length > 0 && (
                <Card className="border-2" style={{ borderColor: "var(--border)" }}>
                  <CardHeader style={{ backgroundColor: "var(--primary-light)" }}>
                    <CardTitle style={{ color: "var(--primary)" }}>Salas en tu carrito ({cartRooms.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {cartRooms.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-4 border-2 rounded-lg"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div>
                          <h3 className="font-semibold" style={{ color: "var(--primary)" }}>
                            {room.name}
                          </h3>
                          <p className="text-sm" style={{ color: "var(--secondary)" }}>
                            Ubicación: {room.location} | Capacidad: {room.capacity} personas
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRemoveRoom(room.id)}
                          className="text-white"
                          style={{ backgroundColor: "#F44336" }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {cartMaterials.length > 0 && (
                <Card className="border-2" style={{ borderColor: "var(--border)" }}>
                  <CardHeader style={{ backgroundColor: "var(--secondary-light)" }}>
                    <CardTitle style={{ color: "var(--primary)" }}>
                      Materiales en tu carrito ({cartMaterials.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {cartMaterials.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border-2 rounded-lg"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div>
                          <h3 className="font-semibold" style={{ color: "var(--primary)" }}>
                            {item.name}
                          </h3>
                          <p className="text-sm" style={{ color: "var(--secondary)" }}>
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-20 border-2"
                            style={{ borderColor: "var(--border)" }}
                          />
                          <Button
                            onClick={() => handleRemoveMaterial(item.id)}
                            className="text-white"
                            style={{ backgroundColor: "#F44336" }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="border-2 sticky top-4" style={{ borderColor: "var(--border)" }}>
                <CardHeader style={{ backgroundColor: "var(--accent-light)" }}>
                  <CardTitle style={{ color: "var(--primary)" }}>Resumen de Reserva</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" style={{ color: "var(--primary)" }} className="font-semibold">
                      Fecha de Reserva
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      className="border-2"
                      style={{ borderColor: "var(--border)" }}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {cartRooms.length > 0 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="start-time" style={{ color: "var(--primary)" }} className="font-semibold">
                          Hora de Inicio
                        </Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="border-2"
                          style={{ borderColor: "var(--border)" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time" style={{ color: "var(--primary)" }} className="font-semibold">
                          Hora de Fin
                        </Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="border-2"
                          style={{ borderColor: "var(--border)" }}
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t-2" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm" style={{ color: "var(--secondary)" }}>
                      Salas: {cartRooms.length}
                    </p>
                    <p className="text-sm" style={{ color: "var(--secondary)" }}>
                      Materiales: {cartMaterials.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isSubmitting || !reservationDate || (cartRooms.length > 0 && (!startTime || !endTime))}
                    className="w-full text-white font-semibold py-2"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
                  </Button>

                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full font-semibold py-2"
                    style={{ backgroundColor: "var(--border)", color: "var(--primary)" }}
                  >
                    Seguir Agregando
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
