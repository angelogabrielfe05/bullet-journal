import { useLiveQuery } from 'dexie-react-hooks'
import { AdicionarItem } from '../componentes/AdicionarItem'
import { Botao } from '../componentes/Botao'
import { LinhaDatada } from '../componentes/LinhaDatada'
import { ListaItens } from '../componentes/ListaItens'
import { Pagina } from '../componentes/Pagina'
import { useHoje } from '../componentes/useHoje'
import { db } from '../dados/banco'
import { itensDaLista, listaDoMes } from '../dados/itens'
import { listarParaMigrar } from '../dados/migracao'
import { irPara } from '../navegacao'
import { capitalizar, formatarMes, mesDoDia, nomeDoMes, proximosMeses, type Mes } from '../regras/datas'
import { ordemCronologica } from '../regras/migracao'

const MESES_A_FRENTE = 6

/** Registro Futuro: os próximos 6 meses, com o que já está agendado (>) para cada um. */
export function Futuro() {
  const hoje = useHoje()
  const mesAtual = mesDoDia(hoje)
  const paraMigrar = useLiveQuery(() => listarParaMigrar(mesAtual), [mesAtual])

  return (
    <Pagina titulo="Futuro">
      <div className="recado recado--neutro">
        <p className="recado__texto">
          <strong>Migração mensal.</strong>{' '}
          {paraMigrar?.length
            ? `${paraMigrar.length} ${paraMigrar.length === 1 ? 'tarefa aberta' : 'tarefas abertas'} de meses anteriores.`
            : 'Nada para migrar agora.'}
        </p>
        <Botao variante={paraMigrar?.length ? 'primario' : 'secundario'} className="botao--pequeno" onClick={() => irPara('migracao')}>
          Abrir
        </Botao>
      </div>

      <p className="bloco__ajuda">
        Anote aqui o que é para depois. Quando o mês chegar, tudo aparece sozinho na aba Mês (e, se tiver dia, no registro daquele dia).
      </p>

      {proximosMeses(mesAtual, MESES_A_FRENTE).map((mes) => (
        <BlocoMes key={mes} mes={mes} />
      ))}
    </Pagina>
  )
}

function BlocoMes({ mes }: { mes: Mes }) {
  const comDia = useLiveQuery(
    async () => (await db.itens.where('mes').equals(mes).filter((i) => !!i.dia).toArray()).sort(ordemCronologica),
    [mes],
  )
  const semDia = useLiveQuery(() => itensDaLista(listaDoMes(mes)), [mes])
  const vazio = comDia?.length === 0 && semDia?.length === 0

  return (
    <section className="bloco bloco-futuro" aria-label={formatarMes(mes)}>
      <header className="bloco__cabecalho bloco__cabecalho--linha">
        <h2 className="bloco__titulo">{capitalizar(formatarMes(mes))}</h2>
        <button type="button" className="link" onClick={() => irPara('mes', mes)}>
          ver mês
        </button>
      </header>

      {!!comDia?.length && (
        <ul className="lista-datada">
          {comDia.map((item) => (
            <LinhaDatada key={item.id} item={item} />
          ))}
        </ul>
      )}
      {!!semDia?.length && <ListaItens itens={semDia} />}
      {vazio && <p className="vazio bloco-futuro__vazio">Nada por enquanto.</p>}

      <AdicionarItem lista={listaDoMes(mes)} dica={`Anotar para ${nomeDoMes(mes)}…`} escolherDiaEm={mes} />
    </section>
  )
}
