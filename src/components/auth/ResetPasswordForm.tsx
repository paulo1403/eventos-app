"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

// Esquema de validación para el formulario
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Obtener token y email de los parámetros de la URL
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (!urlToken || !urlEmail) {
      setError(
        "Enlace de restablecimiento inválido. Por favor solicita un nuevo enlace."
      );
      return;
    }

    setToken(urlToken);
    setEmail(urlEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validar contraseñas con Zod
      const validatedData = resetPasswordSchema.parse({
        password,
        confirmPassword,
      });

      // Enviar solicitud al endpoint de restablecimiento
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          password: validatedData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Limpiar campos
        setPassword("");
        setConfirmPassword("");

        // Redirigir después de 3 segundos
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setError(
          data.message || "Ha ocurrido un error al restablecer la contraseña."
        );
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(
          "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="bg-base-100 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Restablecer contraseña
        </h2>
        <div className="bg-error/20 text-error p-4 rounded-lg mb-6">
          <p>{error || "Enlace de restablecimiento inválido."}</p>
        </div>
        <div className="text-center mt-4">
          <Link
            href="/auth/forgot-password"
            className="link link-hover text-primary"
          >
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Restablecer contraseña
      </h2>

      {success ? (
        <div className="bg-success/20 text-success p-4 rounded-lg mb-6">
          <p>
            ¡Tu contraseña ha sido restablecida con éxito! Serás redirigido a la
            página de inicio de sesión en unos segundos.
          </p>
          <div className="text-center mt-6">
            <Link href="/auth/login" className="link link-hover text-primary">
              Ir a Iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="input input-bordered w-full"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
              className="input input-bordered w-full"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-error/20 text-error p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Restablecer contraseña"}
          </button>
        </form>
      )}
    </div>
  );
}
