# Próximos passos — Bullet Journal

> Documento da Etapa 6. Publicado em 16/11/2026.

## Link do app

**https://angelogabrielfe05.github.io/bullet-journal/**

Código: https://github.com/angelogabrielfe05/bullet-journal (público; seus dados **não** ficam lá, só no aparelho).

## Instalar no iPhone

1. Abra o link acima no **Safari** (precisa ser o Safari).
2. Toque no botão **Compartilhar** (quadrado com seta para cima).
3. Role e toque em **Adicionar à Tela de Início** → **Adicionar**.
4. Abra o app pelo ícone novo (página pontilhada com • ○ X). Ele abre em tela cheia.
5. Teste offline: ative o **Modo Avião** e abra o app pelo ícone. Tudo deve funcionar.

Importante: os dados ficam no app instalado. Se você abrir o link no Safari em vez do ícone, verá um caderno separado (vazio).

## Como usar (resumo)

- **Hoje:** anote com os botões • ○ – * ou com atalhos (`-` nota, `o` evento, `*` prioridade). Toque no • para concluir, no texto para editar, em ⋯ para o menu e arraste pela alça ⠿. As tarefas abertas de dias anteriores aparecem em **Pendentes**: Hoje (<), Agendar (>) ou Descartar.
- **Hábitos:** grade do mês; toque nos quadradinhos. Água e corrida abrem o painel de quantidade.
- **Mês:** calendário (toque num dia para abrir), eventos e tarefas do mês.
- **Futuro:** o que é para os próximos 6 meses. **Migração:** na virada do mês, o Hoje avisa; decida o destino de cada tarefa aberta.
- **Ajustes (⚙):** hábitos (criar, editar, ordenar, arquivar), backup e legenda dos símbolos.

## Rotina de backup (importante)

O iPhone pode apagar dados de apps da web pouco usados, e não há sincronização na v1.

- Uma vez por semana: **⚙ Ajustes → Exportar backup → Salvar em Arquivos** (de preferência no iCloud Drive).
- O app lembra você no Hoje depois de 7 dias sem backup.
- Para restaurar (ou passar para outro aparelho): **⚙ Ajustes → Importar backup** e escolha o arquivo `.json`.

## Como atualizar o app

1. Abra a pasta `bullet-journal` no VS Code com o Claude Code e peça a mudança (ex.: "quero o modo escuro"). Diga "use a skill criar-web-app" para seguir o mesmo workflow.
2. Depois de testado, o Claude Code faz o commit e o envio (`git push`).
3. O GitHub roda os testes e publica sozinho em 1–2 minutos (acompanhe em github.com/angelogabrielfe05/bullet-journal/actions). Se um teste falhar, a versão antiga continua no ar.
4. No iPhone, ao abrir o app, aparece **"Nova versão do app · Atualizar"**. Toque em Atualizar.

Para rodar no computador: `npm run dev` e abra http://localhost:5173/bullet-journal/.

## Limitações conhecidas da v1

- Dados só num aparelho; para passar ao computador, só por backup.
- Mudar os dias ou o tipo de um hábito refaz as contas dos meses anteriores (o app avisa ao editar).
- Se duas ações forem feitas em menos de 5 s, o "Desfazer" da primeira some.
- O contador "X de Y decididas" da migração recomeça se você sair da tela.

## v2: lista priorizada

Puxada de [ideias-futuras.md](ideias-futuras.md). Ordem sugerida pelo uso diário e pelo esforço; você decide a ordem final.

1. **Histórico da escala dos hábitos:** mudar a rotina sem estragar as contas do passado. Pequeno, e protege os dados.
2. **Modo escuro:** pequeno; útil para anotar à noite.
3. **Eventos que se repetem** (ex.: plantão toda terça): médio.
4. **Hábitos "X vezes por semana":** médio; muda o cálculo da sequência.
5. **Coleções personalizadas** (livros, treinos, estudos): médio a grande.
6. **Gráficos e relatório anual:** médio.
7. **Índice com páginas:** médio; faz mais sentido depois das coleções.
8. **Lembretes e notificações:** grande; no iPhone exigem um servidor de envio (sai do "grátis e simples").
9. **Login e sincronização entre aparelhos:** grande; exige servidor e conta.
10. Melhorias menores: avisos de desfazer em fila, contador da migração persistente, mais níveis de subitens, organização do código.

## Ajustes no workflow

- 16/11/2026: v1 dada como concluída pelo usuário depois de instalar e testar no iPhone (offline, backup, teclado e datas ok). Nenhuma etapa do workflow foi apontada como travada ou sobrando.
- Ajuste pós-publicação pedido pelo usuário: no Hoje, os hábitos passaram a ficar em lista vertical (um embaixo do outro) em vez de uma fileira com rolagem lateral.
