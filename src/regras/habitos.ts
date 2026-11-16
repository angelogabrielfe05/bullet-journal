import type { Habito, RegistroHabito } from '../dados/tipos'
import { diaDaSemana, diasDoMes, somarDias, type Dia, type Mes } from './datas'

/** Registros de UM hábito, indexados pelo dia. */
export type RegistrosPorDia = ReadonlyMap<Dia, RegistroHabito>

export const idDoRegistro = (habitoId: string, dia: Dia) => `${habitoId}|${dia}`

/** O hábito vale neste dia? (está na escala e já tinha começado) */
export function valeNoDia(habito: Habito, dia: Dia): boolean {
  return dia >= habito.inicio && habito.dias.includes(diaDaSemana(dia))
}

/** O hábito foi cumprido com este registro? */
export function cumprido(habito: Habito, registro: RegistroHabito | undefined): boolean {
  if (!registro) return false
  if (habito.tipo === 'check') return !!registro.feito
  const quantidade = registro.quantidade ?? 0
  return habito.meta && habito.meta > 0 ? quantidade >= habito.meta : quantidade > 0
}

/** Quanto da meta foi atingido (0 a 1), para pintar a célula parcialmente. */
export function fracaoDoDia(habito: Habito, registro: RegistroHabito | undefined): number {
  if (cumprido(habito, registro)) return 1
  if (habito.tipo === 'check' || !habito.meta) return 0
  return Math.min(1, Math.max(0, (registro?.quantidade ?? 0) / habito.meta))
}

export interface Progresso {
  cumpridos: number
  previstos: number
  /** 0 a 100, arredondado */
  percentual: number
}

/**
 * Progresso do mês: dias cumpridos ÷ dias previstos até hoje.
 * Hoje só entra na conta depois de cumprido (para não "baixar" a
 * porcentagem logo de manhã). Dias futuros não contam.
 */
export function progressoDoMes(
  habito: Habito,
  registros: RegistrosPorDia,
  mes: Mes,
  hoje: Dia,
): Progresso {
  let cumpridos = 0
  let previstos = 0
  for (const dia of diasDoMes(mes)) {
    if (dia > hoje) break
    if (!valeNoDia(habito, dia)) continue
    const ok = cumprido(habito, registros.get(dia))
    if (dia === hoje && !ok) continue
    previstos++
    if (ok) cumpridos++
  }
  return {
    cumpridos,
    previstos,
    percentual: previstos ? Math.round((cumpridos / previstos) * 100) : 0,
  }
}

/**
 * Sequência (streak): quantos dias previstos seguidos foram cumpridos,
 * contando de hoje para trás.
 * - Dias fora da escala não contam nem quebram.
 * - Hoje, enquanto não for cumprido, não quebra.
 */
export function sequencia(habito: Habito, registros: RegistrosPorDia, hoje: Dia): number {
  let total = 0
  for (let dia = hoje; dia >= habito.inicio; dia = somarDias(dia, -1)) {
    if (!valeNoDia(habito, dia)) continue
    if (cumprido(habito, registros.get(dia))) total++
    else if (dia !== hoje) break
  }
  return total
}
