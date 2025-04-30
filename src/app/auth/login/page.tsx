import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Plataforma de Eventos",
  description: "Inicia sesión para acceder a tu cuenta de eventos",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
