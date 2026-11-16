import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { agendar, descartar, desfazerDecisao, listarPendentes, migrarParaHoje } from '../dados/migracao'
import type { Item } from '../dados/tipos'
import { formatarDiaCurto, formatarMes, type Dia } from '../regras/datas'
import { useAviso } from './avisoContexto'
import { PainelAgendar } from './PainelAgendar'
import { MarcaPrioridade, Simbolo } from './Simbolo'

/**
 * Migração diária: tarefas abertas de dias anteriores deste mês,
 * cada uma com 3 destinos (migrar para hoje, agendar, descartar).
 */
export function Pendentes({ hoje }: { hoje: Dia }) {
  const pendentes = useLiveQuery(() => listarPendentes(hoje), [hoje])
  const [agendando, setAgendando] = useState<Item | null>(null)
  const avisar = useAviso()

  if (!pendentes?.length) return null

  const comDesfazer = (texto: string, id: string) =>
    avisar({ texto, acao: { rotulo: 'Desfazer', aoClicar: () => void desfazerDecisao(id) } })

  return (
    <section className="bloco bloco--pendentes" aria-labelledby="titulo-pendentes">
      <header className="bloco__cabecalho">
        <h2 id="titulo-pendentes" className="bloco__titulo">
          Pendentes <span className="bloco__contagem">{pendentes.length}</span>
        </h2>
        <p className="bloco__ajuda">Tarefas abertas de dias anteriores. O que fazer com cada uma?</p>
      </header>

      <ul className="pendentes">
        {pendentes.map((item) => (
          <li key={item.id} className="pendente">
            <div className="pendente__linha">
              <span className="bullet__prioridade">{item.prioridade && <MarcaPrioridade />}</span>
              <Simbolo tipo="tarefa" />
              <span className="pendente__texto">{item.texto}</span>
              <span className="pendente__data">{formatarDiaCurto(item.dia!)}</span>
            </div>
            <div className="pendente__acoes">
              <button
                type="button"
                className="botao botao--secundario botao--pequeno"
                onClick={async () => {
                  await migrarParaHoje(item.id, hoje)
                  comDesfazer('Migrada para hoje', item.id)
                }}
              >
                <Simbolo tipo="tarefa" estado="migrada" tamanho={14} /> Hoje
              </button>
              <button type="button" className="botao botao--secundario botao--pequeno" onClick={() => setAgendando(item)}>
                Agendar <Simbolo tipo="tarefa" estado="agendada" tamanho={14} />
              </button>
              <button
                type="button"
                className="botao botao--fantasma botao--pequeno"
                onClick={async () => {
                  await descartar(item.id)
                  comDesfazer('Tarefa descartada', item.id)
                }}
              >
                Descartar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <PainelAgendar
        aberto={!!agendando}
        aoFechar={() => setAgendando(null)}
        hoje={hoje}
        texto={agendando?.texto}
        aoEscolher={async (mes, dia) => {
          if (!agendando) return
          const id = agendando.id
          await agendar(id, mes, dia)
          comDesfazer(`Agendada para ${dia ? formatarDiaCurto(dia) : formatarMes(mes)}`, id)
        }}
      />
    </section>
  )
}
