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
 *   "o ", "O " ou "○ " → evento  ex.: "o Prova de farmaco"  (precisa do espaço;
 *                        "O" maiúsculo porque o iPhone capitaliza a 1ª letra)
 *   "• "        → tarefa
 *   "*"         → prioridade, combinável: "* o Prova", "o * Prova"
 */
export function interpretarAtalho(bruto: string, opcoes: { ignorarTipo?: boolean } = {}): Interpretado {
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

  if (opcoes.ignorarTipo) {
    // A pessoa escolheu o símbolo no botão: o começo do texto fica como foi digitado.
  } else if (/^[-–—]\s*\S/.test(texto)) {
    tipo = 'nota'
    texto = texto.replace(/^[-–—]\s*/, '')
  } else if (/^[oO○]\s+\S/.test(texto)) {
    tipo = 'evento'
    texto = texto.replace(/^[oO○]\s+/, '')
  } else if (/^•\s*\S/.test(texto)) {
    tipo = 'tarefa'
    texto = texto.replace(/^•\s*/, '')
  }

  if (!prioridade) tirarPrioridade()

  return { tipo, prioridade, texto: texto.trim() }
}
