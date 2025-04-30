import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registro | Plataforma de Eventos",
  description: "Crea una cuenta para gestionar y asistir a eventos",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
