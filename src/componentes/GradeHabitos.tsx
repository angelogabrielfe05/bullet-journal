import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { alternarCheck } from '../dados/habitos'
import type { Habito, RegistroHabito } from '../dados/tipos'
import { diaDaSemana, diasDoMes, formatarDiaCurto, mesDoDia, type Dia, type Mes } from '../regras/datas'
import { cumprido, fracaoDoDia, progressoDoMes, sequencia, valeNoDia } from '../regras/habitos'
import { formatarNumero } from '../regras/numeros'

const INICIAIS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface Props {
  mes: Mes
  hoje: Dia
  habitos: Habito[]
  /** Registros por hábito → por dia (desde o início dos hábitos, para a sequência). */
  registros: Map<string, Map<Dia, RegistroHabito>>
  /** Abrir o painel de quantidade de um hábito num dia. */
  aoAbrirQuantidade: (habito: Habito, dia: Dia) => void
}

/** Grade do mês: hábitos nas linhas, dias nas colunas. Rola para o lado no celular. */
export function GradeHabitos({ mes, hoje, habitos, registros, aoAbrirQuantidade }: Props) {
  const dias = diasDoMes(mes)
  const ehMesAtual = mes === mesDoDia(hoje)
  const rolagem = useRef<HTMLDivElement>(null)

  // Ao abrir o mês atual, rola até o dia de hoje (deixando alguns dias antes à vista).
  useLayoutEffect(() => {
    const caixa = rolagem.current
    if (!caixa) return
    const colunaHoje = caixa.querySelector<HTMLElement>('[data-hoje]')
    const colunaNomes = caixa.querySelector<HTMLElement>('.grade__canto')
    caixa.scrollLeft = colunaHoje && colunaNomes ? colunaHoje.offsetLeft - colunaNomes.offsetWidth - 34 * 4 : 0
  }, [mes, habitos.length])

  return (
    <div ref={rolagem} className="grade" role="region" aria-label="Grade de hábitos do mês" tabIndex={0}>
      <table className="grade__tabela">
        <thead>
          <tr>
            <th scope="col" className="grade__canto">
              <span className="visualmente-oculto">Hábito</span>
            </th>
            {dias.map((dia) => {
              const semana = diaDaSemana(dia)
              return (
                <th
                  key={dia}
                  scope="col"
                  className="grade__dia"
                  data-hoje={dia === hoje || undefined}
                  data-fds={semana === 0 || semana === 6 || undefined}
                  aria-label={formatarDiaCurto(dia)}
                >
                  <span className="grade__inicial" aria-hidden="true">
                    {INICIAIS[semana]}
                  </span>
                  <span aria-hidden="true">{Number(dia.slice(8))}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {habitos.map((habito) => {
            const doHabito = registros.get(habito.id) ?? new Map<Dia, RegistroHabito>()
            const progresso = progressoDoMes(habito, doHabito, mes, hoje)
            const seq = ehMesAtual ? sequencia(habito, doHabito, hoje) : null
            return (
              <tr key={habito.id}>
                <th scope="row" className="grade__habito">
                  <span className="grade__nome">{habito.nome}</span>
                  <span className="grade__resumo">
                    {progresso.previstos ? `${progresso.cumpridos}/${progresso.previstos} · ${progresso.percentual}%` : '—'}
                  </span>
                  {seq !== null && (
                    <span className="grade__sequencia" title="Sequência: dias previstos seguidos cumpridos">
                      seq. {seq}
                    </span>
                  )}
                </th>
                {dias.map((dia) => (
                  <td key={dia} className="grade__celula" data-hoje={dia === hoje || undefined}>
                    <Celula
                      habito={habito}
                      dia={dia}
                      hoje={hoje}
                      registro={doHabito.get(dia)}
                      aoAbrirQuantidade={aoAbrirQuantidade}
                    />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface PropsCelula {
  habito: Habito
  dia: Dia
  hoje: Dia
  registro: RegistroHabito | undefined
  aoAbrirQuantidade: (habito: Habito, dia: Dia) => void
}

function Celula({ habito, dia, hoje, registro, aoAbrirQuantidade }: PropsCelula) {
  // Dia fora da escala (ou antes do início): apagado, não conta.
  if (!valeNoDia(habito, dia)) {
    return <span className="celula celula--fora" aria-hidden="true" />
  }

  const ok = cumprido(habito, registro)
  const fracao = fracaoDoDia(habito, registro)
  const futuro = dia > hoje
  const estado = ok ? 'feito' : fracao > 0 ? 'parcial' : 'vazio'

  const descricao =
    habito.tipo === 'check'
      ? ok
        ? 'feito'
        : 'não feito'
      : `${formatarNumero(registro?.quantidade ?? 0)} de ${formatarNumero(habito.meta ?? 0)} ${habito.unidade ?? ''}`

  return (
    // O botão ocupa a célula inteira (área de toque maior); o quadradinho fica dentro.
    <button
      type="button"
      className="celula-toque"
      disabled={futuro}
      aria-label={`${habito.nome}, ${formatarDiaCurto(dia)}: ${descricao}`}
      aria-pressed={habito.tipo === 'check' ? ok : undefined}
      onClick={() => (habito.tipo === 'check' ? alternarCheck(habito.id, dia) : aoAbrirQuantidade(habito, dia))}
    >
      <span className="celula" data-estado={estado} style={{ '--fracao': fracao } as CSSProperties}>
        {ok && (
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3 8.5 3.2 3L13 4.5" />
          </svg>
        )}
      </span>
    </button>
  )
}
