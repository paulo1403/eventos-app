import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth/auth.schemas";
import { createUser, getUserByEmail } from "@/lib/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar los datos del registro
    const validatedData = registerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Datos de registro inválidos" },
        { status: 400 }
      );
    }

    const { nombre, email, password } = validatedData.data;

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Este correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    // Crear el nuevo usuario
    await createUser(nombre, email, password);

    return NextResponse.json(
      { message: "Usuario registrado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { message: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
