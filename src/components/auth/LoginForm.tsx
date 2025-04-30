"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginSchema } from "@/lib/auth/auth.schemas";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const [showPassword, setShowPassword] = useState(false);

  const initialState = {
    error: null,
    success: false,
  };

  async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const validatedData = loginSchema.parse({ email, password });

      try {
        const result = await signIn("credentials", {
          email: validatedData.email,
          password: validatedData.password,
          redirect: false,
        });

        if (result?.error) {
          return { error: "Credenciales incorrectas", success: false };
        }

        if (result?.ok) {
          router.push("/perfil");
          return { error: null, success: true };
        }
      } catch (signInError) {
        console.error("Error during signIn:", signInError);
        return { error: "Error de conexión con el servidor", success: false };
      }

      return { error: "Error al iniciar sesión", success: false };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return {
          error: err.errors[0].message,
          success: false,
          validationErrors: err.errors,
        };
      }

      return {
        error: "Ha ocurrido un error durante el inicio de sesión",
        success: false,
      };
    }
  }

  const [formState, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center mb-4 text-base-content">
          Iniciar sesión
        </h2>

        {justRegistered && (
          <div className="alert alert-success mb-4">
            <span>Registro exitoso. Ahora puedes iniciar sesión.</span>
          </div>
        )}

        {formState.error && (
          <div className="alert alert-error mb-4">
            <span>{formState.error}</span>
          </div>
        )}

        <form action={formAction}>
          <div className="flex flex-col gap-3">
            <div className="form-control">
              <input
                placeholder="Correo electrónico"
                type="email"
                name="email"
                required
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

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm link link-hover text-base-content/80 hover:text-base-content"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <SubmitButton />

            <div className="flex justify-center mt-4">
              <span className="text-sm text-base-content">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/auth/register"
                  className="link link-primary font-medium"
                >
                  Regístrate
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
