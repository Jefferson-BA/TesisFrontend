// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  output: "server",
  
  integrations: [react()],

  // 🔥 Prefetch inteligente
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },

  // 🔥 Build optimizado
  build: {
    inlineStylesheets: 'auto',
  },

  server: {
    port: 4321,
    host: true,
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        }
      ]
    },
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'framer-motion': ['framer-motion'],
            'tanstack-query': ['@tanstack/react-query'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['@radix-ui/*', 'lucide-react', 'framer-motion'],
    },
  },
});