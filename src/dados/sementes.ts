import { hoje, type Dia } from '../regras/datas'
import { agoraISO, db, lerAjuste, novoId, salvarAjuste } from './banco'
import type { Habito } from './tipos'

const TODOS_OS_DIAS = [0, 1, 2, 3, 4, 5, 6]
const SEG_A_SEX = [1, 2, 3, 4, 5]
const TER_QUI_SAB = [2, 4, 6]

/**
 * Cria os 5 hábitos do PRD na primeira abertura do app.
 * Roda uma vez só: se você apagar os hábitos depois, eles não voltam.
 */
export async function garantirDadosIniciais(inicio: Dia = hoje()): Promise<void> {
  await db.transaction('rw', db.habitos, db.ajustes, async () => {
    if (!(await lerAjuste('primeiroUso'))) await salvarAjuste('primeiroUso', agoraISO())
    if (await lerAjuste<boolean>('semeado')) return

    const base = { inicio, arquivado: false }
    const habitos: Habito[] = [
      { ...base, id: novoId(), ordem: 0, nome: 'Academia', tipo: 'check', dias: SEG_A_SEX },
      { ...base, id: novoId(), ordem: 1, nome: 'Leitura', tipo: 'check', dias: TODOS_OS_DIAS },
      { ...base, id: novoId(), ordem: 2, nome: 'Estudo', tipo: 'check', dias: TODOS_OS_DIAS },
      {
        ...base,
        id: novoId(),
        ordem: 3,
        nome: 'Água',
        tipo: 'quantidade',
        unidade: 'ml',
        meta: 2000,
        incrementos: [250, 500],
        dias: TODOS_OS_DIAS,
      },
      {
        ...base,
        id: novoId(),
        ordem: 4,
        nome: 'Corrida',
        tipo: 'quantidade',
        unidade: 'km',
        meta: 5,
        incrementos: [],
        dias: TER_QUI_SAB,
      },
    ]
    await db.habitos.bulkAdd(habitos)
    await salvarAjuste('semeado', true)
  })
}
