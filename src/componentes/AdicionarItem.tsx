import { useRef, useState, type FormEvent } from 'react'
import { criarItem, listaDoDia, type Lista } from '../dados/itens'
import type { TipoItem } from '../dados/tipos'
import { interpretarAtalho } from '../regras/atalhos'
import { diasDoMes, type Mes } from '../regras/datas'
import { IconeMais } from './Icones'
import { MarcaPrioridade, Simbolo } from './Simbolo'

const TIPOS: { tipo: TipoItem; nome: string }[] = [
  { tipo: 'tarefa', nome: 'Tarefa' },
  { tipo: 'evento', nome: 'Evento' },
  { tipo: 'nota', nome: 'Nota' },
]

interface Props {
  lista: Lista
  /** Texto de exemplo no campo. */
  dica?: string
  /** Mostra um campo de dia opcional dentro deste mês (Futuro). Com dia, o item vai para o registro daquele dia. */
  escolherDiaEm?: Mes
}

/**
 * Campo de anotação rápida no fim da lista. Escolha o símbolo nos botões
 * ou use os atalhos: "-" nota, "o " evento, "*" prioridade.
 */
export function AdicionarItem({ lista, dica = 'Anotar…  ( - nota · o evento )', escolherDiaEm }: Props) {
  // Tipo escolhido tocando no botão; null = deixar o atalho (ou "tarefa") decidir.
  const [tipoEscolhido, setTipoEscolhido] = useState<TipoItem | null>(null)
  const [prioridadeEscolhida, setPrioridadeEscolhida] = useState(false)
  const [texto, setTexto] = useState('')
  const [horario, setHorario] = useState('')
  const [dia, setDia] = useState('')
  const campo = useRef<HTMLInputElement>(null)

  // O atalho digitado aparece na hora nos botões de símbolo. Se a pessoa tocar
  // num botão diferente do atalho, o botão vence e o texto fica como foi digitado.
  const automatico = interpretarAtalho(texto)
  const botaoVence = tipoEscolhido !== null && automatico.tipo !== undefined && automatico.tipo !== tipoEscolhido
  const atalho = botaoVence ? interpretarAtalho(texto, { ignorarTipo: true }) : automatico
  const tipo: TipoItem = tipoEscolhido ?? atalho.tipo ?? 'tarefa'
  const prioridade = prioridadeEscolhida || atalho.prioridade

  async function adicionar(e: FormEvent) {
    e.preventDefault()
    if (!atalho.texto) return
    await criarItem({
      tipo,
      texto: atalho.texto,
      lista: dia ? listaDoDia(dia) : lista,
      prioridade,
      horario: tipo === 'evento' && horario ? horario : undefined,
    })
    setTexto('')
    setHorario('')
    setDia('')
    setTipoEscolhido(null)
    setPrioridadeEscolhida(false)
    campo.current?.focus()
  }

  return (
    <form className="adicionar" onSubmit={adicionar}>
      <div className="adicionar__simbolos" role="group" aria-label="Tipo do item">
        {TIPOS.map(({ tipo: t, nome }) => (
          <button
            key={t}
            type="button"
            className="adicionar__simbolo"
            aria-pressed={tipo === t}
            aria-label={nome}
            title={nome}
            onClick={() => {
              setTipoEscolhido(t)
              campo.current?.focus()
            }}
          >
            <Simbolo tipo={t} tamanho={18} />
          </button>
        ))}
        <button
          type="button"
          className="adicionar__simbolo adicionar__simbolo--prioridade"
          aria-pressed={prioridade}
          aria-label="Prioridade"
          title="Prioridade"
          onClick={() => {
            setPrioridadeEscolhida(!prioridadeEscolhida)
            campo.current?.focus()
          }}
        >
          <MarcaPrioridade />
        </button>
        {escolherDiaEm && (
          <input
            type="date"
            className="adicionar__horario adicionar__dia"
            aria-label="Dia (opcional)"
            title="Dia (opcional)"
            min={diasDoMes(escolherDiaEm)[0]}
            max={diasDoMes(escolherDiaEm).at(-1)}
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          />
        )}
        {tipo === 'evento' && (
          <input
            type="time"
            className="adicionar__horario"
            aria-label="Horário do evento (opcional)"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
        )}
      </div>
      <div className="adicionar__linha">
        <input
          ref={campo}
          className="campo__entrada adicionar__texto"
          aria-label="Novo item"
          placeholder={dica}
          value={texto}
          enterKeyHint="enter"
          autoComplete="off"
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" className="botao botao--primario botao--icone" aria-label="Adicionar" disabled={!atalho.texto}>
          <IconeMais />
        </button>
      </div>
    </form>
  )
}
