# PRD — Bullet Journal digital (v1)

> Documento da Etapa 1. Define o que a v1 faz e o que não faz.
> Criado em 16/11/2026. Status: **aprovado em 16/11/2026** (incluindo os 4 acréscimos: faixa de hábitos no Hoje, lembrete de backup, 1 nível de subitens e atalhos de digitação).

## 1. Em uma frase

Um app pessoal, instalável no iPhone, que funciona como um caderno pontilhado de bullet journal: registro diário com os símbolos do método, rastreador de hábitos em grade mensal, calendário do mês, registro futuro e migração. Funciona offline e guarda tudo no próprio aparelho.

## 2. Para quem e para quê

- **Usuário:** só eu (uso pessoal, um único usuário, sem login).
- **Problema:** organizar tarefas, eventos e hábitos do dia a dia num único lugar, com a lógica do Bullet Journal (Ryder Carroll), sem papel e sem depender de internet.
- **Uso típico:** abrir de manhã para ver o dia e as pendências, anotar rápido ao longo do dia, marcar os hábitos à noite, migrar as tarefas abertas na virada do mês.
- **Aparelho principal:** iPhone (Safari), instalado na tela de início. Também precisa funcionar num navegador de computador.

## 3. Referências

- Método: [bulletjournal.com: What is the Bullet Journal Method](https://bulletjournal.com/blogs/faq/what-is-the-bullet-journal-method), [101planners.com](https://www.101planners.com/printable-bullet-journal), [habitify.me](https://www.habitify.me/blog/how-to-bullet-journal).
- Organização: Notion (blocos que se editam, reordenam e recuam).
- Visual: caderno de papel pontilhado (dotted), com os símbolos do método em destaque.

## 4. Símbolos (rapid logging)

| Símbolo | Significado | Observação |
|---|---|---|
| • | Tarefa | Estado inicial de toda tarefa |
| ○ | Evento | Tem data e, se quiser, horário |
| – | Nota | Informação, sem ação |
| * | Prioridade | Marcador que se soma a uma tarefa (ex.: * • Entregar relatório) |
| X | Concluída | Tarefa feita |
| < | Migrada | Tarefa levada para outro dia ou mês |
| > | Agendada | Tarefa enviada para o Registro Futuro |
| ~~riscado~~ | Descartada | Tarefa que deixou de importar |

Tocar no símbolo de uma tarefa a marca como concluída (X). Tocar de novo desfaz.

## 5. Telas da v1

Navegação por uma barra fixa embaixo com 4 abas: **Hoje · Hábitos · Mês · Futuro**. Um ícone de engrenagem dá acesso a **Ajustes** (hábitos e backup).

### 5.1 Hoje (registro diário)

- Cabeçalho com a data por extenso (ex.: "segunda, 16 de novembro") e setas para ir ao dia anterior/seguinte, além de um botão "voltar para hoje".
- **Pendentes de dias anteriores:** bloco no topo com as tarefas abertas (•) de dias passados **do mês atual**. As de meses anteriores ficam para a migração mensal (5.4), para a mesma tarefa não aparecer em dois lugares. Cada uma tem 3 ações:
  - **Migrar para hoje** → o original vira `<` e uma cópia aberta entra no dia de hoje.
  - **Agendar** → escolhe um mês futuro; o original vira `>` e a tarefa vai para o Registro Futuro.
  - **Descartar** → a tarefa fica riscada.
  - O bloco some quando não há pendências.
- **Hábitos de hoje:** faixa compacta com os hábitos que valem para o dia, para marcar sem sair da tela (atalho para a mesma informação da aba Hábitos).
- **Lista do dia (bullets):**
  - Adicionar rápido: campo no fim da lista, com seletor de símbolo (• ○ –) e opção de prioridade (*). Atalho de digitação: começar com `-` vira nota, `o ` vira evento, `*` marca prioridade.
  - Eventos (○) podem ter horário opcional.
  - Editar o texto tocando nele; trocar o símbolo (ex.: nota → tarefa).
  - Reordenar arrastando.
  - Subitens: recuar um item para ficar "dentro" do item acima (1 nível de recuo na v1).
  - Apagar item.
- **Reflexão do dia:** campo de texto livre no fim da página, salvo automaticamente.

### 5.2 Hábitos (grade do mês)

- Grade estilo caderno: hábitos nas linhas, dias do mês nas colunas, com o mês atual e setas para meses anteriores.
- Dias em que o hábito não vale (fora da escala) aparecem apagados e não contam.
- **Hábito simples (check):** tocar na célula marca/desmarca.
- **Hábito com quantidade:** tocar na célula abre um pequeno painel para somar (botões rápidos, ex.: +250 ml / +500 ml para água; campo livre para km). A célula fica marcada quando a meta do dia é atingida e mostra preenchimento parcial quando não.
- Para cada hábito:
  - **Progresso do mês:** dias cumpridos ÷ dias previstos até hoje (ex.: 12/15 · 80%).
  - **Sequência (streak):** quantos dias previstos seguidos foram cumpridos. Dias fora da escala não quebram a sequência. O dia de hoje, enquanto não for marcado, também não quebra.
- **Hábitos iniciais** (editáveis em Ajustes):

| Hábito | Tipo | Meta diária | Dias |
|---|---|---|---|
| Academia | Check | — | seg a sex |
| Leitura | Check | — | todos os dias |
| Estudo | Check | — | todos os dias |
| Água | Quantidade | 2.000 ml | todos os dias |
| Corrida | Quantidade | 5 km | ter, qui, sáb |

- Em Ajustes: criar, editar (nome, tipo, unidade, meta, dias da semana), reordenar e arquivar hábitos. Arquivar esconde o hábito sem apagar o histórico.

### 5.3 Mês (calendário + tarefas)

- **Calendário do mês** (semana começando na segunda), com setas para outros meses.
  - Cada dia mostra marcadores discretos: pontinho para eventos e contagem de tarefas abertas.
  - Tocar num dia abre o registro diário daquele dia (tela Hoje naquela data).
- **Lista de eventos do mês:** ○ com data e horário, em ordem cronológica.
- **Tarefas do mês:** lista de tarefas que são do mês, mas não de um dia específico (ex.: "renovar matrícula"). Mesmas ações de item da tela Hoje (marcar, editar, prioridade, reordenar, apagar, mover para um dia).

### 5.4 Futuro + Migração

- **Registro Futuro:** os próximos 6 meses, um bloco por mês, com tarefas e eventos agendados (>).
  - Adicionar item direto a um mês futuro, com data opcional.
  - Quando o mês chega, os itens dele passam a aparecer no Mês (eventos no calendário, tarefas na lista do mês).
- **Migração mensal:**
  - Na virada do mês, a tela Hoje mostra um aviso: "Hora de migrar outubro: 7 tarefas abertas".
  - A tela de migração lista todas as tarefas abertas do mês anterior (dos dias e da lista do mês), uma por vez ou em lista, com 3 decisões: **migrar para este mês** (<), **agendar** para um mês futuro (>) ou **descartar** (riscada).
  - Mostra o progresso ("4 de 7 decididas") e confirma quando terminar.
  - Também pode ser aberta a qualquer momento pela aba Futuro.

### 5.5 Ajustes

- Gerenciar hábitos (ver 5.2).
- **Exportar backup:** baixa um arquivo `.json` com todos os dados (nome com data, ex.: `bujo-backup-2026-11-16.json`).
- **Importar backup:** escolhe um arquivo, mostra um resumo (quantos dias, hábitos e itens) e pede confirmação antes de substituir os dados atuais.
- **Lembrete de backup dentro do app:** mostra "último backup há X dias" e um aviso discreto na tela Hoje se passar de 7 dias. Não é notificação; só aparece com o app aberto.

## 6. Regras de dados

- Tudo fica salvo **só no aparelho** (armazenamento local do navegador), sem servidor e sem conta.
- O app pede ao navegador para tratar os dados como **persistentes** (para reduzir o risco de o iPhone apagá-los).
- Salvamento automático a cada alteração; não existe botão "salvar".
- Apagar um item pede confirmação ou permite desfazer logo em seguida.
- O arquivo de backup inclui um número de versão do formato, para importações futuras continuarem funcionando.

## 7. Requisitos gerais

- **Offline:** depois da primeira abertura, o app funciona sem internet.
- **Instalável (PWA):** ícone, nome e tela cheia ao abrir pela tela de início do iPhone.
- **Celular primeiro:** pensado para iPhone (a partir de 360 px de largura), com áreas de toque confortáveis; também usável no computador.
- **Português do Brasil**, datas no formato brasileiro, semana começando na segunda.
- **Visual:** fundo de papel com grade pontilhada, tipografia de caderno, símbolos do método grandes e legíveis. Só modo claro na v1.
- **Rápido:** abrir e já estar no dia de hoje em menos de 2 segundos num iPhone comum.

## 8. Fora da v1

Registrado em [ideias-futuras.md](ideias-futuras.md):

- Login e sincronização entre aparelhos
- Lembretes e notificações
- Coleções personalizadas (livros, treinos etc.)
- Índice com páginas
- Gráficos e relatório anual
- Modo escuro
- Eventos que se repetem
- Hábitos do tipo "X vezes por semana"
- Mais de um nível de subitens

## 9. Como saber que a v1 deu certo

1. Consigo instalar no iPhone e abrir sem internet.
2. Anoto uma tarefa, um evento e uma nota em menos de 10 segundos cada.
3. No dia seguinte, a tarefa não concluída aparece em "Pendentes" e consigo migrar, agendar ou descartar com um toque.
4. Marco os 5 hábitos e vejo progresso do mês e sequência corretos (inclusive respeitando os dias da escala).
5. Vejo o mês no calendário com os eventos e abro qualquer dia a partir dele.
6. Na virada do mês, faço a migração inteira pela tela de Migração.
7. Exporto um backup, apago os dados, importo o arquivo e tudo volta igual.
8. Uso o app todos os dias por 2 semanas sem voltar para o papel.

## 10. Riscos conhecidos

- **iPhone e dados locais:** o Safari pode apagar dados de sites pouco usados. Instalado na tela de início e usado com frequência, o risco cai bastante, mas o backup em arquivo continua sendo a proteção real. Por isso existe o lembrete de backup.
- **Um aparelho só:** sem sincronização, dados do iPhone e do computador ficam separados. Para passar de um para o outro, só por backup.
