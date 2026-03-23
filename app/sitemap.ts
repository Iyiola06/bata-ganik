import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

const staticPaths = [
    '/',
    '/collections',
    '/shop',
    '/our-story',
    '/contact',
    '/shipping-returns',
    '/size-guide',
    '/faq',
    '/care-instructions',
    '/privacy-policy',
    '/terms-of-service',
    '/track-order',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl()
    const now = new Date()

    let products: Array<{ slug: string; updatedAt: Date }> = []
    let collections: Array<{ slug: string; updatedAt: Date }> = []
    try {
        ;[products, collections] = await Promise.all([
            prisma.product.findMany({
                where: { isPublished: true },
                select: { slug: true, updatedAt: true },
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.collection.findMany({
                where: { isActive: true },
                select: { slug: true, updatedAt: true },
                orderBy: { updatedAt: 'desc' },
            }),
        ])
    } catch {
        // Keep sitemap available even if dynamic DB lookup fails.
    }

    const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified: now,
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1 : 0.7,
    }))

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    const collectionEntries: MetadataRoute.Sitemap = collections.map((collection) => ({
        url: `${siteUrl}/shop/${collection.slug}`,
        lastModified: collection.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
    }))

    return [...staticEntries, ...productEntries, ...collectionEntries]
}
