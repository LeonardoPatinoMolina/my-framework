import { defineConfig } from "./node_modules/vite/dist/node/index";

export default defineConfig({
  build: {
    outDir: '/dist',
    assetsDir: 'public',
    minify: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});