import type { JSX } from 'react'
import { BarraAbas } from './componentes/BarraAbas'
import { useRota, type Tela } from './navegacao'
import { Ajustes } from './telas/Ajustes'
import { Futuro } from './telas/Futuro'
import { Habitos } from './telas/Habitos'
import { Hoje } from './telas/Hoje'
import { Mes } from './telas/Mes'
import { Migracao } from './telas/Migracao'

const TELAS: Record<Tela, () => JSX.Element> = {
  hoje: Hoje,
  habitos: Habitos,
  mes: Mes,
  futuro: Futuro,
  migracao: Migracao,
  ajustes: Ajustes,
}

export default function App() {
  const rota = useRota()
  const TelaAtual = TELAS[rota.tela]
  return (
    <div className="app">
      <main className="app__conteudo">
        <TelaAtual />
      </main>
      <BarraAbas telaAtual={rota.tela} />
    </div>
  )
}
