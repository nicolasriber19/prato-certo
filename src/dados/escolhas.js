// Escolhas (RF-07, RF-11): o prato que a pessoa escolheu, em que momento e quando.

import { supabase, modoDemonstracao, dadosOuErro } from '../lib/supabase.js'
import { lerTabela, gravarTabela, novoId } from './local.js'

export async function registrarEscolha(pratoId, momento) {
  if (modoDemonstracao) {
    const escolha = { id: novoId(), prato_id: pratoId, momento, criado_em: new Date().toISOString() }
    gravarTabela('escolhas', [...lerTabela('escolhas'), escolha])
    return escolha
  }
  return dadosOuErro(
    await supabase.from('escolhas').insert({ prato_id: pratoId, momento }).select('id, prato_id, momento, criado_em').single(),
  )
}

// Da mais nova para a mais antiga.
export async function listarEscolhas() {
  const linhas = modoDemonstracao
    ? lerTabela('escolhas')
    : dadosOuErro(
        await supabase.from('escolhas').select('id, prato_id, momento, criado_em').order('criado_em', { ascending: false }),
      )
  return [...linhas].sort((a, b) => b.criado_em.localeCompare(a.criado_em))
}
