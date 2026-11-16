import type { EstadoItem, TipoItem } from '../dados/tipos'

const NOME_DO_TIPO: Record<TipoItem, string> = {
  tarefa: 'Tarefa',
  evento: 'Evento',
  nota: 'Nota',
}

const NOME_DO_ESTADO: Record<EstadoItem, string> = {
  aberta: 'aberta',
  concluida: 'concluída',
  migrada: 'migrada',
  agendada: 'agendada',
  descartada: 'descartada',
}

/** Texto para leitores de tela, ex.: "Tarefa concluída, prioridade". */
export function descreverSimbolo(tipo: TipoItem, estado: EstadoItem, prioridade = false) {
  const base = tipo === 'tarefa' ? `${NOME_DO_TIPO[tipo]} ${NOME_DO_ESTADO[estado]}` : NOME_DO_TIPO[tipo]
  return prioridade ? `${base}, prioridade` : base
}

/** Legenda do método, para a amostra e para ajuda. */
export const LEGENDA: { tipo: TipoItem; estado: EstadoItem; nome: string }[] = [
  { tipo: 'tarefa', estado: 'aberta', nome: 'Tarefa' },
  { tipo: 'evento', estado: 'aberta', nome: 'Evento' },
  { tipo: 'nota', estado: 'aberta', nome: 'Nota' },
  { tipo: 'tarefa', estado: 'concluida', nome: 'Concluída' },
  { tipo: 'tarefa', estado: 'migrada', nome: 'Migrada' },
  { tipo: 'tarefa', estado: 'agendada', nome: 'Agendada' },
]
