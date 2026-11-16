import type { ReactNode, SVGProps } from 'react'

/** Ícones desenhados à mão em SVG (traço de caneta, 24×24). */
function Icone({ children, tamanho = 24, ...props }: SVGProps<SVGSVGElement> & { tamanho?: number; children: ReactNode }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

type P = SVGProps<SVGSVGElement> & { tamanho?: number }

/** Página com bullets */
export const IconeHoje = (p: P) => (
  <Icone {...p}>
    <rect x="4.5" y="3" width="15" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
    <path d="M11 8.5h5" />
    <circle cx="8.5" cy="12.5" r="1" fill="currentColor" />
    <path d="M11 12.5h5" />
    <path d="M8 16.5h1M11 16.5h3" />
  </Icone>
)

/** Grade com check */
export const IconeHabitos = (p: P) => (
  <Icone {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17" strokeWidth={1.2} />
    <path d="m10.3 12.2 1.6 1.6 2.8-3.2" strokeWidth={2} />
  </Icone>
)

/** Calendário */
export const IconeMes = (p: P) => (
  <Icone {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <circle cx="8" cy="13.5" r="0.9" fill="currentColor" />
    <circle cx="12" cy="13.5" r="0.9" fill="currentColor" />
    <circle cx="16" cy="13.5" r="0.9" fill="currentColor" />
    <circle cx="8" cy="17" r="0.9" fill="currentColor" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" />
  </Icone>
)

/** Seta ">" de agendado */
export const IconeFuturo = (p: P) => (
  <Icone {...p}>
    <path d="m6 5 7 7-7 7" />
    <path d="m12 5 7 7-7 7" opacity={0.45} />
  </Icone>
)

export const IconeAjustes = (p: P) => (
  <Icone {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Icone>
)

export const IconeMais = (p: P) => (
  <Icone {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icone>
)

export const IconeFechar = (p: P) => (
  <Icone {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icone>
)

export const IconeSetaEsquerda = (p: P) => (
  <Icone {...p}>
    <path d="m15 5-7 7 7 7" />
  </Icone>
)

export const IconeSetaDireita = (p: P) => (
  <Icone {...p}>
    <path d="m9 5 7 7-7 7" />
  </Icone>
)

/** Alça de arrastar (seis pontinhos) */
export const IconeArrastar = (p: P) => (
  <Icone {...p} stroke="none" fill="currentColor">
    <circle cx="9" cy="6" r="1.5" />
    <circle cx="15" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="15" cy="18" r="1.5" />
  </Icone>
)

export const IconeMenu = (p: P) => (
  <Icone {...p} stroke="none" fill="currentColor">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </Icone>
)
