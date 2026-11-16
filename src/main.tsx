import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { iniciarDados } from './dados/iniciar'
import './estilos/base.css'
import './estilos/componentes.css'

void iniciarDados()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
