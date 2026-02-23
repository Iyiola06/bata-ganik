import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Bata Ganik | Luxury Footwear',
    description: 'Handcrafted luxury footwear from Nigeria to the world.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
