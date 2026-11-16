import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './banco'
import {
  alternarCheck,
  contarDiasRegistrados,
  criarHabito,
  definirQuantidade,
  excluirHabito,
  listarHabitos,
  restaurarHabito,
} from './habitos'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

async function cenario() {
  const leitura = await criarHabito({ nome: 'Leitura', tipo: 'check', dias: [0, 1, 2, 3, 4, 5, 6], inicio: '2026-10-01' })
  const agua = await criarHabito({ nome: 'Água', tipo: 'quantidade', unidade: 'ml', meta: 2000, dias: [0, 1, 2, 3, 4, 5, 6], inicio: '2026-10-01' })
  await alternarCheck(leitura.id, '2026-10-30')
  await alternarCheck(leitura.id, '2026-11-15')
  await alternarCheck(leitura.id, '2026-11-16')
  await alternarCheck(leitura.id, '2026-11-16') // desmarcado: não conta
  await definirQuantidade(agua.id, '2026-11-16', 500)
  return { leitura, agua }
}

describe('excluir hábito', () => {
  it('conta só os dias com marcação', async () => {
    const { leitura, agua } = await cenario()
    expect(await contarDiasRegistrados(leitura.id)).toBe(2)
    expect(await contarDiasRegistrados(agua.id)).toBe(1)
  })

  it('apaga o hábito e todos os registros dele, sem mexer nos outros', async () => {
    const { leitura, agua } = await cenario()
    const excluido = await excluirHabito(leitura.id)
    expect(excluido?.habito.nome).toBe('Leitura')
    expect(excluido?.registros).toHaveLength(3)
    expect((await listarHabitos(true)).map((h) => h.nome)).toEqual(['Água'])
    expect(await db.registros.where('habitoId').equals(leitura.id).count()).toBe(0)
    expect(await db.registros.where('habitoId').equals(agua.id).count()).toBe(1)
  })

  it('desfazer devolve o hábito na mesma posição e com o histórico', async () => {
    const { leitura } = await cenario()
    const excluido = await excluirHabito(leitura.id)
    await restaurarHabito(excluido!)
    expect((await listarHabitos()).map((h) => h.nome)).toEqual(['Leitura', 'Água'])
    expect(await contarDiasRegistrados(leitura.id)).toBe(2)
  })

  it('não faz nada com um hábito que não existe', async () => {
    await cenario()
    expect(await excluirHabito('nao-existe')).toBeUndefined()
    expect(await listarHabitos()).toHaveLength(2)
  })
})
