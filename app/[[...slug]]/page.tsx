'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';

// Dynamically import the App component to ensure it only runs on the client
// and doesn't cause SSR issues with react-router-dom.
const App = dynamic(() => import('@/src/App'), { ssr: false });

export default function ClientApp() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

