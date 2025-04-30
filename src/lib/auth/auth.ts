import { authConfig } from "@/lib/auth/auth.config";
import NextAuth from "next-auth";

export const { auth, signIn, signOut } = NextAuth(authConfig);
