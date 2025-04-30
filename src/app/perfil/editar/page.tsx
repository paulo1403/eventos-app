"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserById } from "@/lib/auth/auth.service";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  imagenPerfil?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    file: null as File | null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el usuario de la sesión desde API
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          throw new Error("No se pudo obtener la información del usuario");
        }

        const userData = await response.json();
        setUser(userData);
        setFormData((prev) => ({ ...prev, nombre: userData.nombre }));
        if (userData.imagenPerfil) {
          setImagePreview(userData.imagenPerfil);
        }
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el perfil. Por favor, intente nuevamente.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, file }));

      // Crear vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);

      if (formData.file) {
        data.append("imagenPerfil", formData.file);
      }

      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/perfil");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-6 min-h-[calc(100dvh)] flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mx-auto max-w-4xl p-6 min-h-[calc(100dvh)] flex flex-col justify-center">
        <div className="alert alert-error">
          <AlertCircleIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>{error}</span>
          <div>
            <Link href="/perfil" className="btn btn-outline">
              Volver a Mi Perfil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 min-h-[calc(100dvh)] flex flex-col justify-center">
      <div className="bg-base-100 shadow-md rounded-lg p-6 border border-base-200">
        <h1 className="text-2xl font-bold mb-6 text-base-content">
          Editar Perfil
        </h1>

        {success && (
          <div className="alert alert-success mb-6">
            <span>¡Perfil actualizado exitosamente! Redirigiendo...</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircleIcon className="stroke-current shrink-0 h-6 w-6" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sección para la imagen de perfil */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Vista previa"
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center text-4xl">
                    {formData.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text text-base-content">
                    Imagen de perfil
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/70">
                    Formatos: JPG, PNG, GIF. Máx 5MB
                  </span>
                </label>
              </div>
            </div>

            {/* Sección para los datos del perfil */}
            <div className="flex-1 space-y-4">
              <div className="form-control">
                <label htmlFor="nombre" className="label">
                  <span className="label-text text-base-content">Nombre</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text text-base-content">
                    Correo electrónico
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input input-bordered w-full"
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/70">
                    El correo electrónico no se puede cambiar
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link href="/perfil" className="btn btn-outline">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
