// Favoritos (RF-06): pratos e restaurantes que a pessoa salvou.
// tipo: 'prato' ou 'restaurante'. No banco, vira a coluna prato_id ou restaurante_id.

import { supabase, modoDemonstracao, dadosOuErro } from '../lib/supabase.js'
import { lerTabela, gravarTabela } from './local.js'

const coluna = (tipo) => `${tipo}_id`

// Devolve { pratos: Set de ids, restaurantes: Set de ids, lista: do mais novo ao mais antigo }
export async function listarFavoritos() {
  const linhas = modoDemonstracao
    ? lerTabela('favoritos')
    : dadosOuErro(
        await supabase
          .from('favoritos')
          .select('prato_id, restaurante_id, criado_em')
          .order('criado_em', { ascending: false }),
      )

  const lista = [...linhas].sort((a, b) => b.criado_em.localeCompare(a.criado_em))
  return {
    pratos: new Set(lista.filter((l) => l.prato_id != null).map((l) => l.prato_id)),
    restaurantes: new Set(lista.filter((l) => l.restaurante_id != null).map((l) => l.restaurante_id)),
    lista,
  }
}

export async function favoritar(tipo, id) {
  if (modoDemonstracao) {
    const linhas = lerTabela('favoritos').filter((l) => l[coluna(tipo)] !== id)
    gravarTabela('favoritos', [...linhas, { prato_id: null, restaurante_id: null, [coluna(tipo)]: id, criado_em: new Date().toISOString() }])
    return
  }
  const { error } = await supabase.from('favoritos').insert({ [coluna(tipo)]: id })
  // 23505 = já era favorito (índice único): para quem usa, está tudo certo.
  if (error && error.code !== '23505') throw error
}

export async function desfavoritar(tipo, id) {
  if (modoDemonstracao) {
    gravarTabela('favoritos', lerTabela('favoritos').filter((l) => l[coluna(tipo)] !== id))
    return
  }
  // A RLS garante que só apaga os favoritos de quem está logado.
  dadosOuErro(await supabase.from('favoritos').delete().eq(coluna(tipo), id))
}
