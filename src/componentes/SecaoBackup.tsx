import { format, parseISO } from 'date-fns'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { salvarArquivoBackup } from '../dados/arquivoBackup'
import { importarBackup, lerUltimoBackup } from '../dados/backup'
import { ErroBackup, lerTextoDoBackup, resumirBackup, type Backup, type ResumoBackup } from '../regras/backup'
import { diasDesde } from '../regras/datas'
import { useAviso } from './avisoContexto'
import { Botao } from './Botao'
import { PainelInferior } from './PainelInferior'

const dataHora = (iso: string) => format(parseISO(iso), "dd/MM/yyyy 'às' HH:mm")

function textoUltimoBackup(iso: string | undefined) {
  if (!iso) return 'Nenhum backup feito ainda.'
  const dias = diasDesde(iso)
  const quando = dias === 0 ? 'hoje' : dias === 1 ? 'ontem' : `há ${dias} dias`
  return `Último backup: ${quando} (${dataHora(iso)}).`
}

/** Exportar e importar o backup em arquivo .json. */
export function SecaoBackup() {
  const ultimo = useLiveQuery(() => lerUltimoBackup(), [])
  const [persistente, setPersistente] = useState<boolean | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [aImportar, setAImportar] = useState<{ backup: Backup; resumo: ResumoBackup } | null>(null)
  const seletor = useRef<HTMLInputElement>(null)
  const avisar = useAviso()

  useEffect(() => {
    navigator.storage?.persisted?.().then(setPersistente, () => setPersistente(false))
  }, [])

  async function exportar() {
    setOcupado(true)
    try {
      if ((await salvarArquivoBackup()) === 'salvo') avisar({ texto: 'Backup salvo ✓' })
    } catch {
      avisar({ texto: 'Não foi possível gerar o backup. Tente de novo.' })
    } finally {
      setOcupado(false)
    }
  }

  async function escolherArquivo(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    e.target.value = '' // permite escolher o mesmo arquivo de novo
    if (!arquivo) return
    try {
      const backup = lerTextoDoBackup(await arquivo.text())
      setAImportar({ backup, resumo: resumirBackup(backup) })
    } catch (erro) {
      avisar({ texto: erro instanceof ErroBackup ? erro.message : 'Não foi possível ler o arquivo.', duracao: 7000 })
    }
  }

  async function confirmarImportacao() {
    if (!aImportar) return
    setOcupado(true)
    try {
      await importarBackup(aImportar.backup)
      setAImportar(null)
      avisar({ texto: 'Backup importado ✓' })
    } catch {
      setAImportar(null) // fecha o painel para o aviso aparecer na frente
      avisar({ texto: 'A importação falhou. Seus dados atuais não foram alterados.', duracao: 7000 })
    } finally {
      setOcupado(false)
    }
  }

  return (
    <section className="bloco" aria-labelledby="titulo-backup">
      <header className="bloco__cabecalho">
        <h2 id="titulo-backup" className="bloco__titulo">
          Backup
        </h2>
        <p className="bloco__ajuda">
          Seus dados ficam só neste aparelho. Faça backup com frequência e guarde o arquivo (no iPhone: “Salvar em Arquivos” ou iCloud
          Drive).
        </p>
      </header>

      <p className="ajustes__info">{ultimo === undefined ? '' : textoUltimoBackup(ultimo)}</p>

      <div className="ajustes__botoes">
        <Botao variante="primario" disabled={ocupado} onClick={exportar}>
          Exportar backup
        </Botao>
        <Botao disabled={ocupado} onClick={() => seletor.current?.click()}>
          Importar backup
        </Botao>
        <input ref={seletor} type="file" accept="application/json,.json" hidden onChange={escolherArquivo} />
      </div>

      {persistente !== null && (
        <p className="bloco__ajuda">
          Proteção contra limpeza automática do navegador: <strong>{persistente ? 'ativa' : 'não garantida'}</strong>
          {persistente ? '.' : ' (no iPhone, instalar o app na Tela de Início ajuda). Por isso o backup é importante.'}
        </p>
      )}

      <PainelInferior aberto={!!aImportar} aoFechar={() => setAImportar(null)} titulo="Importar backup?">
        {aImportar && (
          <div className="importar">
            <p>
              Backup de <strong>{dataHora(aImportar.resumo.exportadoEm)}</strong> com:
            </p>
            <ul className="importar__resumo">
              <li>{aImportar.resumo.itens} itens (tarefas, eventos e notas)</li>
              <li>
                {aImportar.resumo.habitos} hábitos e {aImportar.resumo.registros} marcações
              </li>
              <li>{aImportar.resumo.dias} dias com alguma anotação</li>
            </ul>
            <p className="recado">
              <span className="recado__texto">
                Importar <strong>substitui todos os dados atuais</strong> deste aparelho. Se quiser guardar os atuais, exporte um backup antes.
              </span>
            </p>
            <div className="ajustes__botoes">
              <Botao variante="perigo" disabled={ocupado} onClick={confirmarImportacao}>
                Substituir meus dados
              </Botao>
              <Botao variante="fantasma" onClick={() => setAImportar(null)}>
                Cancelar
              </Botao>
            </div>
          </div>
        )}
      </PainelInferior>
    </section>
  )
}
