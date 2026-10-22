// Testes da regra de recomendação (passo 9). Rode com:  npm test
// Usa só o que já vem no Node (node:test), sem biblioteca de teste.

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { recomendarPratos, recomendarRestaurantes, PONTOS } from '../src/lib/recomendar.js'

// Origem: centro da Asa Sul.
const ORIGEM = { latitude: -15.812, longitude: -47.9 }

const RESTAURANTES = [
  { id: 1, nome: 'Pertinho', latitude: -15.8105, longitude: -47.8975 }, // ~0,3 km
  { id: 2, nome: 'Médio', latitude: -15.7975, longitude: -47.9245 }, //    ~3 km
  { id: 3, nome: 'Longe', latitude: -15.8335, longitude: -48.0555 }, //    ~17 km
]

let proximoId = 1
function prato(campos = {}) {
  const id = proximoId++
  return {
    id,
    restaurante_id: 3, // longe: não ganha pontos de distância
    nome: `Prato ${id}`,
    preco: 30,
    cozinha: 'brasileira',
    tags: [],
    momentos: [],
    ...campos,
  }
}

// Perfil vazio, momento "almoço rápido" e uma data fixa; cada teste muda só o que precisa.
function recomendar(pratos, { perfil, ...extras } = {}) {
  return recomendarPratos({
    pratos,
    restaurantes: RESTAURANTES,
    momento: 'almoco_rapido',
    agora: new Date('2026-10-22T12:00:00-03:00'),
    ...extras,
    perfil: { gostos: [], nao_gosta: [], restricoes: [], orcamento_max: null, ...perfil },
  })
}

const ids = (resultado) => resultado.sugestoes.map((sugestao) => sugestao.prato.id)

describe('restrições', () => {
  it('um perfil vegano nunca recebe prato sem a marca "vegano"', () => {
    const vegano = prato({ tags: ['vegano', 'vegetariano', 'sem_lactose'] })
    const comCarne = prato({ tags: ['sem_gluten', 'sem_lactose'], momentos: ['almoco_rapido'] })
    const vegetariano = prato({ tags: ['vegetariano'] })

    const resultado = recomendar([vegano, comCarne, vegetariano], { perfil: { restricoes: ['vegano'] } })
    assert.deepEqual(ids(resultado), [vegano.id])
  })

  it('exige todas as restrições ao mesmo tempo', () => {
    const veganoComGluten = prato({ tags: ['vegano', 'vegetariano', 'sem_lactose'] })
    const veganoSemGluten = prato({ tags: ['vegano', 'vegetariano', 'sem_lactose', 'sem_gluten'] })

    const resultado = recomendar([veganoComGluten, veganoSemGluten], {
      perfil: { restricoes: ['vegano', 'sem_gluten'] },
    })
    assert.deepEqual(ids(resultado), [veganoSemGluten.id])
    assert.equal(resultado.sugestoes[0].motivos[0], 'Vegano e sem glúten')
  })

  it('prato vegano serve para quem é vegetariano', () => {
    const vegano = prato({ tags: ['vegano', 'vegetariano', 'sem_lactose'] })
    const resultado = recomendar([vegano], { perfil: { restricoes: ['vegetariano'] } })
    assert.deepEqual(ids(resultado), [vegano.id])
  })

  it('sem nenhum prato permitido, a lista vem vazia (e não "acima do orçamento")', () => {
    const resultado = recomendar([prato()], { perfil: { restricoes: ['vegano'], orcamento_max: 10 } })
    assert.deepEqual(resultado, { sugestoes: [], acimaDoOrcamento: false })
  })
})

describe('orçamento', () => {
  it('nenhum prato acima do orçamento aparece, e o prato no limite exato entra', () => {
    const barato = prato({ preco: 20 })
    const noLimite = prato({ preco: 25 })
    const caro = prato({ preco: 25.01 })

    const resultado = recomendar([barato, noLimite, caro], { perfil: { orcamento_max: 25 } })
    assert.deepEqual(ids(resultado).sort(), [barato.id, noLimite.id].sort())
    assert.equal(resultado.acimaDoOrcamento, false)
  })

  it('sem limite (null), todos entram', () => {
    const resultado = recomendar([prato({ preco: 10 }), prato({ preco: 200 })])
    assert.equal(resultado.sugestoes.length, 2)
  })

  it('o preço que vem do banco como texto também funciona', () => {
    const resultado = recomendar([prato({ preco: '24.90' }), prato({ preco: '25.10' })], {
      perfil: { orcamento_max: '25' },
    })
    assert.equal(resultado.sugestoes.length, 1)
  })

  it('se nada cabe no orçamento, mostra os permitidos do mais barato ao mais caro', () => {
    const medio = prato({ preco: 40, momentos: ['almoco_rapido'] })
    const barato = prato({ preco: 30 })
    const vegano = prato({ preco: 35, tags: ['vegano'] })

    const resultado = recomendar([medio, barato, vegano], { perfil: { orcamento_max: 20 } })
    assert.equal(resultado.acimaDoOrcamento, true)
    assert.deepEqual(ids(resultado), [barato.id, vegano.id, medio.id])
  })
})

describe('pontos e ordem', () => {
  it('o momento escolhido soma pontos e vira motivo', () => {
    const doAlmoco = prato({ momentos: ['almoco_rapido'] })
    const doJantar = prato({ momentos: ['jantar_romantico'] })

    const resultado = recomendar([doJantar, doAlmoco])
    assert.deepEqual(ids(resultado), [doAlmoco.id, doJantar.id])
    assert.equal(resultado.sugestoes[0].pontos, PONTOS.momento)
    assert.deepEqual(resultado.sugestoes[0].motivos, ['Bom para almoço rápido'])
  })

  it('trocar o momento muda a ordem', () => {
    const doAlmoco = prato({ momentos: ['almoco_rapido'] })
    const doJantar = prato({ momentos: ['jantar_romantico'] })

    const resultado = recomendar([doAlmoco, doJantar], { momento: 'jantar_romantico' })
    assert.deepEqual(ids(resultado), [doJantar.id, doAlmoco.id])
  })

  it('cozinha de que gosta sobe, e cozinha que quer evitar desce', () => {
    const italiana = prato({ cozinha: 'italiana' })
    const brasileira = prato({ cozinha: 'brasileira' })
    const japonesa = prato({ cozinha: 'japonesa' })

    const resultado = recomendar([japonesa, brasileira, italiana], {
      perfil: { gostos: ['italiana'], nao_gosta: ['japonesa'] },
    })
    assert.deepEqual(ids(resultado), [italiana.id, brasileira.id, japonesa.id])
    assert.equal(resultado.sugestoes[0].motivos[0], 'Você gosta de comida italiana')
    assert.equal(resultado.sugestoes[2].pontos, PONTOS.naoGosta)
  })

  it('distância: até 2 km soma 2, até 5 km soma 1, longe não soma', () => {
    const pertinho = prato({ restaurante_id: 1 })
    const medio = prato({ restaurante_id: 2 })
    const longe = prato({ restaurante_id: 3 })

    const resultado = recomendar([longe, medio, pertinho], { origem: ORIGEM })
    assert.deepEqual(ids(resultado), [pertinho.id, medio.id, longe.id])
    assert.deepEqual(
      resultado.sugestoes.map((s) => s.pontos),
      [PONTOS.pertinho, PONTOS.perto, 0],
    )
    assert.match(resultado.sugestoes[0].motivos[0], /^A \d+ m$/)
    assert.match(resultado.sugestoes[1].motivos[0], /^A \d,\d km$/)
    assert.ok(resultado.sugestoes[2].distanciaKm > 15)
  })

  it('sem origem, não há distância nem pontos por perto', () => {
    const resultado = recomendar([prato({ restaurante_id: 1 })])
    assert.equal(resultado.sugestoes[0].distanciaKm, null)
    assert.equal(resultado.sugestoes[0].pontos, 0)
  })

  it('um prato com nota 1 cai no ranking; com nota 5, sobe', () => {
    const a = prato({ momentos: ['almoco_rapido'] })
    const b = prato({ momentos: ['almoco_rapido'] })
    const c = prato({ momentos: ['almoco_rapido'] })

    const antes = recomendar([a, b, c])
    assert.deepEqual(ids(antes), [a.id, b.id, c.id]) // empate: vale o id

    const depois = recomendar([a, b, c], { minhasNotas: new Map([[a.id, 1], [c.id, 5]]) })
    assert.deepEqual(ids(depois), [c.id, b.id, a.id])
    assert.equal(depois.sugestoes[0].motivos[0], 'Você deu 5 estrelas')
  })

  it('um prato com nota 1 não fica em primeiro, mesmo combinando com momento, gosto e distância', () => {
    const odiado = prato({ restaurante_id: 1, cozinha: 'italiana', momentos: ['almoco_rapido'] })
    const comum = prato({ momentos: ['almoco_rapido'] })

    const resultado = recomendar([odiado, comum], {
      origem: ORIGEM,
      perfil: { gostos: ['italiana'] },
      minhasNotas: new Map([[odiado.id, 1]]),
    })
    assert.deepEqual(ids(resultado), [comum.id, odiado.id])
  })

  it('nota 3 não muda nada', () => {
    const a = prato()
    const resultado = recomendar([a], { minhasNotas: new Map([[a.id, 3]]) })
    assert.equal(resultado.sugestoes[0].pontos, 0)
  })

  it('média de todos a partir de 4 soma 1', () => {
    const bem = prato()
    const resultado = recomendar([bem], { medias: new Map([[bem.id, 4.5]]) })
    assert.equal(resultado.sugestoes[0].pontos, PONTOS.bemAvaliado)
    assert.deepEqual(resultado.sugestoes[0].motivos, ['Nota média 4,5'])
  })

  it('escolhido nos últimos 3 dias perde pontos; há 4 dias, não', () => {
    const ontem = prato()
    const haQuatroDias = prato()
    const escolhas = [
      { prato_id: ontem.id, criado_em: '2026-10-21T12:00:00-03:00' },
      { prato_id: haQuatroDias.id, criado_em: '2026-10-18T11:00:00-03:00' },
    ]

    const resultado = recomendar([ontem, haQuatroDias], { escolhas })
    assert.deepEqual(ids(resultado), [haQuatroDias.id, ontem.id])
    assert.equal(resultado.sugestoes[1].pontos, PONTOS.escolhidoHaPouco)
  })

  it('favorito soma 1 e vira motivo', () => {
    const favorito = prato()
    const resultado = recomendar([prato(), favorito], { favoritos: new Set([favorito.id]) })
    assert.equal(resultado.sugestoes[0].prato.id, favorito.id)
    assert.deepEqual(resultado.sugestoes[0].motivos, ['Está nos seus favoritos'])
  })

  it('no empate de pontos, vem quem tem distância conhecida e depois o mais barato', () => {
    const longeBarato = prato({ restaurante_id: 3, preco: 10 })
    const longeCaro = prato({ restaurante_id: 3, preco: 50 })
    const semRestaurante = prato({ restaurante_id: 99, preco: 5 })

    const resultado = recomendar([longeCaro, semRestaurante, longeBarato], { origem: ORIGEM })
    assert.deepEqual(ids(resultado), [longeBarato.id, longeCaro.id, semRestaurante.id])
  })

  it('os motivos seguem a ordem: restrição, minha nota, momento, gosto, distância', () => {
    const completo = prato({
      restaurante_id: 1,
      cozinha: 'italiana',
      tags: ['vegano', 'vegetariano', 'sem_lactose'],
      momentos: ['almoco_rapido'],
    })
    const resultado = recomendar([completo], {
      origem: ORIGEM,
      perfil: { restricoes: ['vegano'], gostos: ['italiana'] },
      minhasNotas: new Map([[completo.id, 4]]),
    })
    assert.deepEqual(resultado.sugestoes[0].motivos.slice(0, 4), [
      'Vegano',
      'Você deu 4 estrelas',
      'Bom para almoço rápido',
      'Você gosta de comida italiana',
    ])
    assert.match(resultado.sugestoes[0].motivos[4], /^A \d+ m$/)
  })
})

describe('restaurantes', () => {
  it('agrupa os pratos por restaurante e ordena do mais perto ao mais longe', () => {
    const longe1 = prato({ restaurante_id: 3, momentos: ['almoco_rapido'] })
    const longe2 = prato({ restaurante_id: 3 })
    const perto = prato({ restaurante_id: 1 })

    const { sugestoes } = recomendar([longe1, longe2, perto], { origem: ORIGEM })
    const restaurantes = recomendarRestaurantes(sugestoes)

    assert.deepEqual(
      restaurantes.map((r) => r.restaurante.id),
      [1, 3],
    )
    assert.equal(restaurantes[1].pratos.length, 2)
    assert.equal(restaurantes[1].motivos[0], '2 pratos para você')
    assert.equal(restaurantes[1].motivos.at(-1), `Destaque: ${longe1.nome}`)
    assert.equal(restaurantes[1].pontos, PONTOS.momento)
  })

  it('sem origem, ordena pelos pontos do melhor prato', () => {
    const fraco = prato({ restaurante_id: 1 })
    const forte = prato({ restaurante_id: 2, momentos: ['almoco_rapido'] })

    const { sugestoes } = recomendar([fraco, forte])
    assert.deepEqual(
      recomendarRestaurantes(sugestoes).map((r) => r.restaurante.id),
      [2, 1],
    )
  })
})
