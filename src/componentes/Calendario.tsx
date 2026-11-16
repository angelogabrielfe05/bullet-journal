import type { Item } from '../dados/tipos'
import { irPara } from '../navegacao'
import { diaDaSemana, diasDoMes, formatarDiaCurto, type Dia, type Mes } from '../regras/datas'

const CABECALHO = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] // semana começa na segunda
const MAX_MARCAS = 3

interface Props {
  mes: Mes
  hoje: Dia
  /** Todos os itens do mês (com e sem dia). */
  itens: Item[]
}

/** Até 3 marquinhas; acima disso, uma marquinha com o número (ex.: •5). */
function Marcas({ quantidade, classe }: { quantidade: number; classe: string }) {
  if (quantidade > MAX_MARCAS) {
    return (
      <span className="marca-numero">
        <span className={`marca ${classe}`} />
        {quantidade}
      </span>
    )
  }
  return (
    <>
      {Array.from({ length: quantidade }, (_, i) => (
        <span key={i} className={`marca ${classe}`} />
      ))}
    </>
  )
}

/** Calendário do mês. Cada dia mostra ○ por evento e • por tarefa aberta; tocar abre o dia. */
export function Calendario({ mes, hoje, itens }: Props) {
  const dias = diasDoMes(mes)
  const vazios = (diaDaSemana(dias[0]) + 6) % 7 // quantos espaços antes do dia 1

  const porDia = new Map<Dia, { eventos: number; abertas: number }>()
  for (const item of itens) {
    if (!item.dia) continue
    const conta = porDia.get(item.dia) ?? { eventos: 0, abertas: 0 }
    if (item.tipo === 'evento') conta.eventos++
    if (item.tipo === 'tarefa' && item.estado === 'aberta') conta.abertas++
    porDia.set(item.dia, conta)
  }

  return (
    <div className="calendario">
      <div className="calendario__semana" aria-hidden="true">
        {CABECALHO.map((letra, i) => (
          <span key={i} data-fds={i >= 5 || undefined}>
            {letra}
          </span>
        ))}
      </div>
      <ol className="calendario__dias">
        {Array.from({ length: vazios }, (_, i) => (
          <li key={`vazio-${i}`} aria-hidden="true" />
        ))}
        {dias.map((dia) => {
          const conta = porDia.get(dia) ?? { eventos: 0, abertas: 0 }
          const partes = [
            conta.eventos && `${conta.eventos} ${conta.eventos === 1 ? 'evento' : 'eventos'}`,
            conta.abertas && `${conta.abertas} ${conta.abertas === 1 ? 'tarefa aberta' : 'tarefas abertas'}`,
          ].filter(Boolean)
          return (
            <li key={dia}>
              <button
                type="button"
                className="calendario__dia"
                data-hoje={dia === hoje || undefined}
                data-passado={dia < hoje || undefined}
                aria-label={`${formatarDiaCurto(dia)}${partes.length ? `: ${partes.join(', ')}` : ''}`}
                aria-current={dia === hoje ? 'date' : undefined}
                onClick={() => (dia === hoje ? irPara('hoje') : irPara('hoje', dia))}
              >
                <span className="calendario__numero">{Number(dia.slice(8))}</span>
                <span className="calendario__marcas" aria-hidden="true">
                  <Marcas quantidade={conta.eventos} classe="marca--evento" />
                  <Marcas quantidade={conta.abertas} classe="marca--tarefa" />
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
