import { useState } from 'react'
import { capitalizar, formatarMes, mesDoDia, proximosMeses, somarDias, type Dia, type Mes } from '../regras/datas'
import { Botao } from './Botao'
import { PainelInferior } from './PainelInferior'

interface Props {
  aberto: boolean
  aoFechar: () => void
  /** Chamado com o mês escolhido (e o dia, se a pessoa escolher um dia). */
  aoEscolher: (mes: Mes, dia?: Dia) => void
  hoje: Dia
  /** Texto da tarefa, para mostrar no topo. */
  texto?: string
}

/** Escolher para onde agendar (>): um dos próximos 6 meses ou um dia específico. */
export function PainelAgendar({ aberto, aoFechar, aoEscolher, hoje, texto }: Props) {
  const [dia, setDia] = useState('')
  const amanha = somarDias(hoje, 1)

  const escolher = (mes: Mes, diaEscolhido?: Dia) => {
    aoEscolher(mes, diaEscolhido)
    setDia('')
    aoFechar()
  }

  return (
    <PainelInferior aberto={aberto} aoFechar={aoFechar} titulo="Agendar para…">
      {texto && <p className="menu-item__texto">{texto}</p>}
      <ul className="opcoes">
        {proximosMeses(mesDoDia(hoje), 6).map((mes) => (
          <li key={mes}>
            <button type="button" className="opcao" onClick={() => escolher(mes)}>
              <span className="opcao__icone" aria-hidden="true">
                &gt;
              </span>
              <span>{capitalizar(formatarMes(mes))}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="agendar__dia">
        <label className="campo">
          <span className="campo__rotulo">Ou um dia específico</span>
          <input type="date" className="campo__entrada" min={amanha} value={dia} onChange={(e) => setDia(e.target.value)} />
        </label>
        <Botao variante="primario" disabled={!dia || dia < amanha} onClick={() => escolher(mesDoDia(dia), dia)}>
          Agendar
        </Botao>
      </div>
    </PainelInferior>
  )
}
