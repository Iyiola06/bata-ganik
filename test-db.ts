import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['error'] });

async function main() {
    try {
        const res = await prisma.$queryRaw`
        SELECT
          TO_CHAR("createdAt", 'Mon') as month,
          EXTRACT(MONTH FROM "createdAt") as month_num,
          COALESCE(SUM(total), 0) as value
        FROM orders
        WHERE "paymentStatus" = 'PAID'
          AND "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR("createdAt", 'Mon'), EXTRACT(MONTH FROM "createdAt")
        ORDER BY month_num ASC
    `;
        console.log('Success:', res);
    } catch (e) {
        console.error('RAW QUERY FAILED:', e);
    }
}
main().finally(() => prisma.$disconnect());
