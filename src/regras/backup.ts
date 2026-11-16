import type { Habito, Item, Reflexao, RegistroHabito } from '../dados/tipos'

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

const ehLista = (x: unknown, campoObrigatorio: string): x is Record<string, unknown>[] =>
  Array.isArray(x) && x.every((linha) => ehObjeto(linha) && typeof linha[campoObrigatorio] === 'string')

/** Confere se o conteúdo lido do arquivo é um backup válido deste app. */
export function validarBackup(conteudo: unknown): Backup {
  if (!ehObjeto(conteudo) || conteudo.app !== APP_BACKUP) {
    throw new ErroBackup('Este arquivo não é um backup do Bullet Journal.')
  }
  if (typeof conteudo.versao !== 'number' || conteudo.versao > VERSAO_BACKUP) {
    throw new ErroBackup('Este backup foi feito por uma versão mais nova do app. Atualize o app e tente de novo.')
  }
  const dados = conteudo.dados
  if (
    !ehObjeto(dados) ||
    !ehLista(dados.itens, 'id') ||
    !ehLista(dados.habitos, 'id') ||
    !ehLista(dados.registros, 'id') ||
    !ehLista(dados.reflexoes, 'dia')
  ) {
    throw new ErroBackup('O arquivo de backup está incompleto ou corrompido.')
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
