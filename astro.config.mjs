// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  output: "server",
  adapter: vercel(),

  integrations: [react()],

  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },

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
      noExternal: ['@radix-ui/*', 'lucide-react', 'framer-motion', 'recharts', 'react-is'],
    },
  },
});