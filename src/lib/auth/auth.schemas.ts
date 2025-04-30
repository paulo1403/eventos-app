import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z
      .string()
      .email({ message: "Ingresa un correo electrónico válido" }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, {
        message:
          "La confirmación de contraseña debe tener al menos 6 caracteres",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
