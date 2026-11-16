import { useEffect, useRef, type ReactNode } from 'react'
import { IconeFechar } from './Icones'

interface Props {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  children: ReactNode
}

/**
 * Painel que sobe de baixo (bottom sheet), como os menus do iPhone.
 * Usa o <dialog> do navegador: prende o foco, fecha com Esc e
 * tocando fora dele.
 */
export function PainelInferior({ aberto, aoFechar, titulo, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) dialogo.showModal()
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      className="painel"
      aria-label={titulo}
      onCancel={(e) => {
        e.preventDefault()
        aoFechar()
      }}
      onClick={(e) => {
        // Toque no fundo escuro (fora do conteúdo) fecha o painel.
        if (e.target === ref.current) aoFechar()
      }}
    >
      <div className="painel__conteudo">
        <div className="painel__alca" aria-hidden="true" />
        <header className="painel__cabecalho">
          <h2 className="painel__titulo">{titulo}</h2>
          <button type="button" className="painel__fechar" aria-label="Fechar" onClick={aoFechar}>
            <IconeFechar tamanho={20} />
          </button>
        </header>
        {aberto && children}
      </div>
    </dialog>
  )
}
