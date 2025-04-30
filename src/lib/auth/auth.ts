import { authConfig } from "@/lib/auth/auth.config";
import NextAuth from "next-auth";

// Initialize NextAuth with complete configuration
const nextAuth = NextAuth(authConfig);

// Export handlers for API routes
export const { handlers } = nextAuth;

// Export auth for server components
export const { auth } = nextAuth;

// Do not export signIn/signOut here - use next-auth/react for client components
