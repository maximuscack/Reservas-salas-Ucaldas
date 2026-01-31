import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { reservationId, type, userEmail, userName } = await request.json()

    if (!reservationId || !type || !userEmail) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    // Obtener detalles de la reserva
    let reservationDetails = ""
    if (type === "room") {
      const { data: reservation } = await supabase
        .from("room_reservations")
        .select("*, sports_rooms(name, location)")
        .eq("id", reservationId)
        .single()

      if (reservation) {
        reservationDetails = `
        <h3>Detalles de la Reserva de Sala</h3>
        <p><strong>Sala:</strong> ${reservation.sports_rooms?.name || "Desconocida"}</p>
        <p><strong>Ubicación:</strong> ${reservation.sports_rooms?.location || "N/A"}</p>
        <p><strong>Desde:</strong> ${new Date(reservation.start_time).toLocaleString()}</p>
        <p><strong>Hasta:</strong> ${new Date(reservation.end_time).toLocaleString()}</p>
        <p><strong>Estado:</strong> ${reservation.status === "confirmed" ? "Confirmada" : "Pendiente de Aprobación"}</p>
        `
      }
    } else {
      const { data: reservation } = await supabase
        .from("material_reservations")
        .select("*, sports_materials(name, category)")
        .eq("id", reservationId)
        .single()

      if (reservation) {
        reservationDetails = `
        <h3>Detalles de la Reserva de Material</h3>
        <p><strong>Material:</strong> ${reservation.sports_materials?.name || "Desconocido"}</p>
        <p><strong>Categoría:</strong> ${reservation.sports_materials?.category || "N/A"}</p>
        <p><strong>Cantidad:</strong> ${reservation.quantity}</p>
        <p><strong>Fecha:</strong> ${new Date(reservation.reservation_date).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> ${reservation.status === "confirmed" ? "Confirmada" : "Pendiente de Aprobación"}</p>
        `
      }
    }

    // Enviar correo (nota: en producción, usar un servicio como SendGrid, AWS SES, etc.)
    // Por ahora, solo registramos en la base de datos
    console.log(`Email enviado a ${userEmail}:\n${reservationDetails}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
