import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// Self-host the @mediapipe/pose runtime under /mediapipe/ so the camera never
// depends on jsdelivr (offline clinics, hospital firewalls, CDN outages, CSP).
// Dev: stream files from node_modules. Build: copy them into dist/mediapipe/.
function mediapipePosePlugin(): Plugin {
  const pkgDir = path.resolve(__dirname, "node_modules/@mediapipe/pose");
  const allowed = /\.(js|wasm|data|tflite|binarypb)$/;
  // We run modelComplexity: 1 (full). Skip the 27 MB heavy model and the lite
  // variant — they'd just bloat the bundle and break PWA precache.
  const excluded = /pose_landmark_(heavy|lite)\.tflite$/;
  return {
    name: "rehbox:mediapipe-pose-assets",
    configureServer(server) {
      server.middlewares.use("/mediapipe", (req, res, next) => {
        const file = (req.url ?? "/").split("?")[0].replace(/^\/+/, "");
        if (!file || !allowed.test(file) || excluded.test(file)) return next();
        const full = path.join(pkgDir, file);
        if (!full.startsWith(pkgDir) || !fs.existsSync(full)) return next();
        const ext = path.extname(file);
        const type =
          ext === ".js"       ? "application/javascript" :
          ext === ".wasm"     ? "application/wasm"        :
          ext === ".tflite"   ? "application/octet-stream":
          ext === ".binarypb" ? "application/octet-stream":
                                "application/octet-stream";
        res.setHeader("Content-Type", type);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        fs.createReadStream(full).pipe(res);
      });
    },
    closeBundle() {
      const outDir = path.resolve(__dirname, "dist/mediapipe");
      fs.mkdirSync(outDir, { recursive: true });
      for (const entry of fs.readdirSync(pkgDir)) {
        if (!allowed.test(entry) || excluded.test(entry)) continue;
        fs.copyFileSync(path.join(pkgDir, entry), path.join(outDir, entry));
      }
    },
  };
}

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
    mediapipePosePlugin(),
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
        // Include mediapipe runtime (wasm/data/tflite/binarypb) so the camera
        // works offline after the first load. These files are ~10 MB total.
        globPatterns:     ['**/*.{js,css,html,ico,png,svg,woff2,wasm,data,tflite,binarypb}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
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
