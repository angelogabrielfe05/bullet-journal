import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { agendar, descartar, desfazerDecisao, listarPendentes, migrarParaHoje } from '../dados/migracao'
import type { Item } from '../dados/tipos'
import { formatarDiaCurto, formatarMes, type Dia } from '../regras/datas'
import { useAviso } from './avisoContexto'
import { LinhaDecisao } from './LinhaDecisao'
import { PainelAgendar } from './PainelAgendar'

/**
 * Migração diária: tarefas abertas de dias anteriores deste mês,
 * cada uma com 3 destinos (migrar para hoje, agendar, descartar).
 */
export function Pendentes({ hoje }: { hoje: Dia }) {
  const pendentes = useLiveQuery(() => listarPendentes(hoje), [hoje])
  const [agendando, setAgendando] = useState<Item | null>(null)
  const avisar = useAviso()

  if (!pendentes?.length) return null

  const comDesfazer = (texto: string, id: string) =>
    avisar({ texto, acao: { rotulo: 'Desfazer', aoClicar: () => void desfazerDecisao(id) } })

  return (
    <section className="bloco bloco--pendentes" aria-labelledby="titulo-pendentes">
      <header className="bloco__cabecalho">
        <h2 id="titulo-pendentes" className="bloco__titulo">
          Pendentes <span className="bloco__contagem">{pendentes.length}</span>
        </h2>
        <p className="bloco__ajuda">Tarefas abertas de dias anteriores. O que fazer com cada uma?</p>
      </header>

      <ul className="pendentes">
        {pendentes.map((item) => (
          <LinhaDecisao
            key={item.id}
            item={item}
            rotuloData={formatarDiaCurto(item.dia!)}
            rotuloMigrar="Hoje"
            aoMigrar={async () => {
              await migrarParaHoje(item.id, hoje)
              comDesfazer('Migrada para hoje', item.id)
            }}
            aoAgendar={() => setAgendando(item)}
            aoDescartar={async () => {
              await descartar(item.id)
              comDesfazer('Tarefa descartada', item.id)
            }}
          />
        ))}
      </ul>

      <PainelAgendar
        aberto={!!agendando}
        aoFechar={() => setAgendando(null)}
        hoje={hoje}
        texto={agendando?.texto}
        aoEscolher={async (mes, dia) => {
          if (!agendando) return
          const id = agendando.id
          await agendar(id, mes, dia)
          comDesfazer(`Agendada para ${dia ? formatarDiaCurto(dia) : formatarMes(mes)}`, id)
        }}
      />
    </section>
  )
}
