import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario' | 'fantasma' | 'perigo'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  /** Ocupa a largura toda. */
  cheio?: boolean
  /** Botão quadrado só com ícone (passe aria-label). */
  icone?: boolean
}

export function Botao({ variante = 'secundario', cheio, icone, className, type = 'button', ...props }: Props) {
  const classes = ['botao', `botao--${variante}`, cheio && 'botao--cheio', icone && 'botao--icone', className]
    .filter(Boolean)
    .join(' ')
  return <button type={type} className={classes} {...props} />
}
