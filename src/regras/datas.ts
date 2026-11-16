import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  isValid,
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

/** Primeira letra maiúscula: "novembro de 2026" → "Novembro de 2026". */
export const capitalizar = (texto: string): string => texto.charAt(0).toUpperCase() + texto.slice(1)

/** "novembro de 2026" */
export const formatarMes = (mes: Mes): string =>
  format(inicioDoMes(mes), "MMMM 'de' yyyy", { locale: ptBR })

const DIAS_CURTOS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

/** "sáb, 14" */
export const formatarDiaCurto = (dia: Dia): string => `${DIAS_CURTOS[diaDaSemana(dia)]}, ${Number(dia.slice(8))}`

/** "14/11" */
export const formatarDiaNumerico = (dia: Dia): string => format(parseISO(dia), 'dd/MM')

/** Confere se o texto é um dia válido no formato "2026-11-16". */
export const ehDiaValido = (texto: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(texto) && isValid(parseISO(texto)) && paraDia(parseISO(texto)) === texto

/** Confere se o texto é um mês válido no formato "2026-11". */
export const ehMesValido = (texto: string): boolean => /^\d{4}-(0[1-9]|1[0-2])$/.test(texto)

/** Dias inteiros entre duas datas (ISO com hora ou dia), ex.: para "backup há 9 dias". */
export const diasDesde = (isoOuDia: string, ate: Date = new Date()): number =>
  differenceInCalendarDays(ate, parseISO(isoOuDia))

/** "novembro" */
export const nomeDoMes = (mes: Mes): string => format(inicioDoMes(mes), 'MMMM', { locale: ptBR })
