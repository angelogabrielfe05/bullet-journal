import Dexie, { type EntityTable } from 'dexie'
import type { Ajuste, Habito, Item, Reflexao, RegistroHabito } from './tipos'

/**
 * Banco local do aparelho (IndexedDB), via Dexie.
 * Cada "tabela" é como uma aba de planilha; a linha `stores` lista
 * a chave principal e os campos usados para buscar.
 */
export type BancoBujo = Dexie & {
  itens: EntityTable<Item, 'id'>
  habitos: EntityTable<Habito, 'id'>
  registros: EntityTable<RegistroHabito, 'id'>
  reflexoes: EntityTable<Reflexao, 'dia'>
  ajustes: EntityTable<Ajuste, 'chave'>
}

export const db = new Dexie('bullet-journal') as BancoBujo

db.version(1).stores({
  itens: 'id, dia, mes, estado, origemId',
  habitos: 'id, ordem',
  registros: 'id, habitoId, dia',
  reflexoes: 'dia',
  ajustes: 'chave',
})

export const novoId = (): string => crypto.randomUUID()
export const agoraISO = (): string => new Date().toISOString()

export async function lerAjuste<T extends Ajuste['valor']>(
  chave: Ajuste['chave'],
): Promise<T | undefined> {
  return (await db.ajustes.get(chave))?.valor as T | undefined
}

export async function salvarAjuste(chave: Ajuste['chave'], valor: Ajuste['valor']) {
  await db.ajustes.put({ chave, valor })
}

/**
 * Pede ao navegador para não apagar os dados sozinho (importante no iPhone).
 * Devolve true se o pedido foi aceito.
 */
export async function pedirArmazenamentoPersistente(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}
