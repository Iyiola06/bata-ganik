import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

// Cache in ALL environments (including production) to prevent
// "prepared statement already exists" errors with PgBouncer on
// Vercel serverless warm starts.
globalForPrisma.prisma = prisma

