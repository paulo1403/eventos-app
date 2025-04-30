import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function getUserByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return prisma.usuario.findUnique({
    where: { id },
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
