import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getUserById } from "@/lib/auth/auth.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      imagenPerfil: user.imagenPerfil,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return NextResponse.json(
      { message: "Error al obtener datos del usuario" },
      { status: 500 }
    );
  }
}
