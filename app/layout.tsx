import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Bata Ganik | Luxury Footwear',
        template: '%s | Bata Ganik',
    },
    description: 'Handcrafted luxury footwear from Nigeria to the world. Experience premium quality and heritage in every step.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_NG',
        url: 'https://bataganik.com',
        siteName: 'Bata Ganik',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Bata Ganik',
        description: 'Luxury handcrafted footwear brand.',
        url: 'https://bataganik.com',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'NG',
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
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
