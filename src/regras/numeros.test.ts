import { describe, expect, it } from 'vitest'
import { formatarNumero, lerNumero, numeroParaCampo } from './numeros'

describe('números em pt-BR', () => {
  it('formata para exibir', () => {
    expect(formatarNumero(2000)).toBe('2.000')
    expect(formatarNumero(5.25)).toBe('5,25')
  })

  it('lê vírgula decimal, ponto de milhar e ponto decimal', () => {
    expect(lerNumero('5,2')).toBe(5.2)
    expect(lerNumero('1.5')).toBe(1.5)
    expect(lerNumero('2.000')).toBe(2000)
    expect(lerNumero('1.250,5')).toBe(1250.5)
    expect(lerNumero(' 300 ')).toBe(300)
    expect(lerNumero('-250')).toBe(-250)
  })

  it('recusa o que não é número', () => {
    expect(lerNumero('')).toBeNull()
    expect(lerNumero('abc')).toBeNull()
    expect(lerNumero('5 km')).toBeNull()
  })

  it('ida e volta pelo campo editável não muda o valor', () => {
    for (const n of [2000, 5, 5.2, 0.25, 1250.5]) expect(lerNumero(numeroParaCampo(n))).toBe(n)
  })
})
