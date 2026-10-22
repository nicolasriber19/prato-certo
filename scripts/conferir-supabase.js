// Confere a conexão com o Supabase e os dados de exemplo (passos 2 a 4 do plano).
// Rode com:  npm run conferir   (lê a URL e a chave do .env.local)
//
// Não faz login: tudo aqui é o que qualquer visitante do site conseguiria ver.

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const chave = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

let falhas = 0

function ok(texto) {
  console.log(`  ok    ${texto}`)
}

function falha(texto) {
  falhas += 1
  console.log(`  FALHA ${texto}`)
}

// A chave antiga do tipo JWT diz o próprio papel ("anon" ou "service_role") no meio do texto.
function papelDaChaveAntiga(texto) {
  try {
    return JSON.parse(Buffer.from(texto.split('.')[1], 'base64url').toString()).role
  } catch {
    return undefined
  }
}

if (!url || !chave) {
  console.log('Falta preencher VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env.local.')
  process.exit(1)
}

if (chave.startsWith('sb_secret_') || papelDaChaveAntiga(chave) === 'service_role') {
  console.log('A chave do .env.local é a SECRETA. Troque pela "publishable" (ou "anon") e apague a secreta do arquivo.')
  process.exit(1)
}

const supabase = createClient(url, chave, { auth: { persistSession: false } })

console.log('1. Conexão e dados de exemplo')

const restaurantes = await supabase.from('restaurantes').select('id', { count: 'exact', head: true })
if (restaurantes.error) {
  falha(`não consegui ler "restaurantes": ${restaurantes.error.message}. Já rodou o schema.sql?`)
} else if (restaurantes.count === 0) {
  falha('a tabela "restaurantes" está vazia. Rode o seed.sql.')
} else {
  ok(`${restaurantes.count} restaurantes`)
}

const pratos = await supabase.from('pratos').select('tags, momentos')
if (pratos.error) {
  falha(`não consegui ler "pratos": ${pratos.error.message}`)
} else if (pratos.data.length === 0) {
  falha('a tabela "pratos" está vazia. Rode o seed.sql.')
} else {
  ok(`${pratos.data.length} pratos`)

  // Toda restrição e todo momento precisam ter pelo menos um prato.
  const marcas = ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose']
  const momentos = ['almoco_rapido', 'jantar_romantico', 'lanche_economico']
  for (const marca of marcas) {
    const quantos = pratos.data.filter((p) => p.tags.includes(marca)).length
    quantos > 0 ? ok(`${quantos} pratos "${marca}"`) : falha(`nenhum prato "${marca}"`)
  }
  for (const momento of momentos) {
    const quantos = pratos.data.filter((p) => p.momentos.includes(momento)).length
    quantos > 0 ? ok(`${quantos} pratos para "${momento}"`) : falha(`nenhum prato para "${momento}"`)
  }
}

const notas = await supabase.rpc('notas_dos_pratos')
notas.error ? falha(`a função "notas_dos_pratos" falhou: ${notas.error.message}`) : ok('média das notas disponível')

console.log('2. Regras de acesso (RLS), sem login')

for (const tabela of ['perfis', 'favoritos', 'escolhas', 'avaliacoes']) {
  const leitura = await supabase.from(tabela).select('*').limit(1)
  if (leitura.error) {
    // Erro de permissão também protege os dados, mas o esperado é "lista vazia".
    ok(`"${tabela}" bloqueada (${leitura.error.message})`)
  } else if (leitura.data.length === 0) {
    ok(`"${tabela}" não mostra nada a quem não entrou`)
  } else {
    falha(`"${tabela}" mostrou dados a quem não entrou! Confira as políticas no schema.sql.`)
  }
}

const escrita = await supabase.from('restaurantes').insert({
  nome: 'Teste',
  bairro: 'Teste',
  endereco: 'Teste',
  latitude: 0,
  longitude: 0,
  faixa_preco: 1,
})
escrita.error
  ? ok('visitante não consegue criar restaurante')
  : falha('um visitante conseguiu criar restaurante! Apague a linha "Teste" e confira o schema.sql.')

console.log(falhas === 0 ? '\nTudo certo.' : `\n${falhas} falha(s).`)
process.exit(falhas === 0 ? 0 : 1)
