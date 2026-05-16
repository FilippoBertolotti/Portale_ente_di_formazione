import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Condivide in LAN
    port: 5173,
    open: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
});
