import type { Item } from '../dados/tipos'
import { MarcaPrioridade, Simbolo } from './Simbolo'

interface Props {
  item: Item
  /** Texto curto à direita, ex.: "sáb, 14" ou "lista do mês". */
  rotuloData: string
  /** Botão de migrar (<), ex.: "Hoje" ou "Este mês". */
  rotuloMigrar: string
  aoMigrar: () => void
  aoAgendar: () => void
  aoDescartar: () => void
}

/** Uma tarefa aberta esperando decisão: migrar (<), agendar (>) ou descartar. */
export function LinhaDecisao({ item, rotuloData, rotuloMigrar, aoMigrar, aoAgendar, aoDescartar }: Props) {
  return (
    <li className="pendente">
      <div className="pendente__linha">
        <span className="bullet__prioridade">{item.prioridade && <MarcaPrioridade />}</span>
        <Simbolo tipo="tarefa" />
        <span className="pendente__texto">{item.texto}</span>
        <span className="pendente__data">{rotuloData}</span>
      </div>
      <div className="pendente__acoes">
        <button type="button" className="botao botao--secundario botao--pequeno" onClick={aoMigrar}>
          <Simbolo tipo="tarefa" estado="migrada" tamanho={14} /> {rotuloMigrar}
        </button>
        <button type="button" className="botao botao--secundario botao--pequeno" onClick={aoAgendar}>
          Agendar <Simbolo tipo="tarefa" estado="agendada" tamanho={14} />
        </button>
        <button type="button" className="botao botao--fantasma botao--pequeno" onClick={aoDescartar}>
          Descartar
        </button>
      </div>
    </li>
  )
}
