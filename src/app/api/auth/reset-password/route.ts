import { NextResponse } from "next/server";
import { validateResetToken, resetPassword } from "@/lib/auth/auth.service";
import { z } from "zod";

// Esquema de validación para el restablecimiento de contraseña
const resetPasswordSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  token: z.string().min(1, "Token no proporcionado"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número"
    ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos
    const validatedData = resetPasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: "Datos inválidos",
          errors: validatedData.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, token, password } = validatedData.data;

    // Validar token
    const isValidToken = await validateResetToken(token, email);
    if (!isValidToken) {
      return NextResponse.json(
        {
          message:
            "Token inválido o expirado. Por favor, solicita un nuevo enlace de restablecimiento.",
        },
        { status: 400 }
      );
    }

    // Restablecer la contraseña
    const success = await resetPassword(email, token, password);

    if (!success) {
      return NextResponse.json(
        { message: "Error al restablecer la contraseña" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Contraseña restablecida con éxito" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
