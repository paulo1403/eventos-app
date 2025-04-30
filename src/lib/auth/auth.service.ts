import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

interface UsuarioWithRelations {
  id: string;
  nombre: string;
  email: string;
  password: string;
  imagenPerfil?: string;
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

export async function createResetPasswordToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");

  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  const user = await prisma.usuario.update({
    where: { email },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    } as any,
  });

  return user ? { token, email } : null;
}

export async function validateResetToken(token: string, email: string) {
  const user = await prisma.usuario.findFirst({
    where: {
      email,
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    } as any,
  });

  return !!user;
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const isValid = await validateResetToken(token, email);
  if (!isValid) return false;

  const hashedPassword = await hashPassword(newPassword);

  await prisma.usuario.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    } as any,
  });

  return true;
}
