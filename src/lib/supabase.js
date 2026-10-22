// Conexão com o Supabase: login e banco de dados.
//
// A URL e a chave vêm do arquivo .env.local, que fica fora do Git (modelo: .env.example).
// A chave é a "publishable": ela pode ficar no site, porque quem protege os dados
// são as regras de acesso (RLS) de supabase/schema.sql.
// Nunca coloque aqui a chave "secret" (ou a antiga "service_role"): ela ignora essas regras.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Sem o .env.local, o site abre, mas avisa que falta configurar (em vez de quebrar).
export const supabaseConfigurado = Boolean(url && chave)

export const supabase = supabaseConfigurado ? createClient(url, chave) : null
