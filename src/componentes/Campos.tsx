import { useId, useLayoutEffect, useRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface PropsCampo extends InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string
  /** Esconde o rótulo na tela (continua para leitores de tela). */
  rotuloOculto?: boolean
}

export function CampoTexto({ rotulo, rotuloOculto, id, className, ...props }: PropsCampo) {
  const idAuto = useId()
  const idCampo = id ?? idAuto
  return (
    <div className={['campo', className].filter(Boolean).join(' ')}>
      {rotulo && (
        <label htmlFor={idCampo} className={rotuloOculto ? 'visualmente-oculto' : 'campo__rotulo'}>
          {rotulo}
        </label>
      )}
      <input id={idCampo} className="campo__entrada" {...props} />
    </div>
  )
}

interface PropsArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo?: string
  rotuloOculto?: boolean
}

/** Área de texto que cresce sozinha conforme você escreve. */
export function AreaTexto({ rotulo, rotuloOculto, id, className, value, ...props }: PropsArea) {
  const idAuto = useId()
  const idCampo = id ?? idAuto
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <div className={['campo', className].filter(Boolean).join(' ')}>
      {rotulo && (
        <label htmlFor={idCampo} className={rotuloOculto ? 'visualmente-oculto' : 'campo__rotulo'}>
          {rotulo}
        </label>
      )}
      <textarea ref={ref} id={idCampo} className="campo__entrada campo__entrada--area" value={value} rows={3} {...props} />
    </div>
  )
}
