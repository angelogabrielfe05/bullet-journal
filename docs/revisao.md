# Revisão e testes — Bullet Journal v1

> Documento da Etapa 5. Feito em 16/11/2026, antes da publicação. Aprovado para publicar em 16/11/2026.

## 1. Testes automáticos

- `npm test`: 7 arquivos, 52 testes, todos passando (eram 48; +4 vieram das correções da revisão). Cobrem datas, atalhos de digitação, números em pt-BR, regras de hábitos (escala, meta, progresso, sequência), itens (criar, ordenar, mover, apagar/desfazer), pendências e migração mensal (migrar, agendar, descartar, desfazer) e backup (ida e volta, validação, resumo).
- Prova de que os testes pegam erro: a regra da sequência foi estragada de propósito e 3 testes falharam (Tarefa 2).
- `npx tsc -b` (checagem de tipos) e `npm run lint`: sem erros nem avisos.
- `npm run build`: passa; o app inteiro tem ~580 KB guardados para uso offline (12 arquivos, incluindo fontes e ícones).

## 2. Testes manuais no navegador

| O que | Como | Resultado |
|---|---|---|
| Fluxo de um dia (Hoje) | Criar itens com cada atalho, concluir, editar, recuar, arrastar, pendentes (migrar/agendar/descartar/desfazer), hábitos, reflexão, recarregar a página | OK, nada se perde |
| Hábitos | Marcar Academia de 9 a 13/11 com hábitos desde 01/11 | 6/11 · 55% e sequência 6, como calculado à mão |
| Ajustes | Criar, editar (meta "2.500"), reordenar, arquivar/reativar; validação | OK |
| Backup | Exportar → apagar itens e marcações → importar; arquivo inválido | Tudo voltou igual; inválido recusado com mensagem clara |
| Mês | Marcadores do calendário, eventos, tarefa do mês movida para um dia | OK |
| Futuro | Itens com e sem dia em janeiro; aparecem no Mês de janeiro | OK |
| Virada do mês | 4 tarefas de outubro → Migração completa com desfazer | Cada tarefa no destino certo; avisos somem |
| Primeiro uso | Navegador zerado | 5 hábitos criados, sem avisos indevidos, sem erros |
| Offline | Versão final; abrir uma vez, cortar a rede, recarregar | As 6 telas abrem; anotar e marcar hábito funcionam e ficam salvos |
| Larguras | 360, 375, 430 px e 1280 px, nas 6 telas | Sem rolagem lateral indevida; console sem erros nem avisos |

## 3. Revisão independente

Um revisor separado (subagente), sem o histórico da construção, leu o PRD, as tarefas e todo o código. Confirmou como corretos: datas como dia local, sequência e progresso, pendências só do mês atual, migração com desfazer, importação tudo-ou-nada, caminho `/bullet-journal/`, cache offline, ícones, nenhuma chamada de rede, 0 vulnerabilidades nas dependências do app e campos com 16 px (sem zoom no iPhone).

Achados: **1 grave, 5 médios, 11 baixos**.

## 4. O que foi corrigido

| # | Gravidade | Problema | Correção |
|---|---|---|---|
| 1 | Grave | Backup editado à mão (ex.: hábito sem `dias`) passava na checagem, apagava os dados e deixava Ajustes em branco | Validação campo a campo de itens, hábitos, marcações e reflexões (tipos, estados, datas, dias 0–6, meta); arquivo recusado inteiro antes de apagar qualquer coisa. 8 casos de arquivo estragado nos testes |
| 2 | Média | Reflexão e edição de texto podiam perder o digitado ao fechar o app | Salvam na hora quando o app vai para o segundo plano (`visibilitychange`/`pagehide`). Testado |
| 3 | Média | Erro em uma tela deixava o app em branco | Proteção de erro: "Ops…" com Recarregar e Salvar backup; as abas continuam funcionando. Testado com um hábito quebrado de propósito |
| 4 | Média | Atalho `o ` não funcionava no iPhone (maiúscula automática) e o botão não corrigia um atalho errado | Aceita `O `; tocar num botão de símbolo vence o atalho e mantém o texto como digitado. +1 teste |
| 5 | Média | Safari pode recusar o "compartilhar" do backup | Plano B: se o compartilhar falhar, baixa o arquivo |
| 6 | Média | Editar dias/tipo de um hábito refaz as contas do passado | Aviso no formulário de edição (o histórico de escalas fica para a v2, ver pendências) |
| 7 | Baixa | Subitem ficava recuado sob nada ao apagar o item de cima | Apagar o primeiro item tira o recuo do novo primeiro. +1 teste |
| 8 | Baixa | Trocar o símbolo reabria tarefa já migrada (duplicava nas pendentes) | Migrada/agendada/descartada mantém o estado. +1 teste |
| 10 | Baixa | Erro de importação aparecia atrás do painel | Painel fecha antes do aviso |
| 12 | Baixa | Calendário mostrava no máximo 3 marquinhas | Acima de 3, mostra o número (ex.: •5) |
| 13 | Baixa | Textos de exemplo, destino "→ 16/11" e S/D do calendário com contraste 2,5:1 | Novo tom `--tinta-dica` (5,0:1 no papel, 4,6:1 no painel) |
| 14 | Baixa | Quadradinhos da grade de hábitos com 26 px para o dedo | O botão ocupa a célula inteira (34 × 60 px) |
| 15 | Baixa | Leitor de tela falava "salvando…" a cada tecla na reflexão | Anuncia só "Reflexão salva" |
| 16 | Baixa | App instalado podia demorar a pegar versão nova | Procura atualização ao voltar para o app e a cada hora; mostra "Nova versão · Atualizar" (não recarrega sozinho no meio da escrita) |

Também nesta etapa: ícone do app (192, 512, maskable, iPhone 180 px e favicon), lista de arquivos offline sem duplicatas (12 arquivos, ~590 KB).

## 5. Pendências conhecidas

Itens da revisão **não corrigidos**: por decisão de 16/11/2026, foram para [ideias-futuras.md](ideias-futuras.md) (v2). Nenhum perde dados nem trava o uso.

- **#6 (parte 2) Histórico da escala dos hábitos:** guardar `escalas: [{desde, dias}]` para que mudar os dias não reescreva o passado. Mudança de modelo de dados.
- **#9 Avisos com desfazer em fila:** se duas ações acontecem em menos de 5 s, o desfazer da primeira some.
- **#11 Contador da migração:** "X de Y decididas" zera ao sair e voltar da tela (o trabalho feito não se perde, só o contador).
- **#17 Código duplicado:** juntar o fluxo decidir/desfazer de Pendentes e Migração e os nomes de dias/meses num lugar só.

Para conferir **no iPhone de verdade** (não dá para simular aqui):

- Fluxo do backup "Salvar em Arquivos".
- Teclado cobrindo o campo do painel de quantidade.
- Aparência dos campos de data/hora vazios no Safari.
- Instalação na Tela de Início, ícone e uso offline no aparelho.

Observação técnica: no Windows, `npm test` pode falhar com "Vitest failed to find the runner" se o terminal estiver em `c:\` (minúsculo) em vez de `C:\`. É um problema conhecido do Vitest, não do app.
