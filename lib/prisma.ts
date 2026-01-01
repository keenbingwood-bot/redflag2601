import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Debug logging for environment variables (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Prisma Config Debug:')
  console.log('PRISMA_ACCELERATE_URL:', process.env.PRISMA_ACCELERATE_URL ? 'Set' : 'Not set')
  console.log('POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? 'Set' : 'Not set')
  console.log('NODE_ENV:', process.env.NODE_ENV)
}

// Create Prisma Client with proper configuration
const prismaClientOptions: any = {}

// Add accelerateUrl if available
if (process.env.PRISMA_ACCELERATE_URL) {
  prismaClientOptions.accelerateUrl = process.env.PRISMA_ACCELERATE_URL
  console.log('Using Prisma Accelerate URL')
}

// Add database URL for direct connection if accelerateUrl is not available
if (!process.env.PRISMA_ACCELERATE_URL && process.env.POSTGRES_PRISMA_URL) {
  prismaClientOptions.datasourceUrl = process.env.POSTGRES_PRISMA_URL
  console.log('Using direct database URL')
}

// Create Prisma Client instance
let prismaInstance: PrismaClient

try {
  // Only create PrismaClient if we have database configuration
  if (prismaClientOptions.accelerateUrl || prismaClientOptions.datasourceUrl) {
    prismaInstance = new PrismaClient(prismaClientOptions)
    console.log('Prisma Client created with database configuration')
  } else {
    // Create a mock PrismaClient that throws informative errors
    prismaInstance = {
      jobScan: {
        create: async () => {
          throw new Error('Database not configured. Please set PRISMA_ACCELERATE_URL or POSTGRES_PRISMA_URL environment variable.')
        },
        findMany: async () => [],
        findUnique: async () => null,
        update: async () => {
          throw new Error('Database not configured.')
        },
        delete: async () => {
          throw new Error('Database not configured.')
        },
      },
    } as any
    console.warn('WARNING: Database not configured. Using mock Prisma Client.')
  }
} catch (error) {
  console.error('Failed to create Prisma Client:', error)
  // Create a mock PrismaClient as fallback
  prismaInstance = {
    jobScan: {
      create: async () => {
        throw new Error('Prisma Client initialization failed.')
      },
      findMany: async () => [],
      findUnique: async () => null,
      update: async () => {
        throw new Error('Prisma Client initialization failed.')
      },
      delete: async () => {
        throw new Error('Prisma Client initialization failed.')
      },
    },
  } as any
}

export const prisma = globalForPrisma.prisma ?? prismaInstance

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma