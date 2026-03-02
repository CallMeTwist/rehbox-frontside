import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

      manifest: {
        name:             'ReHboX — Digital Physiotherapy',
        short_name:       'ReHboX',
        description:      'AI-powered physiotherapy for musculoskeletal recovery',
        theme_color:      '#2C5FC3',
        background_color: '#0F172A',
        display:          'standalone',
        orientation:      'portrait',
        scope:            '/',
        start_url:        '/',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        screenshots: [
          {
            src:       '/screenshots/home.png',
            sizes:     '390x844',
            type:      'image/png',
            form_factor: 'narrow',
            label:     'ReHboX Home Screen',
          },
        ],
      },

      workbox: {
        // Cache these routes for offline access
        navigateFallback: '/index.html',
        globPatterns:     ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache API GET requests for 1 hour
            urlPattern: /^http:\/\/127\.0\.0\.1:8000\/api\/.*/i,
            handler:    'NetworkFirst',
            options: {
              cacheName:          'api-cache',
              expiration:         { maxEntries: 50, maxAgeSeconds: 3600 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Cache exercise images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
