import React from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { api, type Product, type Collection } from '@/src/lib/api';

// Dynamically import the App component to ensure it only runs on the client
const App = dynamic(() => import('@/src/App'), { ssr: false });

interface PageProps {
    params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const slug = (await params).slug || [];
    const path = slug.join('/');

    // Default metadata
    let title = 'Bata Ganik | Luxury Footwear';
    let description = 'Handcrafted luxury footwear from Nigeria to the world.';
    let ogImage = '/og-image.jpg';

    try {
        if (path.startsWith('products/')) {
            const id = slug[1];
            if (id) {
                const product = await api.get<Product>(`/products/${id}`);
                title = `${product.name} | Bata Ganik`;
                description = product.description || description;
                if (product.images?.[0]) ogImage = product.images[0].url;
            }
        } else if (path === 'collections') {
            title = 'Collections | Bata Ganik';
            description = 'Explore our curated collections of luxury footwear.';
        } else if (path.startsWith('shop')) {
            title = 'Shop | Bata Ganik';
            description = 'Browse our full catalog of premium shoes.';
        } else if (path === 'about' || path === 'our-story') {
            title = 'Our Story | Bata Ganik';
            description = 'The heritage and craftsmanship behind Bata Ganik.';
        }
    } catch (err) {
        console.error('[Metadata] Failed to fetch:', err);
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [ogImage],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function ClientApp({ params }: PageProps) {
    // We don't need 'use client' here anymore if we handle it correctly
    // but the interior component is still client-only.
    return <ClientAppInner />;
}

// Separate client component for the SPA mounting
const ClientAppInner = dynamic(() => Promise.resolve(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { BrowserRouter } = require('react-router-dom');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AuthProvider } = require('@/src/context/AuthContext');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { CartProvider } = require('@/src/context/CartContext');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ActualApp = require('@/src/App').default;

    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <ActualApp />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}), { ssr: false });

