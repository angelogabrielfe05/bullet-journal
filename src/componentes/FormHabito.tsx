import { useState, type FormEvent } from 'react'
import { criarHabito, editarHabito } from '../dados/habitos'
import type { Habito, TipoHabito } from '../dados/tipos'
import { hoje } from '../regras/datas'
import { lerNumero, numeroParaCampo } from '../regras/numeros'
import { Botao } from './Botao'
import { CampoTexto } from './Campos'

const DIAS = [
  { valor: 1, curto: 'S', nome: 'segunda' },
  { valor: 2, curto: 'T', nome: 'terça' },
  { valor: 3, curto: 'Q', nome: 'quarta' },
  { valor: 4, curto: 'Q', nome: 'quinta' },
  { valor: 5, curto: 'S', nome: 'sexta' },
  { valor: 6, curto: 'S', nome: 'sábado' },
  { valor: 0, curto: 'D', nome: 'domingo' },
]

interface Props {
  /** Hábito a editar; sem ele, cria um novo. */
  habito?: Habito
  aoTerminar: () => void
  /** Se vier, mostra "Excluir hábito" no fim (só ao editar). */
  aoExcluir?: () => void
}

/** Formulário de criar/editar hábito (vai dentro de um PainelInferior). */
export function FormHabito({ habito, aoTerminar, aoExcluir }: Props) {
  const [nome, setNome] = useState(habito?.nome ?? '')
  const [tipo, setTipo] = useState<TipoHabito>(habito?.tipo ?? 'check')
  const [unidade, setUnidade] = useState(habito?.unidade ?? '')
  const [meta, setMeta] = useState(habito?.meta ? numeroParaCampo(habito.meta) : '')
  const [incrementos, setIncrementos] = useState(habito?.incrementos?.map(numeroParaCampo).join('; ') ?? '')
  const [dias, setDias] = useState<number[]>(habito?.dias ?? [0, 1, 2, 3, 4, 5, 6])
  const [erro, setErro] = useState('')

  const alternarDia = (d: number) => setDias((atuais) => (atuais.includes(d) ? atuais.filter((x) => x !== d) : [...atuais, d]))

  async function salvar(e: FormEvent) {
    e.preventDefault()
    const metaNumero = lerNumero(meta)
    const listaIncrementos = incrementos
      .split(/[;\s]+/)
      .map(lerNumero)
      .filter((n): n is number => n !== null && n > 0)

    if (!nome.trim()) return setErro('Dê um nome ao hábito.')
    if (!dias.length) return setErro('Escolha pelo menos um dia da semana.')
    if (tipo === 'quantidade' && (!metaNumero || metaNumero <= 0)) return setErro('Informe a meta diária (um número maior que zero).')
    if (tipo === 'quantidade' && !unidade.trim()) return setErro('Informe a unidade (ex.: ml, km, páginas).')

    const dados = {
      nome: nome.trim(),
      tipo,
      unidade: tipo === 'quantidade' ? unidade.trim() : undefined,
      meta: tipo === 'quantidade' ? metaNumero! : undefined,
      incrementos: tipo === 'quantidade' ? listaIncrementos : undefined,
      dias: [...dias].sort((a, b) => a - b),
    }
    if (habito) await editarHabito(habito.id, dados)
    else await criarHabito({ ...dados, inicio: hoje() })
    aoTerminar()
  }

  return (
    <form className="form-habito" onSubmit={salvar} noValidate>
      <CampoTexto rotulo="Nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="ex.: Meditação" autoComplete="off" />

      <fieldset className="form-habito__grupo">
        <legend className="campo__rotulo">Tipo</legend>
        <div className="segmentado">
          <button type="button" aria-pressed={tipo === 'check'} onClick={() => setTipo('check')}>
            Check simples
          </button>
          <button type="button" aria-pressed={tipo === 'quantidade'} onClick={() => setTipo('quantidade')}>
            Check + quantidade
          </button>
        </div>
      </fieldset>

      {tipo === 'quantidade' && (
        <div className="form-habito__quantidade">
          <CampoTexto rotulo="Meta diária" inputMode="decimal" value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="ex.: 2000" />
          <CampoTexto rotulo="Unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)} placeholder="ex.: ml" autoComplete="off" />
          <CampoTexto
            className="form-habito__incrementos"
            rotulo="Botões rápidos (opcional, separados por ;)"
            inputMode="decimal"
            value={incrementos}
            onChange={(e) => setIncrementos(e.target.value)}
            placeholder="ex.: 250; 500"
          />
        </div>
      )}

      <fieldset className="form-habito__grupo">
        <legend className="campo__rotulo">Dias em que vale</legend>
        <div className="dias-semana">
          {DIAS.map((d) => (
            <button key={d.valor} type="button" aria-pressed={dias.includes(d.valor)} aria-label={d.nome} onClick={() => alternarDia(d.valor)}>
              {d.curto}
            </button>
          ))}
        </div>
        <div className="form-habito__atalhos">
          <button type="button" className="link" onClick={() => setDias([0, 1, 2, 3, 4, 5, 6])}>
            todos os dias
          </button>
          <button type="button" className="link" onClick={() => setDias([1, 2, 3, 4, 5])}>
            seg a sex
          </button>
        </div>
      </fieldset>

      {habito && (
        <p className="bloco__ajuda">
          Mudar os dias ou o tipo refaz as contas de progresso e sequência também dos meses anteriores. Se a rotina mudou de vez,
          pode ser melhor arquivar este hábito e criar um novo.
        </p>
      )}

      {erro && (
        <p className="form-habito__erro" role="alert">
          {erro}
        </p>
      )}

      <Botao type="submit" variante="primario" cheio>
        {habito ? 'Salvar alterações' : 'Criar hábito'}
      </Botao>

      {habito && aoExcluir && (
        <Botao variante="fantasma" cheio className="botao--texto-perigo" onClick={aoExcluir}>
          Excluir hábito
        </Botao>
      )}
    </form>
  )
}
