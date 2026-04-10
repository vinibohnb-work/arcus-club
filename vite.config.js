import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'arcus_logo.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Arcus Club',
        short_name: 'Arcus',
        description: 'Plataforma de mentoria estratégica para empresários',
        theme_color: '#080808',
        background_color: '#080808',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Não pré-cacheia JS/HTML — eles mudam a cada deploy e cachear
        // causa novas abas servirem bundle antigo com rotas desatualizadas.
        // Só assets estáticos que raramente mudam ficam no precache.
        globPatterns: ['**/*.{css,ico,png,svg,woff2}'],
        runtimeCaching: [
          // JS do app: sempre busca na rede primeiro, cache só como fallback
          {
            urlPattern: /\/assets\/.*\.js$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'app-js-cache', networkTimeoutSeconds: 5 },
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
})
