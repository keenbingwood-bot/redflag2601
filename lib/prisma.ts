import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma Client with Accelerate URL
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma