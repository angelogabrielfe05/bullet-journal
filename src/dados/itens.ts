import { mesDoDia, type Dia, type Mes } from '../regras/datas'
import { agoraISO, db, novoId } from './banco'
import type { Item, TipoItem } from './tipos'

/**
 * Uma "lista" é onde o item aparece:
 * - com dia: o registro diário daquele dia;
 * - sem dia: a lista de tarefas/eventos do mês (Mês ou Futuro).
 */
export interface Lista {
  mes: Mes
  dia?: Dia
}

export const listaDoDia = (dia: Dia): Lista => ({ dia, mes: mesDoDia(dia) })
export const listaDoMes = (mes: Mes): Lista => ({ mes })

/** Itens de uma lista, já na ordem certa. */
export async function itensDaLista(lista: Lista): Promise<Item[]> {
  const itens = lista.dia
    ? await db.itens.where('dia').equals(lista.dia).toArray()
    : await db.itens
        .where('mes')
        .equals(lista.mes)
        .filter((i) => !i.dia)
        .toArray()
  return itens.sort((a, b) => a.ordem - b.ordem)
}

export async function proximaOrdem(lista: Lista): Promise<number> {
  const itens = await itensDaLista(lista)
  return itens.length ? Math.max(...itens.map((i) => i.ordem)) + 1 : 0
}

export interface NovoItem {
  tipo: TipoItem
  texto: string
  lista: Lista
  prioridade?: boolean
  horario?: string
  recuo?: 0 | 1
}

/** Cria um item no fim da lista. */
export async function criarItem(novo: NovoItem): Promise<Item> {
  return db.transaction('rw', db.itens, async () => {
    const agora = agoraISO()
    const item: Item = {
      id: novoId(),
      tipo: novo.tipo,
      texto: novo.texto.trim(),
      estado: 'aberta',
      prioridade: novo.prioridade ?? false,
      mes: novo.lista.dia ? mesDoDia(novo.lista.dia) : novo.lista.mes,
      dia: novo.lista.dia,
      horario: novo.tipo === 'evento' ? novo.horario : undefined,
      recuo: novo.recuo ?? 0,
      ordem: await proximaOrdem(novo.lista),
      criadoEm: agora,
      atualizadoEm: agora,
    }
    await db.itens.add(item)
    return item
  })
}

async function alterar(id: string, mudancas: Partial<Item>) {
  await db.itens.update(id, { ...mudancas, atualizadoEm: agoraISO() })
}

export async function editarTexto(id: string, texto: string) {
  await alterar(id, { texto: texto.trim() })
}

/** Troca o símbolo (ex.: nota → tarefa). Volta o estado para aberta. */
export async function trocarTipo(id: string, tipo: TipoItem) {
  const item = await db.itens.get(id)
  if (!item || item.tipo === tipo) return
  await alterar(id, {
    tipo,
    estado: 'aberta',
    horario: tipo === 'evento' ? item.horario : undefined,
  })
}

export async function alternarPrioridade(id: string) {
  const item = await db.itens.get(id)
  if (item) await alterar(id, { prioridade: !item.prioridade })
}

/** Tocar no símbolo: • aberta ↔ X concluída. Outros estados não mudam. */
export async function alternarConcluida(id: string) {
  const item = await db.itens.get(id)
  if (!item || item.tipo !== 'tarefa') return
  if (item.estado === 'aberta') await alterar(id, { estado: 'concluida' })
  else if (item.estado === 'concluida') await alterar(id, { estado: 'aberta' })
}

export async function definirHorario(id: string, horario: string | undefined) {
  await alterar(id, { horario: horario || undefined })
}

export async function definirRecuo(id: string, recuo: 0 | 1) {
  await alterar(id, { recuo })
}

/** Salva a nova ordem depois de arrastar: `ids` na ordem em que aparecem. */
export async function reordenar(ids: string[]) {
  await db.transaction('rw', db.itens, async () => {
    await Promise.all(ids.map((id, ordem) => db.itens.update(id, { ordem })))
  })
}

/** Leva o item para outra lista (ex.: tarefa do mês → um dia), no fim dela. */
export async function moverPara(id: string, lista: Lista) {
  await db.transaction('rw', db.itens, async () => {
    await alterar(id, {
      dia: lista.dia,
      mes: lista.dia ? mesDoDia(lista.dia) : lista.mes,
      ordem: await proximaOrdem(lista),
      recuo: 0,
    })
  })
}

/** Apaga e devolve o item, para permitir "desfazer". */
export async function apagarItem(id: string): Promise<Item | undefined> {
  const item = await db.itens.get(id)
  if (item) await db.itens.delete(id)
  return item
}

/** Desfaz um apagamento. */
export async function restaurarItem(item: Item) {
  await db.itens.put(item)
}
