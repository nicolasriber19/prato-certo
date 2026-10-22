// Conexão com o Supabase: login e banco de dados.
//
// A URL e a chave vêm do arquivo .env.local, que fica fora do Git (modelo: .env.example).
// A chave é a "publishable": ela pode ficar no site, porque quem protege os dados
// são as regras de acesso (RLS) de supabase/schema.sql.
// Nunca coloque aqui a chave "secret" (ou a antiga "service_role"): ela ignora essas regras.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigurado = Boolean(url && chave)

// Sem o .env.local, o site funciona no modo demonstração: usa os restaurantes de
// src/dados/catalogo-exemplo.js e guarda tudo só neste navegador (src/dados/local.js).
export const modoDemonstracao = !supabaseConfigurado

export const supabase = supabaseConfigurado ? createClient(url, chave) : null

// Toda resposta do Supabase vem como { data, error }. Esta função devolve os dados
// ou lança o erro, para a tela mostrar a mensagem.
export function dadosOuErro({ data, error }) {
  if (error) throw error
  return data
}
