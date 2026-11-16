import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useAviso } from './avisoContexto'

const UMA_HORA = 60 * 60 * 1000

/**
 * Cuida das atualizações do app instalado:
 * - procura versão nova ao voltar para o app e a cada hora;
 * - quando houver, mostra "Nova versão · Atualizar" (não recarrega sozinho,
 *   para não interromper o que você está escrevendo).
 */
export function AvisoAtualizacao() {
  const avisar = useAviso()
  const {
    needRefresh: [temVersaoNova],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registro) {
      if (!registro) return
      const procurar = () => {
        if (navigator.onLine) void registro.update()
      }
      window.setInterval(procurar, UMA_HORA)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') procurar()
      })
    },
  })

  useEffect(() => {
    if (!temVersaoNova) return
    avisar({
      texto: 'Nova versão do app',
      acao: { rotulo: 'Atualizar', aoClicar: () => void updateServiceWorker(true) },
      duracao: 10 * 60 * 1000,
    })
  }, [temVersaoNova, avisar, updateServiceWorker])

  return null
}
