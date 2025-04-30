// Este archivo contendrá componentes específicos para la autenticación

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/lib/auth/auth.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al registrar usuario");
      }

      // Redirigir al login si el registro es exitoso
      window.location.href = "/auth/login?registered=true";
    } catch (err: any) {
      setError(err.message || "Ha ocurrido un error durante el registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Crear una cuenta
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          error={errors.nombre?.message}
          {...register("nombre")}
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="Confirma tu contraseña"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <a href="/auth/login" className="text-indigo-600 hover:text-indigo-800">
          Inicia sesión
        </a>
      </p>
    </div>
  );
}
