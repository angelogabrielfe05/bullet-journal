# Ideias futuras (fora da v1)

Tudo que surgir e não fizer parte da v1 vem para cá. Na Etapa 6, esta lista vira a v2 priorizada.

## Decidido já na Etapa 1 (16/11/2026)

- **Login e sincronização entre aparelhos:** usar no iPhone e no computador com os mesmos dados.
- **Lembretes e notificações:** ex.: "beba água", "hora de migrar o mês".
- **Coleções personalizadas:** livros lidos, treinos, séries, lista de estudos etc.
- **Índice com páginas:** sumário do caderno com links para coleções e meses.
- **Gráficos e relatório anual:** evolução dos hábitos, tarefas concluídas por mês.
- **Modo escuro.**

## Surgiu durante a entrevista

- **Eventos que se repetem:** ex.: plantão toda terça.
- **Hábitos "X vezes por semana":** ex.: academia 4x/semana em qualquer dia, com sequência contada em semanas.
- **Mais de um nível de subitens:** a v1 permite só 1 nível de recuo.

## Vindas da revisão (Etapa 5, 16/11/2026)

- **Histórico da escala dos hábitos:** guardar `escalas: [{desde, dias}]` para que mudar os dias (ou o tipo) de um hábito não refaça as contas dos meses anteriores. Hoje o app só avisa ao editar.
- **Avisos de desfazer em fila:** se duas ações acontecem em menos de 5 s, o "Desfazer" da primeira some.
- **Contador da migração persistente:** "X de Y decididas" zera ao sair e voltar da tela (o trabalho feito fica salvo; só o contador recomeça).
- **Organização do código:** juntar o fluxo decidir/desfazer de Pendentes e Migração num componente só; nomes de dias e meses só em `src/regras/datas.ts`.
