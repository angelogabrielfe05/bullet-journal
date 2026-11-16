import { describe, expect, it } from 'vitest'
import { interpretarAtalho } from './atalhos'

describe('atalhos de digitação', () => {
  it('sem atalho: só limpa espaços', () => {
    expect(interpretarAtalho('  Estudar cardio ')).toEqual({ tipo: undefined, prioridade: false, texto: 'Estudar cardio' })
  })

  it('"-" vira nota, com ou sem espaço', () => {
    expect(interpretarAtalho('- dormi mal')).toMatchObject({ tipo: 'nota', texto: 'dormi mal' })
    expect(interpretarAtalho('-dormi mal')).toMatchObject({ tipo: 'nota', texto: 'dormi mal' })
    expect(interpretarAtalho('– travessão')).toMatchObject({ tipo: 'nota', texto: 'travessão' })
  })

  it('"o " vira evento, mas só com espaço depois', () => {
    expect(interpretarAtalho('o Prova de farmaco')).toMatchObject({ tipo: 'evento', texto: 'Prova de farmaco' })
    expect(interpretarAtalho('○ Plantão')).toMatchObject({ tipo: 'evento', texto: 'Plantão' })
    expect(interpretarAtalho('ouvir podcast')).toMatchObject({ tipo: undefined, texto: 'ouvir podcast' })
    expect(interpretarAtalho('O médico ligou')).toMatchObject({ tipo: undefined })
  })

  it('"*" marca prioridade e combina com os outros', () => {
    expect(interpretarAtalho('* Entregar relatório')).toEqual({ tipo: undefined, prioridade: true, texto: 'Entregar relatório' })
    expect(interpretarAtalho('*Entregar')).toMatchObject({ prioridade: true, texto: 'Entregar' })
    expect(interpretarAtalho('* o Prova')).toEqual({ tipo: 'evento', prioridade: true, texto: 'Prova' })
    expect(interpretarAtalho('o * Prova')).toEqual({ tipo: 'evento', prioridade: true, texto: 'Prova' })
  })

  it('símbolo sozinho, sem texto, não vira atalho', () => {
    expect(interpretarAtalho('-')).toMatchObject({ tipo: undefined, texto: '-' })
    expect(interpretarAtalho('*')).toMatchObject({ prioridade: false, texto: '*' })
  })
})
