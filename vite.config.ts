import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      },
      includeAssets: ['logo192.png', 'logo512.png'],
      manifest: {
        "short_name": "TrackerPG",
        "name": "TrackerPG - NEET PG Syllabus Tracker",
        "icons": [
          {
            "src": "/logo192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "/logo512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        "start_url": ".",
        "display": "standalone",
        "theme_color": "#0f172a",
        "background_color": "#0f172a",
        "description": "A tool to track your NEET PG syllabus preparation."
      },
    })
  ],
})