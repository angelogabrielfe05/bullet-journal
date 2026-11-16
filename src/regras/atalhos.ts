import type { TipoItem } from '../dados/tipos'

export interface Interpretado {
  /** Tipo indicado pelo atalho (ou undefined se não houver atalho). */
  tipo?: TipoItem
  prioridade: boolean
  /** Texto sem os atalhos. */
  texto: string
}

/**
 * Atalhos de digitação no começo do texto (rapid logging):
 *   "-" ou "–"  → nota       ex.: "- dormi mal"
 *   "o " ou "○ " → evento    ex.: "o Prova de farmaco"  (precisa do espaço)
 *   "• "        → tarefa
 *   "*"         → prioridade, combinável: "* o Prova", "o * Prova"
 */
export function interpretarAtalho(bruto: string): Interpretado {
  let texto = bruto.trimStart()
  let prioridade = false
  let tipo: TipoItem | undefined

  const tirarPrioridade = () => {
    if (/^\*\s*\S/.test(texto)) {
      prioridade = true
      texto = texto.replace(/^\*\s*/, '')
    }
  }

  tirarPrioridade()

  if (/^[-–—]\s*\S/.test(texto)) {
    tipo = 'nota'
    texto = texto.replace(/^[-–—]\s*/, '')
  } else if (/^[o○]\s+\S/.test(texto)) {
    tipo = 'evento'
    texto = texto.replace(/^[o○]\s+/, '')
  } else if (/^•\s*\S/.test(texto)) {
    tipo = 'tarefa'
    texto = texto.replace(/^•\s*/, '')
  }

  if (!prioridade) tirarPrioridade()

  return { tipo, prioridade, texto: texto.trim() }
}
