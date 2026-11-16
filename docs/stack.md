# Stack — Bullet Journal digital (v1)

> Documento da Etapa 2. Aprovado em 16/11/2026.

## Escolhas

| Camada | Escolha | Por quê |
|---|---|---|
| Linguagem | TypeScript | Avisa erros antes de rodar; facilita manutenção. |
| Interface | React | Componentes reutilizáveis; ecossistema grande e estável. |
| Build e servidor local | Vite | Rápido; recarrega na hora em `http://localhost:5173`. |
| Armazenamento | IndexedDB via Dexie | Banco local do navegador, offline, sem servidor. Dexie simplifica consultas e migrações de esquema. |
| PWA | vite-plugin-pwa (Workbox) | Gera service worker (cache offline) e manifest (ícone, nome, tela cheia). |
| Arrastar e soltar | dnd-kit | Reordenar itens com bom suporte a toque no iOS. |
| Datas | date-fns + locale pt-BR | Cálculo de dias, meses e semanas (início na segunda) e formatação em português. |
| Testes | Vitest | Testes das regras críticas: streak, progresso, migração, exportar/importar. |
| Publicação | GitHub Pages + GitHub Actions | Hospedagem estática gratuita; deploy automático a cada push na branch principal. |

Alternativa considerada para publicação: Vercel (exigiria uma segunda conta).

## Decisões técnicas

- **Sem backend e sem login.** Todos os dados ficam no IndexedDB do aparelho.
- **`navigator.storage.persist()`** é pedido na abertura para reduzir o risco de o Safari apagar os dados.
- **Backup:** exportação e importação em JSON com campo `versao` do formato.
- **Fontes servidas pelo próprio app** (não por CDN), para funcionarem offline.
- **Celular primeiro:** layout pensado para 360 a 430 px de largura (iPhone) e adaptado para telas maiores.
- **Caminho base** configurado para o GitHub Pages (`/bullet-journal/`).

## Custo

R$ 0. Conta necessária: GitHub (só na Etapa 6).

## Ambiente verificado (16/11/2026)

Node v24.21.0, npm 11.19.0, git 2.56.0, GitHub CLI 2.102.0.
