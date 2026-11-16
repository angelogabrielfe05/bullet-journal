import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ContextoAviso, type DadosAviso, type MostrarAviso } from './avisoContexto'

type Mostrar = MostrarAviso

/** Envolve o app e desenha o aviso rápido; use `useAviso()` para mostrar. */
export function ProvedorAviso({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<(DadosAviso & { chave: number }) | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const mostrar = useCallback<Mostrar>((novo) => {
    setAviso({ ...novo, chave: Date.now() })
  }, [])

  useEffect(() => {
    window.clearTimeout(timer.current)
    if (aviso) timer.current = window.setTimeout(() => setAviso(null), aviso.duracao ?? 5000)
    return () => window.clearTimeout(timer.current)
  }, [aviso])

  return (
    <ContextoAviso.Provider value={mostrar}>
      {children}
      <div className="aviso-area" role="status" aria-live="polite">
        {aviso && (
          <div key={aviso.chave} className="aviso">
            <span className="aviso__texto">{aviso.texto}</span>
            {aviso.acao && (
              <button
                type="button"
                className="aviso__acao"
                onClick={() => {
                  aviso.acao!.aoClicar()
                  setAviso(null)
                }}
              >
                {aviso.acao.rotulo}
              </button>
            )}
          </div>
        )}
      </div>
    </ContextoAviso.Provider>
  )
}
