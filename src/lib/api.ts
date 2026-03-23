/**
 * Typed API client for Bata Ganik.
 * In dev: Vite proxy forwards /api/* to Next.js (port 3001).
 * In prod on Vercel: same origin, no proxy needed.
 */

const getBase = () => {
    // In browser, relative is best
    if (typeof window !== 'undefined') return '/api'
    // Server-side (e.g. metadata generation) needs full URL
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api`
}

const BASE = getBase()

class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public code?: string,
        public details?: unknown
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${BASE}${path}`
    try {
        const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options,
        })

        if (!res.ok) {
            let message = `HTTP ${res.status}`
            let code: string | undefined
            let details: unknown
            try {
                const data = await res.json()
                message = data?.error ?? data?.message ?? message
                code = data?.code
                details = data?.details
            } catch { }

            if (
                typeof window !== 'undefined' &&
                path.startsWith('/admin') &&
                !path.startsWith('/admin/invite/signup') &&
                (res.status === 401 || res.status === 403)
            ) {
                const reason = res.status === 401 ? 'session-expired' : 'forbidden'
                window.location.href = `/admin/login?reason=${reason}`
            }

            throw new ApiError(res.status, message, code, details)
        }

        return res.json() as Promise<T>
    } catch (err) {
        if (err instanceof ApiError) throw err
        console.error(`[API] Fetch failed for ${url}:`, err)
        throw new Error(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
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

export const EXCHANGE_RATES: Record<string, number> = {
    NGN: 1,
    USD: 1100,
    GBP: 1400,
    EUR: 1200,
};

/**
 * Convert an amount from NGN to a target currency.
 */
export function convertFromNGN(amount: number, currency: string): number {
    const rate = EXCHANGE_RATES[currency.toUpperCase()] || 1;
    return Number((amount / rate).toFixed(2));
}

/**
 * Format a price with the correct currency symbol and formatting.
 */
export function formatPrice(amount: number, currency: string = 'NGN'): string {
    const c = currency.toUpperCase();
    if (c === 'NGN') {
        return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    
    const symbols: Record<string, string> = {
        USD: '$',
        GBP: '£',
        EUR: '€',
    };
    
    const symbol = symbols[c] || c;
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Legacy support for NGN formatting */
export function formatNGN(amount: number): string {
    return formatPrice(amount, 'NGN');
}
