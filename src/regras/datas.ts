import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Datas são guardadas como texto no horário local do aparelho:
 * - Dia: "2026-11-16"
 * - Mês: "2026-11"
 * Nesse formato, comparar textos (<, >) já compara datas.
 */
export type Dia = string
export type Mes = string

export const paraDia = (data: Date): Dia => format(data, 'yyyy-MM-dd')
export const hoje = (): Dia => paraDia(new Date())
export const mesDoDia = (dia: Dia): Mes => dia.slice(0, 7)
export const mesAtual = (): Mes => mesDoDia(hoje())

const inicioDoMes = (mes: Mes) => parseISO(`${mes}-01`)

export const somarDias = (dia: Dia, n: number): Dia => paraDia(addDays(parseISO(dia), n))

export const somarMeses = (mes: Mes, n: number): Mes =>
  format(addMonths(inicioDoMes(mes), n), 'yyyy-MM')

export const diasDoMes = (mes: Mes): Dia[] =>
  eachDayOfInterval({ start: inicioDoMes(mes), end: endOfMonth(inicioDoMes(mes)) }).map(paraDia)

/** 0 = domingo, 1 = segunda, …, 6 = sábado */
export const diaDaSemana = (dia: Dia): number => getDay(parseISO(dia))

/** Os n meses seguintes a `mes` (sem incluir ele). */
export const proximosMeses = (mes: Mes, n: number): Mes[] =>
  Array.from({ length: n }, (_, i) => somarMeses(mes, i + 1))

/** "segunda, 16 de novembro" */
export const formatarDiaExtenso = (dia: Dia): string =>
  format(parseISO(dia), "EEEE, d 'de' MMMM", { locale: ptBR }).replace('-feira', '')

/** "novembro de 2026" */
export const formatarMes = (mes: Mes): string =>
  format(inicioDoMes(mes), "MMMM 'de' yyyy", { locale: ptBR })

/** "novembro" */
export const nomeDoMes = (mes: Mes): string => format(inicioDoMes(mes), 'MMMM', { locale: ptBR })
