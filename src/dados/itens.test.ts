import { beforeEach, describe, expect, it } from 'vitest'
import { db, lerAjuste } from './banco'
import { alternarCheck, definirQuantidade, listarHabitos, registrosDoMes, somarQuantidade } from './habitos'
import {
  alternarConcluida,
  apagarItem,
  criarItem,
  itensDaLista,
  listaDoDia,
  listaDoMes,
  moverPara,
  reordenar,
  restaurarItem,
  trocarTipo,
} from './itens'
import { garantirDadosIniciais } from './sementes'

const HOJE = '2026-11-16'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('itens', () => {
  it('cria no fim da lista do dia, com o mês preenchido', async () => {
    const a = await criarItem({ tipo: 'tarefa', texto: '  Estudar cardio ', lista: listaDoDia(HOJE) })
    const b = await criarItem({ tipo: 'nota', texto: 'cap. 3', lista: listaDoDia(HOJE), recuo: 1 })
    expect(a).toMatchObject({ texto: 'Estudar cardio', mes: '2026-11', dia: HOJE, ordem: 0, estado: 'aberta' })
    expect(b).toMatchObject({ ordem: 1, recuo: 1 })
  })

  it('horário só vale para eventos', async () => {
    const evento = await criarItem({ tipo: 'evento', texto: 'Prova', lista: listaDoDia(HOJE), horario: '08:00' })
    const tarefa = await criarItem({ tipo: 'tarefa', texto: 'x', lista: listaDoDia(HOJE), horario: '09:00' })
    expect(evento.horario).toBe('08:00')
    expect(tarefa.horario).toBeUndefined()
    await trocarTipo(evento.id, 'nota')
    expect((await db.itens.get(evento.id))?.horario).toBeUndefined()
  })

  it('tocar no símbolo conclui e desfaz; notas não mudam', async () => {
    const t = await criarItem({ tipo: 'tarefa', texto: 't', lista: listaDoDia(HOJE) })
    const n = await criarItem({ tipo: 'nota', texto: 'n', lista: listaDoDia(HOJE) })
    await alternarConcluida(t.id)
    expect((await db.itens.get(t.id))?.estado).toBe('concluida')
    await alternarConcluida(t.id)
    expect((await db.itens.get(t.id))?.estado).toBe('aberta')
    await alternarConcluida(n.id)
    expect((await db.itens.get(n.id))?.estado).toBe('aberta')
  })

  it('trocar o símbolo reabre o item', async () => {
    const t = await criarItem({ tipo: 'tarefa', texto: 't', lista: listaDoDia(HOJE) })
    await alternarConcluida(t.id)
    await trocarTipo(t.id, 'nota')
    expect(await db.itens.get(t.id)).toMatchObject({ tipo: 'nota', estado: 'aberta' })
  })

  it('trocar o símbolo não reabre tarefa já migrada', async () => {
    const t = await criarItem({ tipo: 'tarefa', texto: 't', lista: listaDoDia('2026-11-14') })
    await db.itens.update(t.id, { estado: 'migrada', destino: HOJE })
    await trocarTipo(t.id, 'nota')
    await trocarTipo(t.id, 'tarefa')
    expect((await db.itens.get(t.id))?.estado).toBe('migrada')
  })

  it('apagar o primeiro item tira o recuo do subitem que ficou no topo', async () => {
    const pai = await criarItem({ tipo: 'tarefa', texto: 'pai', lista: listaDoDia(HOJE) })
    const filho = await criarItem({ tipo: 'nota', texto: 'filho', lista: listaDoDia(HOJE), recuo: 1 })
    await apagarItem(pai.id)
    expect((await db.itens.get(filho.id))?.recuo).toBe(0)
  })

  it('reordena e mantém listas de dia e de mês separadas', async () => {
    const a = await criarItem({ tipo: 'tarefa', texto: 'a', lista: listaDoDia(HOJE) })
    const b = await criarItem({ tipo: 'tarefa', texto: 'b', lista: listaDoDia(HOJE) })
    const c = await criarItem({ tipo: 'tarefa', texto: 'c', lista: listaDoDia(HOJE) })
    await criarItem({ tipo: 'tarefa', texto: 'do mês', lista: listaDoMes('2026-11') })
    await reordenar([c.id, a.id, b.id])
    expect((await itensDaLista(listaDoDia(HOJE))).map((i) => i.texto)).toEqual(['c', 'a', 'b'])
    expect((await itensDaLista(listaDoMes('2026-11'))).map((i) => i.texto)).toEqual(['do mês'])
  })

  it('move uma tarefa do mês para um dia', async () => {
    const t = await criarItem({ tipo: 'tarefa', texto: 'renovar matrícula', lista: listaDoMes('2026-11') })
    await moverPara(t.id, listaDoDia('2026-11-20'))
    expect(await itensDaLista(listaDoMes('2026-11'))).toHaveLength(0)
    expect((await itensDaLista(listaDoDia('2026-11-20')))[0]).toMatchObject({ id: t.id, mes: '2026-11' })
  })

  it('apagar e desfazer devolve o item igual', async () => {
    const t = await criarItem({ tipo: 'tarefa', texto: 't', lista: listaDoDia(HOJE) })
    const apagado = await apagarItem(t.id)
    expect(await db.itens.count()).toBe(0)
    await restaurarItem(apagado!)
    expect(await db.itens.get(t.id)).toEqual(t)
  })
})

describe('hábitos', () => {
  it('cria os 5 hábitos iniciais uma única vez', async () => {
    await garantirDadosIniciais(HOJE)
    const primeiroUso = await lerAjuste<string>('primeiroUso')
    expect(primeiroUso).toBeTruthy()
    await garantirDadosIniciais(HOJE)
    expect(await lerAjuste('primeiroUso')).toBe(primeiroUso) // não muda na 2ª abertura
    const habitos = await listarHabitos()
    expect(habitos.map((h) => h.nome)).toEqual(['Academia', 'Leitura', 'Estudo', 'Água', 'Corrida'])
    expect(habitos.find((h) => h.nome === 'Água')).toMatchObject({ meta: 2000, unidade: 'ml' })
    expect(habitos.find((h) => h.nome === 'Corrida')).toMatchObject({ meta: 5, dias: [2, 4, 6] })

    // Se a pessoa apagar todos, eles não voltam sozinhos.
    await db.habitos.clear()
    await garantirDadosIniciais(HOJE)
    expect(await db.habitos.count()).toBe(0)
  })

  it('marca check, soma quantidade e agrupa por mês', async () => {
    await alternarCheck('academia', HOJE)
    await somarQuantidade('agua', HOJE, 250)
    await somarQuantidade('agua', HOJE, 500)
    await somarQuantidade('corrida', HOJE, 0.1)
    await somarQuantidade('corrida', HOJE, 0.2)
    await somarQuantidade('agua', '2026-10-31', 500)

    const regs = await registrosDoMes('2026-11')
    expect(regs.get('academia')?.get(HOJE)?.feito).toBe(true)
    expect(regs.get('agua')?.get(HOJE)?.quantidade).toBe(750)
    expect(regs.get('corrida')?.get(HOJE)?.quantidade).toBe(0.3)
    expect(regs.get('agua')?.has('2026-10-31')).toBe(false)

    await alternarCheck('academia', HOJE)
    await somarQuantidade('agua', HOJE, -1000)
    const depois = await registrosDoMes('2026-11')
    expect(depois.get('academia')?.get(HOJE)?.feito).toBe(false)
    expect(depois.get('agua')?.get(HOJE)?.quantidade).toBe(0)

    await definirQuantidade('agua', HOJE, 1800)
    expect((await registrosDoMes('2026-11')).get('agua')?.get(HOJE)?.quantidade).toBe(1800)
  })
})
