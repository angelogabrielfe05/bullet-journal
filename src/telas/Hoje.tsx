import { useLiveQuery } from 'dexie-react-hooks'
import { AdicionarItem } from '../componentes/AdicionarItem'
import { FaixaHabitos } from '../componentes/FaixaHabitos'
import { IconeSetaDireita, IconeSetaEsquerda } from '../componentes/Icones'
import { ListaItens } from '../componentes/ListaItens'
import { Pagina } from '../componentes/Pagina'
import { Pendentes } from '../componentes/Pendentes'
import { RecadosHoje } from '../componentes/RecadosHoje'
import { Reflexao } from '../componentes/Reflexao'
import { useHoje } from '../componentes/useHoje'
import { itensDaLista, listaDoDia } from '../dados/itens'
import { irPara, type PropsTela } from '../navegacao'
import { ehDiaValido, formatarDiaExtenso, formatarDiaNumerico, somarDias, type Dia } from '../regras/datas'

/** Registro diário. Sem parâmetro mostra hoje; com #/hoje/2026-11-14 mostra aquele dia. */
export function Hoje({ parametro }: PropsTela) {
  const hoje = useHoje()
  const dia = parametro && ehDiaValido(parametro) ? parametro : hoje
  const ehHoje = dia === hoje
  const itens = useLiveQuery(() => itensDaLista(listaDoDia(dia)), [dia])

  return (
    <Pagina titulo={tituloDoDia(dia, hoje)}>
      <NavegacaoDia dia={dia} hoje={hoje} />

      {ehHoje && <RecadosHoje hoje={hoje} />}
      {ehHoje && <Pendentes hoje={hoje} />}
      {dia <= hoje && <FaixaHabitos dia={dia} />}

      <section className="bloco" aria-label="Registro do dia">
        {itens && itens.length > 0 && <ListaItens itens={itens} />}
        {itens && itens.length === 0 && (
          <p className="vazio">{ehHoje ? 'Página em branco. O que tem para hoje?' : 'Nada anotado neste dia.'}</p>
        )}
        <AdicionarItem lista={listaDoDia(dia)} />
      </section>

      <Reflexao key={dia} dia={dia} />
    </Pagina>
  )
}

function tituloDoDia(dia: Dia, hoje: Dia) {
  if (dia === hoje) return 'Hoje'
  if (dia === somarDias(hoje, -1)) return 'Ontem'
  if (dia === somarDias(hoje, 1)) return 'Amanhã'
  return formatarDiaNumerico(dia)
}

/** ‹ segunda, 16 de novembro ›  [voltar para hoje] */
function NavegacaoDia({ dia, hoje }: { dia: Dia; hoje: Dia }) {
  const ir = (destino: Dia) => (destino === hoje ? irPara('hoje') : irPara('hoje', destino))
  return (
    <nav className="navegacao-dia" aria-label="Trocar de dia">
      <button type="button" className="botao-simbolo" aria-label="Dia anterior" onClick={() => ir(somarDias(dia, -1))}>
        <IconeSetaEsquerda tamanho={20} />
      </button>
      <p className="navegacao-dia__data" aria-live="polite">
        {formatarDiaExtenso(dia)}
      </p>
      <button type="button" className="botao-simbolo" aria-label="Dia seguinte" onClick={() => ir(somarDias(dia, 1))}>
        <IconeSetaDireita tamanho={20} />
      </button>
      {dia !== hoje && (
        <button type="button" className="link navegacao-dia__hoje" onClick={() => irPara('hoje')}>
          voltar para hoje
        </button>
      )}
    </nav>
  )
}
