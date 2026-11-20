// Testes da distância até o restaurante. Rode com:  npm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { distanciaKm, formatarDistancia, coordenadasDoBairro, BAIRROS } from '../src/lib/distancia.js'

describe('distanciaKm', () => {
  it('é zero para o mesmo ponto', () => {
    const ponto = { latitude: -15.8, longitude: -47.9 }
    assert.equal(distanciaKm(ponto, ponto), 0)
  })

  it('Asa Sul até Taguatinga dá uns 17 km em linha reta', () => {
    const km = distanciaKm(coordenadasDoBairro('Asa Sul'), coordenadasDoBairro('Taguatinga'))
    assert.ok(km > 16 && km < 18, `${km}`)
  })

  it('é igual nos dois sentidos', () => {
    const [a, b] = BAIRROS
    assert.equal(distanciaKm(a, b), distanciaKm(b, a))
  })
})

describe('formatarDistancia', () => {
  it('abaixo de 1 km, em metros, de 50 em 50', () => {
    assert.equal(formatarDistancia(0.35), '350 m')
    assert.equal(formatarDistancia(0.372), '350 m')
    assert.equal(formatarDistancia(0.01), '50 m')
  })

  it('até 10 km, com uma casa e vírgula', () => {
    assert.equal(formatarDistancia(1.234), '1,2 km')
    assert.equal(formatarDistancia(3), '3,0 km')
  })

  it('a partir de 10 km, sem casas', () => {
    assert.equal(formatarDistancia(12.6), '13 km')
  })
})

describe('coordenadasDoBairro', () => {
  it('bairro desconhecido devolve null', () => {
    assert.equal(coordenadasDoBairro('Marte'), null)
  })
})
