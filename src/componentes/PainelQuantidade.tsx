import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type FormEvent } from 'react'
import { db } from '../dados/banco'
import { definirQuantidade, somarQuantidade } from '../dados/habitos'
import type { Habito } from '../dados/tipos'
import { formatarDiaExtenso, type Dia } from '../regras/datas'
import { fracaoDoDia, idDoRegistro } from '../regras/habitos'
import { formatarNumero, lerNumero } from '../regras/numeros'
import { Botao } from './Botao'
import { PainelInferior } from './PainelInferior'

interface Props {
  habito: Habito | null
  dia: Dia
  aoFechar: () => void
}

/** Painel para somar quantidade num hábito (ex.: +250 ml de água, 5 km de corrida). */
export function PainelQuantidade({ habito, dia, aoFechar }: Props) {
  return (
    <PainelInferior aberto={!!habito} aoFechar={aoFechar} titulo={habito?.nome ?? ''}>
      {habito && <ConteudoQuantidade habito={habito} dia={dia} />}
    </PainelInferior>
  )
}

function ConteudoQuantidade({ habito, dia }: { habito: Habito; dia: Dia }) {
  const registro = useLiveQuery(() => db.registros.get(idDoRegistro(habito.id, dia)), [habito.id, dia])
  const [valor, setValor] = useState('')
  const total = registro?.quantidade ?? 0
  const unidade = habito.unidade ?? ''
  const fracao = fracaoDoDia(habito, registro)
  const numero = lerNumero(valor)

  async function somar(e: FormEvent) {
    e.preventDefault()
    if (numero === null) return
    await somarQuantidade(habito.id, dia, numero)
    setValor('')
  }

  return (
    <div className="quantidade">
      <p className="quantidade__dia">{formatarDiaExtenso(dia)}</p>
      <p className="quantidade__total">
        <strong>{formatarNumero(total)}</strong>
        {habito.meta ? ` de ${formatarNumero(habito.meta)}` : ''} {unidade}
        {fracao >= 1 && <span className="quantidade__meta-ok"> · meta batida ✓</span>}
      </p>
      <div className="barra-progresso" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(fracao * 100)} aria-label="Progresso da meta do dia">
        <div className="barra-progresso__preenchido" style={{ width: `${fracao * 100}%` }} />
      </div>

      {!!habito.incrementos?.length && (
        <div className="quantidade__rapidos">
          {habito.incrementos.map((inc) => (
            <Botao key={inc} onClick={() => somarQuantidade(habito.id, dia, inc)}>
              +{formatarNumero(inc)} {unidade}
            </Botao>
          ))}
        </div>
      )}

      <form className="quantidade__livre" onSubmit={somar}>
        <label className="campo">
          <span className="campo__rotulo">Outro valor ({unidade})</span>
          <input
            className="campo__entrada"
            inputMode="decimal"
            placeholder={habito.unidade === 'km' ? 'ex.: 5,2' : 'ex.: 300'}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </label>
        <div className="quantidade__botoes">
          <Botao type="submit" variante="primario" disabled={numero === null}>
            Somar
          </Botao>
          <Botao
            disabled={numero === null}
            onClick={async () => {
              if (numero === null) return
              await definirQuantidade(habito.id, dia, numero)
              setValor('')
            }}
          >
            Definir total
          </Botao>
          <Botao variante="fantasma" disabled={!total} onClick={() => definirQuantidade(habito.id, dia, 0)}>
            Zerar
          </Botao>
        </div>
      </form>
    </div>
  )
}
