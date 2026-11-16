# Bullet Journal digital — PWA pessoal

App pessoal, instalável no iPhone, no estilo de um bullet journal (método Ryder Carroll) em caderno pontilhado. Telas da v1: **Hoje** (registro diário), **Hábitos** (grade do mês com progresso e streak), **Mês** (calendário + tarefas) e **Futuro + Migração**, além de Ajustes (hábitos e backup). Dados só no aparelho (offline), com exportar/importar backup em JSON.

## Stack

TypeScript · React · Vite · Dexie (IndexedDB) · vite-plugin-pwa · dnd-kit · date-fns (pt-BR) · Vitest · GitHub Pages. Detalhes em [docs/stack.md](docs/stack.md).

## Documentos

- [docs/prd.md](docs/prd.md): o que a v1 faz e não faz (fonte da verdade do escopo)
- [docs/stack.md](docs/stack.md): tecnologias e decisões técnicas
- [docs/tarefas.md](docs/tarefas.md): checklist da construção (a primeira caixa não marcada indica onde continuar)
- [docs/revisao.md](docs/revisao.md): revisão e testes (Etapa 5)
- [docs/proximos-passos.md](docs/proximos-passos.md): link, uso, atualização e v2 (Etapa 6)
- [docs/ideias-futuras.md](docs/ideias-futuras.md): tudo que ficou fora da v1

## Regras do workflow (skill criar-web-app)

- Seis etapas com portão de aprovação ao fim de cada uma: PRD → stack → tarefas → construção → revisão → publicação.
- Nada de código antes da Etapa 4. Na construção, fazer uma subtarefa por vez, conferir, marcar `- [x]` em `docs/tarefas.md` e perguntar antes de seguir. Nunca passar de uma tarefa principal para outra sem parar.
- Um commit por tarefa principal, com mensagem em português.
- Ideia nova vai para `docs/ideias-futuras.md`; mudar o escopo exige atualizar o PRD e as tarefas antes.
- O usuário não é desenvolvedor: explicar sem jargão, recomendar em vez de listar opções, tudo gratuito por padrão.
- Tudo em português do Brasil.
