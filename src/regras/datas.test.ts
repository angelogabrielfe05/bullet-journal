import { describe, expect, it } from 'vitest'
import {
  diaDaSemana,
  diasDoMes,
  formatarDiaExtenso,
  formatarMes,
  mesDoDia,
  proximosMeses,
  somarDias,
  somarMeses,
} from './datas'

describe('datas', () => {
  it('lista os dias do mês, inclusive em ano bissexto', () => {
    expect(diasDoMes('2026-11')).toHaveLength(30)
    expect(diasDoMes('2026-02')).toHaveLength(28)
    expect(diasDoMes('2028-02')).toHaveLength(29)
    expect(diasDoMes('2026-11')[0]).toBe('2026-11-01')
  })

  it('soma dias e meses atravessando a virada de ano', () => {
    expect(somarDias('2026-12-31', 1)).toBe('2027-01-01')
    expect(somarDias('2026-03-01', -1)).toBe('2026-02-28')
    expect(somarMeses('2026-11', 2)).toBe('2027-01')
    expect(proximosMeses('2026-11', 3)).toEqual(['2026-12', '2027-01', '2027-02'])
  })

  it('sabe o dia da semana (0 = domingo)', () => {
    expect(diaDaSemana('2026-11-15')).toBe(0)
    expect(diaDaSemana('2026-11-16')).toBe(1)
    expect(diaDaSemana('2026-11-14')).toBe(6)
  })

  it('formata em português', () => {
    expect(formatarDiaExtenso('2026-11-16')).toBe('segunda, 16 de novembro')
    expect(formatarDiaExtenso('2026-11-14')).toBe('sábado, 14 de novembro')
    expect(formatarMes('2026-11')).toBe('novembro de 2026')
    expect(mesDoDia('2026-11-16')).toBe('2026-11')
  })
})
