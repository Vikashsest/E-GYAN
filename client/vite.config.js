
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//   },
// })

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//    base: '/', 
//    server: {
//     host: '0.0.0.0', 
//     port: 5173,
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    // Chunk size warning limit badhaya (default 500 KB → 2 MB)
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // large dependencies ko alag chunk me
          pdfjs: ['pdfjs-dist'],
          reactPageflip: ['react-pageflip'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
