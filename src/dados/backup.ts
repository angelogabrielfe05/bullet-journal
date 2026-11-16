import { APP_BACKUP, VERSAO_BACKUP, type Backup } from '../regras/backup'
import { agoraISO, db, lerAjuste, salvarAjuste } from './banco'

/** Junta todos os dados do aparelho num objeto de backup. */
export async function exportarBackup(): Promise<Backup> {
  const [itens, habitos, registros, reflexoes] = await Promise.all([
    db.itens.toArray(),
    db.habitos.toArray(),
    db.registros.toArray(),
    db.reflexoes.toArray(),
  ])
  return {
    app: APP_BACKUP,
    versao: VERSAO_BACKUP,
    exportadoEm: agoraISO(),
    dados: { itens, habitos, registros, reflexoes },
  }
}

export const backupParaTexto = (backup: Backup) => JSON.stringify(backup, null, 2)

/** Guarda a data do último backup (para o aviso "último backup há X dias"). */
export async function registrarBackupFeito(quando = agoraISO()) {
  await salvarAjuste('ultimoBackup', quando)
}

export const lerUltimoBackup = () => lerAjuste<string>('ultimoBackup')

/**
 * Substitui TODOS os dados do aparelho pelos do backup.
 * Tudo ou nada: se algo falhar no meio, nada é alterado.
 */
export async function importarBackup(backup: Backup) {
  const { itens, habitos, registros, reflexoes } = backup.dados
  await db.transaction('rw', [db.itens, db.habitos, db.registros, db.reflexoes, db.ajustes], async () => {
    await Promise.all([db.itens.clear(), db.habitos.clear(), db.registros.clear(), db.reflexoes.clear()])
    await Promise.all([
      db.itens.bulkAdd(itens),
      db.habitos.bulkAdd(habitos),
      db.registros.bulkAdd(registros),
      db.reflexoes.bulkAdd(reflexoes),
    ])
    // Os hábitos vieram do backup: não criar os iniciais de novo.
    await salvarAjuste('semeado', true)
  })
}
