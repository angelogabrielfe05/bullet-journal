import { beforeEach, describe, expect, it } from 'vitest'
import { ErroBackup, lerTextoDoBackup, resumirBackup, validarBackup } from '../regras/backup'
import { db, lerAjuste } from './banco'
import { backupParaTexto, exportarBackup, importarBackup, lerUltimoBackup, registrarBackupFeito } from './backup'
import { alternarCheck, somarQuantidade } from './habitos'
import { criarItem, listaDoDia, listaDoMes } from './itens'
import { agendar } from './migracao'
import { salvarReflexao } from './reflexoes'
import { garantirDadosIniciais } from './sementes'

const HOJE = '2026-11-16'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

async function tudoOrdenado() {
  const porId = <T extends { id: string }>(xs: T[]) => [...xs].sort((a, b) => a.id.localeCompare(b.id))
  return {
    itens: porId(await db.itens.toArray()),
    habitos: porId(await db.habitos.toArray()),
    registros: porId(await db.registros.toArray()),
    reflexoes: await db.reflexoes.orderBy('dia').toArray(),
  }
}

describe('backup', () => {
  it('ida e volta: exportar, apagar tudo, importar e ficar igual', async () => {
    await garantirDadosIniciais(HOJE)
    const [academia] = await db.habitos.orderBy('ordem').toArray()
    await alternarCheck(academia.id, HOJE)
    await somarQuantidade('agua', HOJE, 750)
    const t = await criarItem({ tipo: 'tarefa', texto: 'Estudar ação', lista: listaDoDia('2026-11-14') })
    await criarItem({ tipo: 'evento', texto: 'Prova', lista: listaDoDia(HOJE), horario: '08:00' })
    await criarItem({ tipo: 'tarefa', texto: 'Do mês', lista: listaDoMes('2026-11') })
    await agendar(t.id, '2027-01')
    await salvarReflexao(HOJE, 'Dia produtivo ✨')

    const antes = await tudoOrdenado()
    const texto = backupParaTexto(await exportarBackup())

    await Promise.all(db.tables.map((tabela) => tabela.clear()))
    expect(await db.itens.count()).toBe(0)

    await importarBackup(lerTextoDoBackup(texto))
    expect(await tudoOrdenado()).toEqual(antes)
    // Não recria os hábitos iniciais depois de importar.
    expect(await lerAjuste('semeado')).toBe(true)
    await garantirDadosIniciais(HOJE)
    expect(await db.habitos.count()).toBe(antes.habitos.length)
  })

  it('importar substitui os dados atuais (não mistura)', async () => {
    await criarItem({ tipo: 'nota', texto: 'antiga', lista: listaDoDia(HOJE) })
    const vazio = await exportarBackup()
    await db.itens.clear()
    await criarItem({ tipo: 'nota', texto: 'nova', lista: listaDoDia(HOJE) })
    await importarBackup(vazio)
    expect((await db.itens.toArray()).map((i) => i.texto)).toEqual(['antiga'])
  })

  it('resume o conteúdo antes de importar', async () => {
    await criarItem({ tipo: 'tarefa', texto: 'a', lista: listaDoDia('2026-11-14') })
    await criarItem({ tipo: 'tarefa', texto: 'b', lista: listaDoDia('2026-11-14') })
    await criarItem({ tipo: 'tarefa', texto: 'c', lista: listaDoMes('2026-12') })
    await alternarCheck('h', '2026-11-15')
    await salvarReflexao(HOJE, 'oi')
    const resumo = resumirBackup(await exportarBackup())
    expect(resumo).toMatchObject({ itens: 3, habitos: 0, registros: 1, dias: 3 })
  })

  it('guarda a data do último backup', async () => {
    expect(await lerUltimoBackup()).toBeUndefined()
    await registrarBackupFeito('2026-11-16T10:00:00.000Z')
    expect(await lerUltimoBackup()).toBe('2026-11-16T10:00:00.000Z')
  })

  it('recusa campo a campo um arquivo editado à mão', async () => {
    await garantirDadosIniciais(HOJE)
    await criarItem({ tipo: 'tarefa', texto: 'fica', lista: listaDoDia(HOJE) })
    const texto = backupParaTexto(await exportarBackup())
    // Cada caso estraga um campo de uma cópia do backup bom.
    const estragar = (mudar: (b: any) => void) => {
      const copia = JSON.parse(texto)
      mudar(copia)
      return copia
    }
    const casos: [string, unknown][] = [
      ['dias', estragar((b) => delete b.dados.habitos[0].dias)],
      ['dias', estragar((b) => (b.dados.habitos[0].dias = [1, 9]))],
      ['tipo', estragar((b) => (b.dados.itens[0].tipo = 'lembrete'))],
      ['mes', estragar((b) => (b.dados.itens[0].mes = '2026-13'))],
      ['ordem', estragar((b) => (b.dados.itens[0].ordem = '1'))],
      ['incompleto', estragar((b) => (b.exportadoEm = 'ontem'))],
      ['meta', estragar((b) => delete b.dados.habitos.find((h: { tipo: string }) => h.tipo === 'quantidade').meta)],
      ['dia', estragar((b) => b.dados.registros.push({ id: 'x', habitoId: 'y', dia: '16/11/2026' }))],
    ]
    for (const [campo, caso] of casos) expect(() => validarBackup(caso)).toThrow(campo)
    // O backup bom continua aceito.
    expect(() => lerTextoDoBackup(texto)).not.toThrow()
  })

  it('recusa arquivos inválidos com mensagem em português', () => {
    expect(() => lerTextoDoBackup('isso não é json')).toThrow(ErroBackup)
    expect(() => validarBackup({ app: 'outro-app', versao: 1 })).toThrow('não é um backup')
    expect(() => validarBackup({ app: 'bullet-journal', versao: 99, dados: {} })).toThrow('versão mais nova')
    const exportadoEm = '2026-11-16T10:00:00.000Z'
    expect(() => validarBackup({ app: 'bullet-journal', versao: 1, exportadoEm, dados: { itens: [], habitos: [] } })).toThrow(
      'incompleto',
    )
    expect(() =>
      validarBackup({
        app: 'bullet-journal',
        versao: 1,
        exportadoEm,
        dados: { itens: [{ semId: true }], habitos: [], registros: [], reflexoes: [] },
      }),
    ).toThrow('inválidos')
  })
})
