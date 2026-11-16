import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type CSSProperties } from 'react'
import { db } from '../dados/banco'
import { alternarCheck, listarHabitos } from '../dados/habitos'
import type { Habito } from '../dados/tipos'
import type { Dia } from '../regras/datas'
import { cumprido, fracaoDoDia, valeNoDia } from '../regras/habitos'
import { irPara } from '../navegacao'
import { formatarNumero } from '../regras/numeros'
import { PainelQuantidade } from './PainelQuantidade'

function Visto() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 8.5 3.2 3L13 4.5" />
    </svg>
  )
}

/** Lista dos hábitos que valem no dia (um embaixo do outro), para marcar sem sair do Hoje. */
export function FaixaHabitos({ dia }: { dia: Dia }) {
  const habitos = useLiveQuery(() => listarHabitos(), [])
  const registros = useLiveQuery(() => db.registros.where('dia').equals(dia).toArray(), [dia])
  const [habitoAberto, setHabitoAberto] = useState<Habito | null>(null)

  const doDia = habitos?.filter((h) => valeNoDia(h, dia)) ?? []
  if (!doDia.length) return null
  const registroDe = (h: Habito) => registros?.find((r) => r.habitoId === h.id)
  const feitos = doDia.filter((h) => cumprido(h, registroDe(h))).length

  return (
    <section className="bloco" aria-labelledby="titulo-habitos-dia">
      <header className="bloco__cabecalho bloco__cabecalho--linha">
        <h2 id="titulo-habitos-dia" className="bloco__titulo">
          Hábitos <span className="bloco__contagem">{feitos}/{doDia.length}</span>
        </h2>
        <button type="button" className="link" onClick={() => irPara('habitos')}>
          ver grade
        </button>
      </header>

      <ul className="faixa-habitos">
        {doDia.map((h) => {
          const registro = registroDe(h)
          const ok = cumprido(h, registro)
          if (h.tipo === 'check') {
            return (
              <li key={h.id}>
                <button type="button" className="chip-habito" aria-pressed={ok} onClick={() => alternarCheck(h.id, dia)}>
                  <span className="chip-habito__caixa" aria-hidden="true">
                    {ok && <Visto />}
                  </span>
                  <span className="chip-habito__nome">{h.nome}</span>
                </button>
              </li>
            )
          }
          const fracao = fracaoDoDia(h, registro)
          return (
            <li key={h.id}>
              <button
                type="button"
                className="chip-habito chip-habito--quantidade"
                data-ok={ok || undefined}
                aria-label={`${h.nome}: ${formatarNumero(registro?.quantidade ?? 0)} de ${formatarNumero(h.meta ?? 0)} ${h.unidade ?? ''}. Tocar para somar.`}
                onClick={() => setHabitoAberto(h)}
                style={{ '--fracao': fracao } as CSSProperties}
              >
                <span className="chip-habito__caixa" aria-hidden="true">
                  {ok && <Visto />}
                </span>
                <span className="chip-habito__nome">{h.nome}</span>
                <span className="chip-habito__valor">
                  {formatarNumero(registro?.quantidade ?? 0)}/{formatarNumero(h.meta ?? 0)} {h.unidade}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <PainelQuantidade habito={habitoAberto} dia={dia} aoFechar={() => setHabitoAberto(null)} />
    </section>
  )
}
