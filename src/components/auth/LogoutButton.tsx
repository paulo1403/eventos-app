"use client";

import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="btn btn-error w-full"
    >
      <LogOutIcon size={16} /> Cerrar Sesión
    </button>
  );
}
