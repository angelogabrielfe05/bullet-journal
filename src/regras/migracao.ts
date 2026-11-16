import type { Item } from '../dados/tipos'
import { mesDoDia, type Dia, type Mes } from './datas'

/**
 * Pendente (migração diária): tarefa aberta de um dia anterior
 * DENTRO do mês atual. Tarefas de meses passados ficam para a
 * migração mensal, para a mesma tarefa não aparecer em dois lugares.
 */
export function ehPendente(item: Item, hoje: Dia): boolean {
  return (
    item.tipo === 'tarefa' &&
    item.estado === 'aberta' &&
    !!item.dia &&
    item.dia < hoje &&
    item.mes === mesDoDia(hoje)
  )
}

/**
 * Para migrar (migração mensal): tarefa aberta de qualquer mês
 * anterior ao atual, seja de um dia ou da lista do mês.
 */
export function ehParaMigrar(item: Item, mesAtual: Mes): boolean {
  return item.tipo === 'tarefa' && item.estado === 'aberta' && item.mes < mesAtual
}

/** Ordem cronológica: primeiro o mês, depois o dia (sem dia vem antes), depois a posição. */
export function ordemCronologica(a: Item, b: Item): number {
  return (
    a.mes.localeCompare(b.mes) ||
    (a.dia ?? '').localeCompare(b.dia ?? '') ||
    a.ordem - b.ordem
  )
}
