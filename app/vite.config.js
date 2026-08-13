import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' so the built app works from any path (local-first, no server routing needed).
export default defineConfig({
  plugins: [react()],
  base: './',
});
