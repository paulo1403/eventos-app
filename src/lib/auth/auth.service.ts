import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Define un tipo extendido que incluya todos los campos y relaciones
interface UsuarioWithRelations {
  id: string;
  nombre: string;
  email: string;
  password: string;
  imagenPerfil?: string; // Campo añadido explícitamente
  createdAt: Date;
  updatedAt: Date;
  asistencia?: any[];
  eventosOrganizados?: any[];
}

export async function getUserByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email },
  });
}

export async function getUserById(
  id: string
): Promise<UsuarioWithRelations | null> {
  return prisma.usuario.findUnique({
    where: { id },
    include: {
      asistencia: {
        include: {
          evento: true,
        },
      },
    },
  });
}

export async function getUserEventosAsistidos(userId: string) {
  return prisma.asistente.findMany({
    where: {
      usuarioId: userId,
    },
    include: {
      evento: {
        include: {
          organizador: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
    orderBy: {
      registradoEn: "desc",
    },
  });
}

export async function createUser(
  nombre: string,
  email: string,
  password: string
) {
  const hashedPassword = await hashPassword(password);

  return prisma.usuario.create({
    data: {
      nombre,
      email,
      password: hashedPassword,
    },
  });
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function updateUser(
  id: string,
  data: { nombre?: string; imagenPerfil?: string }
) {
  return prisma.usuario.update({
    where: { id },
    data,
  });
}
