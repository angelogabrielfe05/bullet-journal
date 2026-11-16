import { useEffect, useState } from 'react'

/**
 * Navegação simples baseada no "#" do endereço (ex.: #/hoje, #/mes).
 * Funciona offline e no GitHub Pages sem configuração extra.
 */

export type Aba = 'hoje' | 'habitos' | 'mes' | 'futuro'
/** "amostra" é a página de amostra do visual, só no modo de desenvolvimento. */
export type Tela = Aba | 'ajustes' | 'migracao' | 'amostra'

/** Toda tela recebe o parâmetro do endereço, ex.: a data em #/hoje/2026-11-14 */
export interface PropsTela {
  parametro?: string
}

export interface Rota {
  tela: Tela
  /** Parâmetro opcional, ex.: a data do dia em #/hoje/2026-11-16 */
  parametro?: string
}

const TELAS: Tela[] = [
  'hoje',
  'habitos',
  'mes',
  'futuro',
  'ajustes',
  'migracao',
  ...(import.meta.env.DEV ? (['amostra'] as const) : []),
]

export function lerRota(hash: string): Rota {
  const [tela, parametro] = hash.replace(/^#\/?/, '').split('/')
  if ((TELAS as string[]).includes(tela)) {
    return { tela: tela as Tela, parametro: parametro || undefined }
  }
  return { tela: 'hoje' }
}

export function irPara(tela: Tela, parametro?: string) {
  window.location.hash = parametro ? `/${tela}/${parametro}` : `/${tela}`
}

export function useRota(): Rota {
  const [rota, setRota] = useState(() => lerRota(window.location.hash))
  useEffect(() => {
    const aoMudar = () => {
      setRota(lerRota(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return rota
}
