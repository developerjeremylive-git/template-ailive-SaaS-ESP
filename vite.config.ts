import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Proxy API requests in development
      '/api/create-stripe-customer': {
        target: 'http://localhost:3000',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
       bypass: (req, res) => {
          return;
        }
      },
      '/api/create-checkout-session': {
        target: 'http://localhost:3000',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
      },
      '/api/deepseek': {
        target: 'http://localhost:3000',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          })
        },
         bypass: (req, res) => {
          return;
        }
      }
    }
  },
   resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Increase the warning limit to suppress the warning message
    chunkSizeWarningLimit: 1000
  }
});
