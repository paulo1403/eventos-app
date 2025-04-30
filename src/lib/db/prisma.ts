import { PrismaClient } from "@prisma/client";

// Evitar múltiples instancias de Prisma Client en desarrollo debido a Hot Reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
