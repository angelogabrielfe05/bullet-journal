/** Número em pt-BR: 2000 → "2.000", 0.5 → "0,5". */
export const formatarNumero = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

/** Lê "1,5" ou "1.5" como 1,5. Devolve null se não for número. */
export function lerNumero(texto: string): number | null {
  const n = Number(texto.trim().replace(',', '.'))
  return texto.trim() && Number.isFinite(n) ? n : null
}
