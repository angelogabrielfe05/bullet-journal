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
      // Quando houver versão nova publicada, o app avisa e a pessoa toca em "Atualizar"
      // (ver src/componentes/AvisoAtualizacao.tsx).
      registerType: 'prompt',
      // Os ícones já entram pelo globPatterns abaixo; isto evita listá-los duas vezes.
      includeManifestIcons: false,
      manifest: {
        name: 'Bullet Journal',
        short_name: 'BuJo',
        description: 'Bullet journal pessoal com hábitos, registro diário, mês e futuro.',
        lang: 'pt-BR',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#faf7f0',
        theme_color: '#faf7f0',
        icons: [
          { src: 'icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // O desenho fica na zona segura central, então serve também como "maskable".
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icone.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
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
