const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: { isPublished: true, isFeatured: true }
  })
  console.log(products)
}

main().catch(console.error).finally(() => prisma.$disconnect())
