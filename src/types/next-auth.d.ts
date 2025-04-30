import "next-auth";
import { DefaultSession } from "next-auth";

// Extender los tipos de NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    nombre: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      nombre: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nombre: string;
  }
}
