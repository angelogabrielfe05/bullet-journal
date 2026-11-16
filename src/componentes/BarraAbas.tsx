import { irPara, type Aba, type Tela } from '../navegacao'

const ABAS: { aba: Aba; rotulo: string; simbolo: string }[] = [
  { aba: 'hoje', rotulo: 'Hoje', simbolo: '•' },
  { aba: 'habitos', rotulo: 'Hábitos', simbolo: '✓' },
  { aba: 'mes', rotulo: 'Mês', simbolo: '▦' },
  { aba: 'futuro', rotulo: 'Futuro', simbolo: '>' },
]

/** Telas que não são abas acendem a aba "dona" delas. */
const ABA_DA_TELA: Record<Tela, Aba | null> = {
  hoje: 'hoje',
  habitos: 'habitos',
  mes: 'mes',
  futuro: 'futuro',
  migracao: 'futuro',
  ajustes: null,
}

export function BarraAbas({ telaAtual }: { telaAtual: Tela }) {
  const ativa = ABA_DA_TELA[telaAtual]
  return (
    <nav className="barra-abas" aria-label="Seções">
      {ABAS.map(({ aba, rotulo, simbolo }) => (
        <button
          key={aba}
          type="button"
          className="barra-abas__aba"
          aria-current={ativa === aba ? 'page' : undefined}
          onClick={() => irPara(aba)}
        >
          <span className="barra-abas__simbolo" aria-hidden="true">
            {simbolo}
          </span>
          <span className="barra-abas__rotulo">{rotulo}</span>
        </button>
      ))}
    </nav>
  )
}
