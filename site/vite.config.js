import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base: works at a domain root and under a sub-path (GitHub Pages /222-FMA/).
  base: './',
  server: { port: 5222, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        catalog: resolve(import.meta.dirname, 'catalog.html'),
        product: resolve(import.meta.dirname, 'product.html'),
      },
    },
  },
});
