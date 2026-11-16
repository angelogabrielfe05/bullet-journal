# Tarefas — Bullet Journal digital (v1)

> Documento da Etapa 3. Guia a construção (Etapa 4).
> Regra: uma subtarefa por vez → conferir → marcar `[x]` → perguntar antes de seguir.
> Um commit no fim de cada tarefa principal. A primeira caixa não marcada indica onde continuar.

## 1.0 Estrutura do projeto

- [x] 1.1 Criar o projeto com Vite + React + TypeScript e conferir que abre em `http://localhost:5173`
- [x] 1.2 Iniciar o git, criar o `.gitignore` e fazer o primeiro commit
- [x] 1.3 Instalar as dependências da stack (Dexie, dnd-kit, date-fns, vite-plugin-pwa, Vitest)
- [x] 1.4 Organizar as pastas (`src/telas`, `src/componentes`, `src/dados`, `src/regras`, `src/estilos`)
- [x] 1.5 Criar a navegação com barra inferior de 4 abas (Hoje, Hábitos, Mês, Futuro) e o botão de Ajustes, com telas vazias
- [x] 1.6 Configurar o PWA básico (manifest com nome e cores, service worker) e o caminho base `/bullet-journal/`
- [x] 1.7 Conferir: build sem erros, navegação entre abas funcionando em 375 px de largura
- [x] 1.8 Commit: "Estrutura do projeto"

## 2.0 Dados e regras

- [x] 2.1 Definir os tipos dos dados: item (tarefa, evento, nota; estado; prioridade; data ou mês; horário; recuo; ordem), hábito, registro de hábito, reflexão do dia, ajustes
- [x] 2.2 Criar o banco local com Dexie (tabelas e índices) e pedir armazenamento persistente
- [x] 2.3 Criar os 5 hábitos iniciais na primeira abertura (academia, leitura, estudo, água 2.000 ml, corrida 5 km com as escalas do PRD)
- [x] 2.4 Funções de itens: criar, editar, trocar símbolo, marcar/desmarcar, recuar, reordenar, apagar
- [x] 2.5 Regra de pendências: listar tarefas abertas de dias anteriores; migrar para hoje (`<` + cópia), agendar (`>` + item no mês futuro), descartar (riscada)
- [x] 2.6 Regras de hábitos: "o hábito vale neste dia?", "foi cumprido?" (check ou meta), progresso do mês e sequência (streak) respeitando a escala
- [x] 2.7 Regra de migração mensal: listar tarefas abertas do mês anterior e aplicar migrar, agendar ou descartar
- [x] 2.8 Exportar backup (JSON com `versao` e data) e importar (validar, resumir, substituir)
- [x] 2.9 Testes automáticos (Vitest) para streak, progresso, pendências, migração e backup ida e volta
- [x] 2.10 Conferir: todos os testes passando
- [x] 2.11 Commit: "Dados e regras"

## 3.0 Visual do caderno

- [x] 3.1 Definir as cores e medidas (papel creme, tinta, destaque, espaçamento) como variáveis de estilo
- [x] 3.2 Fundo de papel com grade pontilhada alinhada às linhas do texto
- [x] 3.3 Escolher e embutir as fontes (uma para títulos com cara de caderno, uma legível para o texto), funcionando offline
- [x] 3.4 Componente de símbolo do bullet (• ○ – * X < > e riscado), grande e fácil de tocar
- [x] 3.5 Componentes base: botão, campo de texto, painel que sobe de baixo (bottom sheet), aviso com "desfazer"
- [x] 3.6 Ajustar a área segura do iPhone (entalhe e barra inferior) e a barra de abas no estilo caderno
- [x] 3.7 Conferir: página de amostra com todos os componentes em 375 px e no computador
- [x] 3.8 Commit: "Visual do caderno"

## 4.0 Tela Hoje

- [x] 4.1 Cabeçalho com a data por extenso, setas de dia anterior/seguinte e botão "hoje"
- [x] 4.2 Lista de itens do dia vinda do banco
- [x] 4.3 Campo de adicionar rápido com seletor de símbolo (• ○ –), prioridade (*) e atalhos de digitação (`-`, `o `, `*`)
- [x] 4.4 Horário opcional em eventos
- [x] 4.5 Tocar no símbolo para concluir/desfazer; tocar no texto para editar; menu do item (trocar símbolo, prioridade, apagar com desfazer)
- [x] 4.6 Recuar e desfazer o recuo (subitem, 1 nível)
- [x] 4.7 Reordenar arrastando (com toque)
- [x] 4.8 Bloco "Pendentes de dias anteriores" com migrar, agendar (escolha do mês) e descartar
- [x] 4.9 Faixa "Hábitos de hoje" com check e soma rápida de quantidade
- [x] 4.10 Reflexão do dia com salvamento automático
- [x] 4.11 Aviso de backup (mais de 7 dias) e aviso de migração mensal (quando houver tarefas abertas do mês anterior)
- [x] 4.12 Conferir: fluxo completo de um dia em 375 px, recarregando a página para ver que nada se perde
- [x] 4.13 Commit: "Tela Hoje"

## 5.0 Hábitos e Ajustes

- [x] 5.1 Grade do mês: hábitos nas linhas, dias nas colunas, rolagem horizontal confortável no celular, setas de mês
- [x] 5.2 Células: dia fora da escala apagado, check simples, preenchimento parcial para quantidade
- [x] 5.3 Painel de quantidade (+250 / +500 ml, campo livre para km, zerar)
- [x] 5.4 Progresso do mês e sequência ao lado de cada hábito
- [x] 5.5 Ajustes, hábitos: criar, editar (nome, tipo, unidade, meta, dias), reordenar e arquivar
- [x] 5.6 Ajustes, backup: exportar arquivo, importar com resumo e confirmação, "último backup há X dias"
- [x] 5.7 Conferir: marcar hábitos em vários dias e conferir progresso e sequência; backup ida e volta no navegador
- [x] 5.8 Commit: "Hábitos e Ajustes"

## 6.0 Mês, Futuro e Migração

- [x] 6.1 Calendário do mês (semana na segunda) com setas de mês e destaque no dia de hoje
- [x] 6.2 Marcadores nos dias (eventos e tarefas abertas); tocar no dia abre o registro daquele dia
- [x] 6.3 Lista de eventos do mês em ordem cronológica
- [x] 6.4 Tarefas do mês (sem dia): adicionar, mesmas ações de item, mover para um dia
- [x] 6.5 Registro Futuro: 6 meses à frente, adicionar item a um mês com data opcional
- [x] 6.6 Itens do Futuro aparecem no Mês quando o mês chega
- [x] 6.7 Tela de Migração: lista de tarefas abertas do mês anterior, migrar/agendar/descartar, progresso "X de Y" e confirmação final
- [x] 6.8 Conferir: simular uma virada de mês com dados de teste e fazer a migração inteira
- [x] 6.9 Commit: "Mês, Futuro e Migração"

## 7.0 Acabamento e publicação

- [x] 7.1 Ícone do app (tela de início do iPhone) e tela de abertura
- [x] 7.2 Testar offline: desligar a rede no navegador e usar todas as telas
- [x] 7.3 Passada final em 360, 375 e 430 px e no computador; zero erros no console
- [x] 7.4 → Etapa 5 (revisão independente e testes) antes de publicar
- [x] 7.5 Criar o repositório no GitHub (login feito pelo usuário) e enviar o código
- [x] 7.6 Configurar a publicação automática no GitHub Pages
- [x] 7.7 Abrir o link publicado e conferir que funciona
- [ ] 7.8 Instalar no iPhone (Compartilhar → Adicionar à Tela de Início) e testar offline no aparelho
- [x] 7.9 Commit final e `docs/proximos-passos.md`
