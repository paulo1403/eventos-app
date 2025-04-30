"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/lib/auth/auth.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Verificar si viene de un registro exitoso
  const justRegistered = searchParams.get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales incorrectas");
        return;
      }

      // Redirigir al perfil del usuario
      window.location.href = "/perfil";
    } catch (err: any) {
      setError("Ha ocurrido un error durante el inicio de sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Iniciar sesión
      </h2>

      {justRegistered && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          Registro exitoso. Ahora puedes iniciar sesión.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          placeholder="Tu contraseña"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end">
          <a
            href="/auth/recuperar-contrasena"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        ¿No tienes una cuenta?{" "}
        <a
          href="/auth/register"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Regístrate
        </a>
      </p>
    </div>
  );
}
