export const EXCHANGE_RATES: Record<string, number> = {
    NGN: 1,
    USD: 1100,
    GBP: 1400,
    EUR: 1200,
};

/**
 * Convert an amount from NGN to a target currency using fixed exchange rates.
 */
export function convertFromNGN(amount: number, currency: string): number {
    const rate = EXCHANGE_RATES[currency.toUpperCase()] || 1;
    // Round to 2 decimal places for non-NGN currencies
    return Number((amount / rate).toFixed(2));
}

/**
 * Format a price with the correct currency symbol and formatting.
 */
export function formatPrice(amount: number, currency: string): string {
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
