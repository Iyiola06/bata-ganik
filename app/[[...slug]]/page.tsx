import React from 'react';
import { Metadata } from 'next';
import { api, type Product } from '@/src/lib/api';
import ClientApp from './ClientApp';

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
        // Fallback
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

export default async function Page({ params }: PageProps) {
    const slug = (await params).slug || [];
    const path = slug.join('/');

    let staticContent = null;

    try {
        if (path === '' || path === 'index') {
            // Home page static content
            const [{ products }, { collections }] = await Promise.all([
                api.get<{ products: Product[] }>('/products?featured=true&limit=6'),
                api.get<{ collections: any[] }>('/collections'),
            ]);

            staticContent = (
                <div className="sr-only">
                    <h1>Bata Ganik | Luxury Footwear</h1>
                    <p>A House of Handmade Luxury Footwear, built to endure. Heritage in every step.</p>
                    <section>
                        <h2>Featured Products</h2>
                        <ul>
                            {products.map(p => (
                                <li key={p.id}>
                                    <a href={`/products/${p.slug}`}>{p.name}</a> - {p.price}
                                    <p>{p.description}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section>
                        <h2>Our Collections</h2>
                        <ul>
                            {collections.map(c => (
                                <li key={c.id}>
                                    <a href={`/shop?collection=${c.slug}`}>{c.name}</a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            );
        } else if (path.startsWith('products/')) {
            // Product page static content
            const id = slug[1];
            if (id) {
                const product = await api.get<Product>(`/products/${id}`);
                staticContent = (
                    <div className="sr-only">
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <span>Price: {product.price}</span>
                        {product.collection && <p>Collection: {product.collection.name}</p>}
                    </div>
                );
            }
        } else if (path === 'our-story' || path === 'about') {
            staticContent = (
                <div className="sr-only">
                    <h1>Our Story - Bata Ganik</h1>
                    <p>Founded by Mr. Kunle Ogunjobi, Bata Ganik is a luxury footwear house built on discipline and craftsmanship. Heritage and quality in every stitch.</p>
                </div>
            );
        }
    } catch (err) {
        // Fallback or ignore
    }

    return (
        <>
            {staticContent}
            <ClientApp />
        </>
    );
}

