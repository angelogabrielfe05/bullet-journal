import { lazy, Suspense, type ComponentType } from 'react'
import { ProvedorAviso } from './componentes/Aviso'
import { BarraAbas } from './componentes/BarraAbas'
import { useRota, type PropsTela, type Tela } from './navegacao'
import { Ajustes } from './telas/Ajustes'
import { Futuro } from './telas/Futuro'
import { Habitos } from './telas/Habitos'
import { Hoje } from './telas/Hoje'
import { Mes } from './telas/Mes'
import { Migracao } from './telas/Migracao'

// A amostra do visual só existe no modo de desenvolvimento (não vai para o app publicado).
const Amostra = import.meta.env.DEV ? lazy(() => import('./telas/Amostra')) : Hoje

const TELAS: Record<Tela, ComponentType<PropsTela>> = {
  hoje: Hoje,
  habitos: Habitos,
  mes: Mes,
  futuro: Futuro,
  migracao: Migracao,
  ajustes: Ajustes,
  amostra: Amostra,
}

export default function App() {
  const rota = useRota()
  const TelaAtual = TELAS[rota.tela]
  return (
    <ProvedorAviso>
      <div className="app">
        <main className="app__conteudo">
          <Suspense fallback={null}>
            <TelaAtual parametro={rota.parametro} />
          </Suspense>
        </main>
        <BarraAbas telaAtual={rota.tela} />
      </div>
    </ProvedorAviso>
  )
}
