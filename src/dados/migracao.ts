import { mesDoDia, type Dia, type Mes } from '../regras/datas'
import { ehPendente, ehParaMigrar, ordemCronologica } from '../regras/migracao'
import { agoraISO, db, novoId } from './banco'
import { listaDoDia, listaDoMes, proximaOrdem, type Lista } from './itens'
import type { EstadoItem, Item } from './tipos'

/* ------------------------------------------------------------------ */
/* Consultas                                                           */
/* ------------------------------------------------------------------ */

/** Tarefas abertas de dias anteriores deste mês (bloco "Pendentes" do Hoje). */
export async function listarPendentes(hoje: Dia): Promise<Item[]> {
  const abertas = await db.itens.where('estado').equals('aberta').toArray()
  return abertas.filter((i) => ehPendente(i, hoje)).sort(ordemCronologica)
}

/** Tarefas abertas de meses anteriores (tela de Migração). */
export async function listarParaMigrar(mesAtual: Mes): Promise<Item[]> {
  const abertas = await db.itens.where('estado').equals('aberta').toArray()
  return abertas.filter((i) => ehParaMigrar(i, mesAtual)).sort(ordemCronologica)
}

/* ------------------------------------------------------------------ */
/* Ações                                                               */
/* ------------------------------------------------------------------ */

/**
 * Marca o original com < ou > e cria uma cópia aberta no destino.
 * Devolve a cópia.
 */
async function levarPara(
  id: string,
  destino: Lista,
  marca: Extract<EstadoItem, 'migrada' | 'agendada'>,
): Promise<Item | undefined> {
  return db.transaction('rw', db.itens, async () => {
    const original = await db.itens.get(id)
    if (!original || original.tipo !== 'tarefa' || original.estado !== 'aberta') return

    const agora = agoraISO()
    await db.itens.update(id, {
      estado: marca,
      destino: destino.dia ?? destino.mes,
      atualizadoEm: agora,
    })

    const copia: Item = {
      id: novoId(),
      tipo: 'tarefa',
      texto: original.texto,
      estado: 'aberta',
      prioridade: original.prioridade,
      mes: destino.dia ? mesDoDia(destino.dia) : destino.mes,
      dia: destino.dia,
      recuo: 0,
      ordem: await proximaOrdem(destino),
      origemId: original.id,
      criadoEm: agora,
      atualizadoEm: agora,
    }
    await db.itens.add(copia)
    return copia
  })
}

/** < Migrar para hoje (migração diária). */
export function migrarParaHoje(id: string, hoje: Dia) {
  return levarPara(id, listaDoDia(hoje), 'migrada')
}

/** < Migrar para a lista de tarefas do mês atual (migração mensal). */
export function migrarParaMes(id: string, mes: Mes) {
  return levarPara(id, listaDoMes(mes), 'migrada')
}

/** > Agendar para um mês futuro (com dia opcional): vai para o Registro Futuro. */
export function agendar(id: string, mes: Mes, dia?: Dia) {
  return levarPara(id, dia ? listaDoDia(dia) : listaDoMes(mes), 'agendada')
}

/** Riscar a tarefa. */
export async function descartar(id: string) {
  const item = await db.itens.get(id)
  if (item?.tipo === 'tarefa' && item.estado === 'aberta') {
    await db.itens.update(id, { estado: 'descartada', atualizadoEm: agoraISO() })
  }
}

/**
 * Desfaz migrar, agendar ou descartar: apaga a cópia (se houver)
 * e reabre o original.
 */
export async function desfazerDecisao(id: string) {
  await db.transaction('rw', db.itens, async () => {
    const original = await db.itens.get(id)
    if (!original || !['migrada', 'agendada', 'descartada'].includes(original.estado)) return
    if (original.estado === 'migrada' || original.estado === 'agendada') {
      await db.itens.where('origemId').equals(id).delete()
    }
    await db.itens.update(id, { estado: 'aberta', destino: undefined, atualizadoEm: agoraISO() })
  })
}
