import type { Dia } from '../regras/datas'
import { agoraISO, db } from './banco'

export async function lerReflexao(dia: Dia): Promise<string> {
  return (await db.reflexoes.get(dia))?.texto ?? ''
}

/** Salva a reflexão do dia; texto vazio apaga o registro. */
export async function salvarReflexao(dia: Dia, texto: string) {
  if (texto.trim()) await db.reflexoes.put({ dia, texto, atualizadoEm: agoraISO() })
  else await db.reflexoes.delete(dia)
}
