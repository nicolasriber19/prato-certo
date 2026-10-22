// Preferências da pessoa (RF-02): gostos, cozinhas a evitar, restrições, orçamento e bairro.
// Sem perfil salvo, o site leva a pessoa para as preferências antes das sugestões.

import { supabase, modoDemonstracao, dadosOuErro } from '../lib/supabase.js'
import { usuarioAtual, aoMudarSessao } from '../lib/sessao.js'
import { lerTabela, gravarTabela } from './local.js'

const CAMPOS = ['gostos', 'nao_gosta', 'restricoes', 'orcamento_max', 'bairro']

// Guarda o perfil já lido, para não buscar de novo a cada tela.
let guardado // undefined = ainda não buscou
aoMudarSessao(() => (guardado = undefined))

function soOsCampos(perfil) {
  return Object.fromEntries(CAMPOS.map((campo) => [campo, perfil[campo]]))
}

export async function lerPerfil() {
  if (guardado !== undefined) return guardado

  if (modoDemonstracao) {
    guardado = lerTabela('perfil', null)
  } else {
    const resposta = await supabase.from('perfis').select('*').eq('id', usuarioAtual().id).maybeSingle()
    const perfil = dadosOuErro(resposta)
    guardado = perfil && { ...soOsCampos(perfil), orcamento_max: perfil.orcamento_max === null ? null : Number(perfil.orcamento_max) }
  }
  return guardado
}

export async function salvarPerfil(perfil) {
  const campos = soOsCampos(perfil)
  if (modoDemonstracao) {
    gravarTabela('perfil', campos)
  } else {
    dadosOuErro(
      await supabase
        .from('perfis')
        .upsert({ id: usuarioAtual().id, ...campos, atualizado_em: new Date().toISOString() }),
    )
  }
  guardado = campos
}

// Depois de "Apagar meus dados", o perfil guardado também some.
export function esquecerPerfil() {
  guardado = undefined
}
