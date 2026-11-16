import type { EstadoItem, TipoItem } from '../dados/tipos'

/**
 * Símbolos do rapid logging, desenhados em SVG para ficarem nítidos
 * e com o mesmo tamanho em qualquer aparelho.
 *
 *  • tarefa   ○ evento   – nota
 *  X concluída   < migrada   > agendada   (riscada = descartada)
 */

interface Props {
  tipo: TipoItem
  estado?: EstadoItem
  tamanho?: number
}

export function Simbolo({ tipo, estado = 'aberta', tamanho = 20 }: Props) {
  return (
    <svg
      className="simbolo"
      data-tipo={tipo}
      data-estado={estado}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {desenho(tipo, estado)}
    </svg>
  )
}

function desenho(tipo: TipoItem, estado: EstadoItem) {
  if (tipo === 'evento') return <circle cx="10" cy="10" r="5.2" strokeWidth={1.9} />
  if (tipo === 'nota') return <path d="M4.5 10h11" strokeWidth={2.2} />

  switch (estado) {
    case 'concluida':
      return <path d="M5 5l10 10M15 5 5 15" strokeWidth={2.3} />
    case 'migrada':
      return <path d="M13.5 4 7 10l6.5 6" strokeWidth={2.3} />
    case 'agendada':
      return <path d="M6.5 4 13 10l-6.5 6" strokeWidth={2.3} />
    default: // aberta e descartada
      return <circle cx="10" cy="10" r="3.6" fill="currentColor" stroke="none" />
  }
}

/** * de prioridade, na caneta vermelha. */
export function MarcaPrioridade({ tamanho = 14 }: { tamanho?: number }) {
  return (
    <svg
      className="marca-prioridade"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 14 14"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 1.5v11M2.2 4.2l9.6 5.6M11.8 4.2 2.2 9.8" />
    </svg>
  )
}
