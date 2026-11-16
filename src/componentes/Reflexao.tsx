import { useCallback, useEffect, useRef, useState } from 'react'
import { lerReflexao, salvarReflexao } from '../dados/reflexoes'
import type { Dia } from '../regras/datas'
import { AreaTexto } from './Campos'

/**
 * Espaço livre no fim da página do dia. Salva sozinho enquanto você
 * escreve (meio segundo depois de parar) e ao sair do campo.
 * Use com key={dia} para recomeçar ao trocar de dia.
 */
export function Reflexao({ dia }: { dia: Dia }) {
  const [texto, setTexto] = useState('')
  const [carregado, setCarregado] = useState(false)
  const [situacao, setSituacao] = useState<'' | 'salvando' | 'salvo'>('')
  const pendente = useRef<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    let ativo = true
    lerReflexao(dia).then((t) => {
      if (!ativo) return
      setTexto(t)
      setCarregado(true)
    })
    return () => {
      ativo = false
    }
  }, [dia])

  const salvar = useCallback(async () => {
    window.clearTimeout(timer.current)
    if (pendente.current === null) return
    const valor = pendente.current
    pendente.current = null
    await salvarReflexao(dia, valor)
    setSituacao('salvo')
  }, [dia])

  // Ao sair da tela ou trocar de dia, salva o que faltou.
  useEffect(() => () => void salvar(), [salvar])

  // Ao mandar o app para o segundo plano (ou fechar), salva na hora.
  useEffect(() => {
    const aoEsconder = () => {
      if (document.visibilityState === 'hidden') void salvar()
    }
    const aoSair = () => void salvar()
    document.addEventListener('visibilitychange', aoEsconder)
    window.addEventListener('pagehide', aoSair)
    return () => {
      document.removeEventListener('visibilitychange', aoEsconder)
      window.removeEventListener('pagehide', aoSair)
    }
  }, [salvar])

  return (
    <section className="bloco reflexao" aria-labelledby="titulo-reflexao">
      <header className="bloco__cabecalho bloco__cabecalho--linha">
        <h2 id="titulo-reflexao" className="bloco__titulo">
          Reflexão do dia
        </h2>
        <span className="reflexao__situacao">{situacao === 'salvando' ? 'salvando…' : situacao === 'salvo' ? 'salvo ✓' : ''}</span>
        {/* Leitor de tela: anuncia só quando salvou, não a cada tecla. */}
        <span className="visualmente-oculto" aria-live="polite">
          {situacao === 'salvo' ? 'Reflexão salva' : ''}
        </span>
      </header>
      <AreaTexto
        rotulo="Reflexão do dia"
        rotuloOculto
        className="reflexao__campo"
        placeholder={carregado ? 'Como foi o dia? O que aprendeu, como se sentiu…' : ''}
        value={texto}
        disabled={!carregado}
        onChange={(e) => {
          setTexto(e.target.value)
          pendente.current = e.target.value
          setSituacao('salvando')
          window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => void salvar(), 500)
        }}
        onBlur={() => void salvar()}
      />
    </section>
  )
}
