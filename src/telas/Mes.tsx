import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { AdicionarItem } from '../componentes/AdicionarItem'
import { Calendario } from '../componentes/Calendario'
import { LinhaDatada } from '../componentes/LinhaDatada'
import { ListaItens } from '../componentes/ListaItens'
import { NavegacaoMes } from '../componentes/NavegacaoMes'
import { Pagina } from '../componentes/Pagina'
import { PainelMoverDia } from '../componentes/PainelMoverDia'
import { useHoje } from '../componentes/useHoje'
import { db } from '../dados/banco'
import { itensDaLista, listaDoMes } from '../dados/itens'
import type { Item } from '../dados/tipos'
import { irPara, type PropsTela } from '../navegacao'
import { ehMesValido, mesDoDia, nomeDoMes, type Mes } from '../regras/datas'

/** Ordem dos eventos: dia, depois horário (sem horário primeiro), depois posição. */
const porDataEHorario = (a: Item, b: Item) =>
  (a.dia ?? '').localeCompare(b.dia ?? '') || (a.horario ?? '').localeCompare(b.horario ?? '') || a.ordem - b.ordem

/** Registro mensal: calendário + eventos + tarefas do mês. #/mes/2026-12 mostra dezembro. */
export function Mes({ parametro }: PropsTela) {
  const hoje = useHoje()
  const mesAtual = mesDoDia(hoje)
  const mes: Mes = parametro && ehMesValido(parametro) ? parametro : mesAtual
  const [movendo, setMovendo] = useState<Item | null>(null)

  const doMes = useLiveQuery(() => db.itens.where('mes').equals(mes).toArray(), [mes])
  const listaDoMesAtual = useLiveQuery(() => itensDaLista(listaDoMes(mes)), [mes])

  const eventos = (doMes ?? []).filter((i) => i.tipo === 'evento' && i.dia).sort(porDataEHorario)
  const ir = (destino: Mes) => (destino === mesAtual ? irPara('mes') : irPara('mes', destino))

  return (
    <Pagina titulo="Mês">
      <NavegacaoMes mes={mes} mesAtual={mesAtual} aoIr={ir} />

      {doMes && <Calendario mes={mes} hoje={hoje} itens={doMes} />}
      <p className="bloco__ajuda calendario__legenda">
        <span className="marca marca--evento" aria-hidden="true" /> evento <span className="marca marca--tarefa" aria-hidden="true" /> tarefa aberta
        · toque num dia para abrir
      </p>

      <section className="bloco" aria-labelledby="titulo-eventos">
        <h2 id="titulo-eventos" className="bloco__titulo">
          Eventos <span className="bloco__contagem">{eventos.length || ''}</span>
        </h2>
        {eventos.length ? (
          <ul className="lista-datada">
            {eventos.map((item) => (
              <LinhaDatada key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="vazio">Nenhum evento com data em {nomeDoMes(mes)}. Toque num dia do calendário para anotar um.</p>
        )}
      </section>

      <section className="bloco" aria-labelledby="titulo-tarefas-mes">
        <header className="bloco__cabecalho">
          <h2 id="titulo-tarefas-mes" className="bloco__titulo">
            Tarefas do mês
          </h2>
          <p className="bloco__ajuda">O que precisa sair em {nomeDoMes(mes)}, sem dia certo.</p>
        </header>
        {!!listaDoMesAtual?.length && (
          <ListaItens
            itens={listaDoMesAtual}
            acoesExtras={(item, fechar) => (
              <li>
                <button
                  type="button"
                  className="opcao"
                  onClick={() => {
                    fechar()
                    setMovendo(item)
                  }}
                >
                  <span className="opcao__icone" aria-hidden="true">
                    ↘
                  </span>
                  Mover para um dia
                </button>
              </li>
            )}
          />
        )}
        <AdicionarItem lista={listaDoMes(mes)} dica={`Anotar para ${nomeDoMes(mes)}…`} />
      </section>

      <PainelMoverDia item={movendo} aoFechar={() => setMovendo(null)} />
    </Pagina>
  )
}
