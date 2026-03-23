import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Bata Ganik',
        short_name: 'Bata Ganik',
        description: 'Handcrafted luxury footwear from Nigeria to the world.',
        start_url: '/',
        display: 'standalone',
        background_color: '#151110',
        theme_color: '#c9a96e',
        icons: [
            {
                src: '/logo.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
            },
        ],
    }
}
