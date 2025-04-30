import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getUserById, getUserEventosAsistidos } from "@/lib/auth/auth.service";
import Link from "next/link";
import { Suspense } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  InfoIcon,
  AlertCircleIcon,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function ProfilePage() {
  dayjs.locale("es");

  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  try {
    const userDetails = await getUserById(userId);
    const eventosAsistidos = await getUserEventosAsistidos(userId);

    if (!userDetails) {
      return (
        <div className="container mx-auto max-w-4xl p-6 min-h-[calc(100vh-5rem)] flex flex-col">
          <div className="alert alert-error">
            <span>Error: No se pudo cargar la información del usuario.</span>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto max-w-4xl p-6 min-h-[calc(100dvh)] flex flex-col justify-center">
        <div className="bg-base-100 shadow-md rounded-lg p-6 border border-base-200">
          <h1 className="text-2xl font-bold mb-6 text-base-content">
            Mi Perfil
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center p-4 bg-base-100 rounded-lg border border-base-200">
                {userDetails.imagenPerfil ? (
                  <div className="rounded-full w-24 h-24 overflow-hidden">
                    <img
                      src={userDetails.imagenPerfil}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-primary text-primary-content rounded-full w-24 h-24 flex justify-center items-center">
                    <span className="text-3xl">
                      {userDetails.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-semibold mt-4 text-base-content">
                  {userDetails.nombre}
                </h2>
                <p className="text-sm text-base-content/70">
                  {userDetails.email}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <Link
                  href="/perfil/editar"
                  className="btn btn-primary btn-outline w-full hover:bg-primary hover:text-primary-content"
                >
                  Editar Perfil
                </Link>

                <LogoutButton />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-base-100 p-6 rounded-lg border border-base-200">
                <h2 className="text-xl font-semibold mb-4 text-base-content">
                  Información Personal
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm text-base-content/70">
                      Nombre
                    </label>
                    <p className="font-medium text-base-content">
                      {userDetails.nombre}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-base-content/70">
                      Correo Electrónico
                    </label>
                    <p className="font-medium text-base-content">
                      {userDetails.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-base-content/70">
                      Miembro desde
                    </label>
                    <p className="font-medium text-base-content">
                      {dayjs(userDetails.createdAt).format(
                        "D [de] MMMM [de] YYYY"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-base-content">
                  Eventos a los que asistirás
                </h2>

                <Suspense
                  fallback={
                    <div className="space-y-4">
                      <div className="card bg-base-200 shadow-sm p-4 animate-pulse border border-base-300">
                        <div className="h-6 bg-base-300 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-base-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-base-300 rounded w-2/3"></div>
                        <div className="flex gap-2 mt-3">
                          <div className="h-4 bg-base-300 rounded w-1/4"></div>
                          <div className="h-4 bg-base-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  }
                />
                <div className="space-y-4">
                  {eventosAsistidos && eventosAsistidos.length > 0 ? (
                    eventosAsistidos.map((asistencia) => (
                      <div
                        key={asistencia.id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow border border-base-300"
                      >
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="card-title text-lg text-base-content">
                              <Link
                                href={`/eventos/${asistencia.evento.id}`}
                                className="link link-hover text-primary"
                              >
                                {asistencia.evento.titulo}
                              </Link>
                            </h3>
                            <span className="badge badge-primary">
                              {dayjs(asistencia.registradoEn).format(
                                "DD/MM/YYYY"
                              )}
                            </span>
                          </div>

                          <p className="text-sm text-base-content/80 line-clamp-2 mb-2">
                            {asistencia.evento.descripcion}
                          </p>

                          <div className="flex flex-wrap gap-2 text-xs text-base-content/70">
                            <div className="flex items-center">
                              <CalendarIcon size={14} className="mr-1" />
                              {dayjs(asistencia.evento.fecha).format(
                                "D [de] MMMM [de] YYYY, HH:mm"
                              )}
                            </div>

                            <div className="flex items-center">
                              <MapPinIcon size={14} className="mr-1" />
                              {asistencia.evento.lugar}
                            </div>

                            <div className="flex items-center">
                              <UserIcon size={14} className="mr-1" />
                              {asistencia.evento.organizador.nombre}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="alert bg-base-200 border border-base-300">
                      <div>
                        <InfoIcon className="stroke-info flex-shrink-0 w-6 h-6" />
                        <span className="text-base-content">
                          No tienes eventos programados para asistir.
                        </span>
                      </div>
                      <div className="flex-none">
                        <Link
                          href="/eventos"
                          className="btn btn-primary btn-sm"
                        >
                          Explorar Eventos
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-base-content">
                  Mis Eventos
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div className="alert bg-base-200 border border-base-300">
                    <div>
                      <InfoIcon className="stroke-info flex-shrink-0 w-6 h-6" />
                      <span className="text-base-content">
                        No tienes eventos creados aún.
                      </span>
                    </div>
                    <div className="flex-none">
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
      </div>
    );
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    return (
      <div className="container mx-auto max-w-4xl p-6 min-h-[calc(100vh-5rem)] flex flex-col">
        <div className="alert alert-error">
          <AlertCircleIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>
            Ha ocurrido un error al cargar tu perfil. Por favor, intenta
            nuevamente más tarde.
          </span>
        </div>
      </div>
    );
  }
}
