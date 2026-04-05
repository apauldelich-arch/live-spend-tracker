import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Life Spend Tracker',
    short_name: 'SpendTracker',
    description: 'High-fidelity financial tracking on the go.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // Usually need 192x192 and 512x512 icons for PWA installability
    ],
  }
}
