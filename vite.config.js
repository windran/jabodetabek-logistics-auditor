import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { copyFileSync, renameSync, existsSync, rmSync } from 'fs';

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'pre-build-copy-html',
      buildStart() {
        // Copy popup.html to project root so Vite uses correct relative paths
        copyFileSync(
          resolve(__dirname, 'src/popup/popup.html'),
          resolve(__dirname, 'popup.html')
        );
      },
      closeBundle() {
        // Clean up temp file
        try { rmSync(resolve(__dirname, 'popup.html')); } catch {}
      },
    },
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '$lib': resolve(__dirname, 'src/lib'),
    },
  },
});
