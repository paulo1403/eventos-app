import { NextResponse } from "next/server";
import {
  createResetPasswordToken,
  getUserByEmail,
} from "@/lib/auth/auth.service";
import { z } from "zod";
import nodemailer from "nodemailer";

// Esquema de validación para el correo electrónico
const forgotPasswordSchema = z.object({
  email: z.string().email("Por favor ingresa un correo electrónico válido"),
});

// Configurar transporte de correo (para desarrollo)
// En producción, deberías usar un servicio real como SendGrid, Amazon SES, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER || "smtp.ethereal.email",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "test@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar el correo electrónico
    const validatedData = forgotPasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Correo electrónico inválido" },
        { status: 400 }
      );
    }

    const { email } = validatedData.data;

    // Verificar si el usuario existe
    const user = await getUserByEmail(email);

    // Por seguridad, no revelar si el correo existe o no
    if (!user) {
      // Simulamos el tiempo de proceso para evitar timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Respuesta genérica para no revelar información
      return NextResponse.json(
        {
          message:
            "Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña",
        },
        { status: 200 }
      );
    }

    // Crear token de restablecimiento
    const resetData = await createResetPasswordToken(email);

    if (!resetData) {
      return NextResponse.json(
        { message: "Error al generar el token de restablecimiento" },
        { status: 500 }
      );
    }

    // URL base de la aplicación (ajustar según el entorno)
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // URL de restablecimiento con el token
    const resetUrl = `${appBaseUrl}/auth/reset-password?token=${
      resetData.token
    }&email=${encodeURIComponent(email)}`;

    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Eventos App" <noreply@eventosapp.com>',
      to: email,
      subject: "Restablece tu contraseña - Eventos App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Restablece tu contraseña</h2>
          <p>Has solicitado restablecer tu contraseña en Eventos App.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
          <p>Saludos,<br>El equipo de Eventos App</p>
        </div>
      `,
    };

    try {
      // Enviar correo (desactivado en desarrollo para evitar problemas)
      // En producción, elimina esta condición y configura correctamente el servicio de correo
      if (process.env.NODE_ENV === "production") {
        await transporter.sendMail(mailOptions);
      } else {
        // En desarrollo, solo imprimimos el enlace en la consola
        console.log("Enlace de restablecimiento:", resetUrl);
      }

      return NextResponse.json(
        {
          message:
            "Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña",
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Error al enviar el correo:", emailError);
      return NextResponse.json(
        { message: "Error al enviar el correo de restablecimiento" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error en el proceso de recuperación de contraseña:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
