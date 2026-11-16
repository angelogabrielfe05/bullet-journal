import type { ReactNode } from 'react'
import { irPara } from '../navegacao'

interface Props {
  titulo: string
  children?: ReactNode
  /** Esconde o botão de Ajustes (usado na própria tela de Ajustes). */
  semAjustes?: boolean
}

/** Moldura comum de toda tela: cabeçalho com título e botão de Ajustes. */
export function Pagina({ titulo, children, semAjustes }: Props) {
  return (
    <section className="pagina">
      <header className="pagina__cabecalho">
        <h1 className="pagina__titulo">{titulo}</h1>
        {!semAjustes && (
          <button
            type="button"
            className="pagina__ajustes"
            aria-label="Ajustes"
            onClick={() => irPara('ajustes')}
          >
            ⚙
          </button>
        )}
      </header>
      <div className="pagina__conteudo">{children}</div>
    </section>
  )
}
