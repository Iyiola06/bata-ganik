
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const counts = await prisma.order.groupBy({
    by: ['paymentStatus'],
    _count: { id: true }
  })
  console.log('Payment Status Groups:', counts)
  
  const totalRaw = await prisma.$queryRaw`SELECT SUM(total) as sum FROM orders WHERE "paymentStatus" = 'PAID'`
  console.log('Raw Total (PAID):', totalRaw)
}

main().catch(console.error).finally(() => prisma.$disconnect())
