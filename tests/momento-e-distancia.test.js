// Testes do momento pela hora e da distância (passo 9). Rode com:  npm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { momentoDaHora } from '../src/lib/momento.js'
import { distanciaKm, formatarDistancia, coordenadasDoBairro, BAIRROS } from '../src/lib/distancia.js'

// Hora local do aparelho, montada sem fuso: new Date(ano, mês, dia, hora, minuto)
const as = (hora, minuto = 0) => new Date(2026, 9, 22, hora, minuto)

describe('momentoDaHora', () => {
  it('das 11h às 14h59 é almoço', () => {
    assert.equal(momentoDaHora(as(11)), 'almoco_rapido')
    assert.equal(momentoDaHora(as(12, 30)), 'almoco_rapido')
    assert.equal(momentoDaHora(as(14, 59)), 'almoco_rapido')
  })

  it('das 18h às 23h59 é jantar', () => {
    assert.equal(momentoDaHora(as(18)), 'jantar_romantico')
    assert.equal(momentoDaHora(as(23, 59)), 'jantar_romantico')
  })

  it('no resto do dia é lanche', () => {
    for (const hora of [0, 6, 10, 15, 17]) {
      assert.equal(momentoDaHora(as(hora)), 'lanche_economico', `${hora}h`)
    }
  })
})

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
