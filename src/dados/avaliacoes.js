// Avaliações (RF-07): nota de 1 a 5 e comentário, uma por pessoa e prato.
// Avaliar de novo o mesmo prato substitui a avaliação anterior.

import { supabase, modoDemonstracao, dadosOuErro } from '../lib/supabase.js'
import { usuarioAtual } from '../lib/sessao.js'
import { lerTabela, gravarTabela } from './local.js'

export async function avaliar(pratoId, nota, comentario = '') {
  const avaliacao = { prato_id: pratoId, nota, comentario: comentario.trim().slice(0, 500), atualizado_em: new Date().toISOString() }

  if (modoDemonstracao) {
    const outras = lerTabela('avaliacoes').filter((a) => a.prato_id !== pratoId)
    gravarTabela('avaliacoes', [...outras, avaliacao])
    return
  }
  dadosOuErro(
    await supabase
      .from('avaliacoes')
      .upsert({ usuario_id: usuarioAtual().id, ...avaliacao }, { onConflict: 'usuario_id,prato_id' }),
  )
}

// Map: id do prato → { nota, comentario }
export async function minhasAvaliacoes() {
  const linhas = modoDemonstracao
    ? lerTabela('avaliacoes')
    : dadosOuErro(await supabase.from('avaliacoes').select('prato_id, nota, comentario'))
  return new Map(linhas.map((a) => [a.prato_id, { nota: a.nota, comentario: a.comentario }]))
}

// Map: id do prato → { media, total }, com as notas de todo mundo.
// No modo demonstração só existe uma pessoa, então a média é a própria nota.
export async function notasDosPratos() {
  if (modoDemonstracao) {
    return new Map(lerTabela('avaliacoes').map((a) => [a.prato_id, { media: a.nota, total: 1 }]))
  }
  const linhas = dadosOuErro(await supabase.rpc('notas_dos_pratos'))
  return new Map(linhas.map((l) => [l.prato_id, { media: Number(l.media), total: Number(l.total) }]))
}
