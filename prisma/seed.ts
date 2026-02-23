import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Bata Ganik database...')

    // ── Collections ──────────────────────────────────────────────
    const collections = await Promise.all([
        prisma.collection.upsert({
            where: { slug: 'lagos-luxury' },
            update: {},
            create: {
                name: 'Lagos Luxury',
                slug: 'lagos-luxury',
                description: 'Contemporary elegance inspired by the pulse of Lagos.',
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL',
            },
        }),
        prisma.collection.upsert({
            where: { slug: 'northern-heritage' },
            update: {},
            create: {
                name: 'Northern Heritage',
                slug: 'northern-heritage',
                description: 'Craftsmanship rooted in the ancient traditions of Northern Nigeria.',
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI',
            },
        }),
        prisma.collection.upsert({
            where: { slug: 'royal-edit' },
            update: {},
            create: {
                name: 'Royal Edit',
                slug: 'royal-edit',
                description: 'Inspired by the majesty of Nigerian royalty and ceremonial dress.',
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO6NeLwXpilr_se4zjGUk5SieGn6vkyZf_KvAytPW1393PC_C8tk5a_8c76Ot9LUPSyVcK1IUxppMdkj6y1a5dq7FIXoWupdNwomcG5VNA3lIbINutkiaqn_WuWzEhKUvXvucsnVjusSjUfyueGZkK3KSo1z6g36yJyiYfpaiK9HIGm6J1pwUO8WdJJ9nD24BP-rLeRqJ3QIlWK5nj44eqYyxvycdka1O7PWxAS1OvyTJTdXlQR1H_y2dQk7dtVfKGlaBUDfqJaK6w',
            },
        }),
        prisma.collection.upsert({
            where: { slug: 'harmattan' },
            update: {},
            create: {
                name: 'Harmattan',
                slug: 'harmattan',
                description: 'Hardy, weathered designs for the driest, most golden season.',
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
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL',
                    isMain: true,
                    order: 0,
                },
            ],
            variants: [
                { sizeEU: '40', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 8 },
                { sizeEU: '41', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 12 },
                { sizeEU: '42', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 10 },
                { sizeEU: '43', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 6 },
                { sizeEU: '44', color: 'Cognac Leather', colorHex: '#8B5A2B', stockQty: 4 },
            ],
        },
        {
            name: 'The Kano Loafer',
            slug: 'the-kano-loafer',
            sku: 'BG-KN-004',
            description:
                'A buttery smooth slip-on that balances Northern restraint with contemporary luxury. Vegetable-tanned leather with hand-burnished edges.',
            heritageStory:
                'Kano — one of Africa\'s oldest cities — is a place where ancient trade routes and modern hustle meet. This loafer is for those who carry history lightly.',
            price: 125000,
            collectionId: northernHeritage.id,
            tags: ['loafer', 'leather', 'casual', 'featured'],
            isPublished: true,
            isFeatured: true,
            images: [
                {
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI',
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
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL',
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
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI',
                    isMain: true,
                    order: 0,
                },
            ],
            variants: [
                { sizeEU: '41', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 0 },
                { sizeEU: '42', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 0 },
                { sizeEU: '43', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 2 },
                { sizeEU: '44', color: 'Espresso', colorHex: '#3B1F0A', stockQty: 0 },
            ],
        },
        {
            name: 'The Ibadan Derby',
            slug: 'the-ibadan-derby',
            sku: 'BG-IB-221',
            description:
                'An open-laced brother to the Oxford — more relaxed, equally refined. Double leather sole with contrasting welt stitching.',
            heritageStory:
                'Ibadan — Nigeria\'s largest city by land area — is a city of depth, layers, and history. This Derby is generous in spirit and precise in craft.',
            price: 110000,
            collectionId: lagosLuxury.id,
            tags: ['derby', 'leather', 'formal', 'featured'],
            isPublished: true,
            isFeatured: true,
            images: [
                {
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw',
                    isMain: true,
                    order: 0,
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
        await prisma.product.upsert({
            where: { slug: data.slug },
            update: {},
            create: {
                ...productFields,
                images: { create: images },
                variants: { create: variants },
            },
        })
    }
    console.log(`✅ Seeded ${productData.length} products`)

    // ── Sample Discount Code ────────────────────────────────────────
    await prisma.discountCode.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: {
            code: 'WELCOME10',
            type: 'percentage',
            value: 10,
            minimumOrder: 50000,
            maxUses: 1000,
            isActive: true,
        },
    })
    console.log('✅ Seeded sample discount code: WELCOME10')

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
