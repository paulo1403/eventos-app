import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/auth/auth.service";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const userId = session.user.id;
  const userDetails = await getUserById(userId);

  if (!userDetails) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="alert alert-error">
          <span>Error: No se pudo cargar la información del usuario.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24">
                  <span className="text-3xl">
                    {userDetails.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-semibold mt-4">
                {userDetails.nombre}
              </h2>
              <p className="text-sm opacity-75">{userDetails.email}</p>
            </div>

            <div className="mt-4">
              <Link
                href="/perfil/editar"
                className="btn btn-outline w-full mb-2"
              >
                Editar Perfil
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-base-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Información Personal
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm opacity-75">Nombre</label>
                  <p className="font-medium">{userDetails.nombre}</p>
                </div>
                <div>
                  <label className="text-sm opacity-75">
                    Correo Electrónico
                  </label>
                  <p className="font-medium">{userDetails.email}</p>
                </div>
                <div>
                  <label className="text-sm opacity-75">Miembro desde</label>
                  <p className="font-medium">
                    {new Date(userDetails.createdAt).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Mis Eventos</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Aquí irían los eventos del usuario */}
                <div className="alert">
                  <span>No tienes eventos registrados aún.</span>
                  <Link
                    href="/eventos/crear"
                    className="btn btn-primary btn-sm"
                  >
                    Crear Evento
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
