import { useLiveQuery } from 'dexie-react-hooks'
import { contarDiasRegistrados } from '../dados/habitos'
import type { Habito } from '../dados/tipos'
import { Botao } from './Botao'

interface Props {
  habito: Habito
  aoExcluir: () => void
  /** Sugere arquivar no lugar (só para hábitos ainda ativos). */
  aoArquivar?: () => void
  aoCancelar: () => void
}

/** Confirmação antes de apagar um hábito e todo o histórico dele. */
export function ConfirmarExclusao({ habito, aoExcluir, aoArquivar, aoCancelar }: Props) {
  const dias = useLiveQuery(() => contarDiasRegistrados(habito.id), [habito.id])

  return (
    <div className="confirmar-exclusao">
      <p>
        Isso apaga <strong>“{habito.nome}”</strong> e todas as marcações dele.{' '}
        {dias === 0 ? 'Ele ainda não tem nenhum dia marcado.' : dias === 1 ? 'Há 1 dia marcado.' : dias ? `São ${dias} dias marcados, somando todos os meses.` : ''}
      </p>
      {aoArquivar && (
        <p className="bloco__ajuda">Se quiser só tirar o hábito das telas e guardar o histórico, prefira arquivar.</p>
      )}
      <div className="confirmar-exclusao__botoes">
        <Botao variante="perigo" cheio onClick={aoExcluir}>
          Excluir de vez
        </Botao>
        {aoArquivar && (
          <Botao variante="secundario" cheio onClick={aoArquivar}>
            Arquivar em vez disso
          </Botao>
        )}
        <Botao variante="fantasma" cheio onClick={aoCancelar}>
          Cancelar
        </Botao>
      </div>
    </div>
  )
}
