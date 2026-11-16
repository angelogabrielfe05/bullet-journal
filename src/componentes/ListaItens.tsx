import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRef, useState, type ReactNode } from 'react'
import {
  alternarConcluida,
  alternarPrioridade,
  apagarItem,
  definirHorario,
  definirRecuo,
  editarTexto,
  reordenar,
  restaurarItem,
  trocarTipo,
} from '../dados/itens'
import type { Item, TipoItem } from '../dados/tipos'
import { useAviso } from './avisoContexto'
import { IconeArrastar, IconeMenu } from './Icones'
import { PainelInferior } from './PainelInferior'
import { MarcaPrioridade, Simbolo } from './Simbolo'
import { descreverSimbolo } from './simbolosTexto'

/** Só deixa arrastar para cima e para baixo. */
const somenteVertical: Modifier = ({ transform }) => ({ ...transform, x: 0 })

interface Props {
  itens: Item[]
  /** Ações extras no menu do item (ex.: "Mover para um dia" no Mês). */
  acoesExtras?: (item: Item, fechar: () => void) => ReactNode
}

/**
 * Lista de bullets: tocar no símbolo conclui, tocar no texto edita,
 * "⋯" abre o menu e a alça "⠿" arrasta para reordenar.
 */
export function ListaItens({ itens, acoesExtras }: Props) {
  // Depois de arrastar, mostra a nova ordem na hora, sem esperar o banco.
  // Quando o banco responde (itens novos), volta a valer a lista do banco.
  const [otimista, setOtimista] = useState<{ base: Item[]; ordem: Item[] } | null>(null)
  const ordem = otimista?.base === itens ? otimista.ordem : itens
  const setOrdem = (nova: Item[]) => setOtimista({ base: itens, ordem: nova })

  const [idDoMenu, setIdDoMenu] = useState<string | null>(null)
  const avisar = useAviso()

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  async function aoSoltar({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const de = ordem.findIndex((i) => i.id === active.id)
    const para = ordem.findIndex((i) => i.id === over.id)
    const nova = arrayMove(ordem, de, para)
    setOrdem(nova)
    await reordenar(nova.map((i) => i.id))
    // O primeiro item da lista não pode ser subitem.
    if (nova[0]?.recuo) await definirRecuo(nova[0].id, 0)
  }

  async function apagar(id: string) {
    const apagado = await apagarItem(id)
    if (apagado) {
      avisar({ texto: 'Item apagado', acao: { rotulo: 'Desfazer', aoClicar: () => void restaurarItem(apagado) } })
    }
  }

  const indiceDoMenu = ordem.findIndex((i) => i.id === idDoMenu)
  const itemDoMenu = indiceDoMenu >= 0 ? ordem[indiceDoMenu] : null

  return (
    <>
      <DndContext sensors={sensores} collisionDetection={closestCenter} modifiers={[somenteVertical]} onDragEnd={aoSoltar}>
        <SortableContext items={ordem.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <ul className="lista-bullets">
            {ordem.map((item) => (
              <LinhaItem key={item.id} item={item} aoAbrirMenu={() => setIdDoMenu(item.id)} aoApagar={() => apagar(item.id)} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <MenuItem
        item={itemDoMenu}
        podeRecuar={indiceDoMenu > 0}
        aoFechar={() => setIdDoMenu(null)}
        aoApagar={(id) => apagar(id)}
        acoesExtras={acoesExtras}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Uma linha                                                           */
/* ------------------------------------------------------------------ */

interface PropsLinha {
  item: Item
  aoAbrirMenu: () => void
  aoApagar: () => void
}

function LinhaItem({ item, aoAbrirMenu, aoApagar }: PropsLinha) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const [editando, setEditando] = useState(false)

  const podeConcluir = item.tipo === 'tarefa' && (item.estado === 'aberta' || item.estado === 'concluida')
  const descricao = descreverSimbolo(item.tipo, item.estado, item.prioridade)

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className="bullet"
      data-tipo={item.tipo}
      data-estado={item.estado}
      data-recuo={item.recuo}
      data-arrastando={isDragging || undefined}
    >
      <span className="bullet__prioridade">{item.prioridade && <MarcaPrioridade />}</span>

      <span className="bullet__simbolo">
        {podeConcluir ? (
          <button
            type="button"
            className="botao-simbolo"
            aria-label={`${descricao}. ${item.estado === 'aberta' ? 'Marcar como concluída' : 'Reabrir'}`}
            onClick={() => alternarConcluida(item.id)}
          >
            <Simbolo tipo={item.tipo} estado={item.estado} />
          </button>
        ) : (
          <span role="img" aria-label={descricao}>
            <Simbolo tipo={item.tipo} estado={item.estado} />
          </span>
        )}
      </span>

      {editando ? (
        <EdicaoTexto
          item={item}
          aoTerminar={async (texto) => {
            setEditando(false)
            if (texto === null || texto === item.texto) return
            if (!texto.trim()) aoApagar()
            else await editarTexto(item.id, texto)
          }}
        />
      ) : (
        <button type="button" className="bullet__texto" onClick={() => setEditando(true)}>
          {item.tipo === 'evento' && item.horario && <span className="bullet__horario">{item.horario} </span>}
          {item.texto}
          {(item.estado === 'migrada' || item.estado === 'agendada') && item.destino && (
            <span className="bullet__destino"> → {rotuloDestino(item.destino)}</span>
          )}
        </button>
      )}

      <span className="bullet__acoes">
        <button type="button" className="botao-simbolo bullet__menu" aria-label={`Opções: ${item.texto}`} onClick={aoAbrirMenu}>
          <IconeMenu tamanho={18} />
        </button>
        <button
          type="button"
          ref={setActivatorNodeRef}
          className="botao-simbolo bullet__alca"
          aria-label={`Arrastar para reordenar: ${item.texto}`}
          {...attributes}
          {...listeners}
        >
          <IconeArrastar tamanho={18} />
        </button>
      </span>
    </li>
  )
}

/** "16/11" para dia, "dez/26" para mês. */
function rotuloDestino(destino: string) {
  const [ano, mes, dia] = destino.split('-')
  if (dia) return `${dia}/${mes}`
  const nomes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${nomes[Number(mes) - 1]}/${ano.slice(2)}`
}

/** Campo de edição no lugar do texto. Enter ou tocar fora salva; Esc cancela. */
function EdicaoTexto({ item, aoTerminar }: { item: Item; aoTerminar: (texto: string | null) => void }) {
  const [texto, setTexto] = useState(item.texto)
  const terminou = useRef(false)
  const terminar = (valor: string | null) => {
    if (terminou.current) return
    terminou.current = true
    aoTerminar(valor)
  }
  return (
    <input
      className="bullet__edicao"
      aria-label="Editar texto"
      value={texto}
      autoFocus
      enterKeyHint="done"
      onChange={(e) => setTexto(e.target.value)}
      onBlur={() => terminar(texto)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') terminar(texto)
        if (e.key === 'Escape') terminar(null)
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Menu do item                                                        */
/* ------------------------------------------------------------------ */

const NOMES_TIPO: Record<TipoItem, string> = { tarefa: 'tarefa', evento: 'evento', nota: 'nota' }

interface PropsMenu {
  item: Item | null
  podeRecuar: boolean
  aoFechar: () => void
  aoApagar: (id: string) => void
  acoesExtras?: Props['acoesExtras']
}

function MenuItem({ item, podeRecuar, aoFechar, aoApagar, acoesExtras }: PropsMenu) {
  return (
    <PainelInferior aberto={!!item} aoFechar={aoFechar} titulo="Opções do item">
      {item && (
        <>
          <p className="menu-item__texto">{item.texto}</p>

          {item.tipo === 'evento' && (
            <label className="menu-item__horario">
              <span>Horário</span>
              <input
                type="time"
                className="campo__entrada"
                value={item.horario ?? ''}
                onChange={(e) => definirHorario(item.id, e.target.value)}
              />
            </label>
          )}

          <ul className="opcoes">
            {(['tarefa', 'evento', 'nota'] as const)
              .filter((tipo) => tipo !== item.tipo)
              .map((tipo) => (
                <li key={tipo}>
                  <button
                    type="button"
                    className="opcao"
                    onClick={() => {
                      void trocarTipo(item.id, tipo)
                      aoFechar()
                    }}
                  >
                    <Simbolo tipo={tipo} /> Transformar em {NOMES_TIPO[tipo]}
                  </button>
                </li>
              ))}
            <li>
              <button
                type="button"
                className="opcao"
                onClick={() => {
                  void alternarPrioridade(item.id)
                  aoFechar()
                }}
              >
                <MarcaPrioridade /> {item.prioridade ? 'Tirar prioridade' : 'Marcar como prioridade'}
              </button>
            </li>
            {(item.recuo === 1 || podeRecuar) && (
              <li>
                <button
                  type="button"
                  className="opcao"
                  onClick={() => {
                    void definirRecuo(item.id, item.recuo === 1 ? 0 : 1)
                    aoFechar()
                  }}
                >
                  <span className="opcao__icone" aria-hidden="true">
                    {item.recuo === 1 ? '⇤' : '⇥'}
                  </span>
                  {item.recuo === 1 ? 'Tirar recuo' : 'Recuar (virar subitem)'}
                </button>
              </li>
            )}
            {acoesExtras?.(item, aoFechar)}
            <li>
              <button
                type="button"
                className="opcao opcao--perigo"
                onClick={() => {
                  aoApagar(item.id)
                  aoFechar()
                }}
              >
                Apagar
              </button>
            </li>
          </ul>
        </>
      )}
    </PainelInferior>
  )
}
