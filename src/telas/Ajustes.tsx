import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useAviso } from '../componentes/avisoContexto'
import { Botao } from '../componentes/Botao'
import { FormHabito } from '../componentes/FormHabito'
import { IconeMais } from '../componentes/Icones'
import { Pagina } from '../componentes/Pagina'
import { PainelInferior } from '../componentes/PainelInferior'
import { SecaoBackup } from '../componentes/SecaoBackup'
import { MarcaPrioridade, Simbolo } from '../componentes/Simbolo'
import { LEGENDA } from '../componentes/simbolosTexto'
import { ConfirmarExclusao } from '../componentes/ConfirmarExclusao'
import { arquivarHabito, excluirHabito, listarHabitos, reordenarHabitos, restaurarHabito } from '../dados/habitos'
import type { Habito } from '../dados/tipos'
import { formatarNumero } from '../regras/numeros'

const NOMES_DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

/** "seg a sex" · "todos os dias" · "ter, qui, sáb" */
function descreverDias(dias: number[]) {
  const ordem = [1, 2, 3, 4, 5, 6, 0].filter((d) => dias.includes(d))
  if (ordem.length === 7) return 'todos os dias'
  if (ordem.length === 5 && ordem.every((d) => d >= 1 && d <= 5)) return 'seg a sex'
  return ordem.map((d) => NOMES_DIAS[d]).join(', ')
}

function descreverHabito(h: Habito) {
  const tipo = h.tipo === 'check' ? 'check' : `meta ${formatarNumero(h.meta ?? 0)} ${h.unidade ?? ''}`
  return `${tipo} · ${descreverDias(h.dias)}`
}

export function Ajustes() {
  const todos = useLiveQuery(() => listarHabitos(true), [])
  const [editando, setEditando] = useState<Habito | 'novo' | null>(null)
  const [excluindo, setExcluindo] = useState<Habito | null>(null)
  const avisar = useAviso()

  const ativos = todos?.filter((h) => !h.arquivado) ?? []
  const arquivados = todos?.filter((h) => h.arquivado) ?? []

  async function mover(indice: number, direcao: -1 | 1) {
    const ids = ativos.map((h) => h.id)
    const destino = indice + direcao
    if (destino < 0 || destino >= ids.length) return
    ;[ids[indice], ids[destino]] = [ids[destino], ids[indice]]
    // Arquivados vão para o fim, mantendo a ordem deles.
    await reordenarHabitos([...ids, ...arquivados.map((h) => h.id)])
  }

  async function arquivar(h: Habito) {
    await arquivarHabito(h.id, true)
    avisar({ texto: `“${h.nome}” arquivado`, acao: { rotulo: 'Desfazer', aoClicar: () => void arquivarHabito(h.id, false) } })
  }

  async function excluir(h: Habito) {
    setExcluindo(null)
    const excluido = await excluirHabito(h.id)
    if (!excluido) return
    avisar({
      texto: `“${h.nome}” excluído`,
      acao: { rotulo: 'Desfazer', aoClicar: () => void restaurarHabito(excluido) },
      duracao: 8000,
    })
  }

  async function arquivarEmVezDeExcluir(h: Habito) {
    setExcluindo(null)
    await arquivar(h)
  }

  return (
    <Pagina titulo="Ajustes" semAjustes>
      <section className="bloco" aria-labelledby="titulo-ajustes-habitos">
        <header className="bloco__cabecalho bloco__cabecalho--linha">
          <h2 id="titulo-ajustes-habitos" className="bloco__titulo">
            Hábitos
          </h2>
          <Botao variante="secundario" className="botao--pequeno" onClick={() => setEditando('novo')}>
            <IconeMais tamanho={16} /> Novo
          </Botao>
        </header>

        <ul className="lista-ajustes">
          {ativos.map((h, i) => (
            <li key={h.id} className="lista-ajustes__item">
              <div className="lista-ajustes__texto">
                <strong>{h.nome}</strong>
                <span>{descreverHabito(h)}</span>
              </div>
              <div className="lista-ajustes__acoes">
                <button type="button" className="botao-simbolo" aria-label={`Subir ${h.nome}`} disabled={i === 0} onClick={() => mover(i, -1)}>
                  ↑
                </button>
                <button
                  type="button"
                  className="botao-simbolo"
                  aria-label={`Descer ${h.nome}`}
                  disabled={i === ativos.length - 1}
                  onClick={() => mover(i, 1)}
                >
                  ↓
                </button>
                <button type="button" className="link" onClick={() => setEditando(h)}>
                  editar
                </button>
                <button type="button" className="link" onClick={() => arquivar(h)}>
                  arquivar
                </button>
              </div>
            </li>
          ))}
          {todos && !ativos.length && <li className="vazio">Nenhum hábito ativo.</li>}
        </ul>

        {arquivados.length > 0 && (
          <details className="arquivados">
            <summary>Arquivados ({arquivados.length})</summary>
            <p className="bloco__ajuda">Não aparecem nas telas, mas o histórico continua guardado.</p>
            <ul className="lista-ajustes">
              {arquivados.map((h) => (
                <li key={h.id} className="lista-ajustes__item">
                  <div className="lista-ajustes__texto">
                    <strong>{h.nome}</strong>
                    <span>{descreverHabito(h)}</span>
                  </div>
                  <div className="lista-ajustes__acoes">
                    <button type="button" className="link" onClick={() => arquivarHabito(h.id, false)}>
                      reativar
                    </button>
                    <button type="button" className="link link--perigo" onClick={() => setExcluindo(h)}>
                      excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <SecaoBackup />

      <section className="bloco" aria-labelledby="titulo-legenda">
        <h2 id="titulo-legenda" className="bloco__titulo">
          Símbolos
        </h2>
        <ul className="legenda-simbolos">
          {LEGENDA.map(({ tipo, estado, nome }) => (
            <li key={nome}>
              <Simbolo tipo={tipo} estado={estado} /> {nome}
            </li>
          ))}
          <li>
            <MarcaPrioridade /> Prioridade
          </li>
          <li>
            <span className="legenda-simbolos__riscado">riscado</span> Descartada
          </li>
        </ul>
      </section>

      <p className="bloco__ajuda ajustes__rodape">Bullet Journal v1 · dados guardados só neste aparelho, sem conta e sem internet.</p>

      <PainelInferior
        aberto={editando !== null}
        aoFechar={() => setEditando(null)}
        titulo={editando === 'novo' ? 'Novo hábito' : 'Editar hábito'}
      >
        {editando !== null && (
          <FormHabito
            key={editando === 'novo' ? 'novo' : editando.id}
            habito={editando === 'novo' ? undefined : editando}
            aoTerminar={() => setEditando(null)}
            aoExcluir={
              editando === 'novo'
                ? undefined
                : () => {
                    setEditando(null)
                    setExcluindo(editando)
                  }
            }
          />
        )}
      </PainelInferior>

      <PainelInferior aberto={excluindo !== null} aoFechar={() => setExcluindo(null)} titulo="Excluir hábito">
        {excluindo && (
          <ConfirmarExclusao
            key={excluindo.id}
            habito={excluindo}
            aoExcluir={() => excluir(excluindo)}
            aoArquivar={excluindo.arquivado ? undefined : () => arquivarEmVezDeExcluir(excluindo)}
            aoCancelar={() => setExcluindo(null)}
          />
        )}
      </PainelInferior>
    </Pagina>
  )
}
