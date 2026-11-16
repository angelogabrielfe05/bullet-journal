/** Número em pt-BR para exibir: 2000 → "2.000", 0.5 → "0,5". */
export const formatarNumero = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

/** Número para pôr num campo editável (sem ponto de milhar): 2000 → "2000", 5.2 → "5,2". */
export const numeroParaCampo = (n: number) => String(n).replace('.', ',')

/**
 * Lê um número digitado no jeito brasileiro ou no internacional:
 * "5,2" → 5.2 · "1.5" → 1.5 · "2.000" → 2000 · "1.250,5" → 1250.5
 * Devolve null se não for número.
 */
export function lerNumero(texto: string): number | null {
  let t = texto.trim().replace(/\s/g, '')
  if (!t) return null
  if (t.includes(',')) {
    t = t.replace(/\./g, '').replace(',', '.') // vírgula decimal; pontos são milhar
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) {
    t = t.replace(/\./g, '') // "2.000" é dois mil
  }
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}
