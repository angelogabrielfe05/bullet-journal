import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { lerAjuste } from '../dados/banco'
import { lerUltimoBackup } from '../dados/backup'
import { salvarArquivoBackup } from '../dados/arquivoBackup'
import { listarParaMigrar } from '../dados/migracao'
import { diasDesde, mesDoDia, nomeDoMes, type Dia } from '../regras/datas'
import { irPara } from '../navegacao'
import { useAviso } from './avisoContexto'
import { Botao } from './Botao'

/** Avisos do topo do Hoje: hora de migrar o mês e lembrete de backup. */
export function RecadosHoje({ hoje }: { hoje: Dia }) {
  const paraMigrar = useLiveQuery(() => listarParaMigrar(mesDoDia(hoje)), [hoje])
  const ultimoBackup = useLiveQuery(() => lerUltimoBackup(), [])
  const primeiroUso = useLiveQuery(() => lerAjuste<string>('primeiroUso'), [])
  const [salvando, setSalvando] = useState(false)
  const avisar = useAviso()

  // Lembrete de backup: 7 dias sem backup (ou desde o primeiro uso, se nunca fez).
  const referencia = ultimoBackup ?? primeiroUso
  const diasSemBackup = referencia ? diasDesde(referencia) : 0
  const mostrarBackup = diasSemBackup >= 7

  // Migração: nome do mês mais recente com tarefas abertas.
  const meses = [...new Set(paraMigrar?.map((i) => i.mes) ?? [])].sort()
  const mesParaMigrar = meses.length === 1 ? nomeDoMes(meses[0]) : null

  if (!paraMigrar?.length && !mostrarBackup) return null

  return (
    <div className="recados">
      {!!paraMigrar?.length && (
        <div className="recado">
          <p className="recado__texto">
            <strong>Hora de migrar{mesParaMigrar ? ` ${mesParaMigrar}` : ''}:</strong> {paraMigrar.length}{' '}
            {paraMigrar.length === 1 ? 'tarefa aberta' : 'tarefas abertas'}
            {mesParaMigrar ? '' : ' de meses anteriores'}.
          </p>
          <Botao variante="secundario" className="botao--pequeno" onClick={() => irPara('migracao')}>
            Migrar
          </Botao>
        </div>
      )}
      {mostrarBackup && (
        <div className="recado">
          <p className="recado__texto">
            {ultimoBackup ? `Último backup há ${diasSemBackup} dias.` : 'Você ainda não fez nenhum backup.'}
          </p>
          <Botao
            variante="secundario"
            className="botao--pequeno"
            disabled={salvando}
            onClick={async () => {
              setSalvando(true)
              try {
                const resultado = await salvarArquivoBackup()
                if (resultado === 'salvo') avisar({ texto: 'Backup salvo ✓' })
              } catch {
                avisar({ texto: 'Não foi possível gerar o backup. Tente pelos Ajustes.' })
              } finally {
                setSalvando(false)
              }
            }}
          >
            Fazer backup
          </Botao>
        </div>
      )}
    </div>
  )
}
