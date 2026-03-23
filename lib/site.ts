export const SITE_NAME = 'Bata Ganik'
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
