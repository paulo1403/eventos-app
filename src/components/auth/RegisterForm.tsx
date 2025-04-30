"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerSchema } from "@/lib/auth/auth.schemas";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  Heading,
  Text,
  TextField,
  Button,
  Flex,
  Link,
  Callout,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { z } from "zod";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="3">
      {pending ? "Registrando..." : "Registrarse"}
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();

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
    <Card size="3" style={{ maxWidth: "400px", width: "100%" }}>
      <Heading as="h2" size="5" align="center" mb="4">
        Crear una cuenta
      </Heading>

      {formState.error && (
        <Callout.Root color="red" mb="4">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{formState.error}</Callout.Text>
        </Callout.Root>
      )}

      <form action={formAction}>
        <Flex direction="column" gap="3">
          <Box>
            <TextField.Root
              placeholder="Nombre completo"
              type="text"
              name="nombre"
              required
            />
            {formState.validationErrors?.find((e) => e.path[0] === "nombre")
              ?.message && (
              <Text size="1" color="red" mt="1">
                {
                  formState.validationErrors.find((e) => e.path[0] === "nombre")
                    ?.message
                }
              </Text>
            )}
          </Box>

          <Box>
            <TextField.Root
              placeholder="Correo electrónico"
              type="email"
              name="email"
              required
            />
            {formState.validationErrors?.find((e) => e.path[0] === "email")
              ?.message && (
              <Text size="1" color="red" mt="1">
                {
                  formState.validationErrors.find((e) => e.path[0] === "email")
                    ?.message
                }
              </Text>
            )}
          </Box>

          <Box>
            <TextField.Root
              placeholder="Contraseña"
              type="password"
              name="password"
              required
            />
            {formState.validationErrors?.find((e) => e.path[0] === "password")
              ?.message && (
              <Text size="1" color="red" mt="1">
                {
                  formState.validationErrors.find(
                    (e) => e.path[0] === "password"
                  )?.message
                }
              </Text>
            )}
          </Box>

          <Box>
            <TextField.Root
              placeholder="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              required
            />
            {formState.validationErrors?.find(
              (e) => e.path[0] === "confirmPassword"
            )?.message && (
              <Text size="1" color="red" mt="1">
                {
                  formState.validationErrors.find(
                    (e) => e.path[0] === "confirmPassword"
                  )?.message
                }
              </Text>
            )}
          </Box>

          <SubmitButton />

          <Flex justify="center" mt="4">
            <Text size="2">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login">Inicia sesión</Link>
            </Text>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
}
