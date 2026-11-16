/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Endereço base no GitHub Pages: https://<usuario>.github.io/bullet-journal/
const BASE = '/bullet-journal/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      // Atualiza o app sozinho quando houver versão nova publicada.
      registerType: 'autoUpdate',
      includeAssets: ['icone.svg'],
      manifest: {
        name: 'Bullet Journal',
        short_name: 'BuJo',
        description: 'Bullet journal pessoal com hábitos, registro diário, mês e futuro.',
        lang: 'pt-BR',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fbf8f1',
        theme_color: '#fbf8f1',
        icons: [{ src: 'icone.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        // Guarda no aparelho tudo que o app precisa para abrir offline.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${BASE}index.html`,
      },
    }),
  ],
  test: {
    environment: 'node',
    // Simula o banco do navegador (IndexedDB) nos testes.
    setupFiles: ['fake-indexeddb/auto'],
  },
})
