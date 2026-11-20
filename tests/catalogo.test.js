// Confere o catálogo de exemplo (src/dados/catalogo.js). Rode com:  npm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { RESTAURANTES, PRATOS } from '../src/dados/catalogo.js'
import { RESTRICOES, COZINHAS } from '../src/lib/opcoes.js'
import { coordenadasDoBairro } from '../src/lib/distancia.js'

describe('catálogo de exemplo', () => {
  it('ids únicos e todo prato aponta para um restaurante que existe', () => {
    assert.equal(new Set(RESTAURANTES.map((r) => r.id)).size, RESTAURANTES.length)
    assert.equal(new Set(PRATOS.map((p) => p.id)).size, PRATOS.length)
    const ids = new Set(RESTAURANTES.map((r) => r.id))
    for (const prato of PRATOS) assert.ok(ids.has(prato.restaurante_id), prato.nome)
  })

  it('só usa marcas e cozinhas que aparecem nos chips da página', () => {
    const marcas = new Set(RESTRICOES.map((r) => r.id))
    const cozinhas = new Set(COZINHAS.map((c) => c.id))
    for (const prato of PRATOS) {
      prato.tags.forEach((tag) => assert.ok(marcas.has(tag), `${prato.nome}: ${tag}`))
      assert.ok(cozinhas.has(prato.cozinha), `${prato.nome}: ${prato.cozinha}`)
    }
  })

  it('todo preço é um número maior que zero', () => {
    for (const prato of PRATOS) assert.ok(Number.isFinite(prato.preco) && prato.preco > 0, prato.nome)
  })

  it('todo restaurante fica num bairro da lista "Onde você está?"', () => {
    for (const restaurante of RESTAURANTES) assert.ok(coordenadasDoBairro(restaurante.bairro), restaurante.nome)
  })

  it('prato vegano também é vegetariano e sem lactose', () => {
    for (const prato of PRATOS.filter((p) => p.tags.includes('vegano'))) {
      assert.ok(prato.tags.includes('vegetariano') && prato.tags.includes('sem_lactose'), prato.nome)
    }
  })

  it('cada restrição e cada cozinha têm pelo menos um prato', () => {
    for (const { id } of RESTRICOES) assert.ok(PRATOS.some((p) => p.tags.includes(id)), id)
    for (const { id } of COZINHAS) assert.ok(PRATOS.some((p) => p.cozinha === id), id)
  })
})
