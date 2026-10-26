import type { Metadata } from 'next';
import './globals.css';
import {
    BRAND_ALIASES,
    BRAND_LOGO,
    DEFAULT_OG_IMAGE,
    SEARCH_SITE_NAME,
    SITE_NAME,
    absoluteUrl,
    getSiteUrl,
} from '@/lib/site';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
    title: {
        default: `${SITE_NAME} | ${SEARCH_SITE_NAME} Luxury Footwear`,
        template: `%s | ${SITE_NAME} · ${SEARCH_SITE_NAME}`,
    },
    description: 'Ganik Leathers, home of Bata Ganik: handcrafted luxury footwear from Nigeria to the world. Experience premium quality and heritage in every step.',
    applicationName: SEARCH_SITE_NAME,
    keywords: ['Bata Ganik', 'Ganik', 'Ganik Leathers', 'luxury footwear Nigeria', 'handcrafted leather shoes'],
    metadataBase: new URL(siteUrl),
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    icons: {
        icon: [
            { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
            { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
        type: 'website',
        locale: 'en_NG',
        url: siteUrl,
        siteName: SEARCH_SITE_NAME,
        title: `${SITE_NAME} | ${SEARCH_SITE_NAME} Luxury Footwear`,
        description: 'Ganik Leathers, home of Bata Ganik: handcrafted luxury footwear from Nigeria to the world.',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: `${SEARCH_SITE_NAME} luxury footwear`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} | ${SEARCH_SITE_NAME} Luxury Footwear`,
        description: 'Ganik Leathers, home of Bata Ganik: handcrafted luxury footwear from Nigeria to the world.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SEARCH_SITE_NAME,
        alternateName: BRAND_ALIASES,
        description: 'Ganik Leathers is the home of Bata Ganik, a luxury handcrafted footwear brand.',
        url: siteUrl,
        logo: absoluteUrl(BRAND_LOGO),
        sameAs: [],
    };

    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SEARCH_SITE_NAME,
        alternateName: BRAND_ALIASES,
        url: siteUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/shop?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
            </head>
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
