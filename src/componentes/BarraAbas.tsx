import type { ComponentType, SVGProps } from 'react'
import { irPara, type Aba, type Tela } from '../navegacao'
import { IconeFuturo, IconeHabitos, IconeHoje, IconeMes } from './Icones'

type IconeAba = ComponentType<SVGProps<SVGSVGElement> & { tamanho?: number }>

const ABAS: { aba: Aba; rotulo: string; Icone: IconeAba }[] = [
  { aba: 'hoje', rotulo: 'Hoje', Icone: IconeHoje },
  { aba: 'habitos', rotulo: 'Hábitos', Icone: IconeHabitos },
  { aba: 'mes', rotulo: 'Mês', Icone: IconeMes },
  { aba: 'futuro', rotulo: 'Futuro', Icone: IconeFuturo },
]

/** Telas que não são abas acendem a aba "dona" delas. */
const ABA_DA_TELA: Record<Tela, Aba | null> = {
  hoje: 'hoje',
  habitos: 'habitos',
  mes: 'mes',
  futuro: 'futuro',
  migracao: 'futuro',
  ajustes: null,
  amostra: null,
}

export function BarraAbas({ telaAtual }: { telaAtual: Tela }) {
  const ativa = ABA_DA_TELA[telaAtual]
  return (
    <nav className="barra-abas" aria-label="Seções">
      {ABAS.map(({ aba, rotulo, Icone }) => (
        <button
          key={aba}
          type="button"
          className="barra-abas__aba"
          aria-current={ativa === aba ? 'page' : undefined}
          onClick={() => irPara(aba)}
        >
          <Icone className="barra-abas__icone" tamanho={24} />
          <span className="barra-abas__rotulo">{rotulo}</span>
        </button>
      ))}
    </nav>
  )
}
