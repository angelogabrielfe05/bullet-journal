import { useEffect, useState } from 'react'
import { hoje } from '../regras/datas'

/**
 * A data de hoje, que se atualiza sozinha se o app ficar aberto
 * depois da meia-noite ou voltar do segundo plano no dia seguinte.
 */
export function useHoje() {
  const [dia, setDia] = useState(hoje)
  useEffect(() => {
    const atualizar = () => setDia(hoje())
    const timer = window.setInterval(atualizar, 60_000)
    document.addEventListener('visibilitychange', atualizar)
    window.addEventListener('focus', atualizar)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', atualizar)
      window.removeEventListener('focus', atualizar)
    }
  }, [])
  return dia
}
