// Escreve supabase/seed.sql a partir de src/dados/catalogo-exemplo.js.
// Rode com:  npm run gerar-seed
//
// Assim o catálogo tem uma fonte só: o mesmo arquivo alimenta o modo demonstração
// e o banco. O teste tests/seed.test.js avisa se alguém esquecer de rodar este script.

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { RESTAURANTES, PRATOS } from '../src/dados/catalogo-exemplo.js'

const ARQUIVO = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url))

const texto = (valor) => `'${String(valor).replaceAll("'", "''")}'`
const lista = (valores) => `'{${valores.join(',')}}'`

function linhaRestaurante(r) {
  return `  (${r.id}, ${texto(r.nome)}, ${texto(r.bairro)}, ${texto(r.endereco)}, ${r.latitude}, ${r.longitude}, ${r.faixa_preco}, ${lista(r.cozinhas)}, ${texto(r.descricao)})`
}

function linhaPrato(p) {
  return `  (${p.id}, ${p.restaurante_id}, ${texto(p.nome)}, ${texto(p.descricao)}, ${p.preco.toFixed(2)}, ${texto(p.cozinha)}, ${lista(p.tags)}, ${lista(p.momentos)}, ${p.tempo_preparo_min})`
}

// Os pratos ganham um comentário com o nome do restaurante, para facilitar a leitura do SQL.
function linhasDosPratos() {
  const linhas = []
  let restauranteAtual = null
  PRATOS.forEach((prato, i) => {
    if (prato.restaurante_id !== restauranteAtual) {
      restauranteAtual = prato.restaurante_id
      const restaurante = RESTAURANTES.find((r) => r.id === restauranteAtual)
      if (i > 0) linhas.push('')
      linhas.push(`  -- ${restaurante.id}. ${restaurante.nome}`)
    }
    const fim = i === PRATOS.length - 1 ? '' : ','
    linhas.push(linhaPrato(prato) + fim)
  })
  return linhas.join('\n')
}

export function gerarSeed() {
  return `-- Prato Certo: restaurantes e pratos DE EXEMPLO.
--
-- ARQUIVO GERADO por "npm run gerar-seed" a partir de src/dados/catalogo-exemplo.js.
-- Não edite aqui: mude o arquivo JS e rode o comando de novo.
--
-- Como usar: depois do schema.sql, SQL Editor → New query → colar este arquivo → Run.
-- Pode rodar de novo: atualiza as linhas pelo id, sem duplicar.


-- Restaurantes -----------------------------------------------------------------

insert into public.restaurantes
  (id, nome, bairro, endereco, latitude, longitude, faixa_preco, cozinhas, descricao)
values
${RESTAURANTES.map(linhaRestaurante).join(',\n')}
on conflict (id) do update set
  nome        = excluded.nome,
  bairro      = excluded.bairro,
  endereco    = excluded.endereco,
  latitude    = excluded.latitude,
  longitude   = excluded.longitude,
  faixa_preco = excluded.faixa_preco,
  cozinhas    = excluded.cozinhas,
  descricao   = excluded.descricao;


-- Pratos -------------------------------------------------------------------------

insert into public.pratos
  (id, restaurante_id, nome, descricao, preco, cozinha, tags, momentos, tempo_preparo_min)
values
${linhasDosPratos()}
on conflict (id) do update set
  restaurante_id    = excluded.restaurante_id,
  nome              = excluded.nome,
  descricao         = excluded.descricao,
  preco             = excluded.preco,
  cozinha           = excluded.cozinha,
  tags              = excluded.tags,
  momentos          = excluded.momentos,
  tempo_preparo_min = excluded.tempo_preparo_min;


-- Os ids foram escritos à mão: avisa o banco de onde continuar a contagem.
select setval(pg_get_serial_sequence('public.restaurantes', 'id'), (select max(id) from public.restaurantes));
select setval(pg_get_serial_sequence('public.pratos', 'id'), (select max(id) from public.pratos));


-- Conferência: quantos pratos atendem cada restrição e cada momento (nenhum pode ser 0).
select marca, (select count(*) from public.pratos as p where marca = any (p.tags || p.momentos)) as pratos
from unnest(array['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose',
                  'almoco_rapido', 'jantar_romantico', 'lanche_economico']) as marca;
`
}

// Rodado direto pelo terminal (e não importado pelo teste): grava o arquivo.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(ARQUIVO, gerarSeed())
  console.log(`Gravado: supabase/seed.sql (${RESTAURANTES.length} restaurantes, ${PRATOS.length} pratos)`)
}
