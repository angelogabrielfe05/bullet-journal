import { pedirArmazenamentoPersistente } from './banco'
import { garantirDadosIniciais } from './sementes'

/** Roda uma vez ao abrir o app. Não trava a tela se algo falhar. */
export async function iniciarDados() {
  try {
    await garantirDadosIniciais()
  } catch (erro) {
    console.error('Não foi possível criar os hábitos iniciais.', erro)
  }
  void pedirArmazenamentoPersistente()
}
