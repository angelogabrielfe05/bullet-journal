import { diasDoMes, type Dia, type Mes } from '../regras/datas'
import { idDoRegistro } from '../regras/habitos'
import { db, novoId } from './banco'
import type { Habito, RegistroHabito } from './tipos'

/* ------------------------------------------------------------------ */
/* Hábitos                                                             */
/* ------------------------------------------------------------------ */

/** Hábitos ativos (ou todos, incluindo arquivados), na ordem da lista. */
export async function listarHabitos(incluirArquivados = false): Promise<Habito[]> {
  const todos = await db.habitos.orderBy('ordem').toArray()
  return incluirArquivados ? todos : todos.filter((h) => !h.arquivado)
}

export async function criarHabito(dados: Omit<Habito, 'id' | 'ordem' | 'arquivado'>): Promise<Habito> {
  const todos = await db.habitos.toArray()
  const habito: Habito = {
    ...dados,
    id: novoId(),
    ordem: todos.length ? Math.max(...todos.map((h) => h.ordem)) + 1 : 0,
    arquivado: false,
  }
  await db.habitos.add(habito)
  return habito
}

export async function editarHabito(id: string, mudancas: Partial<Omit<Habito, 'id'>>) {
  await db.habitos.update(id, mudancas)
}

export async function arquivarHabito(id: string, arquivado = true) {
  await db.habitos.update(id, { arquivado })
}

export async function reordenarHabitos(ids: string[]) {
  await db.transaction('rw', db.habitos, async () => {
    await Promise.all(ids.map((id, ordem) => db.habitos.update(id, { ordem })))
  })
}

/* ------------------------------------------------------------------ */
/* Registros diários                                                   */
/* ------------------------------------------------------------------ */

/** Hábito de check: marca/desmarca o dia. */
export async function alternarCheck(habitoId: string, dia: Dia) {
  const id = idDoRegistro(habitoId, dia)
  await db.transaction('rw', db.registros, async () => {
    const atual = await db.registros.get(id)
    await db.registros.put({ id, habitoId, dia, feito: !atual?.feito })
  })
}

/** Hábito de quantidade: soma (ou subtrai, com valor negativo) ao total do dia. */
export async function somarQuantidade(habitoId: string, dia: Dia, valor: number) {
  const id = idDoRegistro(habitoId, dia)
  await db.transaction('rw', db.registros, async () => {
    const atual = (await db.registros.get(id))?.quantidade ?? 0
    await db.registros.put({ id, habitoId, dia, quantidade: arredondar(Math.max(0, atual + valor)) })
  })
}

/** Hábito de quantidade: define o total do dia (campo livre ou "zerar"). */
export async function definirQuantidade(habitoId: string, dia: Dia, quantidade: number) {
  const id = idDoRegistro(habitoId, dia)
  await db.registros.put({ id, habitoId, dia, quantidade: arredondar(Math.max(0, quantidade)) })
}

/** Evita sobras do tipo 0,30000000004 km. */
const arredondar = (n: number) => Math.round(n * 100) / 100

/**
 * Registros de um intervalo de dias, agrupados por hábito e depois por dia.
 * Para a sequência, peça um intervalo longo o bastante (ex.: desde o início do hábito).
 */
export async function registrosEntre(
  de: Dia,
  ate: Dia,
): Promise<Map<string, Map<Dia, RegistroHabito>>> {
  const registros = await db.registros.where('dia').between(de, ate, true, true).toArray()
  const porHabito = new Map<string, Map<Dia, RegistroHabito>>()
  for (const r of registros) {
    if (!porHabito.has(r.habitoId)) porHabito.set(r.habitoId, new Map())
    porHabito.get(r.habitoId)!.set(r.dia, r)
  }
  return porHabito
}

export function registrosDoMes(mes: Mes) {
  const dias = diasDoMes(mes)
  return registrosEntre(dias[0], dias[dias.length - 1])
}
