// Confere o catálogo de exemplo e se o supabase/seed.sql está em dia com ele.

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { gerarSeed } from '../scripts/gerar-seed.js'
import { RESTAURANTES, PRATOS } from '../src/dados/catalogo-exemplo.js'
import { RESTRICOES, COZINHAS } from '../src/lib/opcoes.js'
import { MOMENTOS } from '../src/lib/momento.js'

describe('catálogo de exemplo', () => {
  it('o seed.sql foi gerado a partir do catálogo atual (rode "npm run gerar-seed")', () => {
    const noDisco = readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8').replaceAll('\r\n', '\n')
    assert.equal(noDisco, gerarSeed())
  })

  it('ids únicos e todo prato aponta para um restaurante que existe', () => {
    assert.equal(new Set(RESTAURANTES.map((r) => r.id)).size, RESTAURANTES.length)
    assert.equal(new Set(PRATOS.map((p) => p.id)).size, PRATOS.length)
    const ids = new Set(RESTAURANTES.map((r) => r.id))
    for (const prato of PRATOS) assert.ok(ids.has(prato.restaurante_id), prato.nome)
  })

  it('só usa marcas, momentos e cozinhas conhecidos', () => {
    const marcas = new Set(RESTRICOES.map((r) => r.id))
    const momentos = new Set(MOMENTOS.map((m) => m.id))
    const cozinhas = new Set(COZINHAS.map((c) => c.id))
    for (const prato of PRATOS) {
      prato.tags.forEach((tag) => assert.ok(marcas.has(tag), `${prato.nome}: ${tag}`))
      prato.momentos.forEach((m) => assert.ok(momentos.has(m), `${prato.nome}: ${m}`))
      assert.ok(cozinhas.has(prato.cozinha), `${prato.nome}: ${prato.cozinha}`)
      assert.ok(prato.momentos.length > 0, `${prato.nome} sem momento`)
    }
  })

  it('prato vegano também é vegetariano e sem lactose', () => {
    for (const prato of PRATOS.filter((p) => p.tags.includes('vegano'))) {
      assert.ok(prato.tags.includes('vegetariano') && prato.tags.includes('sem_lactose'), prato.nome)
    }
  })

  it('cada restrição e cada momento têm prato', () => {
    for (const { id } of [...RESTRICOES, ...MOMENTOS]) {
      assert.ok(PRATOS.some((p) => p.tags.includes(id) || p.momentos.includes(id)), id)
    }
  })
})
