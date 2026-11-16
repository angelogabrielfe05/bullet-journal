import { useState } from 'react'
import { useAviso } from '../componentes/avisoContexto'
import { Botao } from '../componentes/Botao'
import { AreaTexto, CampoTexto } from '../componentes/Campos'
import { IconeMais, IconeMenu } from '../componentes/Icones'
import { Pagina } from '../componentes/Pagina'
import { PainelInferior } from '../componentes/PainelInferior'
import { MarcaPrioridade, Simbolo } from '../componentes/Simbolo'
import { LEGENDA, descreverSimbolo } from '../componentes/simbolosTexto'
import type { EstadoItem, TipoItem } from '../dados/tipos'
import { formatarDiaExtenso, hoje } from '../regras/datas'

/**
 * Página de amostra do visual (só no modo de desenvolvimento):
 * http://localhost:5173/bullet-journal/#/amostra
 */

interface Exemplo {
  tipo: TipoItem
  estado: EstadoItem
  texto: string
  prioridade?: boolean
  recuo?: 0 | 1
  horario?: string
}

const EXEMPLOS: Exemplo[] = [
  { tipo: 'tarefa', estado: 'aberta', texto: 'Estudar cardiologia: insuficiência cardíaca', prioridade: true },
  { tipo: 'nota', estado: 'aberta', texto: 'cap. 3 do Harrison', recuo: 1 },
  { tipo: 'evento', estado: 'aberta', texto: 'Prova de Farmacologia', horario: '08:00' },
  { tipo: 'tarefa', estado: 'concluida', texto: 'Lavar o jaleco' },
  { tipo: 'tarefa', estado: 'migrada', texto: 'Revisar flashcards de antibióticos' },
  { tipo: 'tarefa', estado: 'agendada', texto: 'Renovar matrícula' },
  { tipo: 'tarefa', estado: 'descartada', texto: 'Comprar café especial' },
  { tipo: 'nota', estado: 'aberta', texto: 'Dormi mal, dia mais leve hoje.' },
]

export default function Amostra() {
  const [itens, setItens] = useState(EXEMPLOS)
  const [painelAberto, setPainelAberto] = useState(false)
  const [texto, setTexto] = useState('')
  const [reflexao, setReflexao] = useState('')
  const avisar = useAviso()

  const alternar = (indice: number) =>
    setItens((lista) =>
      lista.map((item, i) =>
        i === indice && item.tipo === 'tarefa' && (item.estado === 'aberta' || item.estado === 'concluida')
          ? { ...item, estado: item.estado === 'aberta' ? 'concluida' : 'aberta' }
          : item,
      ),
    )

  return (
    <Pagina titulo="Amostra">
      <p className="subtitulo">{formatarDiaExtenso(hoje())}</p>

      <section className="amostra__secao">
        <h2 className="amostra__rotulo">Símbolos do método</h2>
        <ul className="amostra__legenda">
          {LEGENDA.map(({ tipo, estado, nome }) => (
            <li key={nome}>
              <Simbolo tipo={tipo} estado={estado} />
              {nome}
            </li>
          ))}
          <li>
            <MarcaPrioridade />
            Prioridade
          </li>
          <li>
            <span className="amostra__riscado">texto</span>
            Descartada
          </li>
        </ul>
      </section>

      <section className="amostra__secao">
        <h2 className="amostra__rotulo">Registro de exemplo (toque nos • para concluir)</h2>
        <ul className="lista-bullets">
          {itens.map((item, i) => (
            <li
              key={i}
              className="bullet"
              data-tipo={item.tipo}
              data-estado={item.estado}
              data-recuo={item.recuo ?? 0}
            >
              <span className="bullet__prioridade">{item.prioridade && <MarcaPrioridade />}</span>
              <span className="bullet__simbolo">
                {item.tipo === 'tarefa' ? (
                  <button
                    type="button"
                    className="botao-simbolo"
                    aria-label={descreverSimbolo(item.tipo, item.estado, item.prioridade)}
                    onClick={() => alternar(i)}
                  >
                    <Simbolo tipo={item.tipo} estado={item.estado} />
                  </button>
                ) : (
                  <Simbolo tipo={item.tipo} estado={item.estado} />
                )}
              </span>
              <span className="bullet__texto">
                {item.horario && <span className="bullet__horario">{item.horario}</span>}
                {item.texto}
              </span>
              <span className="bullet__acoes">
                <button type="button" className="botao-simbolo" aria-label="Opções do item" onClick={() => setPainelAberto(true)}>
                <IconeMenu tamanho={18} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="recado">
        <span className="recado__texto">Último backup há 9 dias.</span>
        <Botao variante="fantasma">Fazer agora</Botao>
      </div>

      <section className="amostra__secao">
        <h2 className="amostra__rotulo">Botões</h2>
        <div className="amostra__linha">
          <Botao variante="primario">Salvar</Botao>
          <Botao>Agendar</Botao>
          <Botao variante="fantasma">Cancelar</Botao>
          <Botao variante="perigo">Descartar</Botao>
          <Botao variante="primario" icone aria-label="Adicionar">
            <IconeMais />
          </Botao>
        </div>
      </section>

      <section className="amostra__secao">
        <h2 className="amostra__rotulo">Campos</h2>
        <CampoTexto
          rotulo="Novo item"
          placeholder="• tarefa, - nota, o evento"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <AreaTexto
          rotulo="Reflexão do dia"
          placeholder="Como foi hoje?"
          value={reflexao}
          onChange={(e) => setReflexao(e.target.value)}
        />
      </section>

      <section className="amostra__secao">
        <h2 className="amostra__rotulo">Painel e aviso</h2>
        <div className="amostra__linha">
          <Botao onClick={() => setPainelAberto(true)}>Abrir painel</Botao>
          <Botao
            onClick={() =>
              avisar({ texto: 'Item apagado', acao: { rotulo: 'Desfazer', aoClicar: () => avisar({ texto: 'Item restaurado' }) } })
            }
          >
            Mostrar aviso
          </Botao>
        </div>
      </section>

      <PainelInferior aberto={painelAberto} aoFechar={() => setPainelAberto(false)} titulo="Opções do item">
        <ul className="opcoes">
          {(['tarefa', 'evento', 'nota'] as const).map((tipo) => (
            <li key={tipo}>
              <button type="button" className="opcao" onClick={() => setPainelAberto(false)}>
                <Simbolo tipo={tipo} /> Transformar em {tipo}
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="opcao" onClick={() => setPainelAberto(false)}>
              <MarcaPrioridade /> Marcar como prioridade
            </button>
          </li>
          <li>
            <button type="button" className="opcao opcao--perigo" onClick={() => setPainelAberto(false)}>
              Apagar
            </button>
          </li>
        </ul>
      </PainelInferior>
    </Pagina>
  )
}
