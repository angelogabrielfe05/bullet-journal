import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './banco'
import { alternarConcluida, criarItem, itensDaLista, listaDoDia, listaDoMes } from './itens'
import {
  agendar,
  descartar,
  desfazerDecisao,
  listarParaMigrar,
  listarPendentes,
  migrarParaHoje,
  migrarParaMes,
} from './migracao'

const HOJE = '2026-11-16'
const MES = '2026-11'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

async function cenario() {
  const sabado = await criarItem({ tipo: 'tarefa', texto: 'Lavar jaleco', lista: listaDoDia('2026-11-14'), prioridade: true })
  const feita = await criarItem({ tipo: 'tarefa', texto: 'Feita', lista: listaDoDia('2026-11-15') })
  await alternarConcluida(feita.id)
  await criarItem({ tipo: 'nota', texto: 'Nota antiga', lista: listaDoDia('2026-11-14') })
  await criarItem({ tipo: 'tarefa', texto: 'De hoje', lista: listaDoDia(HOJE) })
  const outubroDia = await criarItem({ tipo: 'tarefa', texto: 'Resumo de farmaco', lista: listaDoDia('2026-10-31') })
  const outubroLista = await criarItem({ tipo: 'tarefa', texto: 'Renovar matrícula', lista: listaDoMes('2026-10') })
  return { sabado, feita, outubroDia, outubroLista }
}

describe('pendentes (migração diária)', () => {
  it('lista só tarefas abertas de dias anteriores deste mês', async () => {
    const { sabado } = await cenario()
    const pendentes = await listarPendentes(HOJE)
    expect(pendentes.map((i) => i.id)).toEqual([sabado.id])
  })

  it('migrar para hoje: original vira < e a cópia entra no fim de hoje', async () => {
    const { sabado } = await cenario()
    const copia = await migrarParaHoje(sabado.id, HOJE)

    expect(await db.itens.get(sabado.id)).toMatchObject({ estado: 'migrada', destino: HOJE })
    const deHoje = await itensDaLista(listaDoDia(HOJE))
    expect(deHoje.map((i) => i.texto)).toEqual(['De hoje', 'Lavar jaleco'])
    expect(copia).toMatchObject({ estado: 'aberta', prioridade: true, origemId: sabado.id, dia: HOJE })
    expect(await listarPendentes(HOJE)).toHaveLength(0)
  })

  it('agendar: original vira > e a cópia vai para o mês futuro', async () => {
    const { sabado } = await cenario()
    await agendar(sabado.id, '2027-01')
    expect(await db.itens.get(sabado.id)).toMatchObject({ estado: 'agendada', destino: '2027-01' })
    const janeiro = await itensDaLista(listaDoMes('2027-01'))
    expect(janeiro).toHaveLength(1)
    expect(janeiro[0]).toMatchObject({ texto: 'Lavar jaleco', estado: 'aberta', mes: '2027-01' })
  })

  it('agendar com dia: a cópia cai direto no registro daquele dia', async () => {
    const { sabado } = await cenario()
    await agendar(sabado.id, '2027-01', '2027-01-10')
    expect((await itensDaLista(listaDoDia('2027-01-10')))[0]).toMatchObject({ mes: '2027-01' })
  })

  it('descartar risca a tarefa e tira das pendentes', async () => {
    const { sabado } = await cenario()
    await descartar(sabado.id)
    expect((await db.itens.get(sabado.id))?.estado).toBe('descartada')
    expect(await listarPendentes(HOJE)).toHaveLength(0)
  })

  it('desfazer apaga a cópia e reabre o original', async () => {
    const { sabado } = await cenario()
    await migrarParaHoje(sabado.id, HOJE)
    await desfazerDecisao(sabado.id)
    expect(await db.itens.get(sabado.id)).toMatchObject({ estado: 'aberta' })
    expect((await db.itens.get(sabado.id))?.destino).toBeUndefined()
    expect((await itensDaLista(listaDoDia(HOJE))).map((i) => i.texto)).toEqual(['De hoje'])
  })

  it('não migra o que não está aberto', async () => {
    const { feita } = await cenario()
    expect(await migrarParaHoje(feita.id, HOJE)).toBeUndefined()
    expect((await db.itens.get(feita.id))?.estado).toBe('concluida')
  })
})

describe('migração mensal', () => {
  it('lista tarefas abertas de meses anteriores (dos dias e da lista do mês)', async () => {
    const { outubroDia, outubroLista } = await cenario()
    const lista = await listarParaMigrar(MES)
    expect(lista.map((i) => i.id)).toEqual([outubroLista.id, outubroDia.id])
  })

  it('migrar para este mês leva para a lista de tarefas do mês', async () => {
    const { outubroDia, outubroLista } = await cenario()
    await migrarParaMes(outubroDia.id, MES)
    await agendar(outubroLista.id, '2026-12')
    expect(await listarParaMigrar(MES)).toHaveLength(0)
    expect((await itensDaLista(listaDoMes(MES))).map((i) => i.texto)).toEqual(['Resumo de farmaco'])
    expect((await itensDaLista(listaDoMes('2026-12'))).map((i) => i.texto)).toEqual(['Renovar matrícula'])
    expect(await db.itens.get(outubroDia.id)).toMatchObject({ estado: 'migrada', destino: MES })
  })
})
