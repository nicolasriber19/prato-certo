// Restaurantes e pratos (leitura pública).
// Com o Supabase, vêm do banco. No modo demonstração, de catalogo-exemplo.js.
// O catálogo muda pouco: é buscado uma vez e guardado enquanto a página estiver aberta.

import { supabase, modoDemonstracao, dadosOuErro } from '../lib/supabase.js'

let pedido = null

async function buscar() {
  if (modoDemonstracao) {
    // import(): o arquivo de exemplo só é baixado no modo demonstração.
    const { RESTAURANTES, PRATOS } = await import('./catalogo-exemplo.js')
    return { restaurantes: RESTAURANTES, pratos: PRATOS }
  }
  const [restaurantes, pratos] = await Promise.all([
    supabase.from('restaurantes').select('*').order('id'),
    supabase.from('pratos').select('*').order('id'),
  ])
  return {
    restaurantes: dadosOuErro(restaurantes),
    // O banco pode devolver o preço como texto ("39.00"): vira número aqui.
    pratos: dadosOuErro(pratos).map((prato) => ({ ...prato, preco: Number(prato.preco) })),
  }
}

export function carregarCatalogo() {
  if (!pedido) {
    pedido = buscar()
    pedido.catch(() => (pedido = null)) // deu erro: tenta de novo na próxima vez
  }
  return pedido
}

export async function buscarPrato(id) {
  const { pratos, restaurantes } = await carregarCatalogo()
  const prato = pratos.find((item) => item.id === Number(id))
  if (!prato) return null
  return { prato, restaurante: restaurantes.find((r) => r.id === prato.restaurante_id) ?? null }
}

export async function buscarRestaurante(id) {
  const { pratos, restaurantes } = await carregarCatalogo()
  const restaurante = restaurantes.find((item) => item.id === Number(id))
  if (!restaurante) return null
  return { restaurante, pratos: pratos.filter((prato) => prato.restaurante_id === restaurante.id) }
}
