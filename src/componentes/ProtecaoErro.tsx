import { Component, type ErrorInfo, type ReactNode } from 'react'
import { salvarArquivoBackup } from '../dados/arquivoBackup'

interface Props {
  children: ReactNode
}

interface Estado {
  erro: Error | null
  backup: '' | 'salvando' | 'salvo' | 'falhou'
}

/**
 * Se uma tela der erro, mostra uma mensagem com saída (recarregar ou salvar
 * backup) em vez de deixar o app em branco. A barra de abas continua funcionando.
 * Use com key={tela} para que trocar de aba limpe o erro.
 */
export class ProtecaoErro extends Component<Props, Estado> {
  state: Estado = { erro: null, backup: '' }

  static getDerivedStateFromError(erro: Error): Partial<Estado> {
    return { erro }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('Erro na tela:', erro, info.componentStack)
  }

  private salvarBackup = async () => {
    this.setState({ backup: 'salvando' })
    try {
      const resultado = await salvarArquivoBackup()
      this.setState({ backup: resultado === 'salvo' ? 'salvo' : '' })
    } catch {
      this.setState({ backup: 'falhou' })
    }
  }

  render() {
    if (!this.state.erro) return this.props.children
    const { backup } = this.state
    return (
      <section className="pagina protecao-erro" role="alert">
        <h1 className="pagina__titulo">Ops…</h1>
        <p>Algo deu errado nesta tela. Seus dados continuam guardados no aparelho.</p>
        <p className="bloco__ajuda">Tente recarregar. Se o problema continuar, salve um backup por segurança.</p>
        <div className="ajustes__botoes">
          <button type="button" className="botao botao--primario" onClick={() => window.location.reload()}>
            Recarregar
          </button>
          <button type="button" className="botao botao--secundario" disabled={backup === 'salvando'} onClick={this.salvarBackup}>
            {backup === 'salvo' ? 'Backup salvo ✓' : backup === 'falhou' ? 'Tentar backup de novo' : 'Salvar backup'}
          </button>
        </div>
        <p className="bloco__ajuda protecao-erro__detalhe">Detalhe técnico: {this.state.erro.message}</p>
      </section>
    )
  }
}
