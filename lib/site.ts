// Keep the product brand and Google-facing site name explicit.  They are
// intentionally separate while the site transitions from Bata Ganik to
// Ganik Leathers in search results.
export const SITE_NAME = 'Bata Ganik'
export const SEARCH_SITE_NAME = 'Ganik Leathers'
export const BRAND_ALIASES = ['Bata Ganik', 'Ganik', 'Ganik Leathers']
export const BRAND_LOGO = '/ganik-leathers-logo.jpg'
export const DEFAULT_OG_IMAGE = '/og-image.svg'

function normalizeBase(base: string) {
    return base.endsWith('/') ? base.slice(0, -1) : base
}

export function getSiteUrl() {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    if (envUrl) return normalizeBase(envUrl)
    return 'https://bataganik.com'
}

export function absoluteUrl(path = '/') {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${getSiteUrl()}${normalizedPath}`
}
