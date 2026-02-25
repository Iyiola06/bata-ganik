import Stripe from 'stripe'

// Lazily initialized singleton — env vars are not available at module-load
// time during `next build`, so we initialize on first use at runtime.
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-02-24.acacia',
            typescript: true,
        })
    }
    return _stripe
}

/** Convert a float price to Stripe integer amount (cents/kobo) */
export function toStripeAmount(amount: number): number {
    return Math.round(amount * 100)
}
