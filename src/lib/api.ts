/**
 * Typed API client for Bata Ganik.
 * In dev: Vite proxy forwards /api/* to Next.js (port 3001).
 * In prod on Vercel: same origin, no proxy needed.
 */

const BASE = '/api'

class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    })

    if (!res.ok) {
        let message = `HTTP ${res.status}`
        try {
            const data = await res.json()
            message = data?.error ?? data?.message ?? message
        } catch { }
        throw new ApiError(res.status, message)
    }

    return res.json() as Promise<T>
}

export const api = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export { ApiError }

// ── Shared types ──────────────────────────────────────────────

export interface ProductImage {
    id: string
    url: string
    altText: string | null
    isMain: boolean
    order: number
}

export interface ProductVariant {
    id: string
    sizeEU: string
    color: string | null
    colorHex: string | null
    stockQty: number
    priceModifier: number
}

export interface Product {
    id: string
    name: string
    slug: string
    sku: string
    description: string | null
    heritageStory: string | null
    price: number
    compareAtPrice: number | null
    collectionId: string | null
    collection: { name: string; slug: string } | null
    tags: string[]
    isPublished: boolean
    isFeatured: boolean
    images: ProductImage[]
    variants: ProductVariant[]
}

export interface Collection {
    id: string
    name: string
    slug: string
    description: string | null
    imageUrl: string | null
    _count?: { products: number }
}

export interface CartItem {
    id: string
    cartId: string
    productId: string
    variantId: string
    quantity: number
    product: Pick<Product, 'id' | 'name' | 'slug' | 'price'> & { images: ProductImage[] }
    variant: ProductVariant
}

export interface Cart {
    id: string
    sessionId: string | null
    customerId: string | null
    items: CartItem[]
}

export interface Order {
    id: string
    orderNumber: string
    total: number
    subtotal: number
    shippingFee: number
    discountAmount: number
    currency: string
    status: string
    paymentStatus: string
    paymentGateway: string | null
    shippingAddress: Record<string, string>
    guestEmail: string | null
    guestFirstName: string | null
    guestLastName: string | null
    createdAt: string
    items: Array<{
        id: string
        productName: string
        size: string
        color: string | null
        quantity: number
        unitPrice: number
        lineTotal: number
        product: Pick<Product, 'id' | 'name'> & { images: ProductImage[] }
    }>
}

/** Format a number as Nigerian Naira */
export function formatNGN(amount: number): string {
    return `₦ ${amount.toLocaleString('en-NG')}`
}
