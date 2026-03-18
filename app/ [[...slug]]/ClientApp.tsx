'use client';

import React from 'react';
import dynamic from 'next/dynamic';

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

export default function ClientApp() {
    return <ClientAppInner />;
}
