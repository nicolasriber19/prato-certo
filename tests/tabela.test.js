// Testes da tabela de restaurantes e preços. Rode com:  npm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { linhasDaTabela, ordenar, resumo } from '../src/lib/tabela.js'

const ORIGEM = { latitude: -15.812, longitude: -47.9 } // centro da Asa Sul

const RESTAURANTES = [
  { id: 1, nome: 'Perto', latitude: -15.8105, longitude: -47.8975 }, // ~0,3 km
  { id: 2, nome: 'Médio', latitude: -15.7975, longitude: -47.9245 }, //  ~3 km
  { id: 3, nome: 'Longe', latitude: -15.8335, longitude: -48.0555 }, // ~17 km
]

const PRATOS = [
  { id: 1, restaurante_id: 1, nome: 'Lasanha', preco: 52, cozinha: 'italiana', tags: [] },
  { id: 2, restaurante_id: 1, nome: 'Espaguete ao pomodoro', preco: 39, cozinha: 'italiana', tags: ['vegano', 'vegetariano', 'sem_lactose'] },
  { id: 3, restaurante_id: 2, nome: 'Bowl de quinoa', preco: 36, cozinha: 'saudavel', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'] },
  { id: 4, restaurante_id: 3, nome: 'Batata frita', preco: 15, cozinha: 'hamburguer', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'] },
  { id: 5, restaurante_id: 3, nome: 'Tapioca de queijo', preco: 15, cozinha: 'nordestina', tags: ['vegetariano', 'sem_gluten'] },
]

const linhas = (escolhas = {}) => linhasDaTabela({ pratos: PRATOS, restaurantes: RESTAURANTES, ...escolhas })
const nomes = (lista) => lista.map((linha) => linha.prato.nome)

describe('restrições', () => {
  it('sem restrição, aparecem todos os pratos', () => {
    assert.equal(linhas().length, 5)
  })

  it('um prato que não atende à restrição nunca aparece', () => {
    assert.deepEqual(nomes(linhas({ restricoes: ['vegano'] })), ['Espaguete ao pomodoro', 'Bowl de quinoa', 'Batata frita'])
  })

  it('exige todas as restrições marcadas ao mesmo tempo', () => {
    assert.deepEqual(nomes(linhas({ restricoes: ['vegano', 'sem_gluten'] })), ['Bowl de quinoa', 'Batata frita'])
  })

  it('nenhum prato atende: a lista vem vazia', () => {
    assert.deepEqual(linhas({ restricoes: ['vegano'], gostos: ['nordestina'] }), [])
  })
})

describe('gostos', () => {
  it('sem gosto marcado, aparecem todas as cozinhas', () => {
    assert.equal(linhas({ gostos: [] }).length, 5)
  })

  it('com gostos marcados, só aparecem essas cozinhas', () => {
    assert.deepEqual(nomes(linhas({ gostos: ['italiana', 'nordestina'] })), ['Lasanha', 'Espaguete ao pomodoro', 'Tapioca de queijo'])
  })
})

describe('distância', () => {
  it('sem origem, a distância fica vazia', () => {
    assert.ok(linhas().every((linha) => linha.distanciaKm === null))
  })

  it('com origem, cada prato ganha a distância do restaurante', () => {
    const [pertinho] = linhas({ origem: ORIGEM })
    assert.ok(pertinho.distanciaKm > 0.2 && pertinho.distanciaKm < 0.5, `${pertinho.distanciaKm}`)
  })
})

describe('ordenar', () => {
  it('por menor preço; no empate, pelo nome', () => {
    assert.deepEqual(nomes(ordenar(linhas(), 'preco')), [
      'Batata frita',
      'Tapioca de queijo',
      'Bowl de quinoa',
      'Espaguete ao pomodoro',
      'Lasanha',
    ])
  })

  it('por mais perto; no empate, o mais barato', () => {
    assert.deepEqual(nomes(ordenar(linhas({ origem: ORIGEM }), 'distancia')), [
      'Espaguete ao pomodoro',
      'Lasanha',
      'Bowl de quinoa',
      'Batata frita',
      'Tapioca de queijo',
    ])
  })

  it('por mais perto sem origem: vale o preço', () => {
    assert.deepEqual(nomes(ordenar(linhas(), 'distancia')).slice(0, 2), ['Batata frita', 'Tapioca de queijo'])
  })

  it('por nome do prato, com acentos no lugar certo', () => {
    assert.deepEqual(nomes(ordenar(linhas(), 'prato')), [
      'Batata frita',
      'Bowl de quinoa',
      'Espaguete ao pomodoro',
      'Lasanha',
      'Tapioca de queijo',
    ])
  })

  it('por restaurante; no mesmo restaurante, o mais barato primeiro', () => {
    assert.deepEqual(nomes(ordenar(linhas(), 'restaurante')), [
      'Batata frita',
      'Tapioca de queijo',
      'Bowl de quinoa',
      'Espaguete ao pomodoro',
      'Lasanha',
    ])
  })

  it('não muda a lista original', () => {
    const original = linhas()
    const copia = [...original]
    ordenar(original, 'preco')
    assert.deepEqual(original, copia)
  })
})

describe('resumo', () => {
  it('conta pratos e restaurantes e acha o menor e o maior preço', () => {
    assert.deepEqual(resumo(linhas({ restricoes: ['vegano'] })), { pratos: 3, restaurantes: 3, menorPreco: 15, maiorPreco: 39 })
  })

  it('lista vazia', () => {
    assert.deepEqual(resumo([]), { pratos: 0, restaurantes: 0, menorPreco: null, maiorPreco: null })
  })
})
