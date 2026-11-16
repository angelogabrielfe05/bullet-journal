import { formatarMes, somarMeses, type Mes } from '../regras/datas'
import { IconeSetaDireita, IconeSetaEsquerda } from './Icones'

interface Props {
  mes: Mes
  mesAtual: Mes
  /** Ir para outro mês. */
  aoIr: (mes: Mes) => void
}

/** ‹ Novembro de 2026 ›  [voltar para o mês atual] */
export function NavegacaoMes({ mes, mesAtual, aoIr }: Props) {
  return (
    <nav className="navegacao-dia" aria-label="Trocar de mês">
      <button type="button" className="botao-simbolo" aria-label="Mês anterior" onClick={() => aoIr(somarMeses(mes, -1))}>
        <IconeSetaEsquerda tamanho={20} />
      </button>
      <p className="navegacao-dia__data navegacao-dia__data--mes" aria-live="polite">
        {formatarMes(mes)}
      </p>
      <button type="button" className="botao-simbolo" aria-label="Mês seguinte" onClick={() => aoIr(somarMeses(mes, 1))}>
        <IconeSetaDireita tamanho={20} />
      </button>
      {mes !== mesAtual && (
        <button type="button" className="link navegacao-dia__hoje" onClick={() => aoIr(mesAtual)}>
          voltar para o mês atual
        </button>
      )}
    </nav>
  )
}
