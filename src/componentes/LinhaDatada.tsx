import type { Item } from '../dados/tipos'
import { irPara } from '../navegacao'
import { formatarDiaCurto } from '../regras/datas'
import { MarcaPrioridade, Simbolo } from './Simbolo'
import { descreverSimbolo } from './simbolosTexto'

/**
 * Item com dia, mostrado fora do registro diário (Mês, Futuro).
 * Tocar abre o registro daquele dia, onde dá para editar.
 */
export function LinhaDatada({ item }: { item: Item }) {
  if (!item.dia) return null
  const dia = item.dia
  return (
    <li>
      <button
        type="button"
        className="linha-datada"
        data-estado={item.estado}
        onClick={() => irPara('hoje', dia)}
        aria-label={`${formatarDiaCurto(dia)}${item.horario ? `, ${item.horario}` : ''}: ${descreverSimbolo(item.tipo, item.estado, item.prioridade)}, ${item.texto}. Abrir o dia.`}
      >
        <span className="linha-datada__dia">{formatarDiaCurto(dia)}</span>
        <span className="bullet__prioridade">{item.prioridade && <MarcaPrioridade />}</span>
        <Simbolo tipo={item.tipo} estado={item.estado} />
        <span className="linha-datada__texto">
          {item.horario && <span className="bullet__horario">{item.horario} </span>}
          {item.texto}
        </span>
      </button>
    </li>
  )
}
