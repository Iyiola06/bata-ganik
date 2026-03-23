import type { Metadata } from 'next';
import './globals.css';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl, getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
    title: {
        default: `${SITE_NAME} | Luxury Footwear`,
        template: `%s | ${SITE_NAME}`,
    },
    description: 'Handcrafted luxury footwear from Nigeria to the world. Experience premium quality and heritage in every step.',
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
    openGraph: {
        type: 'website',
        locale: 'en_NG',
        url: siteUrl,
        siteName: SITE_NAME,
        title: `${SITE_NAME} | Luxury Footwear`,
        description: 'Handcrafted luxury footwear from Nigeria to the world. Experience premium quality and heritage in every step.',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} luxury footwear`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} | Luxury Footwear`,
        description: 'Handcrafted luxury footwear from Nigeria to the world.',
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
        name: SITE_NAME,
        description: 'Luxury handcrafted footwear brand.',
        url: siteUrl,
        logo: absoluteUrl('/logo.svg'),
        sameAs: [],
    };

    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
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
