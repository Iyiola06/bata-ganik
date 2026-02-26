import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
    console.log('🧹 Cleaning existing demo data...')

    // Delete in dependency order to respect foreign keys
    await prisma.transaction.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.wishlistItem.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.productVariant.deleteMany()
    await prisma.product.deleteMany()
    await prisma.collection.deleteMany()
    await prisma.discountCode.deleteMany()
    await prisma.contactMessage.deleteMany()

    console.log('✅ Database cleaned')
}

async function main() {
    console.log('🌱 Seeding Bata Ganik database...\n')

    await cleanDatabase()

    // ── Collections ──────────────────────────────────────────────
    const collections = await Promise.all([
        prisma.collection.create({
            data: {
                name: 'Lagos Luxury',
                slug: 'lagos-luxury',
                description: 'Contemporary elegance inspired by the pulse of Lagos.',
                imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
            },
        }),
        prisma.collection.create({
            data: {
                name: 'Northern Heritage',
                slug: 'northern-heritage',
                description: 'Craftsmanship rooted in the ancient traditions of Northern Nigeria.',
                imageUrl: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
            },
        }),
        prisma.collection.create({
            data: {
                name: 'Royal Edit',
                slug: 'royal-edit',
                description: 'Inspired by the majesty of Nigerian royalty and ceremonial dress.',
                imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
            },
        }),
        prisma.collection.create({
            data: {
                name: 'Harmattan',
                slug: 'harmattan',
                description: 'Hardy, weathered designs for the driest, most golden season.',
                imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
            },
        }),
    ])

    const [lagosLuxury, northernHeritage, royalEdit, harmattan] = collections
    console.log(`✅ Seeded ${collections.length} collections`)

    // ── Products ───────────────────────────────────────────────────────
    const productData = [
        {
            name: 'The Danfo Oxford',
            slug: 'the-danfo-oxford',
            sku: 'BG-DO-001',
            description:
                'A masterpiece of controlled elegance. Hand-stitched cognac leather with a wholecut silhouette inspired by the iconic yellow buses of Lagos.',
            heritageStory:
                'The Danfo bus is the lifeblood of Lagos — chaotic, colourful, unstoppable. This Oxford channels that same relentless energy into a shoe worthy of a boardroom.',
            price: 245000,
            collectionId: lagosLuxury.id,
            tags: ['oxford', 'leather', 'formal', 'featured'],
            isPublished: true,
            isFeatured: true,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
                    altText: 'The Danfo Oxford — Cognac leather wholecut',
                    isMain: true,
                    order: 0,
                },
                {
                    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80',
                    altText: 'The Danfo Oxford — Side profile',
                    isMain: false,
                    order: 1,
                },
            ],
            variants: [
                { sizeEU: '40', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 8 },
                { sizeEU: '41', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 12 },
                { sizeEU: '42', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 10 },
                { sizeEU: '43', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 6 },
                { sizeEU: '44', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 4 },
                { sizeEU: '40', color: 'Midnight Black', colorHex: '#1a1a1a', stockQty: 5 },
                { sizeEU: '41', color: 'Midnight Black', colorHex: '#1a1a1a', stockQty: 8 },
                { sizeEU: '42', color: 'Midnight Black', colorHex: '#1a1a1a', stockQty: 7 },
            ],
        },
        {
            name: 'The Kano Loafer',
            slug: 'the-kano-loafer',
            sku: 'BG-KN-004',
            description:
                'A buttery smooth slip-on that balances Northern restraint with contemporary luxury. Vegetable-tanned leather with hand-burnished edges.',
            heritageStory:
                "Kano — one of Africa's oldest cities — is a place where ancient trade routes and modern hustle meet. This loafer is for those who carry history lightly.",
            price: 125000,
            collectionId: northernHeritage.id,
            tags: ['loafer', 'leather', 'casual', 'featured'],
            isPublished: true,
            isFeatured: true,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=800&q=80',
                    altText: 'The Kano Loafer — Savannah Brown',
                    isMain: true,
                    order: 0,
                },
            ],
            variants: [
                { sizeEU: '40', color: 'Savannah Brown', colorHex: '#A0774E', stockQty: 15 },
                { sizeEU: '41', color: 'Savannah Brown', colorHex: '#A0774E', stockQty: 20 },
                { sizeEU: '42', color: 'Savannah Brown', colorHex: '#A0774E', stockQty: 18 },
                { sizeEU: '43', color: 'Savannah Brown', colorHex: '#A0774E', stockQty: 12 },
                { sizeEU: '44', color: 'Savannah Brown', colorHex: '#A0774E', stockQty: 8 },
                { sizeEU: '40', color: 'Midnight Black', colorHex: '#1a1a1a', stockQty: 10 },
                { sizeEU: '41', color: 'Midnight Black', colorHex: '#1a1a1a', stockQty: 14 },
                { sizeEU: '42', color: 'Midnight Black', colorHex: '#1a1a1a', stockQty: 11 },
                { sizeEU: '43', color: 'Midnight Black', colorHex: '#1a1a1a', stockQty: 7 },
            ],
        },
        {
            name: 'The Owu Crown Sandal',
            slug: 'the-owu-crown-sandal',
            sku: 'BG-OW-102',
            description:
                'A statement sandal that commands a room. Structured vegetable-tanned leather straps with gold-plated hardware and a cushioned cork footbed.',
            heritageStory:
                'The Owu kingdom of Yorubaland is famed for its warriors and its craft. This sandal honours that tradition — built for those who lead.',
            price: 145000,
            collectionId: royalEdit.id,
            tags: ['sandal', 'leather', 'luxury', 'featured'],
            isPublished: true,
            isFeatured: true,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80',
                    altText: 'The Owu Crown Sandal — Tan leather',
                    isMain: true,
                    order: 0,
                },
            ],
            variants: [
                { sizeEU: '38', color: 'Tan', colorHex: '#C19A6B', stockQty: 12 },
                { sizeEU: '39', color: 'Tan', colorHex: '#C19A6B', stockQty: 10 },
                { sizeEU: '40', color: 'Tan', colorHex: '#C19A6B', stockQty: 8 },
                { sizeEU: '41', color: 'Tan', colorHex: '#C19A6B', stockQty: 6 },
                { sizeEU: '38', color: 'Black', colorHex: '#1a1a1a', stockQty: 9 },
                { sizeEU: '39', color: 'Black', colorHex: '#1a1a1a', stockQty: 7 },
                { sizeEU: '40', color: 'Black', colorHex: '#1a1a1a', stockQty: 5 },
                { sizeEU: '41', color: 'Black', colorHex: '#1a1a1a', stockQty: 4 },
            ],
        },
        {
            name: 'The Zaria Boot',
            slug: 'the-zaria-boot',
            sku: 'BG-ZR-009',
            description:
                'A full-grain leather Chelsea boot with a structured silhouette and elastic side panels. Resoleable Goodyear welt construction for decades of wear.',
            heritageStory:
                'Zaria — the ancient seat of the Zazzau emirate — inspires a boot built to last generations. A boot your grandson will still wear.',
            price: 190000,
            collectionId: harmattan.id,
            tags: ['boot', 'chelsea', 'leather', 'winter'],
            isPublished: true,
            isFeatured: false,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80',
                    altText: 'The Zaria Boot — Espresso leather Chelsea',
                    isMain: true,
                    order: 0,
                },
            ],
            variants: [
                { sizeEU: '41', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 3 },
                { sizeEU: '42', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 5 },
                { sizeEU: '43', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 2 },
                { sizeEU: '44', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 4 },
            ],
        },
        {
            name: 'The Ibadan Derby',
            slug: 'the-ibadan-derby',
            sku: 'BG-IB-221',
            description:
                'An open-laced brother to the Oxford — more relaxed, equally refined. Double leather sole with contrasting welt stitching.',
            heritageStory:
                "Ibadan — Nigeria's largest city by land area — is a city of depth, layers, and history. This Derby is generous in spirit and precise in craft.",
            price: 110000,
            collectionId: lagosLuxury.id,
            tags: ['derby', 'leather', 'formal', 'featured'],
            isPublished: true,
            isFeatured: true,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
                    altText: 'The Ibadan Derby — Oxblood leather',
                    isMain: true,
                    order: 0,
                },
                {
                    url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80',
                    altText: 'The Ibadan Derby — Detail view',
                    isMain: false,
                    order: 1,
                },
            ],
            variants: [
                { sizeEU: '40', color: 'Oxblood', colorHex: '#4A0000', stockQty: 10 },
                { sizeEU: '41', color: 'Oxblood', colorHex: '#4A0000', stockQty: 14 },
                { sizeEU: '42', color: 'Oxblood', colorHex: '#4A0000', stockQty: 12 },
                { sizeEU: '43', color: 'Oxblood', colorHex: '#4A0000', stockQty: 8 },
                { sizeEU: '40', color: 'Tan', colorHex: '#C19A6B', stockQty: 7 },
                { sizeEU: '41', color: 'Tan', colorHex: '#C19A6B', stockQty: 9 },
                { sizeEU: '42', color: 'Tan', colorHex: '#C19A6B', stockQty: 6 },
            ],
        },
    ]

    for (const data of productData) {
        const { images, variants, ...productFields } = data
        await prisma.product.create({
            data: {
                ...productFields,
                images: { create: images },
                variants: { create: variants },
            },
        })
    }
    console.log(`✅ Seeded ${productData.length} products with variants and images`)

    // ── Discount Code ────────────────────────────────────────
    await prisma.discountCode.create({
        data: {
            code: 'WELCOME10',
            type: 'percentage',
            value: 10,
            minimumOrder: 50000,
            maxUses: 1000,
            isActive: true,
        },
    })
    console.log('✅ Seeded discount code: WELCOME10')

    console.log('\n🎉 Seed complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
