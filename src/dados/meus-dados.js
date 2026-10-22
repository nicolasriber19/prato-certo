// "Apagar meus dados" (RF-12): apaga perfil, favoritos, escolhas e avaliações de quem está logado.
// A conta (e-mail e senha) continua existindo no Supabase; só quem administra o projeto apaga.

import { supabase, modoDemonstracao, dadosOuErro } from '../lib/supabase.js'
import { usuarioAtual } from '../lib/sessao.js'
import { apagarTabelas } from './local.js'
import { esquecerPerfil } from './perfis.js'

export async function apagarMeusDados() {
  if (modoDemonstracao) {
    apagarTabelas({ menos: ['sessao'] })
  } else {
    const id = usuarioAtual().id
    // A RLS já impede apagar dados de outra pessoa; o filtro deixa isso explícito.
    for (const tabela of ['favoritos', 'escolhas', 'avaliacoes']) {
      dadosOuErro(await supabase.from(tabela).delete().eq('usuario_id', id))
    }
    dadosOuErro(await supabase.from('perfis').delete().eq('id', id))
  }
  esquecerPerfil()
}
