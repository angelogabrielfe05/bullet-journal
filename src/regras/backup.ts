import { isValid, parseISO } from 'date-fns'
import type { Habito, Item, Reflexao, RegistroHabito } from '../dados/tipos'
import { ehDiaValido, ehMesValido } from './datas'

/**
 * Formato do arquivo de backup. Se o formato mudar no futuro, aumente
 * VERSAO_BACKUP e ensine `validarBackup` a converter as versões antigas.
 */
export const VERSAO_BACKUP = 1
export const APP_BACKUP = 'bullet-journal'

export interface Backup {
  app: typeof APP_BACKUP
  versao: number
  exportadoEm: string
  dados: {
    itens: Item[]
    habitos: Habito[]
    registros: RegistroHabito[]
    reflexoes: Reflexao[]
  }
}

export interface ResumoBackup {
  exportadoEm: string
  itens: number
  habitos: number
  registros: number
  /** Dias diferentes com algum conteúdo (itens, hábitos ou reflexão). */
  dias: number
}

export class ErroBackup extends Error {}

const ehObjeto = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x)

/* ------------------------------------------------------------------ */
/* Validação campo a campo: um arquivo editado à mão ou corrompido     */
/* é recusado inteiro, antes de tocar nos dados do aparelho.           */
/* ------------------------------------------------------------------ */

type Linha = Record<string, unknown>
type Regra = (valor: unknown) => boolean

const texto: Regra = (v) => typeof v === 'string'
const textoCheio: Regra = (v) => typeof v === 'string' && v.trim().length > 0
const booleano: Regra = (v) => typeof v === 'boolean'
const numero: Regra = (v) => typeof v === 'number' && Number.isFinite(v)
const umDe =
  (...opcoes: unknown[]): Regra =>
  (v) =>
    opcoes.includes(v)
const dia: Regra = (v) => typeof v === 'string' && ehDiaValido(v)
const mes: Regra = (v) => typeof v === 'string' && ehMesValido(v)
const dataHora: Regra = (v) => typeof v === 'string' && isValid(parseISO(v))
const horario: Regra = (v) => typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v)
const opcional =
  (regra: Regra): Regra =>
  (v) =>
    v === undefined || regra(v)

const REGRAS_ITEM: Record<string, Regra> = {
  id: textoCheio,
  tipo: umDe('tarefa', 'evento', 'nota'),
  texto,
  estado: umDe('aberta', 'concluida', 'migrada', 'agendada', 'descartada'),
  prioridade: booleano,
  mes,
  dia: opcional(dia),
  horario: opcional(horario),
  recuo: umDe(0, 1),
  ordem: numero,
  origemId: opcional(texto),
  destino: opcional((v) => dia(v) || mes(v)),
  criadoEm: texto,
  atualizadoEm: texto,
}

const REGRAS_HABITO: Record<string, Regra> = {
  id: textoCheio,
  nome: textoCheio,
  tipo: umDe('check', 'quantidade'),
  unidade: opcional(texto),
  meta: opcional((v) => numero(v) && (v as number) > 0),
  incrementos: opcional((v) => Array.isArray(v) && v.every((n) => numero(n) && n > 0)),
  dias: (v) => Array.isArray(v) && v.length > 0 && v.every((d) => Number.isInteger(d) && d >= 0 && d <= 6),
  inicio: dia,
  ordem: numero,
  arquivado: booleano,
}

const REGRAS_REGISTRO: Record<string, Regra> = {
  id: textoCheio,
  habitoId: textoCheio,
  dia,
  feito: opcional(booleano),
  quantidade: opcional((v) => numero(v) && (v as number) >= 0),
}

const REGRAS_REFLEXAO: Record<string, Regra> = {
  dia,
  texto,
  atualizadoEm: texto,
}

/** Devolve o nome do primeiro campo inválido da linha, ou null se estiver tudo certo. */
function campoInvalido(linha: unknown, regras: Record<string, Regra>): string | null {
  if (!ehObjeto(linha)) return '(não é um registro)'
  for (const [campo, regra] of Object.entries(regras)) {
    if (!regra((linha as Linha)[campo])) return campo
  }
  return null
}

function conferirLista(lista: unknown, regras: Record<string, Regra>, nome: string) {
  if (!Array.isArray(lista)) throw new ErroBackup('O arquivo de backup está incompleto ou corrompido.')
  lista.forEach((linha, i) => {
    const campo = campoInvalido(linha, regras)
    if (campo) {
      throw new ErroBackup(`O arquivo de backup tem dados inválidos (${nome} nº ${i + 1}, campo "${campo}"). Nada foi alterado.`)
    }
  })
}

/** Confere se o conteúdo lido do arquivo é um backup válido deste app. */
export function validarBackup(conteudo: unknown): Backup {
  if (!ehObjeto(conteudo) || conteudo.app !== APP_BACKUP) {
    throw new ErroBackup('Este arquivo não é um backup do Bullet Journal.')
  }
  if (typeof conteudo.versao !== 'number' || conteudo.versao > VERSAO_BACKUP) {
    throw new ErroBackup('Este backup foi feito por uma versão mais nova do app. Atualize o app e tente de novo.')
  }
  const dados = conteudo.dados
  if (!ehObjeto(dados) || !dataHora(conteudo.exportadoEm)) {
    throw new ErroBackup('O arquivo de backup está incompleto ou corrompido.')
  }
  conferirLista(dados.itens, REGRAS_ITEM, 'item')
  conferirLista(dados.habitos, REGRAS_HABITO, 'hábito')
  conferirLista(dados.registros, REGRAS_REGISTRO, 'marcação de hábito')
  conferirLista(dados.reflexoes, REGRAS_REFLEXAO, 'reflexão')

  const habitos = dados.habitos as Linha[]
  const semMeta = habitos.findIndex((h) => h.tipo === 'quantidade' && !numero(h.meta))
  if (semMeta >= 0) {
    throw new ErroBackup(`O arquivo de backup tem dados inválidos (hábito nº ${semMeta + 1}, campo "meta"). Nada foi alterado.`)
  }
  return conteudo as unknown as Backup
}

/** Lê o texto do arquivo e valida. */
export function lerTextoDoBackup(texto: string): Backup {
  let conteudo: unknown
  try {
    conteudo = JSON.parse(texto)
  } catch {
    throw new ErroBackup('Não foi possível ler o arquivo. Ele precisa ser o .json exportado pelo app.')
  }
  return validarBackup(conteudo)
}

export function resumirBackup(backup: Backup): ResumoBackup {
  const { itens, habitos, registros, reflexoes } = backup.dados
  const dias = new Set<string>()
  for (const i of itens) if (i.dia) dias.add(i.dia)
  for (const r of registros) dias.add(r.dia)
  for (const r of reflexoes) dias.add(r.dia)
  return {
    exportadoEm: backup.exportadoEm,
    itens: itens.length,
    habitos: habitos.length,
    registros: registros.length,
    dias: dias.size,
  }
}

/** Nome do arquivo: bujo-backup-2026-11-16.json */
export const nomeDoArquivoBackup = (dia: string) => `bujo-backup-${dia}.json`
