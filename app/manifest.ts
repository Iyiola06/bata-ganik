import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Ganik Leathers | Bata Ganik',
        short_name: 'Ganik Leathers',
        description: 'Ganik Leathers, home of Bata Ganik handcrafted luxury footwear.',
        start_url: '/',
        display: 'standalone',
        background_color: '#151110',
        theme_color: '#c9a96e',
        icons: [
            {
                src: '/favicon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
