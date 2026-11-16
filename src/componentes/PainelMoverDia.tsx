import { useState } from 'react'
import { moverPara, listaDoDia } from '../dados/itens'
import type { Item } from '../dados/tipos'
import { diasDoMes, formatarDiaCurto } from '../regras/datas'
import { useAviso } from './avisoContexto'
import { Botao } from './Botao'
import { PainelInferior } from './PainelInferior'

/** Leva uma tarefa da lista do mês para um dia específico (sugere dias do próprio mês). */
export function PainelMoverDia({ item, aoFechar }: { item: Item | null; aoFechar: () => void }) {
  const [dia, setDia] = useState('')
  const avisar = useAviso()
  const dias = item ? diasDoMes(item.mes) : []

  return (
    <PainelInferior aberto={!!item} aoFechar={aoFechar} titulo="Mover para um dia">
      {item && (
        <div className="agendar__dia">
          <label className="campo">
            <span className="campo__rotulo">{item.texto}</span>
            <input type="date" className="campo__entrada" min={dias[0]} max={dias.at(-1)} value={dia} onChange={(e) => setDia(e.target.value)} />
          </label>
          <Botao
            variante="primario"
            disabled={!dia}
            onClick={async () => {
              await moverPara(item.id, listaDoDia(dia))
              avisar({ texto: `Movida para ${formatarDiaCurto(dia)}` })
              setDia('')
              aoFechar()
            }}
          >
            Mover
          </Botao>
        </div>
      )}
    </PainelInferior>
  )
}
