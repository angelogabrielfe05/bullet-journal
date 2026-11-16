import { nomeDoArquivoBackup } from '../regras/backup'
import { hoje } from '../regras/datas'
import { backupParaTexto, exportarBackup, registrarBackupFeito } from './backup'

export type ResultadoBackup = 'salvo' | 'cancelado'

/**
 * Gera o arquivo de backup e entrega para a pessoa guardar:
 * - no celular, abre a folha de compartilhar (no iPhone: "Salvar em Arquivos");
 * - no computador, baixa o arquivo.
 */
export async function salvarArquivoBackup(): Promise<ResultadoBackup> {
  const texto = backupParaTexto(await exportarBackup())
  const nome = nomeDoArquivoBackup(hoje())
  const arquivo = new File([texto], nome, { type: 'application/json' })

  const ehCelular = window.matchMedia('(pointer: coarse)').matches
  if (ehCelular && navigator.canShare?.({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], title: 'Backup do Bullet Journal' })
    } catch (erro) {
      if (erro instanceof DOMException && erro.name === 'AbortError') return 'cancelado'
      throw erro
    }
  } else {
    const url = URL.createObjectURL(arquivo)
    const link = document.createElement('a')
    link.href = url
    link.download = nome
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  await registrarBackupFeito()
  return 'salvo'
}
