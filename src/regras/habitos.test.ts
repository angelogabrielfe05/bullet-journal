import { describe, expect, it } from 'vitest'
import type { Habito, RegistroHabito } from '../dados/tipos'
import { cumprido, fracaoDoDia, progressoDoMes, sequencia, valeNoDia } from './habitos'

// 16/11/2026 é uma segunda-feira.
const HOJE = '2026-11-16'

const academia: Habito = {
  id: 'academia',
  nome: 'Academia',
  tipo: 'check',
  dias: [1, 2, 3, 4, 5], // seg a sex
  inicio: '2026-11-01',
  ordem: 0,
  arquivado: false,
}

const agua: Habito = {
  id: 'agua',
  nome: 'Água',
  tipo: 'quantidade',
  unidade: 'ml',
  meta: 2000,
  incrementos: [250, 500],
  dias: [0, 1, 2, 3, 4, 5, 6],
  inicio: '2026-11-01',
  ordem: 1,
  arquivado: false,
}

const corrida: Habito = {
  ...agua,
  id: 'corrida',
  nome: 'Corrida',
  unidade: 'km',
  meta: 5,
  dias: [2, 4, 6], // ter, qui, sáb
}

/** Monta os registros de check feitos nos dias informados. */
function checks(habito: Habito, dias: string[]) {
  return new Map<string, RegistroHabito>(
    dias.map((dia) => [dia, { id: `${habito.id}|${dia}`, habitoId: habito.id, dia, feito: true }]),
  )
}

function quantidades(habito: Habito, valores: Record<string, number>) {
  return new Map<string, RegistroHabito>(
    Object.entries(valores).map(([dia, quantidade]) => [
      dia,
      { id: `${habito.id}|${dia}`, habitoId: habito.id, dia, quantidade },
    ]),
  )
}

describe('valeNoDia', () => {
  it('respeita a escala da semana', () => {
    expect(valeNoDia(academia, '2026-11-16')).toBe(true) // segunda
    expect(valeNoDia(academia, '2026-11-14')).toBe(false) // sábado
    expect(valeNoDia(corrida, '2026-11-14')).toBe(true) // sábado
  })

  it('não vale antes do início do hábito', () => {
    expect(valeNoDia(academia, '2026-10-30')).toBe(false)
  })
})

describe('cumprido e fração', () => {
  it('check: marcado ou não', () => {
    expect(cumprido(academia, undefined)).toBe(false)
    expect(cumprido(academia, { id: 'x', habitoId: 'academia', dia: HOJE, feito: true })).toBe(true)
  })

  it('quantidade: só cumpre ao atingir a meta, com preenchimento parcial', () => {
    const r = (quantidade: number) => ({ id: 'x', habitoId: 'agua', dia: HOJE, quantidade })
    expect(cumprido(agua, r(1500))).toBe(false)
    expect(fracaoDoDia(agua, r(1500))).toBe(0.75)
    expect(cumprido(agua, r(2000))).toBe(true)
    expect(fracaoDoDia(agua, r(2600))).toBe(1)
  })
})

describe('sequência (streak)', () => {
  const semanaPassadaInteira = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13']

  it('fim de semana fora da escala não quebra; hoje ainda não feito não quebra', () => {
    expect(sequencia(academia, checks(academia, semanaPassadaInteira), HOJE)).toBe(5)
  })

  it('hoje feito soma na sequência', () => {
    expect(sequencia(academia, checks(academia, [...semanaPassadaInteira, HOJE]), HOJE)).toBe(6)
  })

  it('um dia previsto sem check quebra a sequência', () => {
    const semQuarta = semanaPassadaInteira.filter((d) => d !== '2026-11-11')
    expect(sequencia(academia, checks(academia, semQuarta), HOJE)).toBe(2)
  })

  it('para no início do hábito', () => {
    const tudo = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', ...semanaPassadaInteira]
    expect(sequencia(academia, checks(academia, tudo), HOJE)).toBe(10)
  })

  it('corrida (ter/qui/sáb) com quantidade: só conta quem bateu a meta', () => {
    const regs = quantidades(corrida, {
      '2026-11-10': 5, // ter
      '2026-11-12': 6, // qui
      '2026-11-14': 5, // sáb
      '2026-11-07': 3, // sáb anterior: abaixo da meta, quebra aqui
    })
    expect(sequencia(corrida, regs, HOJE)).toBe(3)
  })
})

describe('progresso do mês', () => {
  it('conta só dias previstos até hoje; hoje só entra se cumprido', () => {
    // Dias úteis de 02 a 13/11 = 10 dias previstos (hoje, 16, ainda não feito).
    const p = progressoDoMes(academia, checks(academia, ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13']), '2026-11', HOJE)
    expect(p).toEqual({ cumpridos: 5, previstos: 10, percentual: 50 })
  })

  it('hoje cumprido entra na conta', () => {
    const p = progressoDoMes(academia, checks(academia, [HOJE]), '2026-11', HOJE)
    expect(p).toEqual({ cumpridos: 1, previstos: 11, percentual: 9 })
  })

  it('mês futuro não tem dias previstos', () => {
    expect(progressoDoMes(academia, new Map(), '2026-12', HOJE)).toEqual({
      cumpridos: 0,
      previstos: 0,
      percentual: 0,
    })
  })
})
