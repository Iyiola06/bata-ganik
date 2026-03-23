import React from 'react'
import { Metadata } from 'next'
import ClientApp from './ClientApp'
import { prisma } from '@/lib/prisma'
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/lib/site'

interface PageProps {
    params: Promise<{ slug?: string[] }>
}

const noIndexRoutes = new Set([
    'account',
    'checkout',
    'order-confirmation',
    'login',
    'auth/auth-code-error',
])

const staticRouteMeta: Record<string, { title: string; description: string }> = {
    '': {
        title: 'Luxury Footwear',
        description: 'Handcrafted luxury footwear from Nigeria to the world. Experience premium quality and heritage in every step.',
    },
    collections: {
        title: 'Collections',
        description: 'Explore curated collections of handcrafted luxury footwear.',
    },
    shop: {
        title: 'Shop',
        description: 'Browse our complete catalog of premium handcrafted shoes.',
    },
    contact: {
        title: 'Contact',
        description: 'Contact Bata Ganik for support, bespoke orders, or wholesale inquiries.',
    },
    'our-story': {
        title: 'Our Story',
        description: 'Discover the heritage, discipline, and craftsmanship behind Bata Ganik.',
    },
    'shipping-returns': {
        title: 'Shipping and Returns',
        description: 'Learn about delivery timelines, shipping options, and returns policy.',
    },
    'size-guide': {
        title: 'Size Guide',
        description: 'Find your best footwear fit with the Bata Ganik size guide.',
    },
    faq: {
        title: 'FAQ',
        description: 'Answers to common questions about orders, payments, shipping, and products.',
    },
    'care-instructions': {
        title: 'Care Instructions',
        description: 'Care recommendations to keep your Bata Ganik shoes in top condition.',
    },
    'privacy-policy': {
        title: 'Privacy Policy',
        description: 'Read how Bata Ganik collects, uses, and protects your personal data.',
    },
    'terms-of-service': {
        title: 'Terms of Service',
        description: 'Read the terms governing the use of Bata Ganik products and services.',
    },
    'track-order': {
        title: 'Track Order',
        description: 'Track your Bata Ganik order status and delivery progress.',
    },
}

function joinPath(slug: string[]) {
    return slug.join('/')
}

function canonicalPathFromSlug(slug: string[]) {
    const path = joinPath(slug)
    return path ? `/${path}` : '/'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const slug = (await params).slug || []
    const path = joinPath(slug)
    const canonicalPath = canonicalPathFromSlug(slug)

    if (path.startsWith('admin')) {
        return {
            title: 'Admin',
            description: 'Admin dashboard',
            robots: { index: false, follow: false },
            alternates: { canonical: canonicalPath },
        }
    }

    if (path.startsWith('products/') && slug[1]) {
        try {
            const identifier = slug[1]
            const product = await prisma.product.findFirst({
                where: {
                    OR: [{ id: identifier }, { slug: identifier }],
                    isPublished: true,
                },
                include: { images: { orderBy: { order: 'asc' } } },
            })

            if (product) {
                const productCanonicalPath = `/products/${product.slug}`
                const productTitle = product.name
                const productDescription =
                    product.description ||
                    'Handcrafted premium footwear from Bata Ganik.'
                const image = product.images[0]?.url || DEFAULT_OG_IMAGE

                return {
                    title: productTitle,
                    description: productDescription,
                    alternates: { canonical: productCanonicalPath },
                    robots: { index: true, follow: true },
                    openGraph: {
                        type: 'website',
                        title: productTitle,
                        description: productDescription,
                        url: absoluteUrl(productCanonicalPath),
                        images: [{ url: image }],
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: productTitle,
                        description: productDescription,
                        images: [image],
                    },
                }
            }
        } catch {
            // Fall through to generic metadata
        }
    }

    if (path.startsWith('shop/') && slug[1]) {
        const category = decodeURIComponent(slug[1]).replace(/-/g, ' ')
        const title = `${category} Shoes`
        const description = `Shop ${category} footwear from ${SITE_NAME}.`
        return {
            title,
            description,
            alternates: { canonical: canonicalPath },
            openGraph: {
                title,
                description,
                url: absoluteUrl(canonicalPath),
                images: [{ url: DEFAULT_OG_IMAGE }],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [DEFAULT_OG_IMAGE],
            },
        }
    }

    const routeMeta = staticRouteMeta[path]
    if (routeMeta) {
        return {
            title: routeMeta.title,
            description: routeMeta.description,
            alternates: { canonical: canonicalPath },
            robots: { index: !noIndexRoutes.has(path), follow: !noIndexRoutes.has(path) },
            openGraph: {
                title: routeMeta.title,
                description: routeMeta.description,
                url: absoluteUrl(canonicalPath),
                images: [{ url: DEFAULT_OG_IMAGE }],
            },
            twitter: {
                card: 'summary_large_image',
                title: routeMeta.title,
                description: routeMeta.description,
                images: [DEFAULT_OG_IMAGE],
            },
        }
    }

    // Unknown SPA paths should not compete with primary indexed routes.
    return {
        title: 'Luxury Footwear',
        description: 'Handcrafted luxury footwear from Nigeria to the world.',
        alternates: { canonical: canonicalPath },
        robots: { index: false, follow: false },
    }
}

export default async function Page({ params }: PageProps) {
    const slug = (await params).slug || []
    const path = joinPath(slug)

    let staticContent: React.ReactNode = null
    let productJsonLd: Record<string, unknown> | null = null

    try {
        if (path === '') {
            const [products, collections] = await Promise.all([
                prisma.product.findMany({
                    where: { isPublished: true, isFeatured: true },
                    take: 6,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        price: true,
                    },
                }),
                prisma.collection.findMany({
                    where: { isActive: true },
                    orderBy: { name: 'asc' },
                    select: { id: true, name: true, slug: true },
                }),
            ])

            staticContent = (
                <div className="sr-only">
                    <h1>{SITE_NAME} Luxury Footwear</h1>
                    <p>A house of handmade luxury footwear, built to endure. Heritage in every step.</p>
                    <section>
                        <h2>Featured Products</h2>
                        <ul>
                            {products.map((p) => (
                                <li key={p.id}>
                                    <a href={`/products/${p.slug}`}>{p.name}</a> - NGN {p.price}
                                    <p>{p.description}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section>
                        <h2>Our Collections</h2>
                        <ul>
                            {collections.map((c) => (
                                <li key={c.id}>
                                    <a href={`/shop?collection=${c.slug}`}>{c.name}</a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            )
        } else if (path.startsWith('products/') && slug[1]) {
            const identifier = slug[1]
            const product = await prisma.product.findFirst({
                where: {
                    OR: [{ id: identifier }, { slug: identifier }],
                    isPublished: true,
                },
                include: {
                    images: { orderBy: { order: 'asc' } },
                    collection: { select: { name: true, slug: true } },
                    variants: { select: { stockQty: true } },
                },
            })

            if (product) {
                staticContent = (
                    <div className="sr-only">
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <p>Collection: {product.collection?.name}</p>
                        <p>Price: NGN {product.price}</p>
                    </div>
                )

                productJsonLd = {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: product.name,
                    description: product.description || '',
                    sku: product.sku,
                    image: product.images.map((img) => img.url),
                    brand: {
                        '@type': 'Brand',
                        name: SITE_NAME,
                    },
                    offers: {
                        '@type': 'Offer',
                        url: absoluteUrl(`/products/${product.slug}`),
                        priceCurrency: 'NGN',
                        price: product.price,
                        availability: product.variants.some((v) => v.stockQty > 0)
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                    },
                }
            }
        } else if (path === 'our-story') {
            staticContent = (
                <div className="sr-only">
                    <h1>Our Story - {SITE_NAME}</h1>
                    <p>
                        Founded by Mr. Kunle Ogunjobi, {SITE_NAME} is a luxury footwear house built on discipline and craftsmanship.
                    </p>
                </div>
            )
        } else if (path === 'shop' || path.startsWith('shop/')) {
            staticContent = (
                <div className="sr-only">
                    <h1>Shop {SITE_NAME}</h1>
                    <p>Browse handcrafted premium footwear across collections and categories.</p>
                </div>
            )
        } else if (path === 'collections') {
            staticContent = (
                <div className="sr-only">
                    <h1>{SITE_NAME} Collections</h1>
                    <p>Explore curated collections of handcrafted luxury footwear.</p>
                </div>
            )
        }
    } catch {
        // Keep SPA rendering resilient even if SEO data lookup fails.
    }

    return (
        <>
            {staticContent}
            {productJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
                />
            )}
            <ClientApp />
        </>
    )
}
