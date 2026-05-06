import path from "path"
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: "Attendance System",
      short_name: "Attendance",
      description: "Attendance System",
      // theme_color: "#fff",
      // background_color: "#fff",
      display: "standalone",
      scope: "/",
    },
   
    // ... manifest and workbox configurations
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
