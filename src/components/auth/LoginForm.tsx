"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginSchema } from "@/lib/auth/auth.schemas";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
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
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const initialState = {
    error: null,
    success: false,
  };

  async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const validatedData = loginSchema.parse({ email, password });

      const result = await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (result?.error) {
        return { error: "Credenciales incorrectas", success: false };
      }

      router.push("/perfil");
      return { error: null, success: true };
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
    <Card size="3" style={{ maxWidth: "400px", width: "100%" }}>
      <Heading as="h2" size="5" align="center" mb="4">
        Iniciar sesión
      </Heading>

      {justRegistered && (
        <Callout.Root color="green" mb="4">
          <Callout.Text>
            Registro exitoso. Ahora puedes iniciar sesión.
          </Callout.Text>
        </Callout.Root>
      )}

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

          <Flex justify="end">
            <Link href="/auth/recuperar-contrasena" size="1">
              ¿Olvidaste tu contraseña?
            </Link>
          </Flex>

          <SubmitButton />

          <Flex justify="center" mt="4">
            <Text size="2">
              ¿No tienes una cuenta?{" "}
              <Link href="/auth/register">Regístrate</Link>
            </Text>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
}
