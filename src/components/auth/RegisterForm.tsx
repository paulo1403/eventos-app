"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerSchema } from "@/lib/auth/auth.schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "Registrando..." : "Registrarse"}
    </button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialState = {
    error: null,
    success: false,
  };

  async function registerAction(prevState: any, formData: FormData) {
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      const validatedData = registerSchema.parse({
        nombre,
        email,
        password,
        confirmPassword,
      });

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: validatedData.nombre,
          email: validatedData.email,
          password: validatedData.password,
          confirmPassword: validatedData.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al registrar usuario");
      }

      router.push("/auth/login?registered=true");
      return { error: null, success: true };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return {
          error: err.errors[0].message,
          success: false,
          validationErrors: err.errors,
        };
      } else if (err instanceof Error) {
        return { error: err.message, success: false };
      }

      return {
        error: "Ha ocurrido un error durante el registro",
        success: false,
      };
    }
  }

  const [formState, formAction] = useActionState(registerAction, initialState);

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center mb-4 text-base-content">
          Crear una cuenta
        </h2>

        {formState.error && (
          <div className="alert alert-error mb-4">
            <span>{formState.error}</span>
          </div>
        )}

        <form action={formAction}>
          <div className="flex flex-col gap-3">
            <div className="form-control">
              <input
                placeholder="Nombre completo"
                type="text"
                name="nombre"
                required
                autoComplete="name"
                className="input input-bordered w-full text-base-content placeholder:text-base-content/60"
              />
              {formState.validationErrors?.find((e) => e.path[0] === "nombre")
                ?.message && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {
                      formState.validationErrors.find(
                        (e) => e.path[0] === "nombre"
                      )?.message
                    }
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <input
                placeholder="Correo electrónico"
                type="email"
                name="email"
                required
                autoComplete="new-email"
                className="input input-bordered w-full text-base-content placeholder:text-base-content/60"
              />
              {formState.validationErrors?.find((e) => e.path[0] === "email")
                ?.message && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {
                      formState.validationErrors.find(
                        (e) => e.path[0] === "email"
                      )?.message
                    }
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <div className="relative">
                <input
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  className="input input-bordered w-full pr-10 text-base-content placeholder:text-base-content/60"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/70 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formState.validationErrors?.find((e) => e.path[0] === "password")
                ?.message && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {
                      formState.validationErrors.find(
                        (e) => e.path[0] === "password"
                      )?.message
                    }
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <div className="relative">
                <input
                  placeholder="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  className="input input-bordered w-full pr-10 text-base-content placeholder:text-base-content/60"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/70 hover:text-base-content"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {formState.validationErrors?.find(
                (e) => e.path[0] === "confirmPassword"
              )?.message && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {
                      formState.validationErrors.find(
                        (e) => e.path[0] === "confirmPassword"
                      )?.message
                    }
                  </span>
                </label>
              )}
            </div>

            <SubmitButton />

            <div className="flex justify-center mt-4">
              <span className="text-sm text-base-content">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="link link-primary font-medium"
                >
                  Inicia sesión
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
