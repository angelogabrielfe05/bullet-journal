import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type CSSProperties } from 'react'
import { Botao } from '../componentes/Botao'
import { GradeHabitos } from '../componentes/GradeHabitos'
import { NavegacaoMes } from '../componentes/NavegacaoMes'
import { Pagina } from '../componentes/Pagina'
import { PainelQuantidade } from '../componentes/PainelQuantidade'
import { useHoje } from '../componentes/useHoje'
import { listarHabitos, registrosEntre } from '../dados/habitos'
import type { Habito } from '../dados/tipos'
import { irPara, type PropsTela } from '../navegacao'
import { diasDoMes, ehMesValido, mesDoDia, type Dia, type Mes } from '../regras/datas'

/** Grade de hábitos do mês. Sem parâmetro mostra o mês atual; #/habitos/2026-10 mostra outubro. */
export function Habitos({ parametro }: PropsTela) {
  const hoje = useHoje()
  const mesAtual = mesDoDia(hoje)
  const mes: Mes = parametro && ehMesValido(parametro) ? parametro : mesAtual
  const [quantidade, setQuantidade] = useState<{ habito: Habito; dia: Dia } | null>(null)

  const habitos = useLiveQuery(() => listarHabitos(), [])

  // Busca os registros desde o início do hábito mais antigo (para a sequência)
  // até o fim do mês mostrado (ou hoje, o que vier depois).
  const dias = diasDoMes(mes)
  const inicioMaisAntigo = habitos?.reduce((menor, h) => (h.inicio < menor ? h.inicio : menor), dias[0]) ?? dias[0]
  const fim = dias[dias.length - 1] > hoje ? dias[dias.length - 1] : hoje
  const registros = useLiveQuery(() => registrosEntre(inicioMaisAntigo, fim), [inicioMaisAntigo, fim])

  const ir = (destino: Mes) => (destino === mesAtual ? irPara('habitos') : irPara('habitos', destino))

  return (
    <Pagina titulo="Hábitos">
      <NavegacaoMes mes={mes} mesAtual={mesAtual} aoIr={ir} />

      {habitos && registros && habitos.length > 0 && (
        <GradeHabitos
          mes={mes}
          hoje={hoje}
          habitos={habitos}
          registros={registros}
          aoAbrirQuantidade={(habito, dia) => setQuantidade({ habito, dia })}
        />
      )}

      {habitos && habitos.length === 0 && (
        <p className="vazio">Nenhum hábito ativo. Crie o primeiro em Ajustes.</p>
      )}

      <section className="legenda-grade" aria-label="Como ler a grade">
        <ul className="legenda-grade__itens">
          <li>
            <span className="celula" data-estado="feito" aria-hidden="true" /> feito
          </li>
          <li>
            <span className="celula" data-estado="parcial" style={{ '--fracao': 0.5 } as CSSProperties} aria-hidden="true" /> parte da meta
          </li>
          <li>
            <span className="celula celula--fora" aria-hidden="true" /> não vale no dia
          </li>
        </ul>
        <p className="bloco__ajuda">
          <strong>12/15 · 80%</strong>: dias cumpridos de dias previstos até hoje. <strong>seq.</strong>: dias previstos seguidos
          cumpridos (fins de semana fora da escala não quebram a sequência).
        </p>
        <Botao variante="secundario" className="botao--pequeno" onClick={() => irPara('ajustes')}>
          Gerenciar hábitos
        </Botao>
      </section>

      <PainelQuantidade habito={quantidade?.habito ?? null} dia={quantidade?.dia ?? hoje} aoFechar={() => setQuantidade(null)} />
    </Pagina>
  )
}
