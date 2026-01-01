import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma Client with proper configuration
const prismaClientOptions: any = {}

// Add accelerateUrl if available
if (process.env.PRISMA_ACCELERATE_URL) {
  prismaClientOptions.accelerateUrl = process.env.PRISMA_ACCELERATE_URL
}

// Add database URL for direct connection if accelerateUrl is not available
if (!process.env.PRISMA_ACCELERATE_URL && process.env.POSTGRES_PRISMA_URL) {
  prismaClientOptions.datasourceUrl = process.env.POSTGRES_PRISMA_URL
}

// Create Prisma Client instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma