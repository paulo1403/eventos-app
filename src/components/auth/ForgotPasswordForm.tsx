"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";

// Esquema de validación para el formulario
const forgotPasswordSchema = z.object({
  email: z.string().email("Por favor ingresa un correo electrónico válido"),
});

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Validar email con Zod
      const validatedData = forgotPasswordSchema.parse({ email });

      // Enviar solicitud al endpoint de recuperación
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: validatedData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.message || "Ha ocurrido un error. Inténtalo de nuevo.");
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

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        ¿Olvidaste tu contraseña?
      </h2>

      {success ? (
        <div className="alert alert-success flex flex-col items-center">
          <p>
            Si tu dirección de correo electrónico está registrada, recibirás
            instrucciones para restablecer tu contraseña. Revisa tu bandeja de
            entrada (y la carpeta de spam si es necesario).
          </p>
          <div className="text-center mt-6">
            <Link href="/auth/login" className="link link-hover text-primary">
              Volver a Iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Correo electrónico</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="input input-bordered w-full"
              disabled={isSubmitting}
            />
          </div>

          {error && <div className="alert alert-error text-sm">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/auth/login"
              className="link link-hover text-primary text-sm"
            >
              Volver a Iniciar sesión
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
