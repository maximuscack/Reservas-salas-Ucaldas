import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { reservationId, type } = await request.json()

    if (!reservationId || !type) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    let reminderDetails = ""
    let userEmail = ""

    if (type === "room") {
      const { data: reservation } = await supabase
        .from("room_reservations")
        .select("*, sports_rooms(name), profiles(email)")
        .eq("id", reservationId)
        .single()

      if (reservation) {
        userEmail = reservation.profiles?.email || ""
        const startTime = new Date(reservation.start_time)
        const now = new Date()
        const hoursUntil = Math.round((startTime.getTime() - now.getTime()) / (1000 * 60 * 60))

        reminderDetails = `
        <h3>Recordatorio: Tu Reserva de Sala está próxima</h3>
        <p><strong>Sala:</strong> ${reservation.sports_rooms?.name}</p>
        <p><strong>Próxima en:</strong> ${hoursUntil} horas</p>
        <p><strong>Hora de inicio:</strong> ${startTime.toLocaleString()}</p>
        <p>Por favor, asegúrate de llegar a tiempo.</p>
        `
      }
    } else {
      const { data: reservation } = await supabase
        .from("material_reservations")
        .select("*, sports_materials(name), profiles(email)")
        .eq("id", reservationId)
        .single()

      if (reservation) {
        userEmail = reservation.profiles?.email || ""
        reminderDetails = `
        <h3>Recordatorio: Tu Reserva de Material</h3>
        <p><strong>Material:</strong> ${reservation.sports_materials?.name}</p>
        <p><strong>Cantidad:</strong> ${reservation.quantity}</p>
        <p><strong>Fecha de reserva:</strong> ${new Date(reservation.reservation_date).toLocaleDateString()}</p>
        <p>Por favor, recuerda recoger el material en la fecha y hora asignadas.</p>
        `
      }
    }

    console.log(`Email recordatorio enviado a ${userEmail}:\n${reminderDetails}`)

    // Marcar como enviado en la base de datos
    const { data: reminder } = await supabase
      .from("reservation_reminders")
      .select("*")
      .eq(type === "room" ? "reservation_id" : "material_reservation_id", reservationId)
      .single()

    if (reminder) {
      await supabase.from("reservation_reminders").update({ is_sent: true }).eq("id", reminder.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
