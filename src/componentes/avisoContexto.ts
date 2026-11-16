import { createContext, useContext } from 'react'

export interface DadosAviso {
  texto: string
  /** Botão opcional, ex.: { rotulo: 'Desfazer', aoClicar: () => restaurar() } */
  acao?: { rotulo: string; aoClicar: () => void }
  /** Tempo na tela em ms (padrão 5 s). */
  duracao?: number
}

export type MostrarAviso = (aviso: DadosAviso) => void

export const ContextoAviso = createContext<MostrarAviso>(() => {})

/** Mostra um aviso rápido no rodapé, ex.: "Item apagado · Desfazer". */
export const useAviso = () => useContext(ContextoAviso)
