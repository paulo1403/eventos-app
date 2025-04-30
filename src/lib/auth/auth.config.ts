import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/auth/auth.schemas";
import { getUserByEmail, verifyPassword } from "@/lib/auth/auth.service";

export const authConfig: NextAuthConfig = {
  secret:
    process.env.NEXTAUTH_SECRET || "este-es-un-secret-temporal-para-desarrollo",
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/perfil") ||
        nextUrl.pathname.startsWith("/eventos/crear");
      if (isProtected) {
        if (isLoggedIn) return true;
        return false;
      } else if (
        isLoggedIn &&
        (nextUrl.pathname === "/auth/login" ||
          nextUrl.pathname === "/auth/register")
      ) {
        return Response.redirect(new URL("/perfil", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nombre = user.nombre;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.nombre = token.nombre as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Validar los datos con Zod
        const validatedCredentials = loginSchema.safeParse(credentials);
        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;

        try {
          const user = await getUserByEmail(email);
          if (!user) return null;

          const passwordMatch = await verifyPassword(password, user.password);
          if (!passwordMatch) return null;

          return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
          };
        } catch (error) {
          console.error("Error durante la autenticación:", error);
          return null;
        }
      },
    }),
  ],
};
