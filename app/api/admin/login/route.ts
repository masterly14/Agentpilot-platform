import { NextResponse } from "next/server"
import { createAdminSessionCookie } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD no está configurada en el servidor" },
      { status: 500 }
    )
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
  }

  const response = createAdminSessionCookie()
  if (!response) {
    return NextResponse.json({ error: "No se pudo crear la sesión" }, { status: 500 })
  }

  return response
}
