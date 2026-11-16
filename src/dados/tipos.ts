import type { Dia, Mes } from '../regras/datas'

/* ------------------------------------------------------------------ */
/* Itens do registro (rapid logging)                                   */
/* ------------------------------------------------------------------ */

/** • tarefa · ○ evento · – nota */
export type TipoItem = 'tarefa' | 'evento' | 'nota'

/**
 * Estado de uma tarefa:
 * aberta (•) · concluida (X) · migrada (<) · agendada (>) · descartada (riscada).
 * Eventos e notas ficam sempre "aberta".
 */
export type EstadoItem = 'aberta' | 'concluida' | 'migrada' | 'agendada' | 'descartada'

export interface Item {
  id: string
  tipo: TipoItem
  texto: string
  estado: EstadoItem
  /** * prioridade */
  prioridade: boolean
  /** Mês a que o item pertence (sempre preenchido). */
  mes: Mes
  /**
   * Dia do item. Com dia: aparece no registro diário daquele dia.
   * Sem dia: é uma tarefa/evento do mês (lista do Mês ou do Futuro).
   */
  dia?: Dia
  /** Horário opcional de eventos, "HH:MM". */
  horario?: string
  /** 0 = item normal · 1 = subitem (recuado sob o item de cima) */
  recuo: 0 | 1
  /** Posição dentro da lista (do dia, ou do mês quando não há dia). */
  ordem: number
  /** Item de onde esta cópia veio (quando foi migrada ou agendada). */
  origemId?: string
  /** Para onde a tarefa foi (dia ou mês), quando migrada (<) ou agendada (>). */
  destino?: Dia | Mes
  criadoEm: string
  atualizadoEm: string
}

/* ------------------------------------------------------------------ */
/* Hábitos                                                             */
/* ------------------------------------------------------------------ */

export type TipoHabito = 'check' | 'quantidade'

export interface Habito {
  id: string
  nome: string
  tipo: TipoHabito
  /** Só para quantidade: "ml", "km"… */
  unidade?: string
  /** Só para quantidade: meta diária (ex.: 2000). */
  meta?: number
  /** Botões de soma rápida (ex.: [250, 500]). */
  incrementos?: number[]
  /** Dias da semana em que o hábito vale: 0 = domingo … 6 = sábado. */
  dias: number[]
  /** Primeiro dia que conta para progresso e sequência. */
  inicio: Dia
  ordem: number
  /** Arquivado: some das telas, mas o histórico fica guardado. */
  arquivado: boolean
}

/** O que foi feito de um hábito em um dia. */
export interface RegistroHabito {
  /** `${habitoId}|${dia}`: um registro por hábito por dia. */
  id: string
  habitoId: string
  dia: Dia
  /** Hábito de check: marcado ou não. */
  feito?: boolean
  /** Hábito de quantidade: total do dia. */
  quantidade?: number
}

/* ------------------------------------------------------------------ */
/* Outros                                                              */
/* ------------------------------------------------------------------ */

/** Campo de reflexão livre no fim da página do dia. */
export interface Reflexao {
  dia: Dia
  texto: string
  atualizadoEm: string
}

/** Preferências e marcadores internos do app (chave → valor). */
export interface Ajuste {
  chave: 'semeado' | 'ultimoBackup'
  valor: string | boolean
}
