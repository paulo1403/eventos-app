import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/lib/auth/auth.service";
import { auth } from "@/lib/auth/auth";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";

// Asegúrate de instalar la dependencia uuid si no lo has hecho:
// npm install uuid @types/uuid

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await req.formData();
    const nombre = formData.get("nombre") as string;

    if (!nombre || nombre.trim().length === 0) {
      return NextResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    // Datos a actualizar
    const updateData: { nombre: string; imagenPerfil?: string } = {
      nombre: nombre.trim(),
    };

    // Verificar si hay imagen para procesar
    const file = formData.get("imagenPerfil") as File | null;
    if (file) {
      // Validar el archivo
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "El archivo debe ser una imagen" },
          { status: 400 }
        );
      }

      // Limitar el tamaño del archivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "La imagen debe ser menor a 5MB" },
          { status: 400 }
        );
      }

      // Crear directorio si no existe
      const uploadDir = path.join(process.cwd(), "public/uploads/users");
      await mkdir(uploadDir, { recursive: true });

      // Generar nombre único para el archivo
      const fileExtension = file.name.split(".").pop();
      const uniqueFilename = `${userId}-${uuidv4()}.${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Leer y escribir el archivo
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      // Ruta relativa para almacenar en la base de datos
      updateData.imagenPerfil = `/uploads/users/${uniqueFilename}`;
    }

    // Actualizar el usuario en la base de datos
    await updateUser(userId, updateData);

    return NextResponse.json({ message: "Perfil actualizado exitosamente" });
  } catch (error: any) {
    console.error("Error al actualizar el perfil:", error);
    return NextResponse.json(
      { message: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}
