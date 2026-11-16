import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useAviso } from '../componentes/avisoContexto'
import { Botao } from '../componentes/Botao'
import { IconeSetaEsquerda } from '../componentes/Icones'
import { LinhaDecisao } from '../componentes/LinhaDecisao'
import { Pagina } from '../componentes/Pagina'
import { PainelAgendar } from '../componentes/PainelAgendar'
import { useHoje } from '../componentes/useHoje'
import { agendar, descartar, desfazerDecisao, listarParaMigrar, migrarParaMes } from '../dados/migracao'
import type { Item } from '../dados/tipos'
import { irPara } from '../navegacao'
import { capitalizar, formatarDiaCurto, formatarMes, mesDoDia, nomeDoMes, type Mes } from '../regras/datas'

/**
 * Migração mensal: cada tarefa aberta de meses anteriores ganha um destino —
 * migrar para este mês (<), agendar para o futuro (>) ou descartar.
 */
export function Migracao() {
  const hoje = useHoje()
  const mesAtual = mesDoDia(hoje)
  const restantes = useLiveQuery(() => listarParaMigrar(mesAtual), [mesAtual])
  const [agendando, setAgendando] = useState<Item | null>(null)
  const [decididas, setDecididas] = useState(0)
  const avisar = useAviso()

  const total = (restantes?.length ?? 0) + decididas

  async function decidir(acao: () => Promise<unknown>, texto: string, id: string) {
    await acao()
    setDecididas((n) => n + 1)
    avisar({
      texto,
      acao: {
        rotulo: 'Desfazer',
        aoClicar: async () => {
          await desfazerDecisao(id)
          setDecididas((n) => Math.max(0, n - 1))
        },
      },
    })
  }

  // Agrupa por mês de origem (ex.: outubro, setembro…).
  const grupos = new Map<Mes, Item[]>()
  for (const item of restantes ?? []) {
    if (!grupos.has(item.mes)) grupos.set(item.mes, [])
    grupos.get(item.mes)!.push(item)
  }

  return (
    <Pagina titulo="Migração">
      <button type="button" className="link link--voltar" onClick={() => irPara('futuro')}>
        <IconeSetaEsquerda tamanho={16} /> Futuro
      </button>

      <p className="bloco__ajuda">
        Revise as tarefas abertas dos meses anteriores. O que ainda importa vem para {nomeDoMes(mesAtual)} (&lt;), o que é para depois vai
        para o futuro (&gt;) e o que deixou de importar é riscado.
      </p>

      {restantes && total > 0 && (
        <div className="progresso-migracao" role="status">
          <span>
            <strong>{decididas}</strong> de <strong>{total}</strong> decididas
          </span>
          <div className="barra-progresso" aria-hidden="true">
            <div className="barra-progresso__preenchido" style={{ width: `${(decididas / total) * 100}%` }} />
          </div>
        </div>
      )}

      {[...grupos].map(([mes, itens]) => (
        <section key={mes} className="bloco bloco--pendentes" aria-label={`Tarefas abertas de ${formatarMes(mes)}`}>
          <h2 className="bloco__titulo">
            {capitalizar(formatarMes(mes))} <span className="bloco__contagem">{itens.length}</span>
          </h2>
          <ul className="pendentes">
            {itens.map((item) => (
              <LinhaDecisao
                key={item.id}
                item={item}
                rotuloData={item.dia ? formatarDiaCurto(item.dia) : 'lista do mês'}
                rotuloMigrar="Este mês"
                aoMigrar={() => decidir(() => migrarParaMes(item.id, mesAtual), `Migrada para ${nomeDoMes(mesAtual)}`, item.id)}
                aoAgendar={() => setAgendando(item)}
                aoDescartar={() => decidir(() => descartar(item.id), 'Tarefa descartada', item.id)}
              />
            ))}
          </ul>
        </section>
      ))}

      {restantes && restantes.length === 0 && (
        <div className="migracao-fim">
          <p className="migracao-fim__titulo">{decididas ? 'Migração concluída ✓' : 'Nada para migrar'}</p>
          <p className="bloco__ajuda">
            {decididas
              ? `${decididas} ${decididas === 1 ? 'tarefa decidida' : 'tarefas decididas'}. As migradas estão nas tarefas de ${nomeDoMes(mesAtual)}.`
              : 'Não há tarefas abertas de meses anteriores.'}
          </p>
          <div className="ajustes__botoes">
            <Botao variante="primario" onClick={() => irPara('mes')}>
              Ver {nomeDoMes(mesAtual)}
            </Botao>
            <Botao variante="fantasma" onClick={() => irPara('hoje')}>
              Ir para Hoje
            </Botao>
          </div>
        </div>
      )}

      <PainelAgendar
        aberto={!!agendando}
        aoFechar={() => setAgendando(null)}
        hoje={hoje}
        texto={agendando?.texto}
        aoEscolher={(mes, dia) => {
          if (!agendando) return
          const id = agendando.id
          void decidir(() => agendar(id, mes, dia), `Agendada para ${dia ? formatarDiaCurto(dia) : formatarMes(mes)}`, id)
        }}
      />
    </Pagina>
  )
}
